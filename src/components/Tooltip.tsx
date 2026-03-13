import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    children: ReactNode;
    content: string | ReactNode;
    delay?: number;
}

export default function Tooltip({ children, content, delay = 0.4 }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay * 1000);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    // For mobile (touch and hold)
    const handleTouchStart = () => {
        handleMouseEnter();
    };

    const handleTouchEnd = () => {
        handleMouseLeave();
    };

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 z-[100] pointer-events-none"
                    >
                        <div
                            className="bg-[#301934]/95 backdrop-blur-md border border-[#d4af37]/40 rounded-xl p-4 shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col items-center text-center relative"
                            translate="no"
                        >
                            {/* Triangle pointer */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#301934] border-b border-r border-[#d4af37]/40 rotate-45"></div>

                            <div className="text-[#F7E7CE] font-light text-xs leading-relaxed tracking-wide z-10">
                                {content}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
