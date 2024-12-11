'use client'
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { motion } from "motion/react"
import { pathUtils } from "../utils/pathUtils";
import { Button } from "@/components/ui/button";

export function HeaderComponent() {
    const path = usePathname() as keyof typeof pathUtils

    const activePath = pathUtils
        .slice()
        .reverse()
        .find((item) => path.toString().startsWith(item.route));

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex w-full items-center justify-start p-1 py-4 gap-4">
            <SidebarTrigger name='left' className='sidebar-trigger-left' />
            <h1 className="text-2xl font-bold text-center">
                {activePath ? activePath.title : "Unknown Route"}
            </h1>
            <SidebarTrigger name='right' className='sidebar-trigger-right' />
        </motion.header>
    )
}