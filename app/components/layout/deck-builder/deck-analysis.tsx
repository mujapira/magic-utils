"use client"
import { ICard } from "@/app/interfaces"
import { ChartConfig } from "@/components/ui/chart"
import { use, useEffect, useState } from "react"
import { PieChartComponent } from "./pie-chart"
import { Badge } from "@/components/ui/badge"

export interface IDeckStatisticsInfo {
    totalCards: number
    totalUniqueCards: number
    totalMana: number
    averageMana: number
    totalCreatures: number
    totalSpells: number
    totalArtifacts: number
    totalEnchantments: number
    totalPlaneswalkers: number
    totalLands: number
    colors: {
        white: number
        blue: number
        black: number
        red: number
        green: number
        colorless: number
    },
    rarity: {
        common: number
        uncommon: number
        rare: number
        mythic: number
    }
}

const colorMap: Record<string, keyof IDeckStatisticsInfo["colors"]> = {
    W: "white",
    U: "blue",
    B: "black",
    R: "red",
    G: "green",
};

const chartConfig: ChartConfig = {
    white: {
        label: "White",
        color: "hsl(var(--color-mana-white))",
    },
    blue: {
        label: "Blue",
        color: "hsl(var(--color-mana-blue))",
    },
    black: {
        label: "Black",
        color: "hsl(var(--color-mana-black))",
    },
    red: {
        label: "Red",
        color: "hsl(var(--color-mana-red))",
    },
    green: {
        label: "Green",
        color: "hsl(var(--color-mana-green))",
    },
    colorless: {
        label: "Colorless",
        color: "hsl(var(--color-mana-colorless))",
    },
    common: {
        label: "Common",
        color: "hsl(var(--color-rarity-common))",
    },
    uncommon: {
        label: "Uncommon",
        color: "hsl(var(--color-rarity-uncommon))",
    },
    rare: {
        label: "Rare",
        color: "hsl(var(--color-rarity-rare))",
    },
    mythic: {
        label: "Mythic",
        color: "hsl(var(--color-rarity-mythic))",
    },
};

export function DeckAnalysis({ cards }: { cards: ICard[] }) {
    const [deckInfo, setDeckInfo] = useState<IDeckStatisticsInfo>()

    const calculateDeckStatistics = (cards: ICard[]): IDeckStatisticsInfo => {
        return cards.reduce(
            (acc: any, card) => {
                if (!card) return acc;

                // Soma a quantidade total de cartas
                acc.totalCards += card.quantity;

                // Soma o custo total de mana usando `cmc`
                if (typeof card.cmc === "number") {
                    acc.totalMana += card.cmc * card.quantity;
                }

                // Categoriza a carta em tipos e soma ao total correspondente
                if (card.type_line.includes("Creature")) acc.totalCreatures += card.quantity;
                if (card.type_line.includes("Instant") || card.type_line.includes("Sorcery"))
                    acc.totalSpells += card.quantity;
                if (card.type_line.includes("Artifact")) acc.totalArtifacts += card.quantity;
                if (card.type_line.includes("Enchantment")) acc.totalEnchantments += card.quantity;
                if (card.type_line.includes("Planeswalker")) acc.totalPlaneswalkers += card.quantity;
                if (card.type_line.includes("Land")) acc.totalLands += card.quantity;

                // Calcula a distribuição de cores
                if (!card.colors || card.colors.length === 0) {
                    acc.colors.colorless += card.quantity;
                } else {
                    card.colors.forEach((colorAbbreviation) => {
                        const color = colorMap[colorAbbreviation]; // Mapeia a abreviação para o nome completo
                        if (color) {
                            acc.colors[color] += card.quantity;
                        }
                    });
                }

                // Soma a raridade
                switch (card.rarity) {
                    case "common":
                        acc.rarity.common += card.quantity;
                        break;
                    case "uncommon":
                        acc.rarity.uncommon += card.quantity;
                        break;
                    case "rare":
                        acc.rarity.rare += card.quantity;
                        break;
                    case "mythic":
                        acc.rarity.mythic += card.quantity;
                        break;
                    default:
                        break; // Ignora raridades desconhecidas
                }

                acc.averageMana = acc.totalMana / acc.totalCards;


                return acc;
            },
            {
                totalCards: 0,
                totalUniqueCards: cards.length,
                totalMana: 0,
                averageMana: 0,
                totalCreatures: 0,
                totalSpells: 0,
                totalArtifacts: 0,
                totalEnchantments: 0,
                totalPlaneswalkers: 0,
                totalLands: 0,
                colors: {
                    white: 0,
                    blue: 0,
                    black: 0,
                    red: 0,
                    green: 0,
                    colorless: 0,
                },
                rarity: {
                    common: 0,
                    uncommon: 0,
                    rare: 0,
                    mythic: 0,
                },
            }
        );
    }

    const handleGetAnalysis = async () => {
        setDeckInfo(calculateDeckStatistics(cards))

    }

    const generateChartData = (
        config: ChartConfig,
        values: Record<string, number>
    ) => {
        return Object.entries(values).map(([key, value]) => ({
            name: String(config[key]?.label || key),
            value,
            fill: config[key]?.color || "hsl(var(--chart-default))",
        }));
    };

    const manaBalanceData = generateChartData(chartConfig, deckInfo?.colors || {});
    const rarityData = generateChartData(chartConfig, deckInfo?.rarity || {});

    useEffect(() => {
        handleGetAnalysis()
    }, [cards])

    return (
        <div>
            {deckInfo && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <PieChartComponent
                            data={manaBalanceData}
                            title="Mana Balance"
                            description="Mana distribution in your deck"
                            dataKey="value"
                            nameKey="name"
                        />

                        <PieChartComponent
                            data={rarityData}
                            title="Rarity Distribution"
                            description="Rarity breakdown in your deck"
                            dataKey="value"
                            nameKey="name"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalCards} Cards</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalUniqueCards} Uniques</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalMana} Total Mana</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalCreatures} Creatures</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalSpells} Spells</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalArtifacts} Artifacts</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalEnchantments} Enchantments</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalPlaneswalkers} Planeswalkers</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.totalLands} Lands</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">Mana Cost {deckInfo.averageMana.toFixed(1)}</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.colors.white} White</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.colors.blue} Blue</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.colors.black} Black</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.colors.red} Red</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.colors.green} Green</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.colors.colorless} Colorless</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.rarity.common} Common</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.rarity.uncommon} Uncommon</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.rarity.rare} Rare</Badge>
                        <Badge variant={"outline"} className="flex-grow flex-shrink-0">{deckInfo.rarity.mythic} Mythic</Badge>

                    </div>


                </div>
            )}

        </div>
    )
}