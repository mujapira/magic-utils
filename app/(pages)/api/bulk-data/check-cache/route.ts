import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"

const CACHE_DURATION = 60 * 60 * 24 // 24 horas em segundos

const publicDir = path.join(process.cwd(), "public")
const filePath = path.join(publicDir, "default_cards.json")

export const GET = async () => {
  const isCached = checkCacheValidity()

  if (isCached) {
    return NextResponse.json(
      { status: "cached", message: "File is cached and valid!" },
      { status: 200 }
    )
  }

  return NextResponse.json(
    { status: "not_cached", message: "File is not cached or expired!" },
    { status: 200 }
  )
}

const checkCacheValidity = (): boolean => {
  if (fs.existsSync(filePath)) {
    const fileStats = fs.statSync(filePath)
    const now = Date.now()
    const fileAge = (now - fileStats.mtimeMs) / 1000 // Em segundos

    return fileAge < CACHE_DURATION // True se o cache ainda é válido
  }
  return false
}
