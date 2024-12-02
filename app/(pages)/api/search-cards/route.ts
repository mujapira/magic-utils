import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { ICard, LegalFormats, Legalities } from "@/app/interfaces"

const filePath = path.join(process.cwd(), "public", "default_cards.json")
let cachedData: ICard[] = []

// Normalize strings for consistent matching
const normalizeString = (str: string) =>
  str ? str.toLowerCase().replace(/\s+/g, " ").trim() : ""

// Load and cache JSON data in memory
const loadJSON = () => {
  if (cachedData.length === 0) {
    const fileContent = fs.readFileSync(filePath, "utf-8")
    cachedData = JSON.parse(fileContent).map((card: ICard) => ({
      ...card,
      name: normalizeString(card.name),
      layout: normalizeString(card.layout),
      colors: card.colors?.map(normalizeString),
      keywords: card.keywords?.map(normalizeString),
      games: card.games?.map(normalizeString),
      legalities: Object.fromEntries(
        Object.entries(card.legalities || {}).map(([key, value]) => [
          normalizeString(key),
          normalizeString(value as string),
        ])
      ),
    }))
  }
}

interface QueryParams {
  name?: string
  cmc?: string
  pow?: string
  toughness?: string
  keywords?: string
  legal?: LegalFormats
  games?: string
  layout?: string
  page?: string
  pageSize?: string
}

export const GET = async (req: Request): Promise<NextResponse> => {
  const url = new URL(req.url)
  const params: QueryParams = Object.fromEntries(
    url.searchParams
  ) as QueryParams

  // Load JSON if not already cached
  loadJSON()

  // Filter dataset based on parameters
  const filteredCards = cachedData.filter((card) => {
    const matchesName = params.name
      ? card.name.includes(normalizeString(params.name))
      : true
    const matchesCmc = params.cmc ? card.cmc === parseFloat(params.cmc) : true
    const matchesPower = params.pow ? card.power === params.pow : true
    const matchesToughness = params.toughness
      ? card.toughness === params.toughness
      : true
    const matchesKeywords = params.keywords
      ? card.keywords?.includes(normalizeString(params.keywords))
      : true

    const isValidLegalFormat = (key: string): key is LegalFormats => {
      return key in card.legalities
    }

    const matchesLegal = params.legal
      ? isValidLegalFormat(params.legal) &&
        card.legalities[params.legal as LegalFormats] === "legal"
      : true

    const matchesGames = params.games
      ? card.games?.includes(normalizeString(params.games))
      : true
    const matchesLayout = params.layout
      ? card.layout === normalizeString(params.layout)
      : true

    return (
      matchesName &&
      matchesCmc &&
      matchesPower &&
      matchesToughness &&
      matchesKeywords &&
      matchesLegal &&
      matchesGames &&
      matchesLayout
    )
  })

  // Pagination
  const page = parseInt(params.page || "1", 10)
  const pageSize = parseInt(params.pageSize || "20", 10)
  const start = (page - 1) * pageSize
  const paginatedResults = filteredCards.slice(start, start + pageSize)

  // Default behavior: search by name if no parameters provided
  if (!Object.keys(params).length) {
    return NextResponse.json({
      results: cachedData.slice(0, pageSize),
      totalResults: cachedData.length,
      currentPage: page,
      totalPages: Math.ceil(cachedData.length / pageSize),
    })
  }

  // Return results
  return NextResponse.json({
    results: paginatedResults,
    totalResults: filteredCards.length,
    currentPage: page,
    totalPages: Math.ceil(filteredCards.length / pageSize),
  })
}