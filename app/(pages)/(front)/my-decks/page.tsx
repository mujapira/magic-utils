import { DeckBuilderComponent } from "@/app/components/deck-builder/deck-builder";
import { MyDeckComponent } from "@/app/components/my-decks/my-decks";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "My decks",
  description: "Manage your decks",
}

export default function MyDeck() {
  return (
      <MyDeckComponent />
  );
}
