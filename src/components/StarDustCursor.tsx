import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    life: number;
    maxLife: number;
    vx: number;
    vy: number;
}

interface StarDustCursorProps {
    className?: string;
    particleColor?: string; // Optional hex or rgba string for particles
    isHighIntensity?: boolean;
    attractTargetId?: string; // ID of the element to attract particles toward
}

export default function StarDustCursor({ className = "fixed inset-0 pointer-events-none z-[9000]", particleColor, isHighIntensity, attractTargetId }: StarDustCursorProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -100, y: -100, isMoving: false });
    const targetElRef = useRef<DOMRect | null>(null);
    const isMobileRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const checkMobile = () => {
            isMobileRef.current = window.innerWidth < 768;
        };
        checkMobile();

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const resize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            // Debounce resize to avoid mobile keyboard/address bar jumps
            resizeTimeout = setTimeout(() => {
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }, 500);
        };

        // Initial immediate resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', resize);

        const onMouseMove = (e: MouseEvent | TouchEvent) => {
            const isTouch = 'touches' in e;
            const x = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
            const y = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

            mouseRef.current.x = x;
            mouseRef.current.y = y;
            mouseRef.current.isMoving = true;

            // In mobile touch, we don't necessarily want constant attraction,
            // but we can spawn a few on touch start/move
            if (isMobileRef.current && Math.random() > 0.3) return; // Throttled spawn on mobile

            const el = attractTargetId ? document.getElementById(attractTargetId) : null;
            if (el) targetElRef.current = el.getBoundingClientRect();

            const count = isMobileRef.current ? 1 : (isHighIntensity ? 4 : 2);
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: x + (Math.random() * (isHighIntensity ? 20 : 10) - (isHighIntensity ? 10 : 5)),
                    y: y + (Math.random() * (isHighIntensity ? 20 : 10) - (isHighIntensity ? 10 : 5)),
                    size: Math.random() * (isHighIntensity ? 3 : 2) + 0.5,
                    life: 1,
                    maxLife: Math.random() * 0.5 + 0.3,
                    vx: (Math.random() - 0.5) * (isHighIntensity ? 2 : 1),
                    vy: Math.random() * (isMobileRef.current ? 0.5 : 1) + 0.5
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onMouseMove, { passive: true });

        // Mobile Ambient Mode: Periodic autonomous spawns
        const ambientInterval = setInterval(() => {
            if (isMobileRef.current && particlesRef.current.length < 30) {
                particlesRef.current.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 2 + 0.5,
                    life: 1,
                    maxLife: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                });
            }
        }, 300);

        let animationId: number;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const activeParticles = [];
            const maxParticles = isMobileRef.current ? 40 : 150;

            // Cap particle count
            if (particlesRef.current.length > maxParticles) {
                particlesRef.current = particlesRef.current.slice(-maxParticles);
            }

            for (let i = 0; i < particlesRef.current.length; i++) {
                const p = particlesRef.current[i];

                // Attraction logic (only on desktop for better performance)
                if (!isMobileRef.current && targetElRef.current) {
                    const targetX = targetElRef.current.left + targetElRef.current.width / 2;
                    const targetY = targetElRef.current.top + targetElRef.current.height / 2;
                    const dx = targetX - p.x;
                    const dy = targetY - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 600) {
                        const force = (1 - distance / 600) * 0.15;
                        p.vx += (dx / distance) * force;
                        p.vy += (dy / distance) * force;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;
                p.life -= isMobileRef.current ? 0.01 : 0.015;

                if (p.life > 0) {
                    activeParticles.push(p);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                    if (particleColor) {
                        if (particleColor.startsWith('#') && particleColor.length >= 7) {
                            const rgb = parseInt(particleColor.substring(1, 7), 16);
                            ctx.fillStyle = `rgba(${(rgb >> 16) & 0xff}, ${(rgb >> 8) & 0xff}, ${rgb & 0xff}, ${p.life})`;
                        } else {
                            ctx.fillStyle = particleColor;
                        }
                    } else {
                        ctx.fillStyle = `rgba(247, 231, 206, ${p.life})`;
                    }
                    ctx.fill();
                }
            }
            particlesRef.current = activeParticles;
            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onMouseMove);
            clearInterval(ambientInterval);
            cancelAnimationFrame(animationId);
            if (resizeTimeout) clearTimeout(resizeTimeout);
        };
    }, [particleColor, isHighIntensity, attractTargetId]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    );
}
