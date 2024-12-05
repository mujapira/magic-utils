'use client'
import { motion } from "motion/react"
import { useMtg } from "@/app/contexts/mtgContext"
import { ICard, LocalStorageDeck, SearchCardByListRequest } from "@/app/interfaces"
import { useEffect, useState } from "react"
import { LoadingCards } from "../loading-cards";
import { CardComponent } from "../card-component";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowBigLeft, ArrowLeftIcon } from "lucide-react"

export default function EditDeckComponent({ id }: { id: string }) {
    const { handleGetDeckCards, loadingData, deckData, savedDecks, isCardSelectionStarted } = useMtg();

    const [activeDeck, setActiveDeck] = useState<LocalStorageDeck>();

    const handleLoadDeck = async () => {
        try {
            if (!id) return

            await handleGetDeckCards("localStorage", id)

            setActiveDeck(savedDecks.find((deck) => deck.id === id));
        } catch (error) {
            console.error('Error loading deck:', error);
        }
    };

    useEffect(() => {
        handleLoadDeck();
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center flex-col h-100 justify-center pb-40 w-full gap-2">


            <div className="flex w-full items-center">
                <Link href={"/my-decks"} className="flex">
                    <Button variant="link" className="p-0 gap-2">
                        <ArrowLeftIcon className="flex" />
                        {!loadingData &&
                            <span className="text-xl">{activeDeck?.name}</span>
                        }
                    </Button>
                </Link>
            </div>

            {loadingData && <LoadingCards />}

            {!loadingData &&
                <div id="list" className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-4 overflow-auto flex-1">
                    {deckData.map((card) => (
                        <>
                            {card.quantity > 0 && (
                                <div className="flex-grow flex-shrink-0 " key={card.id}>
                                    <CardComponent card={card} />
                                </div>
                            )}
                        </>
                    ))}
                </div>
            }
        </motion.div >
    )
}