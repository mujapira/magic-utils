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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { ICard } from "../../../interfaces"
import { LoadingCards } from "../../loading-cards"
import { Textarea } from "@/components/ui/textarea"
import { CardComponent } from "../../card-component"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
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
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

const revalidate = 60 * 60 * 24

export function DeckBuilderComponent() {
    const [data, setData] = useState<ICard[]>([])
    const [loadingData, setLoadingData] = useState(false)
    const [cardsToSearch, setCardsToSearch] = useState<string>("")
    const [open, setOpen] = useState(false)
    const [deckRegisterInfo, setDeckRegisterInfo] = useState({ name: "", description: "" })
    const handleGetDeckCards = async () => {
        setLoadingData(true);
        const cards = cardsToSearch
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (cards.length === 0) {
            return;
        }

        try {
            setOpen(false);

            const response = await fetch("/api/search-cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cards }),
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar cartas. Tente novamente.");
            }

            const data = await response.json();
            setData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingData(false);
        }
    }

    const handleSaveDeck = async () => {
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center flex-col h-100 justify-center pb-40 w-full">

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {(!loadingData && data.length === 0) &&
                        <Button variant="outline">Start here!</Button>
                    }
                </DialogTrigger>
                <DialogContent className="">
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
                        value={cardsToSearch}
                        onChange={(e) => setCardsToSearch(e.target.value)}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant={"secondary"}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => handleGetDeckCards()}
                            type="button" variant={"default"}>Import</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {loadingData && <LoadingCards />}

            {data.length > 0 && (
                <div className="w-full mt-4 flex-col gap-4 relative">

                    <Drawer>
                        <DrawerTitle>
                        </DrawerTitle>
                        <DrawerTrigger>Open</DrawerTrigger>
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
                                        <Input placeholder="Deck Name" className="mb-4" />
                                        <Label>Deck Description</Label>
                                        <Textarea placeholder="Deck Description" />
                                    </TabsContent>
                                    <TabsContent value="deck-info">
                                        <DeckAnalysis cards={data} />
                                    </TabsContent>
                                </Tabs>
                                <DrawerFooter>
                                    <div className="flex gap-4 items-center justify-end mb-4">
                                        <DrawerClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DrawerClose>
                                        <Button onClick={() => handleSaveDeck()} >
                                            Save
                                        </Button>
                                    </div>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>



                    <div className="flex flex-wrap gap-2">
                        {data.map((card) => (
                            <div className="flex-grow flex-shrink-0" key={card.id}>
                                <CardComponent {...card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </motion.div>
    )
}