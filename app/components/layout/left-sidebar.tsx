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
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

export function LeftSidebar() {
    const pathName = usePathname()

    const isRouteActive = (path: string): boolean => {
        return pathName === path;
    }

    return (
        <Sidebar>
            <motion.div
                className="flex flex-1 flex-col"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <SidebarHeader>
                    <Button type="button" variant={"secondary"}>
                        <Link href="/" className="font-bold">
                            Magic Utils
                        </Link>
                    </Button>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {pathUtils.map((item, index) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Button
                                                className="flex duration-1000 items-center justify-start w-full"
                                                variant={isRouteActive(item.route) ? "default" : "ghost"}>
                                                <Link className="flex items-center justify-start w-full gap-2" href={item.route}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </Button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarGroup>
                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/logout">
                                            <LogOut />
                                            <span>Logout</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarFooter>
            </motion.div>
        </Sidebar>
    )
}
