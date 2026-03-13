import { useEffect, useRef } from 'react';

interface Particle {
    angle: number;
    baseRadius: number;
    size: number;
    speed: number;
    seed: number;
    color: string;
}

interface SOSParticlesProps {
    className?: string;
    isActive: boolean;
    startTimeMs: number | null;
}

export default function SOSParticles({ className = "fixed inset-0 pointer-events-none z-[9000]", isActive, startTimeMs }: SOSParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isMobile = window.innerWidth < 768;

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const resize = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (canvas) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }, 500);
        };

        // Initial resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', resize);

        // Initialize particles
        if (particlesRef.current.length === 0) {
            const count = isMobile ? 120 : 300; 
            const maxRadius = Math.max(window.innerWidth, window.innerHeight);
            const golds = ['rgba(247, 231, 206,', 'rgba(212, 175, 55,']; 
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    angle: Math.random() * Math.PI * 2,
                    baseRadius: Math.random() * maxRadius + 50,
                    size: Math.random() * (isMobile ? 2 : 2.5) + 0.5,
                    speed: (Math.random() - 0.5) * (isMobile ? 0.001 : 0.0015),
                    seed: Math.random() * 1000,
                    color: golds[Math.floor(Math.random() * golds.length)]
                });
            }
        }

        let animationId: number;
        const render = () => {
            if (!isActive || !startTimeMs) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                animationId = requestAnimationFrame(render);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const elapsed = (Date.now() - startTimeMs) / 1000;
            const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

            let globalScale = 1.0;
            let globalOpacity = 0.5;

            if (elapsed < 9) {
                globalOpacity = Math.min(0.5, elapsed / 5 * 0.5);
            } else if (elapsed < 150) {
                const cycleTime = (elapsed - 9) % 16;
                if (cycleTime < 4) {
                    const progress = cycleTime / 4;
                    const eased = easeInOutSine(progress);
                    globalScale = 1.0 - eased * 0.65;
                    globalOpacity = 0.5 + eased * 0.5;
                } else if (cycleTime < 8) {
                    globalScale = 0.35;
                    globalOpacity = 1.0;
                } else if (cycleTime < 12) {
                    const progress = (cycleTime - 8) / 4;
                    const eased = easeInOutSine(progress);
                    globalScale = 0.35 + eased * 0.65;
                    globalOpacity = 1.0 - eased * 0.5;
                } else {
                    globalScale = 1.0;
                    globalOpacity = 0.5;
                }
            } else {
                const fadeProgress = (elapsed - 150) / 10;
                globalOpacity = Math.max(0, 0.5 * (1 - fadeProgress));
            }

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const time = Date.now() / 1000;

            for (let i = 0; i < particlesRef.current.length; i++) {
                const p = particlesRef.current[i];
                p.angle += p.speed;

                const driftX = Math.sin(time * 0.5 + p.seed) * (isMobile ? 20 : 40);
                const driftY = Math.cos(time * 0.6 + p.seed) * (isMobile ? 20 : 40);

                const targetX = centerX + Math.cos(p.angle) * (p.baseRadius * globalScale) + driftX;
                const targetY = centerY + Math.sin(p.angle) * (p.baseRadius * globalScale) + driftY;

                ctx.beginPath();
                ctx.arc(targetX, targetY, p.size, 0, Math.PI * 2);

                const twinkle = Math.sin(time * 1.5 + p.seed) * 0.4 + 0.6;
                ctx.fillStyle = `${p.color} ${globalOpacity * twinkle})`;

                // Reduce shadow blur on mobile to improve performance
                if (!isMobile) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = `rgba(247, 231, 206, ${globalOpacity * 0.3})`;
                }

                ctx.fill();
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
            if (resizeTimeout) clearTimeout(resizeTimeout);
        };
    }, [isActive, startTimeMs]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    );
}
