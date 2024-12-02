import { ICard, ScryfallCard } from "@/app/interfaces";
import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const filePath = path.join(process.cwd(), "public", "default_cards.json");

        const fileData = await fs.readFile(filePath, "utf-8");
        const allCards: ScryfallCard[] = JSON.parse(fileData);

        const body = await req.json();
        const cardLines: string[] = body.cards;

        if (!Array.isArray(cardLines) || cardLines.length === 0) {
            return NextResponse.json({ error: "A lista de cartas está vazia" }, { status: 400 });
        }

        const result: ICard[] = cardLines.map((line) => {
            const match = line.match(/^(\d+)?\s*(.+)$/);
            if (!match) return null;

            const quantity = match[1] ? parseInt(match[1], 10) : 1;
            const name = match[2]?.trim();

            const cardData = allCards.find((card) =>
                card.name.toLowerCase().includes(name.toLowerCase())
            );

            return {
                ...cardData,
                isDoubleSide: cardData?.card_faces ? cardData.card_faces.length > 1 : false,
                quantity,
            };
        }) as ICard[];

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar cartas:", error);
        return NextResponse.json({ error: "Erro ao processar a requisição" }, { status: 500 });
    }
};