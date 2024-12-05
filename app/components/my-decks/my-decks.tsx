
'use client'
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
import { useMtg } from "@/app/contexts/mtgContext"
import { Button } from "@/components/ui/button";
import { ArrowBigRightDashIcon, EllipsisVertical, Eye, Info, Layers, PenSquareIcon, PlusCircle, Trash, View } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CardComponent } from "../card-component";
import { LoadingCards } from "../loading-cards";
import { useToast } from "@/hooks/use-toast";
import { SearchCardComponent } from "../search-card-component";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DeckAnalysis } from "../deck-builder/deck-analysis";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export type DialogOption = "import" | "scratch"

export function MyDeckComponent() {
    const {
        savedDecks,
        handleGetDeckCards,
        isCreatingNewDeck,
        setIsCreatingNewDeck,
        isCardSelectionStarted,
        deckData,
        setDeckFromList,
        deckFromList,
        loadingData,
        handleSaveDeck,
        loading,
        searchResult,
        input,
        setInput,
        totalResults,
        clearData
    } = useMtg();

    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");

    const { toast } = useToast();

    const [dialogOption, setDialogOption] = useState<DialogOption | null>(null);

    const handleStartPickingCards = async () => {

        if (dialogOption === "import") {
            if (deckFromList.length <= 3) {
                toast({
                    title: "Invalid deck list",
                    description: "Please make sure to paste a valid deck list",
                    variant: "destructive"
                })

                document.getElementById("deckList")?.focus();
                return;
            }

        }

        await handleGetDeckCards(
            dialogOption === "import" ? "list" : "localStorage"
        )
    }

    const handleClearDeck = () => {
        clearData();
    }

    useEffect(() => {
        handleClearDeck();
    }, [])

    return (
        <div className="flex flex-col gap-4 w-full">
            {!isCardSelectionStarted && (
                <>
                    <div>
                        <Button onClick={() => setIsCreatingNewDeck(true)}>
                            Create new deck <PlusCircle />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedDecks.map((deck) => (
                            <div key={deck.id} className="flex p-4 gap-4 flex-col border rounded">
                                <DropdownMenu dir="ltr">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold">{deck.name}</span>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant={"ghost"} size={"icon"}>
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </div>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <span>
                                                    Edit Deck
                                                </span>
                                                <DropdownMenuShortcut>
                                                    <PenSquareIcon />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <span>
                                                    Delete Deck
                                                </span>
                                                <DropdownMenuShortcut>
                                                    <Trash />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <span className="flex text-base flex-1 line-clamp-2">{deck.description}</span>
                                <Link className="" href={`/my-decks/${deck.id}`}>
                                    <Button className="flex w-full">
                                        <span>
                                            View Deck
                                        </span>
                                        <ArrowBigRightDashIcon />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <Dialog open={isCreatingNewDeck} onOpenChange={setIsCreatingNewDeck}>
                        <DialogContent className="max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Let's get started</DialogTitle>
                                <DialogDescription>
                                    <span>Choose the option that fits you best!</span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex w-full gap-4 items-center justify-between">
                                <Button className="flex-1" variant={dialogOption === "import" ? "default" : "secondary"} onClick={() => setDialogOption("import")}>Import list</Button>
                                <Button className="flex-1" variant={dialogOption === "scratch" ? "default" : "secondary"} onClick={() => setDialogOption("scratch")}>Start from scratch</Button>
                            </div>

                            {dialogOption === "import" && (
                                <>
                                    <DialogDescription>
                                        Make sure to paste your deck list in the format below
                                    </DialogDescription>
                                    <Textarea
                                        id="deckList"
                                        onChange={(e) => setDeckFromList(e.target.value)}
                                        placeholder={`4 Card Name\n3 Card Name\n2 Card Name\nCard Name`}
                                        className="w-full h-24"
                                    />
                                </>
                            )}

                            {dialogOption === "scratch" && (
                                <>
                                    <DialogDescription>
                                        In this option you will start with an empty deck.
                                        Make sure to add cards to it!

                                        Have fun! 🎉
                                    </DialogDescription>
                                </>
                            )}

                            <Separator orientation="horizontal" className="mt-4" />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" className="">
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button onClick={() => handleStartPickingCards()} type="button" variant="default">
                                    {dialogOption === "import" ? "Import" : "Start"}
                                </Button>

                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}

            {loadingData && <LoadingCards />}

            {!isCardSelectionStarted && (
                <div className="w-full flex flex-col md:flex-row mt-4 gap-4 relative h-full">
                    <div className="flex flex-col w-full sm:w-2/5 gap-2">
                        <span className="text-center font-semibold">
                            Utility bar
                        </span>
                        <Label>Deck Name</Label>
                        <Input placeholder="Deck Name" className="mb-4"
                            onChange={(e) => setDeckName(e.target.value)}
                        />
                        <Label>Deck Description</Label>
                        <Textarea
                            onChange={(e) => setDeckDescription(e.target.value)}
                            placeholder="Deck Description" />

                        <Button onClick={() => handleSaveDeck(deckName, deckDescription)}>
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

                            <Input
                                type="text"
                                placeholder="Birds of Paradise"
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
                                        <div key={card.id + "searchResult"} className="p-4 border rounded shadow-sm">
                                            <CardComponent card={card} isSearch />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div id="list" className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {deckData.map((card) => (
                            <div className="flex-grow flex-shrink-0 " key={card.id + "deckData"}>
                                <CardComponent card={card} />
                            </div>
                        ))}
                    </div>
                </div>

            )}


        </div>
    );
}