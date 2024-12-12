'use client'
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { motion } from "motion/react"
import { pathUtils } from "../utils/pathUtils";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function HeaderComponent() {
    const path = usePathname() as keyof typeof pathUtils

    const { setOpen } = useSidebar("right")

    const activePath = pathUtils
        .slice()
        .reverse()
        .find((item) => path.toString().startsWith(item.route));

    useEffect(() => {
        setOpen(false)
    }, [activePath])

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex w-full items-center justify-start p-1 py-4 gap-4">
            <SidebarTrigger name='left' className='sidebar-trigger-left' />
            <h1 className="text-2xl font-bold w-full text-start">
                {activePath ? activePath.title : "Unknown Route"}
            </h1>
        </motion.header>
    )
}