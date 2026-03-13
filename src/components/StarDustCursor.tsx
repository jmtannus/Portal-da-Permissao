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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
            mouseRef.current.isMoving = true;

            // Update target position if attractTargetId is provided
            if (attractTargetId) {
                const el = document.getElementById(attractTargetId);
                if (el) {
                    targetElRef.current = el.getBoundingClientRect();
                }
            } else {
                targetElRef.current = null;
            }

            // Spawn particles: more if high intensity
            const count = isHighIntensity ? 4 : 2;
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: e.clientX + (Math.random() * (isHighIntensity ? 20 : 10) - (isHighIntensity ? 10 : 5)),
                    y: e.clientY + (Math.random() * (isHighIntensity ? 20 : 10) - (isHighIntensity ? 10 : 5)),
                    size: Math.random() * (isHighIntensity ? 3 : 2) + 0.5,
                    life: 1,
                    maxLife: Math.random() * 0.5 + 0.3, // 0.3 to 0.8 seconds approx with 60fps decay
                    vx: (Math.random() - 0.5) * (isHighIntensity ? 2 : 1),
                    vy: Math.random() * 1 + 0.5 // drifting downwards
                });
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        let animationId: number;
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const activeParticles = [];
            for (let i = 0; i < particlesRef.current.length; i++) {
                const p = particlesRef.current[i];

                // Gravity Logic
                if (targetElRef.current) {
                    const targetX = targetElRef.current.left + targetElRef.current.width / 2;
                    const targetY = targetElRef.current.top + targetElRef.current.height / 2;
                    
                    const dx = targetX - p.x;
                    const dy = targetY - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 600) { // Only attract if relatively close for natural feel
                        const force = (1 - distance / 600) * 0.15;
                        p.vx += (dx / distance) * force;
                        p.vy += (dy / distance) * force;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.015; // Slightly slower fade for better visibility of the trail

                if (p.life > 0) {
                    activeParticles.push(p);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

                    if (particleColor) {
                        // Attempt to inject alpha into provided hex, else fallback
                        if (particleColor.startsWith('#') && particleColor.length >= 7) {
                            const rgb = parseInt(particleColor.substring(1, 7), 16);
                            const r = (rgb >> 16) & 0xff;
                            const g = (rgb >> 8) & 0xff;
                            const b = (rgb >> 0) & 0xff;
                            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life})`;
                        } else {
                            ctx.fillStyle = particleColor;
                        }
                    } else {
                        ctx.fillStyle = `rgba(247, 231, 206, ${p.life})`; // Default Champagne
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
            cancelAnimationFrame(animationId);
        };
    }, [particleColor, isHighIntensity, attractTargetId]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    );
}
