import { HomeIcon, LucideProps, ScrollText } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface PathUtils {
    route: string;
    title: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export const pathUtils: PathUtils[] = [
    { route: "/", title: "Home", icon: HomeIcon },
    { route: "/deck-builder", title: "Deck Builder", icon: ScrollText },
]