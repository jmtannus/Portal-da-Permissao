import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowLeft, Wind, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import Tooltip from './Tooltip';

interface DiarioDeSombrasProps {
    onBack: () => void;
    onSuccess: () => void;
}

const PLACEHOLDERS = [
    "O que puxou o fio da sua paz hoje?",
    "Se essa dor fosse um tecido, qual seria a textura dela?",
    "O que você precisa deixar ir para voltar a respirar?"
];

const PONTES = [
    "Eu me dou permissão para ",
    "Eu escolho a realidade onde ",
    "Sinto a presença da minha versão que "
];

const INSPIRATIONS_SOMBRA = [
    "ter paciência com as minhas partes que ainda estão aprendendo.",
    "ter a coragem de olhar para o que me assusta e não fugir.",
    "ser liberta dessas crenças antigas que já não me servem.",
    "ser gentil comigo mesma quando eu não dou conta de tudo.",
    "ter clareza sobre quais medos não me pertencem mais.",
    "ser merecedora de perdão, começando pelo meu próprio.",
    "ter limites saudáveis sem sentir culpa por impô-los."
];

const HEAVY_WORDS = ['desespero', 'exaustão', 'insuportável', 'não aguento', 'dor limite', 'sem forças', 'socorro', 'vontade de desistir'];

export default function DiarioDeSombras({ onBack, onSuccess }: DiarioDeSombrasProps) {
    const [text, setText] = useState("");
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [isBurning, setIsBurning] = useState(false);
    const [isLiberated, setIsLiberated] = useState(false);
    const [showConquista, setShowConquista] = useState(false);
    const [hasTriggeredSOS, setHasTriggeredSOS] = useState(false);

    // Intention Ritual State
    const [selectedPonte, setSelectedPonte] = useState<string>("");
    const [isPonteMenuOpen, setIsPonteMenuOpen] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const applyIntention = (base: string) => {
        const prefix = selectedPonte ? selectedPonte : "";
        const intention = prefix + base;

        let newText = text;
        if (!text.trim()) {
            newText = intention;
        } else {
            newText = text + (text.endsWith('\n') ? '' : '\n') + intention;
        }

        setText(newText);
        focusTextarea();
    };

    // Listen for Heavy Words -> Gatilho de Sentimento
    useEffect(() => {
        if (!text || hasTriggeredSOS) return;
        const lower = text.toLowerCase();

        if (HEAVY_WORDS.some(w => lower.includes(w))) {
            setHasTriggeredSOS(true);
            window.dispatchEvent(new CustomEvent('portal:heavy_emotion'));
        }
    }, [text, hasTriggeredSOS]);

    const handleIdentidade = () => applyIntention("Eu sou ");
    const handleRecurso = () => applyIntention("Eu tenho ");

    const handleInspiration = () => {
        const randomInsp = INSPIRATIONS_SOMBRA[Math.floor(Math.random() * INSPIRATIONS_SOMBRA.length)];
        applyIntention("ser/ter " + randomInsp + " ");
    };

    const handleSelectPonte = (ponte: string) => {
        setSelectedPonte(ponte);
        setIsPonteMenuOpen(false);
        if (!text.trim()) {
            setText(ponte);
            focusTextarea();
        }
    };

    const focusTextarea = () => {
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const len = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(len, len);
            }
        }, 50);
    };

    // Rotate placeholders every 8 seconds if user hasn't typed anything
    useEffect(() => {
        if (text.length > 0 || isBurning || isLiberated) return;
        const interval = setInterval(() => {
            setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [text, isBurning, isLiberated]);

    const handleLiberar = () => {
        if (!text.trim()) return;

        setIsBurning(true);

        // Process integration to localStorage (Espelho da Alma)
        saveToEspelho();

        // Reveal the success message after the animation completes (2s)
        setTimeout(() => {
            setIsLiberated(true);
        }, 2000);
    };

    const saveToEspelho = () => {
        try {
            const now = new Date();
            const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const dayName = days[now.getDay()];

            // Format hour to closest even hour string that matches Espelho da Alma Grid (08:00 to 22:00)
            const currentHour = now.getHours();
            let evenHour = currentHour % 2 === 0 ? currentHour : currentHour - 1;

            // Clamp to fit the visible grid bounds
            if (evenHour < 8) evenHour = 8;
            if (evenHour > 22) evenHour = 22;

            const hourStr = `${evenHour.toString().padStart(2, '0')}:00`;

            const newEntry = {
                day: dayName,
                hour: hourStr,
                type: 'Sombra',
                sosTriggered: false,
                themes: ['Desabafo do Diário'],
                content: text,
                date: now.toISOString()
            };

            const existing = localStorage.getItem('portal_logs');
            const logs = existing ? JSON.parse(existing) : [];
            logs.push(newEntry);
            localStorage.setItem('portal_logs', JSON.stringify(logs));

            // Check if this was the 5th Sombra to unlock Obsidiana da Verdade
            const sombraCount = logs.filter((l: any) => l.type === 'Sombra' && !l.sosTriggered).length;
            if (sombraCount === 5) {
                setShowConquista(true);
            }

        } catch (e) {
            console.error("Failed to save log", e);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#301934] to-[#000000] z-[1] overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]">

            {/* Velvet Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-60 mix-blend-multiply pointer-events-none"></div>

            {/* Subtle Vignette overlay for cocoon effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] pointer-events-none opacity-80"></div>

            {/* Header / Back Button */}
            <div className="absolute top-8 left-8 z-50">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium tracking-widest uppercase">Voltar</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-3xl z-20 relative flex flex-col items-center">

                {!isLiberated ? (
                    <>
                        <div className="text-center mb-10 w-full">
                            <h2 className="text-3xl md:text-5xl font-light text-white tracking-wide mb-3 opacity-90 drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
                                Diário de <span className="text-[#d4af37] italic">Sombras</span>
                            </h2>
                            <p className="text-white/40 tracking-widest uppercase text-xs md:text-sm">Um lugar seguro para queimar o que pesa</p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key="textarea-container"
                                initial={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                                animate={
                                    isBurning
                                        ? { opacity: 0, filter: "blur(20px)", scale: 1.1, y: -40 }
                                        : { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }
                                }
                                transition={{ duration: 2, ease: "easeIn" }}
                                className="w-full relative flex flex-col items-center"
                            >
                                {/* Ritual da Intenção UI */}
                                <div className="neural-command-area w-full flex-col sm:flex-row flex items-center justify-between mb-4 gap-4 px-3 py-2 z-30 transition-all rounded-3xl">

                                    {/* Pontes de Permissão (Dropdown) */}
                                    <div className="relative w-full sm:w-auto">
                                        <Tooltip content="Suavize a resistência. Use para facilitar a aceitação de novas realidades pelo cérebro">
                                            <button
                                                onClick={() => setIsPonteMenuOpen(!isPonteMenuOpen)}
                                                className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/80 font-medium text-sm hover:bg-white/10 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                                            >
                                                <span className="truncate">{selectedPonte ? "Ponte ativa..." : "Pontes de Permissão"}</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isPonteMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        </Tooltip>

                                        <AnimatePresence>
                                            {isPonteMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute top-full left-0 mt-2 w-64 bg-[#1a0c1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 origin-top"
                                                >
                                                    <button onClick={() => handleSelectPonte("")} className="text-left px-3 py-2 text-xs text-white/40 hover:bg-white/5 rounded-lg transition-colors italic w-full">Remover Ponte</button>
                                                    {PONTES.map((ponte, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleSelectPonte(ponte)}
                                                            className="text-left px-3 py-2 text-sm text-white/90 hover:bg-[#d4af37]/20 rounded-lg transition-colors w-full"
                                                        >
                                                            "{ponte}..."
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Ação de Intenção (Identidade / Recurso / Random) */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                        <Tooltip content="Programe quem você É. Use para estados internos e valores (Ex: Eu sou capaz)">
                                            <button
                                                onClick={handleIdentidade}
                                                className="px-4 py-2 bg-white/5 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] rounded-full text-sm font-medium hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                                            >
                                                Identidade
                                            </button>
                                        </Tooltip>
                                        <Tooltip content="Manifeste o que você TEM. Use para ferramentas e conquistas (Ex: Eu tenho foco)">
                                            <button
                                                onClick={handleRecurso}
                                                className="px-4 py-2 bg-white/5 backdrop-blur-md border border-[#d4af37]/30 text-[#d4af37] rounded-full text-sm font-medium hover:bg-[#d4af37]/10 hover:border-[#d4af37]/60 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                                            >
                                                Recurso
                                            </button>
                                        </Tooltip>
                                        <button
                                            onClick={handleInspiration}
                                            className="p-2 aspect-square bg-gradient-to-tr from-[#301934] to-[#1a0c1c] rounded-full border border-[#d4af37]/50 text-[#d4af37] hover:scale-110 hover:bg-[#d4af37]/20 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center shrink-0 ml-1"
                                            title="Inspirar Intenção"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <textarea
                                    ref={textareaRef}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    disabled={isBurning}
                                    placeholder={PLACEHOLDERS[placeholderIdx]}
                                    className="w-full min-h-[300px] bg-white/5 backdrop-blur-md rounded-2xl p-8 text-white/90 placeholder:text-white/30 font-light text-lg md:text-xl leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-white/10 transition-shadow transition-colors"
                                    style={{
                                        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.4)"
                                    }}
                                />

                                {/* Smoke/Ash Particles triggering during burn */}
                                {isBurning && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 pointer-events-none flex items-center justify-center -top-20"
                                    >
                                        {/* Mocking random ashes floating up */}
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0.8, y: 0, x: 0, scale: Math.random() * 1.5 + 0.5 }}
                                                animate={{
                                                    opacity: 0,
                                                    y: -200 - Math.random() * 100,
                                                    x: (Math.random() - 0.5) * 200,
                                                    rotate: Math.random() * 360
                                                }}
                                                transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
                                                className="absolute w-2 h-2 rounded-full bg-black shadow-[0_0_10px_rgba(255,255,255,0.1)] blur-[1px]"
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-8 transition-opacity duration-500" style={{ opacity: isBurning ? 0 : 1 }}>
                            <button
                                onClick={handleLiberar}
                                disabled={text.length === 0 || isBurning}
                                className={`flex items-center gap-3 px-8 py-4 rounded-full font-medium tracking-wide
                                    ${text.length === 0
                                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                        : 'bg-black/40 text-[#d4af37] hover-seda'
                                    }
                                `}
                            >
                                <Flame className={`w-5 h-5 ${text.length > 0 ? 'animate-pulse' : ''}`} />
                                Libertar para o Universo
                            </button>
                        </div>
                    </>
                ) : (
                    // Success Message
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="flex flex-col items-center text-center max-w-lg"
                    >
                        <div className="w-20 h-20 rounded-full bg-[#d4af37]/5 flex items-center justify-center border border-[#d4af37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] mb-8">
                            <Wind className="w-8 h-8 text-[#d4af37] opacity-80" strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-light text-[#F7E7CE] mb-6 leading-relaxed">
                            Sua sombra foi acolhida e integrada.<br />Você está mais leve agora.
                        </h3>
                        <p className="text-white/40 text-sm tracking-wide font-light">
                            O registro simbólico foi guardado no Espelho da Alma. A dor se dissipou.
                        </p>

                        <button
                            onClick={onSuccess}
                            className="mt-8 flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-full hover:bg-[#d4af37]/90 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide">Visitar Espelho da Alma</span>
                        </button>

                        {/* Conquista Message for 5th Sombra */}
                        {showConquista && (
                            <div className="bg-[#301934] border border-[#5F4B8B] p-6 rounded-2xl mt-12 max-w-sm shadow-[0_0_20px_rgba(95,75,139,0.3)] animate-in slide-in-from-bottom flex flex-col items-center zoom-in-95 relative z-50">
                                <div className="absolute -top-5 w-10 h-10 mb-2 rotate-45 bg-gradient-to-br from-[#301934] to-[#5F4B8B] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]" />
                                <h4 className="text-[#F7E7CE] font-serif text-lg mb-2 leading-tight mt-4">A Obsidiana da Verdade</h4>
                                <p className="text-[#F7E7CE]/80 text-sm italic font-light">"Sua coragem em olhar para a verdade materializou uma nova virtude no seu Tesouro Particular."</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
