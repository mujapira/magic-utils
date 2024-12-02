import path from "path"
import fs from "fs"

const ALL_CARDS_URL = "https://api.scryfall.com/bulk-data"

interface RequestData {
  object: string
  has_more: boolean
  data: BulkData[]
}

interface BulkData {
  object: string
  id: string
  type: string
  updated_at: string
  uri: string
  name: string
  description: string
  size: number
  download_uri: string
  content_type: string
  content_encoding: string
}

const encoder = new TextEncoder()
const publicDir = path.join(process.cwd(), "public")
const filePath = path.join(publicDir, "default_cards.json")

export const GET = async () => {
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(`data: Starting download...\n\n`))

        const downloadUri = await fetchDefaultCardsData()
        await downloadAndSaveFile(downloadUri, controller)

        controller.close()
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        controller.enqueue(encoder.encode(`data: Error - ${errorMessage}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

/**
 * Fetches the URI for the default cards bulk data from the API.
 */
const fetchDefaultCardsData = async (): Promise<string> => {
  const response = await fetch(ALL_CARDS_URL, { cache: "force-cache" })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from ${ALL_CARDS_URL}: ${response.statusText}`
    )
  }

  const { data }: RequestData = await response.json()
  const target = data.find((item) => item.type === "default_cards")

  if (!target) {
    throw new Error("Default cards type not found in API response.")
  }

  return target.download_uri
}

/**
 * Downloads the file from the given URI and saves it locally.
 * Tracks the download progress and sends updates to the client.
 */ const downloadAndSaveFile = async (
  downloadUri: string,
  controller: ReadableStreamDefaultController
): Promise<void> => {
  const response = await fetch(downloadUri)

  if (!response.ok) {
    throw new Error(
      `Failed to download file from ${downloadUri}: ${response.statusText}`
    )
  }

  if (!response.body) {
    throw new Error("Response body is empty while downloading cards.")
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const { Readable } = require("stream")
  const nodeStream = Readable.from(response.body)

  let downloaded = 0
  const totalSize = 500 * 1024 * 1024; 
  
  const pipeline = require("stream/promises").pipeline
  const writer = fs.createWriteStream(filePath)

  await pipeline(
    nodeStream,
    new (require("stream").Transform)({
      transform(
        chunk: Buffer,
        _: BufferEncoding,
        callback: (error?: Error | null, data?: Buffer) => void
      ) {
        downloaded += chunk.length

        if (isNaN(totalSize) || totalSize <= 0) {
          // If Content-Length is missing, provide bytes downloaded
          controller.enqueue(
            encoder.encode(
              `data: Downloading... (${downloaded} bytes received)\n\n`
            )
          )
        } else {
          // Calculate percentage progress if Content-Length is available
          const progress = ((downloaded / totalSize) * 100).toFixed(2)
          controller.enqueue(encoder.encode(`data: ${progress}%\n\n`))
        }

        callback(null, chunk)
      },
    }),
    writer
  )

  controller.enqueue(encoder.encode(`data: Download completed!\n\n`))
}
