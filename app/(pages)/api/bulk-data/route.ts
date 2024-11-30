import { NextResponse } from "next/server"
import path from "path"
import { promisify } from "util"
import stream from "stream"
import fs from "fs"

const pipeline = promisify(stream.pipeline)

const ALL_CARDS_URL = "https://api.scryfall.com/bulk-data"
const CACHE_DURATION = 60 * 60 * 24 // 1 dia

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

export const GET = async () => {
  try {
    const publicDir = path.join(process.cwd(), "public")
    const filePath = path.join(publicDir, "default_cards.json")

    if (fs.existsSync(filePath)) {
      const fileStats = fs.statSync(filePath)
      const now = Date.now()
      const fileAge = (now - fileStats.mtimeMs) / 1000

      if (fileAge < CACHE_DURATION) {
        console.log("Cache válido. Usando arquivo local.")
        return NextResponse.json(
          { message: "Arquivo já está atualizado no cache!" },
          { status: 200 }
        )
      }
    }

    const response = await fetch(ALL_CARDS_URL, { cache: "force-cache" })

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar dados de ${ALL_CARDS_URL}: ${response.statusText}`
      )
    }

    const { data }: RequestData = await response.json()
    const target = data.find((item) => item.type === "default_cards")

    if (!target) {
      throw new Error("Tipo 'default_cards' não encontrado")
    }

    const { download_uri } = target

    const cardsResponse = await fetch(download_uri)

    if (!cardsResponse.ok) {
      throw new Error(
        `Erro ao baixar o arquivo de ${download_uri}: ${cardsResponse.statusText}`
      )
    }

    if (!cardsResponse.body) {
      throw new Error("Corpo da resposta vazio ao baixar as cartas")
    }

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    const { Readable } = require("stream")
    const nodeStream = Readable.from(cardsResponse.body)
    await pipeline(nodeStream, fs.createWriteStream(filePath))

    return NextResponse.json(
      { message: "Arquivo baixado e salvo com sucesso!" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao processar requisição:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error("Erro desconhecido:", error)
      return NextResponse.json({ error: "Erro desconhecido" }, { status: 500 })
    }
  }
}
