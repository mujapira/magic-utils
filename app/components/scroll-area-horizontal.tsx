"useClient"

import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useCallback, useRef } from 'react';

interface HorizontalTextAreaProps {
    children: React.ReactNode;
}

export function HorizontalTextArea({ children }: HorizontalTextAreaProps) {
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        // Ignore this event unless it's a strictly vertical wheel event (horizontal wheel events are already handled by the library)
        if (!viewportRef.current || e.deltaY === 0 || e.deltaX !== 0) {
            return;
        }

        e.preventDefault();

        // Capture up/down wheel events and scroll the viewport horizontally
        const delta = e.deltaY;
        const currPos = viewportRef.current.scrollLeft;
        const scrollWidth = viewportRef.current.scrollWidth;

        const newPos = Math.max(0, Math.min(scrollWidth, currPos + delta));

        viewportRef.current.scrollLeft = newPos;
    }, []);

    return (
        <ScrollArea.Root onWheel={onWheel}>
            <ScrollArea.Viewport ref={viewportRef}>
                {children}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="horizontal">
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}