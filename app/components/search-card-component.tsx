"use client"
import { motion } from "motion/react"
import type { ICard } from "../interfaces"
import { Fragment, use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, PlusCircle, Replace } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"

export function SaarchCardComponent({ ...card }: ICard) {
    
    const handleAddCard = () => {

    }

    const renderButtons = () => (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 opacity-0 
        hover:opacity-100
        duration-300">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddCard}
                    className="w-4 h-8"
                >
                    <PlusCircle/>
                </Button>
      
          
        </div>
    );

    const cardStyles = `group rounded-xl relative w-full min-w-[144px] max-w-[288px] aspect-[488/680]
        bg-cover bg-center bg-no-repeat flex flex-col justify-between overflow-hidden
        flex items-center justify-center
        `;

    return (
        <Fragment>

    
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                        backgroundImage: `url(${card.image_uris?.normal})`,
                    }}
                    className={cardStyles}
                >
                    {renderButtons()}
                </motion.div>
       
        </Fragment>
    )
}