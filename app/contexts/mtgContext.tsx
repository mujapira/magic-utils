"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode, use } from "react";
import { ICard, LocalStorageDeck, SearchCardByListRequest, SearchCardByListResponseBody, UserDeck } from "../interfaces";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { CheckCacheEndpoint, SearchCardsByListEndpoint, SearchCardsEndpoint, UpdateBulkDataEndpoint } from "../utils/pathUtils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/utils";

interface SearchResponse {
    results: ICard[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
}

interface QueryState {
    name?: string;
    cmc?: string;
    pow?: string;
    toughness?: string;
    keywords?: string;
    legal?: string;
    games?: string;
    layout?: string;
    set?: string;
    rarity?: string;
    type?: string;
}

interface MtgContextType {
    deckData: ICard[];
    loadingData: boolean;
    searchResult: ICard[];
    addCardToDeck: (card: ICard) => void;
    removeCardFromDeck: (cardId: string) => void;
    handleGetDeckCards: (source: "localStorage" | "list", deckId?: string) => Promise<ICard[] | undefined>;
    handleSaveDeck: (deckName: string, deckDescription: string) => Promise<void>;
    handleFetchBulkData: () => Promise<void>;
    setDeckFromList: React.Dispatch<React.SetStateAction<string>>;
    deckFromList: string;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    fetchCards: () => Promise<void>;
    totalResults: number;
    progress: number;
    isModalImportListOpen: boolean;
    setIsModalImportListOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isCardSelectionStarted: boolean;
    setIsCardSelectionStarted: React.Dispatch<React.SetStateAction<boolean>>;
    savedDecks: LocalStorageDeck[];
    isDrawerDeckOpened: boolean;
    setIsDrawerDeckOpened: React.Dispatch<React.SetStateAction<boolean>>;
    deleteDeck: (deckId: string) => void;
    updateCardQuantity: (id: string, newQuantity: number) => void;
    removeCard: (id: string) => void;
    setIsCreatingNewDeck: React.Dispatch<React.SetStateAction<boolean>>;
    isCreatingNewDeck: boolean;
    setDeckData: React.Dispatch<React.SetStateAction<ICard[]>>;
    clearData: () => void;
}

const MtgContext = createContext<MtgContextType | undefined>(undefined);

export const MtgProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();


    const [isCardSelectionStarted, setIsCardSelectionStarted] = useState(false);
    const [isCreatingNewDeck, setIsCreatingNewDeck] = useState(false);

    const [isModalImportListOpen, setIsModalImportListOpen] = useState(false);
    const [isDrawerDeckOpened, setIsDrawerDeckOpened] = useState(false);

    // Estados do baralho
    const [deckData, setDeckData] = useState<ICard[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [deckFromList, setDeckFromList] = useState<string>("");
    const [progress, setProgress] = useState(0);

    // Estados de busca
    const [input, setInput] = useState<string>("");
    const [query, setQuery] = useState<QueryState>({});
    const [searchResult, setSearchResult] = useState<ICard[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalResults, setTotalResults] = useState<number>(0);

    const [savedDecks, setSavedDecks] = useState<LocalStorageDeck[]>([]);

    //#region General
    const addCardToDeck = (card: ICard) => {
        card.quantity = 1;
        setDeckData((prevDeck) => [...prevDeck, card]);
    };

    const removeCardFromDeck = (cardId: string) => {
        setDeckData((prevDeck) => prevDeck.filter((card) => card.id !== cardId));
    };

    const handleGetDeckCards = async (source: "localStorage" | "list", deckId?: string): Promise<ICard[] | undefined> => {
        setLoadingData(true);

        try {
            let cards: UserDeck[] = [];

            if (source === "localStorage") {
                if (!deckId) {
                    setLoadingData(false);
                    setIsCardSelectionStarted(true);

                    return;
                }

                const savedDeck = savedDecks.find((deck) => deck.id === deckId);
                if (!savedDeck) {
                    console.error(`Deck with ID ${deckId} not found.`);
                    return;
                }

                cards = savedDeck.cards;
            } else if (source === "list") {
                cards = deckFromList
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0)
                    .map((line) => {
                        const match = line.match(/^(\d+)?\s*(.+)$/);
                        if (!match) return null;

                        const quantity = match[1] ? parseInt(match[1], 10) : 1;
                        const nameOrId = match[2]?.trim();

                        const isIdFormat = /^[a-z0-9-]{36}$/.test(nameOrId);

                        return {
                            id: isIdFormat ? nameOrId : "0",
                            name: isIdFormat ? "" : nameOrId,
                            quantity,
                        };
                    })
                    .filter(Boolean) as UserDeck[];
            }

            setIsCardSelectionStarted(true);

            if (cards.length === 0) {
                console.warn("No cards to process.");
                setLoadingData(false);
                return;
            }

            const response = await fetch("/api/search-cards-by-list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cards }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch cards from the backend.");
            }

            const data: SearchCardByListResponseBody = await response.json();
            setDeckData(data.cards);
            return data.cards;
        } catch (err) {
            console.error("Error in handleGetDeckCards:", err);
            return undefined;
        } finally {
            setIsCreatingNewDeck(false);
            setLoadingData(false);
        }
    };

    const handleFetchBulkData = async () => {

        const shouldGetNewData = await (await fetch(CheckCacheEndpoint)).json()

        if (shouldGetNewData.status === "cached")
            return;

        setLoading(true);
        const { id: toastId, update: updateToast, dismiss } = toast({
            title: "Syncing",
            description: (
                <div className="flex flex-col gap-1">
                    <span>We are getting the latest MTG data 🧙‍♂️</span>
                    <Progress value={0} max={100} className="w-80" />
                </div>
            ),
            duration: 40000, // Toast dura o suficiente para processos longos
        });

        const eventSource = new EventSource(UpdateBulkDataEndpoint);

        eventSource.onmessage = (event) => {
            const message = event.data;

            if (message.includes("%")) {
                const progress = parseInt(message.replace("%", ""), 10);
                setProgress(progress);

                // Atualiza o toast com o progresso
                updateToast({
                    id: toastId,
                    title: "Syncing",
                    description: (
                        <div className="flex flex-col gap-1">
                            <span>We are getting the latest MTG data 🧙‍♂️</span>
                            <Progress value={progress} max={100} className="w-80" />
                        </div>
                    ),
                });
            } else if (message === "Download completed!") {
                setProgress(100);
                eventSource.close();
                setLoadingData(false);

                // Atualiza o toast para mostrar conclusão
                updateToast({
                    id: toastId,
                    title: "Sync completed!",
                    description: (
                        <div className="flex flex-col gap-1">
                            <span>Start building your deck 🎉</span>
                            <Progress value={100} max={100} className="w-80" />
                        </div>
                    ),
                    duration: 3000, // Fecha automaticamente após 3 segundos
                });

                setTimeout(() => dismiss(), 3000); // Remove o toast
            } else if (message.startsWith("Error")) {
                console.error(message);
                eventSource.close();
                setLoadingData(false);

                // Atualiza o toast para mostrar erro
                updateToast({
                    id: toastId,
                    title: "Error",
                    description: "An error occurred while syncing data.",
                    variant: "destructive",
                    duration: 5000,
                });
            }
        };

        eventSource.onerror = () => {
            console.error("Error in SSE connection.");
            setLoadingData(false);
            eventSource.close();

            // Atualiza o toast para mostrar erro de conexão
            updateToast({
                id: toastId,
                title: "Connection Error",
                description: "The connection to the server was interrupted.",
                variant: "destructive",
                duration: 5000,
            });
        };
    };

    const clearData = () => {
        setDeckData([]);
        setInput("");
        setSearchResult([]);
        setTotalResults(0);
        setIsCardSelectionStarted(false);
    }

    useEffect(() => {
        handleFetchBulkData()
    }, [])
    //#endregion


    //#region Search cards
    const parseInputToQuery = (input: string): QueryState => {
        const parsedQuery: QueryState = {};
        const tokens = input.trim().split(/\s+/);
        let currentKey: string | null = null;

        tokens.forEach((token) => {
            if (token.startsWith("/")) {
                // Define o token como chave, removendo a barra
                currentKey = token.slice(1).toLowerCase();
                parsedQuery[currentKey as keyof QueryState] = ""; // Inicializa a chave
            } else if (currentKey) {
                // Adiciona ao valor da chave atual
                parsedQuery[currentKey as keyof QueryState] += ` ${token}`;
            }
        });

        // Limpa espaços desnecessários dos valores
        Object.keys(parsedQuery).forEach((key) => {
            parsedQuery[key as keyof QueryState] = parsedQuery[key as keyof QueryState]?.trim();
        });

        // Se não houver nenhum parâmetro detectado, trate o input como nome
        if (Object.keys(parsedQuery).length === 0 && input.trim()) {
            parsedQuery.name = input.trim();
        }

        return parsedQuery;
    };


    const fetchCards = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(query as Record<string, string>);
            if (params.has("name")) {
                if (params.toString().length < 8) {
                    setSearchResult([]);
                    setTotalResults(0);
                    return;
                }
            } else {
                if (params.toString().length < 3) {
                    setSearchResult([]);
                    setTotalResults(0);
                    return;
                }
            }

            const response = await fetch(`${SearchCardsEndpoint}?${params.toString()}`);
            const data: SearchResponse = await response.json();
            setSearchResult(data.results);
            setTotalResults(data.totalResults);
        } catch (error) {
            console.error("Error fetching cards:", error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = debounce(fetchCards, 400);

    useEffect(() => {
        if (input.trim()) {
            const parsedQuery = parseInputToQuery(input);
            setQuery(parsedQuery);
        }
    }, [input]);

    useEffect(() => {
        if (Object.keys(query).length > 0) {
            debouncedFetch();
        }

        return () => {
            debouncedFetch.cancel();
        };
    }, [query]);
    //#endregion


    //#region Deck Local Storage
    const handleSaveDeck = async (deckName: string, deckDescription: string) => {
        if (!deckName.trim()) {
            console.error("Deck name is required!");
            return;
        }

        // Nome descritivo para a chave no localStorage
        const storageKey = "MtgUtils-Decks";

        // Recupera decks existentes do localStorage

        if (!localStorage) {
            return
        }

        const savedDecks = JSON.parse(localStorage.getItem(storageKey) || "[]");


        // Cria o novo deck
        const newDeck = {
            id: generateId(),
            name: deckName,
            description: deckDescription,
            cards: deckData.map((card) => ({
                id: card.id,
                name: card.name,
                quantity: 1, // Default quantity, ajustável se necessário
            })),
        };

        // Salva o novo deck no localStorage
        localStorage.setItem(storageKey, JSON.stringify([...savedDecks, newDeck]));

        toast({
            title: "Deck saved! 💾",
            description: "Your deck has been saved successfully.",
        })

        setIsDrawerDeckOpened(false);
    };

    const deleteDeck = (deckId: string) => {
        const updatedDecks = savedDecks.filter((deck) => deck.id !== deckId);
        setSavedDecks(updatedDecks);
        localStorage.setItem("MtgUtils-Decks", JSON.stringify(updatedDecks));
    };

    const loadSavedDecks = () => {
        const decks = JSON.parse(localStorage.getItem("MtgUtils-Decks") || "[]");
        setSavedDecks(decks);
    };

    useEffect(() => {
        loadSavedDecks();
    }, []);
    //#endregion


    //#region Card Actions
    const updateCardQuantity = (id: string, newQuantity: number) => {
        setDeckData((prevDeck) =>
            prevDeck.map((card) =>
                card.id === id ? { ...card, quantity: newQuantity } : card
            )
        );
    };

    const removeCard = (id: string) => {
        // setDeckData((prevDeck) => prevDeck.filter((card) => card.id !== id));
    };
    //#endregion

    return (
        <MtgContext.Provider
            value={{
                deckData,
                loadingData,
                addCardToDeck,
                removeCardFromDeck,
                handleGetDeckCards,
                handleSaveDeck,
                handleFetchBulkData,
                setDeckFromList,
                input,
                setInput,
                loading,
                fetchCards,
                totalResults,
                progress,
                searchResult,
                isModalImportListOpen,
                setIsModalImportListOpen,
                isCardSelectionStarted,
                setIsCardSelectionStarted,
                deckFromList,
                savedDecks,
                isDrawerDeckOpened,
                setIsDrawerDeckOpened,
                deleteDeck,
                updateCardQuantity,
                removeCard,
                isCreatingNewDeck,
                setIsCreatingNewDeck,
                setDeckData,
                clearData
            }}
        >
            {children}
        </MtgContext.Provider>
    );
};

export const useMtg = () => {
    const context = useContext(MtgContext);

    if (!context) {
        throw new Error("useDeck must be used within a MtgProvider");
    }

    return context;
};
