import { motion } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface EloDoRespiroCardProps {
    onClose: () => void;
    intention: string;
    setIntention: (val: string) => void;
    onAnchor: () => void;
    isMaterialized: boolean;
}

export default function EloDoRespiroCard({ 
    onClose, 
    intention, 
    setIntention, 
    onAnchor, 
    isMaterialized 
}: EloDoRespiroCardProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/98 backdrop-blur-2xl animate-box-open">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-[#f7e7ce]/70 hover:text-white transition-colors p-2 glass-panel z-[110]"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="w-full max-w-sm aspect-[9/16] relative glass-panel overflow-hidden border-[#f7e7ce]/30 flex flex-col items-center group shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                {/* Background Image */}
                <img 
                    src="/assets/guardia-elo-respiro.jpg" 
                    alt="Guardiã do Fluxo Celestial" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                />

                {/* 528Hz Crystalline Vibration Effect over the central symbol */}
                {/* Positioned between the hands of the guardian */}
                <motion.div 
                    className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none z-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(247,231,206,0.4) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                    }}
                    animate={{ 
                        opacity: [0.7, 1.0, 0.7],
                        scale: [0.95, 1.05, 0.95]
                    }}
                    transition={{ 
                        duration: 0.00189, // 528Hz cycle
                        repeat: Infinity, 
                        ease: 'linear' 
                    }}
                />
                
                {/* Overlay Content */}
                <div className="relative z-30 h-full w-full flex flex-col items-center justify-end p-8 text-center bg-gradient-to-t from-black via-transparent to-transparent">
                    <div className="mb-4">
                        <h3 className="text-xl font-serif text-[#f7e7ce] mb-1 luxury-text-glow tracking-[0.2em] uppercase">Guardian of the Celestial Flow</h3>
                        <p className="text-[9px] text-[#f7e7ce]/60 italic uppercase tracking-widest">For the 'O Elo do Respiro' Jewel</p>
                    </div>

                    {/* Upload/Intention Area */}
                    <div className="w-full space-y-4 mb-6">
                        {!isMaterialized ? (
                            <div className="space-y-3">
                                <textarea 
                                    value={intention}
                                    onChange={(e) => setIntention(e.target.value)}
                                    placeholder="Anchor your breathing flow intention..."
                                    className="w-full bg-black/60 border border-[#f7e7ce]/20 rounded-xl p-4 text-sm text-[#f7e7ce] placeholder:text-[#f7e7ce]/30 focus:outline-none focus:border-[#f7e7ce]/60 h-28 resize-none transition-all backdrop-blur-sm"
                                />
                                <button 
                                    onClick={onAnchor}
                                    className="w-full py-4 bg-[#f7e7ce] text-[#301934] rounded-xl text-xs font-bold tracking-[3px] uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(247,231,206,0.2)] active:scale-95"
                                >
                                    Ancorar Fluxo
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-[#f7e7ce]/20 shadow-xl">
                                <p className="text-[9px] uppercase tracking-[4px] text-[#f7e7ce]/40 mb-3">Intenção de Respiro Selada</p>
                                <p className="text-sm text-white font-light italic leading-relaxed">"{intention || 'O fluxo se tornou eterno.'}"</p>
                            </div>
                        )}
                    </div>

                    {isMaterialized && (
                        <button className="flex items-center gap-3 text-[#f7e7ce] hover:text-white transition-all text-[10px] font-medium uppercase tracking-[4px] border-b border-[#f7e7ce]/20 pb-2 hover:border-[#f7e7ce]/80">
                            <Download className="w-3 h-3" />
                            Download Card
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
