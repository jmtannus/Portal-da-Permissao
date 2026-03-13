import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';

// Steps definition based// We accept userName to personalize Tour text
export const getTourSteps = (userName: string = 'Janaína') => [
    {
        id: 1,
        title: "O Acolhimento",
        text: `Bem-vinda(o), ${userName}. Tudo aqui começa com uma pergunta sagrada. Sua resposta é o primeiro ponto de luz — ou de sombra — que começará a desenhar o mapa da sua alma.`,
        targetView: "home"
    },
    {
        id: 2,
        title: "O Portal de Escolha",
        text: "Escolha o seu território. No Diário de Luz, celebramos o que brilha. No de Sombras, damos permissão para a dor ser sentida e queimada. Nada se perde, tudo se transforma.",
        targetView: "escrita"
    },
    {
        id: 3,
        title: "O Comando Neural",
        text: "Aqui você hackeia sua realidade. Use Identidade para reprogramar quem você É ou Recurso para manifestar o que você TEM. Se a afirmação parecer difícil, as Pontes de Permissão suavizam o caminho para o seu subconsciente.",
        targetView: "sombras", // Using sombras as the showcase for the neural command
        focusSelector: ".neural-command-area" // CSS class to add to intention buttons wrapper
    },
    {
        id: 4,
        title: "O Espelho da Verdade",
        text: "A engenharia do sentir. Aqui, seus registros revelam padrões invisíveis. Entenda seus ciclos e observe como sua Luz e Sombra se integram em uma única história.",
        targetView: "espelho"
    },
    {
        id: 5,
        title: "Seu Disjuntor",
        text: "Para os dias de tempestade, use o botão RESPIRE. É sua pausa sagrada de 180 segundos. Um compromisso de não se abandonar quando o mundo parecer pesado demais.\n\n🎁 Presente de Boas-Vindas: Como símbolo do seu compromisso, você acaba de desbloquear sua primeira semente de Joia: a Ametista do Início.",
        targetView: "home", // SOS is global but best seen on home
        focusSelector: ".sos-button-area"
    },
    {
        id: 6,
        title: "O Tesouro da Constância",
        text: "Sua evolução merece ser adornada. Cada reflexão profunda materializa Joias de Virtude. Colecione suas vitórias emocionais e honre sua jornada.",
        targetView: "tesouro"
    }
];

interface WelcomeTourProps {
    currentStep: number;
    onNext: () => void;
    onPrev?: () => void;
    onClose: () => void;
}

export default function WelcomeTour({ currentStep, onNext, onPrev, onClose }: WelcomeTourProps) {
    const [userName, setUserName] = useState('Janaína');

    useEffect(() => {
        try {
            const userPref = localStorage.getItem('portal_user');
            if (userPref) {
                const parsed = JSON.parse(userPref);
                if (parsed.name) setUserName(parsed.name);
            }
        } catch (e) { }
    }, []);

    const steps = getTourSteps(userName);
    const stepData = steps[currentStep - 1];

    if (!stepData) return null;

    const isLastStep = currentStep === steps.length;
    const isNeuralStep = currentStep === 3;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed bottom-0 left-0 right-0 md:bottom-10 md:left-1/2 md:-translate-x-1/2 z-[9999] w-full md:w-[90%] md:max-w-md"
            >
                <div className={`p-8 md:p-6 rounded-t-3xl md:rounded-3xl flex flex-col gap-5 md:gap-4 shadow-2xl border ${isNeuralStep ? 'bg-[#301934]/95 border-[#F7E7CE]/50 shadow-[#F7E7CE]/20 backdrop-blur-xl' : 'bg-[#1a0c1c]/95 border-[#d4af37]/30 shadow-black/80 backdrop-blur-xl'}`}>

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 relative">
                        <span className={`text-[10px] md:text-xs font-bold tracking-widest ${isNeuralStep ? 'text-[#F7E7CE]' : 'text-[#d4af37]'}`}>
                            PASSO {currentStep} DE {steps.length}
                        </span>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                {steps.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${s.id === currentStep ? (isNeuralStep ? 'bg-[#F7E7CE]' : 'bg-[#d4af37]') : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Fechar Tour"
                            >
                                <X className="w-4 h-4 opacity-50 hover:opacity-100" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <h3 className={`font-serif text-lg md:text-2xl luxury-text-glow ${isNeuralStep ? 'text-[#F7E7CE]' : 'text-white/90'}`}>
                            {stepData.title}
                        </h3>
                        <p className={`text-sm md:text-base font-light leading-relaxed ${isNeuralStep ? 'text-[#F7E7CE]/80' : 'text-white/60'}`} translate="no">
                            {stepData.text}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-2 md:mt-0">
                        <div className="flex items-center gap-4 md:gap-3">
                            {currentStep > 1 && onPrev && (
                                <button
                                    onClick={onPrev}
                                    className={`p-2.5 md:p-2 rounded-full transition-colors ${isNeuralStep ? 'text-[#F7E7CE]/70 hover:bg-[#F7E7CE]/10' : 'text-white/50 hover:bg-white/10 hover:text-white/90'}`}
                                    aria-label="Passo Anterior"
                                >
                                    <ArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className={`text-[11px] md:text-xs underline transition-colors ${isNeuralStep ? 'text-[#F7E7CE]/50 hover:text-[#F7E7CE]' : 'text-white/30 hover:text-white/80'}`}
                            >
                                Pular Tour
                            </button>
                        </div>

                        <button
                            onClick={async () => {
                                if (currentStep === 2) {
                                    // Explicit 528Hz crystal sound trigger
                                    try {
                                        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                                        const audioCtx = new AudioContextClass();
                                        
                                        // Mobile engines often need a resume() inside the click handler
                                        if (audioCtx.state === 'suspended') {
                                            await audioCtx.resume();
                                        }

                                        const oscillator = audioCtx.createOscillator();
                                        const gainNode = audioCtx.createGain();
                                        oscillator.type = 'sine';
                                        oscillator.frequency.setValueAtTime(528, audioCtx.currentTime); // 528 Hz
                                        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                                        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
                                        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3);
                                        oscillator.connect(gainNode);
                                        gainNode.connect(audioCtx.destination);
                                        oscillator.start();
                                        oscillator.stop(audioCtx.currentTime + 3);
                                    } catch (e) { 
                                        console.error("Audio trigger error:", e); 
                                    }
                                }
                                onNext();
                            }}
                            className={`px-6 py-4 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-xl ${isNeuralStep
                                ? 'bg-[#F7E7CE] text-[#301934] shadow-[#F7E7CE]/10'
                                : 'bg-gradient-to-r from-[#d4af37] to-[#f4d068] text-black shadow-[#d4af37]/20'
                                }`}
                        >
                            {isLastStep ? 'Começar Jornada' : (isNeuralStep ? 'Compreendo meu Poder' : 'Próximo Passo')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
