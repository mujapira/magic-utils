'use client'

import { useMtg } from "@/app/contexts/mtgContext";
import { UserDeck } from "@/app/interfaces";
import { Button } from "@/components/ui/button";
import { generateId } from "../../../lib/utils";
import { Input } from "@/components/ui/input";

export function BoosterGenerator() {
    const {
        handleGetDeckCards,
        setDeckFromList,
    } = useMtg();


    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            console.error("No file selected");
            return;
        }

        if (file.type !== "text/csv") {
            console.error("Invalid file type. Must be text/csv");
            return;
        }

        try {
            const text = await file.text();

            let map = new Map();

            text.split("\n").forEach((line, i) => {
                if (i === 0) return
                const members = line.split(",")
                const name = members[1]
                map.set(name, (map.get(name) || 0) + 1)
            })

            let cards = ""
            map.forEach((value, key) => {
                cards += `${value} ${key}\n`
            })


        } catch (err) {
            console.error("Error parsing CSV:", err);
        }
    };


    return (
        <span>
            <span>
                Lets generate some boosters!
            </span>

            <br />

            <Button>
                Generate from decks
            </Button>

            <Button>
                Generate from list
            </Button>

            <div className="flex flex-col gap-2">
                <label htmlFor="csv-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded">
                    Choose CSV File
                </label>
                <Input
                    id="csv-upload"
                    type="file"
                    accept="text/csv"
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </div>

        </span>
    )
}