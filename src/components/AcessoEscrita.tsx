import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Flame, 
    Sun, 
    ChevronDown, 
    Sparkles,
    Feather
} from 'lucide-react';

interface LogEntry {
    day: string;
    hour: string;
    type: 'Luz' | 'Sombra';
    sosTriggered: boolean;
    themes: string[];
    content: string;
    date: string;
}

interface AcessoEscritaProps {
    onBack: () => void;
    onSuccess: () => void;
}

const PLACEHOLDERS_SOMBRA = [
    "O que puxou o fio da sua paz hoje?",
    "Se essa dor fosse um tecido, qual seria a textura dela?",
    "O que você precisa deixar ir para voltar a respirar?"
];

const PLACEHOLDERS_LUZ = [
    "O que brilhou no seu dia hoje?",
    "Que pequeno gesto de amor você testemunhou?",
    "Qual sorriso te fez lembrar que a vida vale a pena?"
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

const HEAVY_WORDS = ['desespero', 'exaustão', 'insuportável', 'não aguento', 'dor limite', 'sem forças', 'socorro', 'vontade de desistir'];

export default function AcessoEscrita({ onBack, onSuccess }: AcessoEscritaProps) {
    // Layout State
    const [activeTab, setActiveTab] = useState<'sombras' | 'luz'>('sombras');
    const [isMobile, setIsMobile] = useState(false);

    // Shared State
    const [userName, setUserName] = useState('Janaína');
    const [selectedPonte, setSelectedPonte] = useState<string>("");
    const [isPonteMenuOpen, setIsPonteMenuOpen] = useState(false);

    // Sombra State
    const [textSombra, setTextSombra] = useState("");
    const [sombraPlaceholderIdx, setSombraPlaceholderIdx] = useState(0);
    const [isBurning, setIsBurning] = useState(false);
    const [hasTriggeredSOS, setHasTriggeredSOS] = useState(false);

    // Luz State
    const [textLuz, setTextLuz] = useState("");
    const [luzPlaceholderIdx, setLuzPlaceholderIdx] = useState(0);
    const [isRadiating, setIsRadiating] = useState(false);

    // Unlock States
    const [showConquistaSombra, setShowConquistaSombra] = useState(false);
    const [isCitrinoUnlockedJustNow, setIsCitrinoUnlockedJustNow] = useState(false);

    const textareaSombraRef = useRef<HTMLTextAreaElement>(null);
    const textareaLuzRef = useRef<HTMLTextAreaElement>(null);

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load User Name
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

    // Heavy Words Listener
    useEffect(() => {
        if (!textSombra || hasTriggeredSOS) return;
        const lower = textSombra.toLowerCase();
        if (HEAVY_WORDS.some(w => lower.includes(w))) {
            setHasTriggeredSOS(true);
            window.dispatchEvent(new CustomEvent('portal:heavy_emotion'));
        }
    }, [textSombra, hasTriggeredSOS]);

    // Placeholder Rotators
    useEffect(() => {
        const interval = setInterval(() => {
            if (!textSombra) setSombraPlaceholderIdx(p => (p + 1) % PLACEHOLDERS_SOMBRA.length);
            if (!textLuz) setLuzPlaceholderIdx(p => (p + 1) % PLACEHOLDERS_LUZ.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [textSombra, textLuz]);

    const handleApplyIntention = (base: string, type: 'sombras' | 'luz') => {
        const intention = (selectedPonte || "") + base;
        if (type === 'sombras') {
            setTextSombra(prev => prev + (prev.trim() ? '\n' : '') + intention);
            setTimeout(() => textareaSombraRef.current?.focus(), 50);
        } else {
            setTextLuz(prev => prev + (prev.trim() ? '\n' : '') + intention);
            setTimeout(() => textareaLuzRef.current?.focus(), 50);
        }
    };

    const handleInspiration = (type: 'sombras' | 'luz') => {
        const isSombra = type === 'sombras';
        const inspirations = isSombra ? INSPIRATIONS_SOMBRA : INSPIRATIONS_LUZ;
        const randomInsp = inspirations[Math.floor(Math.random() * inspirations.length)];
        handleApplyIntention("ser/ter " + randomInsp + " ", type);
    };

    const handleSave = (type: 'Luz' | 'Sombra') => {
        const text = type === 'Luz' ? textLuz : textSombra;
        if (!text.trim()) return;

        // Trigger 528Hz Crystal Sound
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(528, audioCtx.currentTime); 
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 3);
        } catch (e) {
            console.warn("Audio trigger failed:", e);
        }

        if (type === 'Luz') setIsRadiating(true);
        else setIsBurning(true);

        const now = new Date();
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const currentHour = now.getHours();
        let evenHour = currentHour % 2 === 0 ? currentHour : currentHour - 1;
        evenHour = Math.max(8, Math.min(22, evenHour));

        const newEntry: LogEntry = {
            day: days[now.getDay()],
            hour: `${evenHour.toString().padStart(2, '0')}:00`,
            type,
            sosTriggered: false,
            themes: [type === 'Luz' ? 'Celebração da Luz' : 'Desabafo do Diário'],
            content: text,
            date: now.toISOString()
        };

        const logs = JSON.parse(localStorage.getItem('portal_logs') || '[]');
        logs.push(newEntry);
        localStorage.setItem('portal_logs', JSON.stringify(logs));

        // Unlock Logic
        if (type === 'Sombra') {
            const count = logs.filter((l: any) => l.type === 'Sombra').length;
            if (count === 5) setShowConquistaSombra(true);
        } else {
            const count = logs.filter((l: any) => l.type === 'Luz').length;
            if (count === 7) {
                localStorage.setItem('portal_citrino_unlocked', 'true');
                setIsCitrinoUnlockedJustNow(true);
            }
        }

        setTimeout(() => onSuccess(), 2500);
    };

    const renderEditor = (type: 'sombras' | 'luz') => {
        const isSombra = type === 'sombras';
        const text = isSombra ? textSombra : textLuz;
        const setText = isSombra ? setTextSombra : setTextLuz;
        const placeholder = isSombra ? PLACEHOLDERS_SOMBRA[sombraPlaceholderIdx] : PLACEHOLDERS_LUZ[luzPlaceholderIdx];
        const ref = isSombra ? textareaSombraRef : textareaLuzRef;
        const isProcessing = isSombra ? isBurning : isRadiating;

        return (
            <div className={`flex-1 flex flex-col p-6 md:p-10 relative overflow-hidden transition-all duration-700 ${isSombra ? 'bg-[#1a0f1c]' : 'bg-[#FAF3E0]'} ${!isMobile && activeTab !== type ? 'opacity-30 blur-sm scale-95 pointer-events-none' : 'opacity-100'}`}>
                {/* Textures */}
                <div className={`absolute inset-0 opacity-40 pointer-events-none ${isSombra ? "bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] mix-blend-multiply" : "bg-[url('https://www.transparenttextures.com/patterns/cream-dust.png')] mix-blend-overlay"}`}></div>
                
                <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-6 flex flex-col items-center md:items-start">
                        <h2 className={`text-2xl md:text-4xl font-light tracking-widest uppercase mb-1 ${isSombra ? 'text-white luxury-text-glow' : 'text-[#301934]'}`}>
                            {isSombra ? 'Sombras' : 'Luz'}
                        </h2>
                        <p className={`text-[10px] md:text-xs tracking-[0.2em] uppercase font-light opacity-60 ${isSombra ? 'text-[#d4af37]' : 'text-[#301934]'}`}>
                            {isSombra ? 'O que precisa ser liberado?' : 'O que merece ser celebrado?'}
                        </p>
                    </div>

                    {/* Ritual Controls */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsPonteMenuOpen(!isPonteMenuOpen)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium backdrop-blur-md transition-all ${isSombra ? 'bg-white/5 border-white/10 text-white/80' : 'bg-[#301934]/5 border-[#301934]/10 text-[#301934]/80'}`}
                            >
                                <span>{selectedPonte ? "Ponte ativa..." : "Pontes"}</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            <AnimatePresence>
                                {isPonteMenuOpen && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={`absolute top-full left-0 mt-2 w-56 p-2 rounded-xl border backdrop-blur-xl z-[60] shadow-2xl ${isSombra ? 'bg-[#1a0c1c] border-white/10' : 'bg-white/90 border-[#301934]/10'}`}>
                                        {PONTES.map((ponte, i) => (
                                            <button key={i} onClick={() => { setSelectedPonte(ponte); setIsPonteMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${isSombra ? 'text-white/80 hover:bg-[#d4af37]/20' : 'text-[#301934] hover:bg-[#F7E7CE]/60'}`}>"{ponte}..."</button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button onClick={() => handleApplyIntention("Eu sou ", type)} className={`px-4 py-2 rounded-full border text-[10px] md:text-xs font-medium uppercase tracking-wider transition-all ${isSombra ? 'border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10' : 'border-[#301934]/40 text-[#301934] hover:bg-[#301934]/10'}`}>Identidade</button>
                        <button onClick={() => handleApplyIntention("Eu tenho ", type)} className={`px-4 py-2 rounded-full border text-[10px] md:text-xs font-medium uppercase tracking-wider transition-all ${isSombra ? 'border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10' : 'border-[#301934]/40 text-[#301934] hover:bg-[#301934]/10'}`}>Recurso</button>
                        <button
                            onClick={() => handleInspiration(type)}
                            className={`p-2 aspect-square rounded-full border transition-all flex items-center justify-center ${isSombra ? 'bg-[#301934] border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-[#F7E7CE] border-white/50 text-[#301934] hover:bg-white/50 shadow-[0_0_15px_rgba(247,231,206,0.8)]'}`}
                            title="Inspirar Intenção"
                        >
                            <Sparkles className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Textarea */}
                    <div className="flex-1 relative mb-6 min-h-[250px] md:min-h-0">
                        <textarea
                            ref={ref}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={isProcessing}
                            placeholder={placeholder}
                            className={`w-full h-full rounded-2xl p-6 md:p-8 text-sm md:text-lg font-light leading-relaxed resize-none focus:outline-none transition-all shadow-inner border shadow-black/20 ${isSombra ? 'bg-white/5 text-white/90 border-white/5 focus:border-white/10' : 'bg-[#301934]/5 text-[#301934]/90 border-[#301934]/5 focus:border-[#301934]/10'}`}
                        />
                        
                        {/* Status animations (Flame/Sun) */}
                        <AnimatePresence>
                            {isProcessing && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl pointer-events-none p-6 text-center">
                                    {isSombra ? (
                                        <>
                                            <Flame className="w-12 h-12 text-[#d4af37] animate-pulse mb-4" />
                                            {showConquistaSombra && (
                                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#301934] border border-[#d4af37]/30 p-4 rounded-xl shadow-2xl">
                                                    <h4 className="text-[#F7E7CE] font-serif text-sm mb-1">A Obsidiana da Verdade</h4>
                                                    <p className="text-[#F7E7CE]/70 text-[10px] italic">"Sua coragem em olhar para a verdade materializou uma nova virtude."</p>
                                                </motion.div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Sun className="w-12 h-12 text-[#F7E7CE] animate-spin-slow mb-4" />
                                            {isCitrinoUnlockedJustNow && (
                                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/10 border border-[#F7E7CE]/30 p-4 rounded-xl shadow-2xl">
                                                    <h4 className="text-[#301934] font-serif text-sm mb-1">A Joia do Sorriso</h4>
                                                    <p className="text-[#301934]/70 text-[10px] italic">"{userName}, seu brilho é o resultado da sua escolha constante."</p>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => handleSave(isSombra ? 'Sombra' : 'Luz')}
                        disabled={!text.trim() || isProcessing}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-medium uppercase tracking-[0.2em] text-xs transition-all ${!text.trim() ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'} ${isSombra ? 'bg-[#d4af37] text-black shadow-[#d4af37]/20 shadow-xl' : 'bg-[#301934] text-[#F7E7CE] shadow-[#301934]/20 shadow-xl'}`}
                    >
                        {isSombra ? <Flame className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        {isSombra ? 'Libertar Sombras' : 'Irradiar Luz'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 w-full h-full z-[120] bg-black flex flex-col">
            
            {/* Unified Top Controls (Back & Nav) */}
            <div className="absolute top-0 inset-x-0 z-[150] h-20 px-4 md:px-12 flex items-center justify-between pointer-events-none">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors glass-panel px-4 py-2 border-white/20 bg-black/40 backdrop-blur-xl pointer-events-auto group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] md:text-xs font-medium tracking-widest uppercase">Voltar</span>
                </button>

                {/* Mobile Tabs */}
                <div className="flex md:hidden glass-panel bg-black/60 backdrop-blur-xl border-white/10 rounded-full p-1 pointer-events-auto">
                    <button 
                        onClick={() => setActiveTab('sombras')}
                        className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'sombras' ? 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-white/40'}`}
                    >
                        Sombras
                    </button>
                    <button 
                        onClick={() => setActiveTab('luz')}
                        className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'luz' ? 'bg-[#F7E7CE] text-[#301934] shadow-[0_0_15px_rgba(247,231,206,0.4)]' : 'text-white/40'}`}
                    >
                        Luz
                    </button>
                </div>

                <div className="hidden md:block">
                    {/* Placeholder for center symmetry or user info */}
                    <span className="text-white/20 font-serif italic text-sm tracking-widest">{userName} • Portal Escritura</span>
                </div>
            </div>

            {/* Editor Area */}
            <div className={`flex-1 flex overflow-hidden ${isMobile ? 'flex-col' : 'flex-row'}`}>
                <AnimatePresence mode="wait">
                    {isMobile ? (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'sombras' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: activeTab === 'sombras' ? 20 : -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="flex-1 flex flex-col"
                        >
                            {renderEditor(activeTab)}
                        </motion.div>
                    ) : (
                        <>
                            {renderEditor('sombras')}
                            {/* Desktop Divider */}
                            <div className="w-px bg-white/10 relative h-full flex items-center justify-center">
                                <div className="absolute w-10 h-10 rounded-full bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center z-50">
                                    <Feather className="w-4 h-4 text-white/40" />
                                </div>
                            </div>
                            {renderEditor('luz')}
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative Label (Desktop Only) */}
            <div className="hidden md:flex absolute bottom-8 left-0 right-0 justify-center z-50 pointer-events-none">
                <h1 className="text-white/10 font-serif tracking-[1em] text-sm uppercase">Equilíbrio Sagrado</h1>
            </div>
        </div>
    );
}
