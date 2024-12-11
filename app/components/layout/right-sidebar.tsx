'use client'
import { pathUtils } from "@/app/utils/pathUtils"
import { Button } from "@/components/ui/button"
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
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { UtilityBar } from "../utility-bar"

export function RightSidebar() {

    return (
        <Sidebar side='right' variant='sidebar' collapsible='offcanvas'>
            <motion.div
                className="flex flex-1 flex-col"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <SidebarHeader>
                    Search cards
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <UtilityBar />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </motion.div>
        </Sidebar>
    )
}
