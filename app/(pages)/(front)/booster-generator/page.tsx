import { BoosterGenerator } from "@/app/components/booster-generator/booster-generator";
import { Metadata } from "next";



export const metadata: Metadata = {
    title: "Booster Generator",
    description: "Generate booster packs",
}

export default function BoosterGeneratorPage() {
    return (
        <BoosterGenerator />
    );
}
