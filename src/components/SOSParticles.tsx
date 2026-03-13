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

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Initialize particles
        if (particlesRef.current.length === 0) {
            const count = 300; // Dense luxury effect
            const maxRadius = Math.max(window.innerWidth, window.innerHeight);
            const golds = ['rgba(247, 231, 206,', 'rgba(212, 175, 55,']; // Champagne and Pure Gold bases
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    angle: Math.random() * Math.PI * 2,
                    baseRadius: Math.random() * maxRadius + 50, // Range covers 50px to edge of screen
                    size: Math.random() * 2.5 + 0.5,
                    speed: (Math.random() - 0.5) * 0.0015, // Smooth organic orbit
                    seed: Math.random() * 1000,
                    color: golds[Math.floor(Math.random() * golds.length)]
                });
            }
        }

        let animationId: number;
        const render = () => {
            if (!isActive || !startTimeMs) {
                // Dim down existing if active was turned off suddenly
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                animationId = requestAnimationFrame(render);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const elapsed = (Date.now() - startTimeMs) / 1000;
            const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

            let globalScale = 1.0;
            let globalOpacity = 0.5;

            // Phase logic mapped to 16s breathing cycle exactly
            if (elapsed < 9) {
                // Phase 1: Intro (0s -> 9s)
                globalOpacity = Math.min(0.5, elapsed / 5 * 0.5); // fade in first 5s softly
            } else if (elapsed < 150) {
                // Phase 2: Breathing 4-4-4-4
                const cycleTime = (elapsed - 9) % 16;
                if (cycleTime < 4) {
                    // INSPIRAR (0 to 4s): attract to center, increase brightness
                    const progress = cycleTime / 4;
                    const eased = easeInOutSine(progress);
                    globalScale = 1.0 - eased * 0.65; // Particles collapse to 35% distance
                    globalOpacity = 0.5 + eased * 0.5; // Brightness peaks to 1.0
                } else if (cycleTime < 8) {
                    // RETER (4 to 8s): hold at center, max brightness
                    globalScale = 0.35;
                    globalOpacity = 1.0;
                } else if (cycleTime < 12) {
                    // EXPIRAR (8 to 12s): repel outwards smoothly
                    const progress = (cycleTime - 8) / 4;
                    const eased = easeInOutSine(progress);
                    globalScale = 0.35 + eased * 0.65; // Particles expand back to 1.0
                    globalOpacity = 1.0 - eased * 0.5; // Brightness relaxes to 0.5
                } else {
                    // VAZIO (12 to 16s): drift naturally before next cycle
                    globalScale = 1.0;
                    globalOpacity = 0.5;
                }
            } else {
                // Phase 3: Outro fade out (150s -> 180s)
                const fadeProgress = (elapsed - 150) / 10; // slow fade over 10 seconds
                globalOpacity = Math.max(0, 0.5 * (1 - fadeProgress));
            }

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const time = Date.now() / 1000;

            for (let i = 0; i < particlesRef.current.length; i++) {
                const p = particlesRef.current[i];
                p.angle += p.speed;

                // Subtle fluid mechanics (organic underwater drift)
                const driftX = Math.sin(time * 0.5 + p.seed) * 40;
                const driftY = Math.cos(time * 0.6 + p.seed) * 40;

                const targetX = centerX + Math.cos(p.angle) * (p.baseRadius * globalScale) + driftX;
                const targetY = centerY + Math.sin(p.angle) * (p.baseRadius * globalScale) + driftY;

                ctx.beginPath();
                ctx.arc(targetX, targetY, p.size, 0, Math.PI * 2);

                // Add living twinkle effect per particle
                const twinkle = Math.sin(time * 1.5 + p.seed) * 0.4 + 0.6; // 0.2 to 1.0 fluctuation
                ctx.fillStyle = `${p.color} ${globalOpacity * twinkle})`;

                // Adds a slight atmospheric blurred glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(247, 231, 206, ${globalOpacity * 0.3})`;

                ctx.fill();
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [isActive, startTimeMs]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
        />
    );
}
