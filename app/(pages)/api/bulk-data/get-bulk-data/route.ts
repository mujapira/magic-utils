import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"

const CACHE_DURATION = 60 * 60 * 24 // 24 hours in seconds
const publicDir = path.join(process.cwd(), "public")
const filePath = path.join(publicDir, "default_cards.json")

export const GET = async () => {
  try {

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const data = JSON.parse(fileContent)

    return NextResponse.json(data, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_DURATION}`,
      },
    })
  } catch (error) {
    console.error("Error while fetching cards:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

