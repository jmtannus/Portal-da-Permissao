import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SOSButton from './SOSButton';
import Logo from './Logo';

interface TopNavProps {
    currentView: 'home' | 'espelho' | 'tesouro' | 'oasis' | 'escrita' | 'sombras' | 'luz';
    setCurrentView: (view: any) => void;
}

export default function TopNav({ currentView, setCurrentView }: TopNavProps) {
    const [userName, setUserName] = useState('Janaína');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const navLinks = [
        { id: 'home', label: 'Início' },
        { id: 'espelho', label: 'Espelho da Alma' },
        { id: 'tesouro', label: 'Meu Tesouro' },
    ];

    const handleLinkClick = (id: string) => {
        setCurrentView(id);
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 inset-x-0 z-[100] h-20 bg-[#301934]/60 backdrop-blur-xl border-b border-[#F7E7CE]/10 flex items-center justify-between px-4 md:px-12 transition-all duration-500">
            {/* Left Box: Logo */}
            <div className="flex-1 flex items-center justify-start z-10">
                <button
                    id="global-nav-selo"
                    onClick={() => handleLinkClick('home')}
                    className="flex items-center gap-3 group outline-none"
                >
                    <div className="scale-75 md:scale-100 origin-left">
                        <Logo />
                    </div>
                </button>
            </div>

            {/* Desktop Center Box: Links */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-10">
                {navLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => handleLinkClick(link.id)}
                        className={`text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:tracking-[0.3em] ${
                            currentView === link.id 
                                ? 'text-[#F7E7CE] font-medium luxury-text-glow' 
                                : 'text-[#F7E7CE]/50 hover:text-[#F7E7CE]/80 font-light'
                        }`}
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            {/* Right Box: Identity, S.O.S & Hamburger */}
            <div className="flex-1 flex items-center justify-end gap-3 md:gap-6 z-10">
                <span className="text-[#F7E7CE] font-serif italic text-lg tracking-wide hidden lg:block opacity-90 truncate max-w-[150px]">
                    {userName}
                </span>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative flex items-center scale-90 md:scale-100">
                        <SOSButton inNav={true} />
                    </div>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-[#F7E7CE] hover:bg-white/5 rounded-full transition-colors outline-none"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute top-20 left-0 right-0 bg-[#301934]/95 backdrop-blur-2xl border-b border-[#F7E7CE]/10 p-8 flex flex-col items-center gap-8 md:hidden shadow-2xl"
                    >
                        <div className="flex flex-col items-center gap-6 w-full">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => handleLinkClick(link.id)}
                                    className={`text-lg tracking-[0.3em] uppercase py-2 w-full text-center border-b border-white/5 ${
                                        currentView === link.id 
                                            ? 'text-[#F7E7CE] font-medium luxury-text-glow' 
                                            : 'text-[#F7E7CE]/50 font-light'
                                    }`}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="pt-4 flex flex-col items-center gap-2">
                            <span className="text-[#F7E7CE]/40 text-xs tracking-widest uppercase">Identidade Conectada</span>
                            <span className="text-[#F7E7CE] font-serif italic text-xl">{userName}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
