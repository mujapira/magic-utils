
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
import { ArrowBigRightDashIcon, Banana, EllipsisVertical, HardDriveDownload, Import, Info, PenSquareIcon, PlusCircle, Share, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CardComponent } from "../card-component";
import { LoadingCards } from "../loading-cards";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { UtilityBar } from "../utility-bar";
import Loading from "@/app/loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RightSidebar } from "../layout/right-sidebar";

export type DialogOption = "import" | "scratch"

export function MyDeckComponent() {
    const {
        savedLocalStorageDecks,
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
        clearData,
        deleteDeck,
        isFetchingData,
        exportAllDecksAsJson,
        exportDeckByIdAsJson,
        importDecksFromJson
    } = useMtg();

    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { toast } = useToast();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


    const [dialogOption, setDialogOption] = useState<DialogOption | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importDecksFromJson(file);
        }
    };

    const handleStartNewDeck = async () => {

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

        await handleSaveDeck(deckName, deckDescription, true);
    }

    const handleClearDeck = () => {
        clearData();
    }

    useEffect(() => {
        handleClearDeck();
    }, [])

    return (
        <div className="flex flex-col gap-4 w-full">
            <>
                {isFetchingData && (
                    <Loading />
                )}
            </>
            {!isFetchingData && (
                <>
                    {!isCardSelectionStarted && (
                        <>
                            <div className="flex justify-between">
                                <Button onClick={() => setIsCreatingNewDeck(true)}>
                                    Create new deck <PlusCircle />
                                </Button>


                                <div className="flex gap-4">
                                    <Button onClick={handleButtonClick} className="">
                                        Import Decks <Import />
                                    </Button>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="application/json"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />

                                    <Button onClick={() => exportAllDecksAsJson()}>
                                        Export Decks <Share />
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {savedLocalStorageDecks.map((deck) => (
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
                                                            Export Deck
                                                        </span>
                                                        <DropdownMenuShortcut>
                                                            <HardDriveDownload />
                                                        </DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => deleteDeck(deck.id)}>
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
                                                    Manage Deck
                                                </span>
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

                                    <div>
                                        <Label>Deck Name</Label>
                                        <Input placeholder="Deck Name" className="mb-4"
                                            onChange={(e) => setDeckName(e.target.value)}
                                        />
                                        <Label>Deck Description</Label>
                                        <Textarea
                                            onChange={(e) => setDeckDescription(e.target.value)}
                                            placeholder="Deck Description" />
                                    </div>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary" className="">
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        {dialogOption && (
                                            <Button onClick={() => handleStartNewDeck()} type="button" variant="default">
                                                {dialogOption === "import" ? "Import" : "Start"}
                                            </Button>
                                        )}

                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}

                    {isCardSelectionStarted && (
                        <UtilityBar />
                    )}
                </>
            )}
        </div>
    );
}