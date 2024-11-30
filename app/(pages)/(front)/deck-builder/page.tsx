import { DeckBuilderComponent } from "@/app/components/deck-builder/deck-builder";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Deck Builder",
  description: "Build your deck with ease",
}

export default function DeckBuilder() {
  return (
    <DeckBuilderComponent />
  );
}
