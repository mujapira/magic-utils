import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import {
  SearchCardByListRequestBody,
  ICard,
  ScryfallCard,
} from "@/app/interfaces"

export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), "public", "default_cards.json")
    const fileData = await fs.readFile(filePath, "utf-8")
    const allCards: ScryfallCard[] = JSON.parse(fileData)

    const body: SearchCardByListRequestBody = await req.json()
    const cardRequests = body.cards

    if (!Array.isArray(cardRequests) || cardRequests.length === 0) {
      return NextResponse.json({ error: "No cards provided." }, { status: 400 })
    }

    const result: ICard[] = cardRequests
      .map(({ id, name, quantity }) => {
        let cardData: ScryfallCard | undefined

        if (id !== "0") {
          cardData = allCards.find((card) => card.id === id)
        }

        if (!cardData) {
          cardData = allCards.find(
            (card) => card.name.toLowerCase() === name.toLowerCase()
          )
        }

        if (!cardData) {
          cardData = allCards.find((card) =>
            card.name.toLowerCase().includes(name.toLowerCase())
          )
        }

        if (!cardData) {
          return null
        }

        return {
          ...cardData,
          isDoubleSide: cardData.card_faces
            ? cardData.card_faces.length > 1
            : false,
          quantity: Number(quantity),
        }
      })
      .filter(Boolean) as ICard[]

    return NextResponse.json({ cards: result }, { status: 200 })
  } catch (error) {
    console.error("Error in POST /search-cards-by-list:", error)
    return NextResponse.json(
      { error: "Failed to process the request." },
      { status: 500 }
    )
  }
}
