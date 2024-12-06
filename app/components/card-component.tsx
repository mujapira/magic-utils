"use client"
import { motion } from "motion/react"
import type { ICard } from "../interfaces"
import { Fragment, use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Minus, Plus, Replace } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { useMtg } from "../contexts/mtgContext"


type CardComponentProps = {
    card: ICard
    isSearch?: boolean
}

export function CardComponent({ card, isSearch = false }: CardComponentProps) {
    const { updateCardQuantity, removeCard, addCardToDeck } = useMtg();
    const { toast } = useToast();
    const [isTransformed, setIsTransformed] = useState<boolean>(false);

    const isTransform = (card.card_faces?.length ?? 0) > 1;

    const handleIncrease = () => updateCardQuantity(card.id, card.quantity + 1);

    const handleAddCardToDeck = () => {
        addCardToDeck(card)
        toast({
            title: "Card added",
            description: `${card.name} added to deck`,
        });
    }

    const handleDecrease = () => {
        if (card.quantity === 1) {
            toast({
                title: "Card removed",
                description: `${card.name} removed from deck. You can undo this action.`,
                action: (
                    <ToastAction asChild altText="Undo card removal">
                        <Button onClick={() => updateCardQuantity(card.id, 1)}>Undo</Button>
                    </ToastAction>
                ),
            });
        }

        updateCardQuantity(card.id, card.quantity - 1);
    };

    const handleTransform = () => setIsTransformed(!isTransformed);

    const handleSeeDetails = () => {

    };

    const renderButtons = () => (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 opacity-0 hover:opacity-100 duration-300">
            <div className="flex gap-4">
                <Button type="button" variant="secondary" onClick={handleSeeDetails} size="icon">
                    <Eye />
                </Button>
                {isSearch ? (
                    <Button type="button" variant="secondary" onClick={() => handleAddCardToDeck()} size="icon">
                        <Plus />
                    </Button>
                ) : (
                    isTransform && (
                        <Button type="button" variant="secondary" onClick={handleTransform} size="icon">
                            <Replace />
                        </Button>
                    )
                )}
            </div>
            {!isSearch && (
                <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={handleDecrease} size="icon">
                        <Minus />
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleIncrease} size="icon">
                        <Plus />
                    </Button>
                </div>
            )}
        </div>
    );

    const cardImage = isTransform
        ? card.card_faces?.[isTransformed ? 1 : 0]?.image_uris?.normal
        : card.image_uris?.normal;

    const cardStyles = `group rounded-xl relative w-full min-w-[144px] max-w-[288px] aspect-[488/680]
        bg-cover bg-center bg-no-repeat flex flex-col justify-between overflow-hidden items-center justify-center`;

    const cardStylesSearch = `group rounded-xl relative w-full
        w-[288px] min-h-[340px] max-h-[680px] aspect-[488/680]
        bg-cover bg-center bg-no-repeat flex flex-col justify-between overflow-hidden items-center justify-center`;

    return (
        <Fragment>
          
            {isTransform ? (
                <motion.div
                    key={isTransformed ? "back" : "front"}
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ backgroundImage: `url(${cardImage})` }}
                    className={isSearch ? cardStylesSearch : cardStyles}
                >
                    {!isSearch && (
                        <Button variant="secondary" className="bg-opacity-50 w-4 h-8 absolute bottom-0 left-0">
                            {card.quantity}
                        </Button>
                    )}
                    {renderButtons()}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{ backgroundImage: `url(${cardImage})` }}
                    className={isSearch ? cardStylesSearch : cardStyles}
                >
                    {!isSearch && (
                        <Button variant="secondary" className="bg-opacity-50 w-4 h-8 absolute bottom-0 left-0">
                            {card.quantity}
                        </Button>
                    )}
                    {renderButtons()}
                </motion.div>
            )}
        </Fragment>
    );
}