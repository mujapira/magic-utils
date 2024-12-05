'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { DeckAnalysis } from "./deck-analysis"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ICard } from "@/app/interfaces"
import { LoadingCards } from "../loading-cards"
import { CardComponent } from "../card-component"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { debounce } from "lodash";
import { SearchCardComponent } from "../search-card-component"
import { useMtg } from "@/app/contexts/mtgContext"


export function DeckBuilderComponent() {
    const {
        deckData,
        loadingData,
        addCardToDeck,
        handleGetDeckCards,
        handleSaveDeck,
        setDeckFromList,
        deckFromList,
        input,
        setInput,
        loading,
        totalResults,
        searchResult,
        isCardSelectionStarted,
        isModalImportListOpen,
        setIsModalImportListOpen,
        isDrawerDeckOpened,
        setIsDrawerDeckOpened
    } = useMtg();

    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center flex-col h-100 justify-center pb-40 w-full">

            <Dialog open={isModalImportListOpen} onOpenChange={setIsModalImportListOpen}>
                <DialogTrigger asChild>
                    {(!loadingData && !isCardSelectionStarted) &&
                        <Button variant="outline">Start here!</Button>
                    }
                </DialogTrigger>
                <DialogContent className="">
                    {/* oopcao decklist */}
                    <DialogHeader>
                        <DialogTitle>Deck List</DialogTitle>
                        <DialogDescription>
                            <span>Choose the card list to import your deck.</span>
                            <span>Please, make sure to use the correct format, like the placeholder text.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder={`4 Card Name\n3 Card Name\n2 Card Name\nCard Name`}
                        className="w-80 h-80"
                        value={deckFromList}
                        onChange={(e) => setDeckFromList(e.target.value)}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant={"secondary"}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => handleGetDeckCards()}
                            type="button" variant={"default"}>Import</Button>
                        <Button onClick={() => handleGetDeckCards()}
                            type="button" variant={"default"}>Start from scratch!</Button>
                    </DialogFooter>

                    {/* opção from scratch */}

                    {/* opção from scratch */}

                </DialogContent>
            </Dialog>

            {loadingData && <LoadingCards />}


            {isCardSelectionStarted && (
                <div className="w-full flex flex-col md:flex-row mt-4 gap-4 relative">
                    <div className="flex flex-col w-full sm:w-1/5 gap-2">
                        <span className="text-center font-semibold">
                            Utility bar
                        </span>
                        <Drawer open={isDrawerDeckOpened} onOpenChange={setIsDrawerDeckOpened}>
                            <DrawerTitle>
                            </DrawerTitle>
                            <DrawerTrigger asChild>
                                <Button>
                                    Manage deck
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="max-w-3xl w-full mx-auto">
                                    <DrawerHeader>
                                    </DrawerHeader>
                                    <Tabs defaultValue="deck-form" className="flex flex-col pb-4">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="deck-form">Information</TabsTrigger>
                                            <TabsTrigger value="deck-info">Analysis</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="deck-form">
                                            <Label>Deck Name</Label>
                                            <Input placeholder="Deck Name" className="mb-4"
                                                onChange={(e) => setDeckName(e.target.value)}
                                            />
                                            <Label>Deck Description</Label>
                                            <Textarea
                                                onChange={(e) => setDeckDescription(e.target.value)}
                                                placeholder="Deck Description" />
                                        </TabsContent>
                                        <TabsContent value="deck-info">
                                            <DeckAnalysis cards={deckData} />
                                        </TabsContent>
                                    </Tabs>
                                    <DrawerFooter>
                                        <div className="flex gap-4 items-center justify-end mb-4">
                                            <DrawerClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DrawerClose>
                                            <Button onClick={() => handleSaveDeck(deckName, deckDescription)}>
                                                Save
                                            </Button>
                                        </div>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search (e.g., :name dragon :cmc 4 :pow 3)"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="border p-2 w-full rounded"
                            />
                        </div>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div>
                                <p>
                                    Showing {searchResult.length} of {totalResults} results
                                </p>
                                <div className="flex flex-col">
                                    {searchResult.map((card) => (
                                        <div key={card.id} className="p-4 border rounded shadow-sm">
                                            <SearchCardComponent addCardToDeck={() => addCardToDeck(card)} card={card} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div id="list" className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {deckData.map((card) => (
                            <div className="flex-grow flex-shrink-0 " key={card.id}>
                                <CardComponent {...card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </motion.div>
    )
}