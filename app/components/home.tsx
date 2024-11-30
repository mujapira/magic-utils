'use client'

import { motion } from "motion/react"

export function HomeComponent() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center flex-col h-100 justify-center pb-40">
            <span className="font-bold text-2xl">
                Welcome to Magic Utils
            </span>
            <span className="italic font-light">
                a collection of utility to make your life easier
            </span>
        </motion.div>
    )
}