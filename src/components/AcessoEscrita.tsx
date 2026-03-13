import { PlusCircle, Search } from 'lucide-react';

interface AcessoEscritaProps {
    onBack: () => void;
    onSelect: (type: 'sombras' | 'luz') => void;
}

export default function AcessoEscrita({ onBack, onSelect }: AcessoEscritaProps) {
    return (
        <div className="fixed inset-0 w-full h-full z-[1] overflow-hidden flex flex-col md:flex-row">

            {/* Back Button */}
            <div className="absolute top-8 left-8 z-50">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group glass-panel px-4 py-2 border-white/20 bg-black/20 backdrop-blur-xl"
                >
                    <span className="text-sm font-medium tracking-wide">Voltar ao Portal</span>
                </button>
            </div>

            {/* Sombras Side (Left) */}
            <div
                onClick={() => onSelect('sombras')}
                className="group relative flex-1 h-[50vh] md:h-full cursor-pointer overflow-hidden bg-[#1a0f1c] hover-seda"
            >
                {/* Backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#301934] to-[#000000] opacity-80 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-60 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_150%)] pointer-events-none opacity-90 group-hover:opacity-60 transition-opacity duration-1000"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 transform group-hover:scale-105 transition-transform duration-1000">
                    <div className="w-20 h-20 rounded-full bg-[#d4af37]/5 flex items-center justify-center mb-8 border border-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] group-hover:shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-all duration-700">
                        <Search className="w-8 h-8 text-[#d4af37]/70 group-hover:text-[#d4af37] transition-colors duration-700" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light text-white tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-700 luxury-text-glow">
                        SOMBRAS
                    </h2>
                    <p className="text-[#d4af37]/50 font-light tracking-wide max-w-xs group-hover:text-[#d4af37]/80 transition-colors duration-700">
                        O que precisa ser liberado?
                    </p>
                </div>
            </div>

            {/* Luz Side (Right) */}
            <div
                onClick={() => onSelect('luz')}
                className="group relative flex-1 h-[50vh] md:h-full cursor-pointer overflow-hidden bg-[#FAF3E0] hover-seda"
            >
                {/* Backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-tl from-[#F7E7CE] to-[#fffDF7] opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-dust.png')] opacity-40 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#F7E7CE_150%)] pointer-events-none opacity-50 group-hover:opacity-10 transition-opacity duration-1000"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 transform group-hover:scale-105 transition-transform duration-1000">
                    <div className="w-20 h-20 rounded-full bg-[#301934]/5 flex items-center justify-center mb-8 border border-[#301934]/10 shadow-[0_0_30px_rgba(247,231,206,0.5)] group-hover:shadow-[0_0_50px_rgba(247,231,206,1)] transition-all duration-700">
                        <PlusCircle className="w-8 h-8 text-[#301934]/50 group-hover:text-[#301934]/80 transition-colors duration-700" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light text-[#301934] tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                        LUZ
                    </h2>
                    <p className="text-[#301934]/50 font-light tracking-wide max-w-xs group-hover:text-[#301934]/80 transition-colors duration-700">
                        O que merece ser celebrado?
                    </p>
                </div>
            </div>

            {/* Center Divider / Ornament (Desktop Only) */}
            <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent z-20 items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <span className="text-white/40 tracking-widest text-xs font-serif italic">ou</span>
                </div>
            </div>

            {/* Center Divider / Ornament (Mobile Only) */}
            <div className="flex md:hidden absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent z-20 items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <span className="text-white/40 tracking-widest text-[10px] font-serif italic">ou</span>
                </div>
            </div>

            {/* Dynamic Footer Title */}
            <div className="absolute bottom-8 left-0 right-0 z-50 pointer-events-none flex justify-center">
                <div className="relative">
                    {/* Shadow Layer for contrast */}
                    <h1 className="text-[#F7E7CE] font-serif font-medium tracking-[0.3em] md:tracking-[0.5em] text-lg md:text-2xl uppercase absolute inset-0 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] mix-blend-overlay">
                        Portal da Permissão
                    </h1>
                    {/* Difference Layer for magic invertion */}
                    <h1 className="text-[#FAF3E0] font-serif font-medium tracking-[0.3em] md:tracking-[0.5em] text-lg md:text-2xl uppercase mix-blend-difference opacity-90 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        Portal da Permissão
                    </h1>
                </div>
            </div>

        </div>
    );
}
