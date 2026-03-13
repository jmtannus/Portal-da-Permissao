import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    children: ReactNode;
    content: string | ReactNode;
    delay?: number;
    disabled?: boolean;
}

export default function Tooltip({ children, content, delay = 0.2, disabled = false }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mobileCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (disabled) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay * 1000);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    // Mobile touch logic: Show on tap, auto-close after 3s
    const handleTouch = () => {
        if (disabled) return;
        
        // Toggle visibility on mobile
        if (!isVisible) {
            setIsVisible(true);
            if (mobileCloseTimeoutRef.current) clearTimeout(mobileCloseTimeoutRef.current);
            mobileCloseTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, 3000);
        } else {
            setIsVisible(false);
            if (mobileCloseTimeoutRef.current) clearTimeout(mobileCloseTimeoutRef.current);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (mobileCloseTimeoutRef.current) clearTimeout(mobileCloseTimeoutRef.current);
        };
    }, []);

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleTouch}
        >
            {children}
            <AnimatePresence>
                {isVisible && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 z-[100] pointer-events-none"
                    >
                        <div
                            className="bg-[#301934]/95 backdrop-blur-md border border-[#F7E7CE]/20 rounded-lg p-3 shadow-[0_4px_20px_rgba(247,231,206,0.1)] flex flex-col items-center text-center relative"
                            translate="no"
                        >
                            {/* Triangle pointer */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#301934] border-b border-r border-[#F7E7CE]/20 rotate-45"></div>

                            <div className="text-[#F7E7CE] font-light text-[11px] leading-relaxed tracking-wide z-10">
                                {content}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
