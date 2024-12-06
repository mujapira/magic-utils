import { Label } from "@/components/ui/label";
import { useMtg } from "../contexts/mtgContext";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronsUpDown, Info, Loader2 } from "lucide-react";
import { CardComponent } from "./card-component";
import { LoadingCards } from "./loading-cards";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function UtilityBar() {
    const {
        handleSaveDeck,
        loading,
        searchResult,
        input,
        setInput,
        totalResults,
        activeLocalStorageDeck
    } = useMtg();

    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");

    useEffect(() => {
        if (activeLocalStorageDeck) {
            setDeckName(activeLocalStorageDeck.name);
            setDeckDescription(activeLocalStorageDeck.description);
        }
    }, [])

    const groupedCards = searchResult.reduce((groups: { [key: string]: typeof searchResult }, card) => {
        if (!groups[card.name]) groups[card.name] = [];
        groups[card.name].push(card);
        return groups;
    }, {});

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="w-full flex flex-col gap-4 relative h-full">
            <div className="flex flex-col w-full gap-4">
                <span className="text-center font-semibold">
                    Utility bar
                </span>

                <Collapsible defaultOpen={false} open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="secondary" className="flex items-center gap-2 w-full">
                            <span className="w-full">
                                Deck Info
                            </span>
                            <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="flex flex-col mt-2 px-4">
                            <Label className="mb-2">Deck Name</Label>
                            <Input placeholder="Deck Name" className="mb-4"
                                value={deckName}
                                onChange={(e) => setDeckName(e.target.value)}
                            />
                            <Label className="mb-2">Deck Description</Label>
                            <Textarea
                                value={deckDescription}
                                onChange={(e) => setDeckDescription(e.target.value)}
                                placeholder="Deck Description" />
                        </div>
                    </CollapsibleContent>
                </Collapsible>


                <Button onClick={() => handleSaveDeck(deckName, deckDescription, false)}>
                    Save
                </Button>

                <Separator className="my-4" />

                <div className="flex flex-col gap-2">
                    <Tooltip>
                        <TooltipTrigger className="w-auto">
                            <Label className="flex items-center gap-2">
                                <Info size={22} />
                                <span className="whitespace-nowrap">
                                    Search Cards
                                </span>
                            </Label>
                        </TooltipTrigger>
                        <TooltipContent align="start" className="bg-muted">
                            <p className="font-bold">Advanced Search Tips</p>
                            <p>Use the syntax below to perform advanced searches by combining multiple attributes.</p>

                            <p className="mt-2">Syntax</p>
                            <p className="font-mono bg-background p-1 rounded">
                                /attribute value /attribute value /attribute value
                            </p>

                            <p className="mt-2">Example</p>
                            <p className="font-mono bg-background  p-1 rounded">
                                /cmc 2 /pow 2 /tou 2
                            </p>
                            <p>This search will find cards with a Converted Mana Cost of 2, Power of 2, and Toughness of 2.</p>

                            <p className="mt-2">Available Attributes</p>
                            <ul className="list-disc list-inside">
                                <li><strong>/name:</strong> Search by card name (<em>/name Birds of Paradise</em>).</li>
                                <li><strong>/cmc:</strong> Search by Converted Mana Cost (<em>/cmc 3</em>).</li>
                                <li><strong>/pow:</strong> Search by Power (<em>/pow 4</em>).</li>
                                <li><strong>/tou:</strong> Search by Toughness (<em>/tou 5</em>).</li>
                                <li><strong>/keywords:</strong> Search by card keywords (<em>/keywords flying</em>).</li>
                                <li><strong>/legal:</strong> Search by format legality (<em>/legal standard</em>).</li>
                                <li><strong>/games:</strong> Search by game type (<em>/games paper</em>).</li>
                                <li><strong>/layout:</strong> Search by card layout (<em>/layout transform</em>).</li>
                                <li><strong>/rarity:</strong> Search by rarity (<em>/rarity mythic</em>).</li>
                                <li><strong>/set:</strong> Search by set (<em>/set theros</em>).</li>
                                <li><strong>/type:</strong> Search by type (<em>/type elf</em>).</li>
                                <li>🚧<strong>/mana:</strong> Search by mana cost (<em>/mana {`{2}{B}{R}`}</em>).</li>
                                <li>🚧<strong>/managen:</strong> Search by produced mana (<em>/managen G /managen R</em>).</li>
                            </ul>

                            <p className="mt-2">Quick Tip:</p>
                            <p>If no attribute is specified, the search will default to the card name.</p>
                        </TooltipContent>
                    </Tooltip>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Birds of Paradise"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                        <Loader2 className={`h-6 w-6 absolute top-2 right-2 ${loading ? "animate-spin" : "hidden"}`} />
                    </div>
                    <div>
                        <p className="text-xs pb-2 text-muted-foreground">
                            Showing {searchResult.length} of {totalResults} results
                        </p>
                        <div className="flex flex-col overflow-y-auto gap-2">
                            {Object.keys(groupedCards).map((name) => (
                                <ScrollArea key={name} className="overflow-x-auto gap-2">
                                    <div className="flex gap-2 h-auto">
                                        {groupedCards[name].map((card) => (
                                            <CardComponent
                                                key={card.id + "grouped"}
                                                card={card}
                                                isSearch
                                            />
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" className="h-4" />
                                </ScrollArea>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

