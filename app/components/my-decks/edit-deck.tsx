'use client'
import { motion } from "motion/react"
import { useMtg } from "@/app/contexts/mtgContext"
import { ICard, LocalStorageDeck, SearchCardByListRequest } from "@/app/interfaces"
import { Fragment, useEffect, useState } from "react"
import { LoadingCards } from "../loading-cards";
import { CardComponent } from "../card-component";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowBigLeft, ArrowLeftIcon } from "lucide-react"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { UtilityBar } from "../utility-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { RightSidebar } from "../layout/right-sidebar"

export default function EditDeckComponent({ id }: { id: string }) {
    const { handleGetDeckCards, loadingData, deckData, activeLocalStorageDeck } = useMtg();

    const handleLoadDeck = async () => {
        try {
            if (!id) return
            await handleGetDeckCards("localStorage", id)

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
            className="flex items-center flex-col h-full pb-8 justify-center w-full gap-2">

            <div className="flex w-full items-center">
                <Link href={"/my-decks"} className="flex">
                    <Button variant="link" className="p-0 gap-2">
                        <ArrowLeftIcon className="flex" />
                        <span className="text-xl">{activeLocalStorageDeck?.name}</span>
                    </Button>
                </Link>
            </div>

            {loadingData && <LoadingCards />}

            {!loadingData &&
                <div id="list" className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 overflow-auto flex-1">
                    {deckData.map((card, i) => (
                        <Fragment key={card.id + i + "-" + Math.random()}>
                            {card.quantity > 0 && (
                                <div className="flex-grow flex-shrink-0 ">
                                    <CardComponent card={card} />
                                </div>
                            )}
                        </Fragment>
                    ))}
                </div>
            }
        </motion.div >
    )
}