import { Backpack, Banana, Bluetooth, HomeIcon, Inbox, Layers, LucideProps, ScrollText, Search, Star } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface PathUtils {
    route: string;
    title: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export const pathUtils: PathUtils[] = [
    { route: "/", title: "Home", icon: HomeIcon },
    // { route: "/deck-builder", title: "Deck Builder", icon: ScrollText },
    { route: "/my-decks", title: "My Decks", icon: Layers },
    { route: "/booster-generator", title: "Booster Generator", icon: Inbox },
    { route: "/search-cards", title: "Search Cards", icon: Search },
    { route: "/favorites", title: "Favorites", icon: Star }
]

export const SearchCardsByListEndpoint = "/api/search-cards-by-list"
export const SearchCardsEndpoint = "/api/search-cards"
export const CheckCacheEndpoint = "/api/bulk-data/check-cache"
export const GetBulkDataEndpoint = "/api/bulk-data/get-bulk-data"
export const UpdateBulkDataEndpoint = "/api/bulk-data/update-bulk-data"
