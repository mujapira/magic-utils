import { Backpack, HomeIcon, Layers, LucideProps, ScrollText } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface PathUtils {
    route: string;
    title: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export const pathUtils: PathUtils[] = [
    { route: "/", title: "Home", icon: HomeIcon },
    { route: "/deck-builder", title: "Deck Builder", icon: ScrollText },
    { route: "/my-decks", title: "My Decks", icon: Layers },
]

export const SearchCardsByListEndpoint = "/api/search-cards-by-list"
export const SearchCardsEndpoint = "/api/search-cards"
export const CheckCacheEndpoint = "/api/bulk-data/check-cache"
export const GetBulkDataEndpoint = "/api/bulk-data/get-bulk-data"
export const UpdateBulkDataEndpoint = "/api/bulk-data/update-bulk-data"
