import { useState, useEffect } from 'react';
import SOSButton from './SOSButton';
import Logo from './Logo';

interface TopNavProps {
    currentView: 'home' | 'espelho' | 'tesouro' | 'oasis' | 'escrita' | 'sombras' | 'luz';
    setCurrentView: (view: any) => void;
}

export default function TopNav({ currentView, setCurrentView }: TopNavProps) {
    const [userName, setUserName] = useState('Janaína');

    useEffect(() => {
        try {
            const raw = localStorage.getItem('portal_user');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.name) setUserName(parsed.name);
            } else {
                const name = localStorage.getItem('portal_user_name');
                if (name) setUserName(name);
            }
        } catch (e) { }
    }, []);

    // Se estiver em modo de imersão/full screen de alguma ferramenta que não precise do nav, ou se quisermos sempre global:
    // O pedido diz "Barra de navegação fixa no topo de todas as páginas".

    return (
        <div className="fixed top-0 inset-x-0 z-[100] h-20 bg-[#301934]/60 backdrop-blur-xl border-b border-[#F7E7CE]/10 flex items-center justify-between px-6 md:px-12 transition-all duration-500">
            {/* Left Box: Logo */}
            <div className="flex-1 flex items-center justify-start">
                <button
                    id="global-nav-selo"
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-3 group"
                >
                    <Logo />
                </button>
            </div>

            {/* Center Box: Links */}
            <div className="flex-1 flex items-center justify-center gap-6 md:gap-10">
                <button
                    onClick={() => setCurrentView('home')}
                    className={`text-sm tracking-widest uppercase transition-colors ${currentView === 'home' ? 'text-[#F7E7CE] font-medium' : 'text-[#F7E7CE]/50 hover:text-[#F7E7CE]/80 font-light'}`}
                >
                    Início
                </button>
                <button
                    onClick={() => setCurrentView('espelho')}
                    className={`text-sm tracking-widest uppercase transition-colors ${currentView === 'espelho' ? 'text-[#F7E7CE] font-medium' : 'text-[#F7E7CE]/50 hover:text-[#F7E7CE]/80 font-light'}`}
                >
                    Espelho da Alma
                </button>
                <button
                    onClick={() => setCurrentView('tesouro')}
                    className={`text-sm tracking-widest uppercase transition-colors ${currentView === 'tesouro' ? 'text-[#F7E7CE] font-medium' : 'text-[#F7E7CE]/50 hover:text-[#F7E7CE]/80 font-light'}`}
                >
                    Meu Tesouro
                </button>
            </div>

            {/* Right Box: Identity & S.O.S */}
            <div className="flex-1 flex items-center justify-end gap-6 relative">
                <span className="text-[#F7E7CE] font-serif italic text-lg tracking-wide hidden md:block opacity-90">
                    {userName}
                </span>

                {/* O SOSButton será posicionado relative por fora, então precisamos avisá-lo para não ser absolute. */}
                <div className="relative flex items-center">
                    <SOSButton inNav={true} />
                </div>
            </div>
        </div>
    );
}
