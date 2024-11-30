"use client"
import { motion } from "motion/react"
import type { ICard } from "../interfaces"
import { Fragment, use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Replace } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"

export function CardComponent({ ...card }: ICard) {
    const [quantity, setQuantity] = useState(card.quantity || 1);
    const [isTransformed, setIsTransformed] = useState<boolean>(false)
    const { toast } = useToast()
    const isTransform = card.isDoubleSide

    const handleTransform = () => {
        setIsTransformed(!isTransformed)
    }

    const increase = () => {
        setQuantity((prev) => prev + 1)
    };

    const undoRemoval = () => {
        setQuantity((prev) => prev)
    };

    const decrease = () => {
        if (quantity === 1) {
            toast({
                duration: 10000,
                title: "Card removed",
                description: `${card.name} removed from deck, you can undo this action.`,
                action: (
                    <ToastAction
                        asChild
                        altText="Undo card removal"
                    >
                        <Button onClick={() => undoRemoval()}>
                            Undo
                        </Button>
                    </ToastAction>
                ),
            });
        } else {
            setQuantity((prev) => prev - 1)
        }
    };

    const renderButtons = () => (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 opacity-0 
        hover:opacity-100
        duration-300">
            {isTransform && (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleTransform}
                    className="w-4 h-8"
                >
                    <Replace />
                </Button>
            )}
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={decrease}
                    className="w-4 h-8"
                >
                    <Minus />
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={increase}
                    className="w-4 h-8"
                >
                    <Plus />
                </Button>
            </div>
        </div>
    );

    const cardStyles = `group rounded-xl relative w-full min-w-[144px] max-w-[288px] aspect-[488/680]
        bg-cover bg-center bg-no-repeat flex flex-col justify-between overflow-hidden
        flex items-center justify-center
        `;

    return (
        <Fragment>
            {isTransform && (
                <motion.div
                    key={isTransformed ? "back" : "front"}
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                    style={{
                        backgroundImage: `url(${card.card_faces?.[isTransformed ? 1 : 0]?.image_uris?.normal})`,
                    }}
                    className={cardStyles}
                >
                    <Button
                        variant="secondary"
                        className="bg-opacity-50 w-4 h-8 absolute bottom-0 left-0"
                    >{quantity}
                    </Button>
                    {renderButtons()}
                </motion.div>
            )}

            {!isTransform && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                        backgroundImage: `url(${card.image_uris?.normal})`,
                    }}
                    className={cardStyles}
                >
                    <Button
                        variant="secondary"
                        className="bg-opacity-50 w-4 h-8 absolute bottom-0 left-0"
                    >{quantity}
                    </Button>
                    {renderButtons()}
                </motion.div>
            )}
        </Fragment>
    )
}