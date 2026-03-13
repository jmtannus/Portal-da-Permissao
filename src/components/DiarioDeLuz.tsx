import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, ArrowLeft, ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import Tooltip from './Tooltip';

interface DiarioDeLuzProps {
    onBack: () => void;
    onSuccess: () => void;
}

const PLACEHOLDERS = [
    "O que brilhou no seu dia hoje?",
    "Que pequeno gesto de amor você testemunhou?",
    "Qual sorriso te fez lembrar que a vida vale a pena?"
];

const PONTES = [
    "Eu me dou permissão para ",
    "Eu escolho a realidade onde ",
    "Sinto a presença da minha versão que "
];

const INSPIRATIONS_LUZ = [
    "ser uma mulher em paz, independentemente do caos externo.",
    "ser vulnerável e, ainda assim, permanecer segura.",
    "ter abundância e desfrutar dela sem qualquer culpa.",
    "ter tempo de qualidade para o meu próprio descanso.",
    "ser a protagonista absoluta da minha própria história.",
    "ser saudável, vibrante e cheia de energia.",
    "ter clareza total sobre meus passos profissionais.",
    "ter relacionamentos que nutrem minha alma."
];

export default function DiarioDeLuz({ onBack, onSuccess }: DiarioDeLuzProps) {
    const [text, setText] = useState("");
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [isRadiating, setIsRadiating] = useState(false);
    const [isLiberated, setIsLiberated] = useState(false);

    // Intention Ritual State
    const [selectedPonte, setSelectedPonte] = useState<string>("");
    const [isPonteMenuOpen, setIsPonteMenuOpen] = useState(false);

    // Citrino Unlock State
    const [isCitrinoUnlockedJustNow, setIsCitrinoUnlockedJustNow] = useState(false);
    const [userName, setUserName] = useState('Janaína');

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        try {
            const userPref = localStorage.getItem('portal_user_name') || localStorage.getItem('portal_user');
            if (userPref) {
                if (userPref.startsWith('{')) {
                    const parsed = JSON.parse(userPref);
                    if (parsed.name) setUserName(parsed.name);
                } else {
                    setUserName(userPref);
                }
            }
        } catch (e) { }
    }, []);

    const applyIntention = (base: string) => {
        const prefix = selectedPonte ? selectedPonte : "";
        const intention = prefix + base;

        let newText = text;
        // If the text is empty or just standard whitespace, replace it
        if (!text.trim()) {
            newText = intention;
        } else {
            // Append with a line break if there's already content
            newText = text + (text.endsWith('\n') ? '' : '\n') + intention;
        }

        setText(newText);
        focusTextarea();
    };

    const handleIdentidade = () => applyIntention("Eu sou ");
    const handleRecurso = () => applyIntention("Eu tenho ");

    const handleInspiration = () => {
        const randomInsp = INSPIRATIONS_LUZ[Math.floor(Math.random() * INSPIRATIONS_LUZ.length)];
        applyIntention("ser/ter " + randomInsp + " "); // generic prefix as the inspiration array has mixed intentions, user can adjust
    };

    const handleSelectPonte = (ponte: string) => {
        setSelectedPonte(ponte);
        setIsPonteMenuOpen(false);
        // We don't instantly inject the bridge alone into the text area.
        // It's meant to prefix the Identidade/Recurso button clicks.
        // Or if the user wants it instantly:
        if (!text.trim()) {
            setText(ponte);
            focusTextarea();
        }
    };

    const focusTextarea = () => {
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                // move cursor to end
                const len = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(len, len);
            }
        }, 50);
    };

    // Rotate placeholders every 8 seconds if user hasn't typed anything
    useEffect(() => {
        if (text.length > 0 || isRadiating || isLiberated) return;
        const interval = setInterval(() => {
            setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [text, isRadiating, isLiberated]);

    const handleIrradiar = () => {
        if (!text.trim()) return;

        setIsRadiating(true);

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
                type: 'Luz',
                sosTriggered: false,
                themes: ['Celebração da Luz'],
                content: text,
                date: now.toISOString()
            };

            const existing = localStorage.getItem('portal_logs');
            const logs = existing ? JSON.parse(existing) : [];
            logs.push(newEntry);
            localStorage.setItem('portal_logs', JSON.stringify(logs));

            // Check if this is the 7th Luz entry for Citrino unlock
            const luzCount = logs.filter((l: any) => l.type === 'Luz').length;
            if (luzCount === 7 && localStorage.getItem('portal_citrino_unlocked') !== 'true') {
                localStorage.setItem('portal_citrino_unlocked', 'true');
                setIsCitrinoUnlockedJustNow(true);
            }
        } catch (e) {
            console.error("Failed to save log", e);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#FAF3E0] z-[1] overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12">

            {/* Sunroom Backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F7E7CE] to-[#fffDF7] pointer-events-none opacity-80"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-dust.png')] opacity-40 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#F7E7CE_120%)] pointer-events-none opacity-50"></div>

            {/* Header / Back Button */}
            <div className="absolute top-8 left-8 z-50">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#301934]/50 hover:text-[#301934] transition-colors group"
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
                            <h2 className="text-3xl md:text-5xl font-light text-[#301934] tracking-wide mb-3 opacity-90">
                                Diário de <span className="text-[#F7E7CE] italic drop-shadow-[0_0_10px_rgba(247,231,206,0.8)]">Luz</span>
                            </h2>
                            <p className="text-[#301934]/50 tracking-widest uppercase text-xs md:text-sm">Um altar para o que te fez sorrir hoje</p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key="textarea-container"
                                initial={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                                animate={
                                    isRadiating
                                        ? { opacity: 0, filter: "blur(20px)", scale: 1.1, y: -40 }
                                        : { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }
                                }
                                transition={{ duration: 2, ease: "easeIn" }}
                                className="w-full relative flex flex-col items-center"
                            >
                                {/* Ritual da Intenção UI */}
                                <div className="neural-command-area w-full flex-col sm:flex-row flex items-center justify-between mb-4 gap-4 px-3 py-2 z-30 transition-all rounded-3xl">

                                    {/* Pontes de Permissão (Dropdown) */}
                                    <div className="relative z-30 w-full sm:w-auto">
                                        <Tooltip content="Suavize a resistência. Use para facilitar a aceitação de novas realidades pelo cérebro">
                                            <button
                                                onClick={() => setIsPonteMenuOpen(!isPonteMenuOpen)}
                                                className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-white/30 backdrop-blur-md rounded-full border border-[#301934]/10 text-[#301934] font-medium text-sm hover:bg-white/50 transition-colors shadow-[0_2px_10px_rgba(247,231,206,0.5)]"
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
                                                    className="absolute top-full left-0 mt-2 w-64 bg-white/80 backdrop-blur-xl border border-[#301934]/10 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 origin-top"
                                                >
                                                    <button onClick={() => handleSelectPonte("")} className="text-left px-3 py-2 text-xs text-[#301934]/50 hover:bg-[#301934]/5 rounded-lg transition-colors italic w-full">Remover Ponte</button>
                                                    {PONTES.map((ponte, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleSelectPonte(ponte)}
                                                            className="text-left px-3 py-2 text-sm text-[#301934] hover:bg-[#F7E7CE]/50 rounded-lg transition-colors w-full"
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
                                                className="px-4 py-2 bg-white/20 backdrop-blur-md border border-[#F7E7CE] text-[#301934] rounded-full text-sm font-medium hover:bg-[#F7E7CE]/40 transition-colors shadow-[0_2px_10px_rgba(247,231,206,0.3)] shadow-[#F7E7CE]/20 hover:shadow-[#F7E7CE]/50"
                                            >
                                                Identidade
                                            </button>
                                        </Tooltip>
                                        <Tooltip content="Manifeste o que você TEM. Use para ferramentas e conquistas (Ex: Eu tenho foco)">
                                            <button
                                                onClick={handleRecurso}
                                                className="px-4 py-2 bg-white/20 backdrop-blur-md border border-[#F7E7CE] text-[#301934] rounded-full text-sm font-medium hover:bg-[#F7E7CE]/40 transition-colors shadow-[0_2px_10px_rgba(247,231,206,0.3)] shadow-[#F7E7CE]/20 hover:shadow-[#F7E7CE]/50"
                                            >
                                                Recurso
                                            </button>
                                        </Tooltip>
                                        <button
                                            onClick={handleInspiration}
                                            className="p-2 aspect-square bg-gradient-to-tr from-[#F7E7CE] to-white rounded-full border border-white/50 text-[#301934] hover:scale-110 transition-transform shadow-[0_0_15px_rgba(247,231,206,0.8)] flex items-center justify-center shrink-0 ml-1"
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
                                    disabled={isRadiating}
                                    placeholder={PLACEHOLDERS[placeholderIdx]}
                                    className="w-full min-h-[300px] bg-[#301934]/5 backdrop-blur-md rounded-2xl p-8 text-[#301934]/90 placeholder:text-[#301934]/40 font-light text-lg md:text-xl leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#301934]/10 transition-shadow transition-colors border border-[#301934]/10"
                                    style={{
                                        boxShadow: "inset 0 2px 20px rgba(247,231,206,0.2), 0 10px 40px rgba(0,0,0,0.05)"
                                    }}
                                />

                                {/* Light Particles triggering during radiate */}
                                {isRadiating && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 pointer-events-none flex items-center justify-center -top-20 z-50"
                                    >
                                        {Array.from({ length: 30 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0.8, y: 0, x: 0, scale: Math.random() * 2 + 1 }}
                                                animate={{
                                                    opacity: 0,
                                                    y: -300 - Math.random() * 150,
                                                    x: (Math.random() - 0.5) * 300,
                                                    rotate: Math.random() * 360
                                                }}
                                                transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
                                                className="absolute w-2 h-2 rounded-full bg-[#F7E7CE] shadow-[0_0_20px_rgba(247,231,206,1)] blur-[0.5px]"
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-8 transition-opacity duration-500" style={{ opacity: isRadiating ? 0 : 1 }}>
                            <button
                                onClick={handleIrradiar}
                                disabled={text.length === 0 || isRadiating}
                                className={`flex items-center gap-3 px-8 py-4 rounded-full font-medium tracking-wide
                                    ${text.length === 0
                                        ? 'bg-[#301934]/5 text-[#301934]/20 cursor-not-allowed'
                                        : 'bg-transparent text-[#301934] hover-seda'
                                    }
                                `}
                            >
                                <Sun className={`w-5 h-5 ${text.length > 0 ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
                                Irradiar Gratidão
                            </button>
                        </div>
                    </>
                ) : (
                    // Success Message & Golden Explosion
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="flex flex-col items-center text-center max-w-lg z-50 relative"
                    >
                        {isCitrinoUnlockedJustNow && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
                            >
                                {Array.from({ length: 150 }).map((_, i) => (
                                    <motion.div
                                        key={`glitter-${i}`}
                                        initial={{ opacity: 1, y: 0, x: 0, scale: Math.random() * 2 + 1 }}
                                        animate={{
                                            opacity: 0,
                                            y: (Math.random() - 0.5) * 800,
                                            x: (Math.random() - 0.5) * 800,
                                            rotate: Math.random() * 360
                                        }}
                                        transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
                                        className="absolute w-2 h-2 md:w-3 md:h-3 bg-[#e4c23e] rounded-sm filter drop-shadow-[0_0_8px_rgba(247,231,206,1)]"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' // Star shape
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}

                        <div className={`w-20 h-20 rounded-full flex items-center justify-center border shadow-[0_0_50px_rgba(247,231,206,0.5)] mb-8 relative z-10 ${isCitrinoUnlockedJustNow ? 'bg-gradient-to-br from-[#F7E7CE] to-[#D4AF37] border-[#F7E7CE]' : 'bg-[#F7E7CE]/20 border-[#F7E7CE]/40'}`}>
                            <Sun className={`w-8 h-8 ${isCitrinoUnlockedJustNow ? 'text-white' : 'text-[#d4af37] opacity-90'}`} strokeWidth={isCitrinoUnlockedJustNow ? 2 : 1.5} />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-light text-[#301934] mb-6 leading-relaxed relative z-10">
                            {isCitrinoUnlockedJustNow ? (
                                <span><span className="font-medium text-[#D4AF37]">{userName}</span>, seu brilho hoje é o resultado da sua escolha constante. A joia do Sorriso agora é sua.</span>
                            ) : (
                                <>Sua luz foi irradiada para o mundo.<br />O espelho agora reflete a sua paz.</>
                            )}
                        </h3>

                        <button
                            onClick={onSuccess}
                            className="mt-8 flex items-center gap-2 bg-[#301934] text-[#F7E7CE] px-6 py-3 rounded-full hover:bg-[#301934]/90 transition-colors shadow-lg"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide">Visitar Espelho da Alma</span>
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
