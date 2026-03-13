import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Volume2 } from 'lucide-react';
import SOSParticles from './SOSParticles';

// Random integration questions for the end of the pause
const INTEGRACAO_QUESTIONS = [
    "O que muda na sua respiração quando você para de tentar separar a sua luz da sua sombra?",
    "Que forma tem a paz quando você simplesmente se permite estar?",
    "Qual parte sua mais precisava desse abraço agora?",
    "Que permissão você quer se dar para o resto do seu dia?"
];

export default function SOSButton({ inNav = false }: { inNav?: boolean }) {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(180);
    const [userName, setUserName] = useState('Janaína');
    const [finishingQuestion, setFinishingQuestion] = useState("");
    const [showCareBalloon, setShowCareBalloon] = useState(false);
    const [masterVolume, setMasterVolume] = useState(0.15); // Default start volume

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const biquadFilterRef = useRef<BiquadFilterNode | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const ballRef = useRef<HTMLDivElement>(null);

    // Initialize user name and listen to custom events
    useEffect(() => {
        try {
            const userPref = localStorage.getItem('portal_user');
            if (userPref) {
                const parsed = JSON.parse(userPref);
                if (parsed.name) setUserName(parsed.name);
            }
        } catch (e) { }

        // Listen to Gatilho de Sentimento
        const handleHeavyEmotion = () => {
            if (!isActive) {
                setShowCareBalloon(true);
            }
        };

        window.addEventListener('portal:heavy_emotion', handleHeavyEmotion);

        // Cleanup audio and context on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close().catch(console.error);
            }
            window.removeEventListener('portal:heavy_emotion', handleHeavyEmotion);
        };
    }, [isActive]);

    // Timer & Standard Countdown
    useEffect(() => {
        let interval: number;
        if (isActive && seconds > 0) {
            interval = window.setInterval(() => setSeconds(s => s - 1), 1000);
        } else if (seconds === 0 && isActive) {
            // Once timer ends, prepare the screen for phase 3 (Retorno)
        }
        return () => window.clearInterval(interval);
    }, [isActive, seconds]);

    // Audio Biofeedback Sync & Visual Sync Loop via RAF
    useEffect(() => {
        if (!isActive) return;

        let animationFrameId: number;

        const loop = () => {
            if (!audioRef.current || !startTimeRef.current) return;

            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            let targetVolMultiplier = 0;
            let targetScale = 1.0;
            let isVazio = false;

            const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

            if (elapsed < 9) {
                // Fade in intro
                targetVolMultiplier = Math.min(1.0, elapsed / 5);
                targetScale = 1.0;
            } else if (elapsed < 150) {
                // Biofeedback breathing phase (mapped to 16s cycle)
                const cycleTime = (elapsed - 9) % 16;
                if (cycleTime < 4) {
                    const prog = easeInOutSine(cycleTime / 4);
                    targetVolMultiplier = 1.0 + prog * 1.66; // 1.0x to 2.66x (relative to master volume)
                    targetScale = 1.0 + prog * 0.5; // 1.0 -> 1.5
                } else if (cycleTime < 8) {
                    targetVolMultiplier = 2.66;
                    targetScale = 1.5;
                } else if (cycleTime < 12) {
                    const prog = easeInOutSine((cycleTime - 8) / 4);
                    targetVolMultiplier = 2.66 - prog * 1.66; // 2.66 -> 1.0
                    targetScale = 1.5 - prog * 0.5; // 1.5 -> 1.0
                } else {
                    targetVolMultiplier = 1.0;
                    targetScale = 1.0;
                    isVazio = true;
                }
            } else {
                // Fade out outro
                const fadeProgress = (elapsed - 150) / 10;
                targetVolMultiplier = Math.max(0, 1.0 - fadeProgress);
                targetScale = 1.0;
            }

            // Sync Volume
            audioRef.current.volume = Math.min(1.0, masterVolume * targetVolMultiplier);

            // Sync Low Pass Filter
            if (biquadFilterRef.current) {
                const targetFreq = isVazio ? 800 : 20000; // Lowpass cutoff drop during Vazio
                const currentFreq = biquadFilterRef.current.frequency.value;
                biquadFilterRef.current.frequency.value = currentFreq + (targetFreq - currentFreq) * 0.1; // Smooth interpolate
            }

            // Sync Light Ball directly for maximum 60fps fluidity
            if (ballRef.current) {
                ballRef.current.style.transform = `scale(${targetScale})`;

                // Manual dynamic exact box-shadow interpolation
                const glowProgress = (targetScale - 1.0) / 0.5; // 0.0 to 1.0
                const blurOut = 20 + glowProgress * 60; // 20px to 80px
                const alphaOut = 0.2 + glowProgress * 0.6; // 0.2 to 0.8
                const blurIn = glowProgress * 30; // 0px to 30px
                const alphaIn = glowProgress * 0.6; // 0.0 to 0.6

                ballRef.current.style.boxShadow = `0 0 ${blurOut}px rgba(247, 231, 206, ${alphaOut}), inset 0 0 ${blurIn}px rgba(255, 255, 255, ${alphaIn})`;
                ballRef.current.style.opacity = `${0.5 + glowProgress * 0.5}`;
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isActive, masterVolume]);

    const handleStart = () => {
        setIsActive(true);
        setSeconds(180);
        setShowCareBalloon(false); // Hide balloon if active
        setFinishingQuestion(INTEGRACAO_QUESTIONS[Math.floor(Math.random() * INTEGRACAO_QUESTIONS.length)]);
        startTimeRef.current = Date.now();

        // 1. Initialize Context EXACTLY on the click event (Required by iOS Safari & Chrome)
        if (!audioCtxRef.current && audioRef.current) {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioCtxRef.current = new AudioContextClass();

                const source = audioCtxRef.current.createMediaElementSource(audioRef.current);
                biquadFilterRef.current = audioCtxRef.current.createBiquadFilter();
                biquadFilterRef.current.type = 'lowpass';
                biquadFilterRef.current.frequency.value = 20000;

                source.connect(biquadFilterRef.current);
                biquadFilterRef.current.connect(audioCtxRef.current.destination);
            } catch (e) {
                console.error("Audio Context failed to start:", e);
            }
        }

        // 2. Unblock the audio context immediately
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().catch(console.error);
        }

        // 3. Play the Audio element
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Autoplay blocked in handleStart', e));
        }
    };

    const handleFinish = () => {
        setIsActive(false);
        setSeconds(180);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0;
        }

        // Automaticaly log the SOS incident
        try {
            const now = new Date();
            let dayStr = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(now).replace('.', '');
            const dayCap = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
            const hourStr = `${String(now.getHours()).padStart(2, '0')}:00`;

            const newLog = {
                date: now.toISOString(),
                day: dayCap,
                hour: hourStr,
                type: 'Sombra',
                themes: ['Pausa Sagrada'],
                sosTriggered: true,
                content: "" // No content, just the emergency marker
            };

            const existing = localStorage.getItem('portal_logs');
            const logs = existing ? JSON.parse(existing) : [];
            logs.push(newLog);
            localStorage.setItem('portal_logs', JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to log SOS', e);
        }
    };

    const elapsed = isActive ? 180 - seconds : 0;
    let phase = 1;
    // User requested breathing to start at 2:51, so after 9 seconds of elapsed time (180 - 171 = 9)
    if (elapsed >= 9 && elapsed < 150) phase = 2;
    if (elapsed >= 150) phase = 3;

    // Calculate texts for phase 2 (16s cycle logic)
    let phase2Text = "";
    let phase2Subtext = "";
    if (phase === 2) {
        const cyclePhase = (elapsed - 9) % 16;
        if (cyclePhase < 4) {
            phase2Text = "INSPIRAR";
            phase2Subtext = "Receba o ar como um presente.";
        } else if (cyclePhase < 8) {
            phase2Text = "RETER";
            phase2Subtext = "Sinta a vida habitando você.";
        } else if (cyclePhase < 12) {
            phase2Text = "EXPIRAR";
            phase2Subtext = "Solte o que não te pertence mais.";
        } else {
            phase2Text = "VAZIO";
            phase2Subtext = "Habite o silêncio.";
        }
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    return (
        <>
            {/* The Audio Element is ALWAYS mounted so refs never detach */}
            <audio
                ref={audioRef}
                src="/sos-audio.mp3"
                crossOrigin="anonymous"
                loop
                preload="auto"
            />

            {isActive && createPortal(
                <div className="fixed inset-0 z-[9999] bg-[#301934]/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-1000">
                    {/* Render the Biofeedback Stardust Engine */}
                    <SOSParticles isActive={isActive} startTimeMs={startTimeRef.current} className="fixed inset-0 pointer-events-none z-[10000]" />

                    {/* O Desligamento (Phase 1) */}
                    {phase === 1 && (
                        <div className="max-w-xl animate-in fade-in duration-1000 zoom-in-95">
                            <h2 translate="no" className="text-3xl md:text-4xl text-[#f7e7ce] mb-6 font-serif tracking-widest luxury-text-glow notranslate">
                                Respire, {userName}.
                            </h2>
                            <p translate="no" className="text-white/60 font-light tracking-wide text-lg md:text-xl leading-relaxed notranslate">
                                O mundo parou por um instante. Você está segura aqui.
                            </p>
                        </div>
                    )}

                    {/* A Respiração Quadrada (Phase 2) */}
                    {phase === 2 && (
                        <div className="flex flex-col items-center animate-in fade-in duration-[2000ms]">

                            <div className="h-16 flex items-end justify-center mb-12">
                                <h3 translate="no" className="text-3xl text-[#F7E7CE] font-serif tracking-widest uppercase transition-all duration-1000 notranslate">
                                    {phase2Text}
                                </h3>
                            </div>

                            {/* Círculo de Respiração (16s square breathing) */}
                            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-[#f7e7ce]/20 flex items-center justify-center relative mb-16">
                                <div className="absolute inset-0 bg-[#f7e7ce]/5 rounded-full blur-xl"></div>
                                {/* CSS animation removed. Mathematics handled by RAF in component */}
                                <div ref={ballRef} className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-[#f7e7ce]/80 to-white rounded-full"></div>
                            </div>

                            <div className="h-12 flex items-start justify-center">
                                <p translate="no" className="text-white/70 font-light tracking-wide text-lg transition-all duration-1000 notranslate">
                                    {phase2Subtext}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* O Retorno (Phase 3) */}
                    {phase === 3 && (
                        <div className="max-w-2xl flex flex-col items-center animate-in fade-in duration-1000 zoom-in-95 mt-10">
                            <h2 translate="no" className="text-3xl md:text-4xl text-[#f7e7ce] mb-8 font-serif tracking-wide luxury-text-glow leading-relaxed notranslate">
                                Você se deu permissão para pausar. Essa é a sua maior vitória hoje.
                            </h2>

                            <div className="bg-black/20 border border-[#F7E7CE]/20 p-8 rounded-2xl w-full mb-12">
                                <p translate="no" className="text-[#F7E7CE]/90 font-serif italic text-xl md:text-2xl leading-relaxed notranslate">
                                    "{finishingQuestion}"
                                </p>
                            </div>

                            {seconds <= 10 && (
                                <button
                                    onClick={handleFinish}
                                    className="px-8 py-3 rounded-full border border-[#F7E7CE]/40 text-[#F7E7CE] hover:bg-[#F7E7CE]/10 hover:border-[#F7E7CE] transition-all tracking-widest uppercase text-sm font-medium animate-in fade-in duration-1000 shadow-[0_0_20px_rgba(247,231,206,0.2)]"
                                    translate="no"
                                >
                                    Voltar em Paz
                                </button>
                            )}
                        </div>
                    )}

                    {/* Minimalist Volume Control */}
                    {(phase === 2 || phase === 3) && (
                        <div className="absolute bottom-8 right-4 md:right-8 flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity duration-500 z-50">
                            <div className="relative h-24 w-8 flex justify-center">
                                <input
                                    type="range"
                                    min="0.0" max="0.5" step="0.01"
                                    value={masterVolume}
                                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none -rotate-90 origin-center
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#F7E7CE] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_#F7E7CE]"
                                    title="Ajustar Volume do Frequencial"
                                />
                            </div>
                            <Volume2 className="w-4 h-4 text-[#F7E7CE]" />
                        </div>
                    )}

                    {/* Fixed Timer display at the bottom (shows during phase 1, 2, and 3 until 0) */}
                    {seconds > 0 && (
                        <div className="absolute bottom-16 text-[#F7E7CE] text-4xl font-thin tracking-widest animate-in fade-in duration-1000 opacity-80" translate="no">
                            {timeStr}
                        </div>
                    )}
                </div>,
                document.body
            )}

            <div className={`sos-button-area group transition-all duration-500 ease-in-out rounded-full ${inNav ? 'relative' : 'absolute top-8 right-8 z-50 drawer-shift'}`}>

                {/* Hover Tooltip */}
                <div className="absolute right-0 top-14 w-64 p-4 rounded-xl bg-[#301934]/95 backdrop-blur-md border border-[#d4af37]/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none translate-y-2 group-hover:translate-y-0 text-center">
                    <p className="text-[#F7E7CE] font-serif italic text-sm mb-2 opacity-90">Pausa Sagrada</p>
                    <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#F7E7CE]/30 to-transparent mx-auto mb-2"></div>
                    <p className="text-white/70 text-xs font-light leading-relaxed">
                        O mundo está pesado? Clique aqui para 3 minutos de silêncio e respiração guiada. Não se abandone.
                    </p>
                </div>

                {/* The Anchor Button */}
                <button
                    onClick={handleStart}
                    className="flex items-center gap-3 px-4 py-2 rounded-full border border-transparent hover:border-[#F7E7CE]/20 hover:bg-white/5 transition-all duration-700"
                >
                    <span className="text-[#F7E7CE] font-medium text-xs tracking-widest opacity-80 group-hover:opacity-100 transition-opacity uppercase">
                        S.O.S
                    </span>

                    {/* Glowing pulsing dot */}
                    <div className="relative flex items-center justify-center w-6 h-6">
                        {/* The Aura - Reactivated pulse animation */}
                        <div className={`absolute inset-0 bg-[#F7E7CE] rounded-full blur-md transition-opacity duration-1000 ${showCareBalloon ? 'opacity-80 animate-ping' : 'opacity-70 animate-pulse'}`}></div>
                        {/* The Core */}
                        <div className="relative w-2 h-2 bg-[#F7E7CE] rounded-full shadow-[0_0_10px_rgba(247,231,206,1)] z-10"></div>
                    </div>
                </button>

                {/* Care Dot */}
                {showCareBalloon && (
                    <span className="absolute top-1 right-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7e7ce] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f7e7ce]"></span>
                    </span>
                )}

                {/* Care Balloon */}
                {!isActive && showCareBalloon && (
                    <div className="absolute right-0 top-14 w-72 p-5 rounded-2xl bg-[#301934] border border-[#d4af37]/50 shadow-[0_10px_40px_rgba(212,175,55,0.2)] animate-in slide-in-from-top-4 fade-in duration-500 z-[60]">
                        <div className="absolute -top-2 right-6 w-4 h-4 bg-[#301934] border-t border-l border-[#d4af37]/50 rotate-45"></div>
                        <p className="text-[#F7E7CE] font-light text-sm leading-relaxed tracking-wide">
                            {userName}, o peso parece maior agora. Quer ancorar o seu respiro por 3 minutos antes de continuar?
                        </p>
                        <button
                            onClick={() => setShowCareBalloon(false)}
                            className="mt-3 text-[#F7E7CE]/50 text-xs hover:text-[#F7E7CE] transition-colors border-b border-transparent hover:border-[#F7E7CE]"
                        >
                            Estou bem, obrigado.
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
