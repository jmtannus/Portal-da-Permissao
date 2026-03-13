import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Upload, Heart, Settings2, Sparkles, Music } from 'lucide-react';

const TRACKS = [
    { title: 'The Resonance of Silence - Binaural Beats', src: 'https://cdn.pixabay.com/audio/2025/09/24/audio_b7e313e39e.mp3' },
    { title: 'Alpha Binaural Waves (11Hz)', src: 'https://cdn.pixabay.com/audio/2021/09/06/audio_887337c364.mp3' },
    { title: 'Drifting Away - Binaural Beats', src: 'https://cdn.pixabay.com/audio/2025/09/23/audio_c80c5b04ce.mp3' }
];

interface Particle {
    x: number;
    y: number;
    size: number;
    life: number;
    vx: number;
    vy: number;
    type: 'estrela' | 'poeira';
}

interface OasisEstelarProps {
    onBack: () => void;
}

export default function OasisEstelar({ onBack }: OasisEstelarProps) {
    // Canvas & particles state
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -100, y: -100, isMoving: false });

    // Ritmo da Jornada settings
    const [particleType, setParticleType] = useState<'estrela' | 'poeira'>('estrela');
    const [expansion, setExpansion] = useState(2); // 1 to 5
    const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.2 to 3
    const [persistence, setPersistence] = useState(0.95); // 0.8 to 0.99
    const [showRitmo, setShowRitmo] = useState(false);

    // Vitrola da Alma settings
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
    const [favoriteTrackIdx, setFavoriteTrackIdx] = useState<number | null>(() => {
        const saved = localStorage.getItem('oasis_favorite_track');
        return saved ? parseInt(saved, 10) : null;
    });
    const [customAudioLabel, setCustomAudioLabel] = useState<string | null>(null);
    const [volume, setVolume] = useState(0.15); // 15% initial volume for peace

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    // Track initialization
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            const startIdx = favoriteTrackIdx !== null ? favoriteTrackIdx : 0;
            setCurrentTrackIdx(startIdx);
            audioRef.current.src = TRACKS[startIdx].src;
            audioRef.current.loop = true;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Play/Pause & Volume effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log('Audio autoplay blocked:', e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIdx, volume]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        const next = (currentTrackIdx + 1) % TRACKS.length;
        setCurrentTrackIdx(next);
        setCustomAudioLabel(null);
        if (audioRef.current) {
            audioRef.current.src = TRACKS[next].src;
            if (isPlaying) audioRef.current.play();
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && audioRef.current) {
            const fileUrl = URL.createObjectURL(file);
            audioRef.current.src = fileUrl;
            setCustomAudioLabel(file.name);
            setIsPlaying(true);
            if (audioRef.current) audioRef.current.play();
        }
    };

    const toggleFavorite = () => {
        if (favoriteTrackIdx === currentTrackIdx) {
            setFavoriteTrackIdx(null);
            localStorage.removeItem('oasis_favorite_track');
        } else {
            setFavoriteTrackIdx(currentTrackIdx);
            localStorage.setItem('oasis_favorite_track', currentTrackIdx.toString());
        }
    };

    // Canvas animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const draw = () => {
            // clear background completely
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add new particles if mouse is moving
            if (mouseRef.current.isMoving) {
                const count = particleType === 'estrela' ? 1 : 3;

                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = (Math.random() * 2) * speedMultiplier;
                    particlesRef.current.push({
                        x: mouseRef.current.x + (Math.random() * 20 - 10),
                        y: mouseRef.current.y + (Math.random() * 20 - 10),
                        size: (Math.random() * expansion + 1),
                        life: 1,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        type: particleType
                    });
                }
                mouseRef.current.isMoving = false;
            }

            // Update & Draw particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life *= persistence; // fade out depending on persistence setting

                if (p.life < 0.01) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.life;

                if (p.type === 'estrela') {
                    // Crisp circles for 'estrelas'
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = '#F7E7CE';
                    ctx.fill();

                    // Add subtle glow
                    ctx.shadowColor = '#F7E7CE';
                    ctx.shadowBlur = p.size * 2;
                } else {
                    // Soft gradient for 'poeira'
                    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                    grad.addColorStop(0, '#F7E7CE');
                    grad.addColorStop(1, 'rgba(247,231,206,0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleType, expansion, persistence, speedMultiplier]);

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
        mouseRef.current.isMoving = true;
    };

    return (
        <div
            className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#301934] to-[#5F4B8B] z-[1] overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Wild Silk overlay texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-mamba.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

            {/* Canvas for Rastro Estelar */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 pointer-events-none mix-blend-screen"
            />

            {/* Main Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="flex flex-col items-center transform transition-all hover:scale-105 duration-1000">
                    <div className="w-32 h-32 rounded-full bg-[#F7E7CE]/5 flex items-center justify-center backdrop-blur-md border border-[#F7E7CE]/20 shadow-[0_0_60px_rgba(247,231,206,0.15)] mb-8 animate-[pulse_6s_ease-in-out_infinite]">
                        <Sparkles className="w-10 h-10 text-[#F7E7CE] opacity-80 animate-pulse" strokeWidth={1} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light text-[#F7E7CE] tracking-[0.2em] uppercase opacity-90 luxury-text-glow">
                        Apenas Respire
                    </h2>
                    <p className="text-[#F7E7CE]/60 font-light mt-4 tracking-widest text-sm">
                        O silêncio também é uma resposta.
                    </p>
                </div>
            </div>

            {/* UI Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">

                {/* Return Button */}
                <div className="absolute top-8 left-8 pointer-events-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#F7E7CE]/70 hover:text-[#F7E7CE] transition-colors group glass-panel px-4 py-2 border-[#F7E7CE]/20 bg-[#301934]/60 backdrop-blur-xl"
                    >
                        <span className="text-sm font-medium tracking-wide">Voltar ao Oasis</span>
                    </button>
                </div>

                {/* Vitrola da Alma (Bottom Left) */}
                <div className="absolute bottom-8 left-8 pointer-events-auto">
                    <div className="glass-panel bg-white/5 backdrop-blur-xl border border-[#F7E7CE]/20 p-5 rounded-3xl flex flex-col gap-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)] w-80">

                        {/* Track Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#301934] to-[#5F4B8B] flex items-center justify-center border border-[#F7E7CE]/30 shadow-inner relative overflow-hidden shrink-0">
                                <Music className={`w-5 h-5 text-[#F7E7CE] absolute ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
                            </div>
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className="text-[10px] uppercase tracking-widest text-[#F7E7CE]/50 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Vitrola da Alma</span>
                                <span className="text-[#F7E7CE] font-medium text-sm tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                                    {customAudioLabel ? customAudioLabel : TRACKS[currentTrackIdx].title}
                                </span>
                            </div>
                        </div>

                        {/* Controls & Volume */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-[#F7E7CE]/10 hover:bg-[#F7E7CE]/20 flex items-center justify-center text-[#F7E7CE] transition-colors border border-[#F7E7CE]/30 shadow-[0_4px_15px_rgba(247,231,206,0.1)]">
                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                                </button>

                                <button onClick={nextTrack} className="w-10 h-10 rounded-full flex items-center justify-center text-[#F7E7CE]/50 hover:text-[#F7E7CE] transition-colors hover:bg-white/5" title="Próxima Faixa" disabled={!!customAudioLabel}>
                                    <SkipForward className={`w-5 h-5 ${customAudioLabel ? 'opacity-30 cursor-not-allowed' : ''}`} />
                                </button>

                                <button onClick={toggleFavorite} className="w-10 h-10 rounded-full flex items-center justify-center text-[#F7E7CE]/50 hover:text-[#F7E7CE] transition-colors hover:bg-white/5" title="Salvar Favorita">
                                    <Heart className={`w-4 h-4 ${favoriteTrackIdx === currentTrackIdx ? 'fill-[#F7E7CE] text-[#F7E7CE]' : ''}`} />
                                </button>
                            </div>

                            {/* Discrete Volume Control */}
                            <div className="flex items-center gap-2 group px-2" title="Volume">
                                <div className="text-[9px] uppercase tracking-widest text-[#F7E7CE]/50 select-none">Vol</div>
                                <input
                                    type="range" min="0" max="1" step="0.01" value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-16 h-1 bg-[#F7E7CE]/20 rounded-lg appearance-none cursor-pointer accent-[#F7E7CE]"
                                />
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div className="pt-3 border-t border-[#F7E7CE]/10 mt-1">
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#F7E7CE]/5 hover:bg-[#F7E7CE]/10 text-[#F7E7CE]/80 hover:text-[#F7E7CE] text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#F7E7CE]/20 shadow-sm" title="Escolher arquivo MP3">
                                <Upload className="w-4 h-4" />
                                <span>Sintonizar Minha Essência</span>
                                <input type="file" accept="audio/mp3, audio/wav, audio/ogg" className="hidden" ref={audioInputRef} onChange={handleFileUpload} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Ritmo da Jornada Panel (Bottom Right) */}
                <div className="absolute bottom-8 right-8 pointer-events-auto flex flex-col items-end gap-3 z-30">

                    {/* Settings Panel Body */}
                    <div className={`glass-panel border border-[#F7E7CE]/20 p-6 rounded-3xl transition-all duration-500 w-72 bg-[#301934]/70 backdrop-blur-2xl origin-bottom-right shadow-[0_10px_40px_rgba(0,0,0,0.4)] ${showRitmo ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 pointer-events-none translate-y-4 absolute bottom-full mb-4'}`}>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] tracking-widest uppercase text-[#F7E7CE]/70 block">Largura das Estrelas</label>
                                </div>
                                <input
                                    type="range" min="1" max="5" step="0.5" value={expansion}
                                    onChange={(e) => setExpansion(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-[#F7E7CE]/20 rounded-lg appearance-none cursor-pointer accent-[#F7E7CE]"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] tracking-widest uppercase text-[#F7E7CE]/70 block">Velocidade do Rastro</label>
                                </div>
                                <input
                                    type="range" min="0.2" max="3" step="0.1" value={speedMultiplier}
                                    onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-[#F7E7CE]/20 rounded-lg appearance-none cursor-pointer accent-[#F7E7CE]"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] tracking-widest uppercase text-[#F7E7CE]/70 block">Intensidade do Brilho</label>
                                </div>
                                <input
                                    type="range" min="0.8" max="0.99" step="0.01" value={persistence}
                                    onChange={(e) => setPersistence(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-[#F7E7CE]/20 rounded-lg appearance-none cursor-pointer accent-[#F7E7CE]"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] tracking-widest uppercase text-[#F7E7CE]/70 block">Tipo de Astro</label>
                                </div>
                                <div className="flex bg-[#F7E7CE]/10 rounded-lg p-1">
                                    <button
                                        onClick={() => setParticleType('estrela')}
                                        className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${particleType === 'estrela' ? 'bg-[#F7E7CE]/20 text-[#F7E7CE]' : 'text-[#F7E7CE]/50 hover:text-[#F7E7CE]'}`}
                                    >
                                        Estrelas
                                    </button>
                                    <button
                                        onClick={() => setParticleType('poeira')}
                                        className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${particleType === 'poeira' ? 'bg-[#F7E7CE]/20 text-[#F7E7CE]' : 'text-[#F7E7CE]/50 hover:text-[#F7E7CE]'}`}
                                    >
                                        Poeira
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setShowRitmo(!showRitmo)}
                        className={`glass-panel bg-white/5 backdrop-blur-xl border border-[#F7E7CE]/20 rounded-2xl p-4 flex items-center gap-3 text-[#F7E7CE]/70 hover:text-[#F7E7CE] transition-all hover:bg-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)]`}
                        title="Ritmo da Jornada"
                    >
                        <Settings2 className="w-5 h-5" />
                        <span className="text-sm tracking-widest uppercase font-medium">Ritmo da Jornada</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
