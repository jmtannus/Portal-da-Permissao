import { useState, useEffect } from 'react';
import { Download, Sparkles, ChevronLeft } from 'lucide-react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface JewelDef {
    id: string;
    name: string;
    pillar: string;
    description: string;
    unlockedCriteria: string;
    unlocked: boolean;
    materialized?: boolean;
    colorHex: string;
    gradient: string;
    isMultifaceted?: boolean;
    isTramaAmulet?: boolean;
}

const JEWELS: JewelDef[] = [
    {
        id: 'ametista',
        name: 'Ametista do Início',
        pillar: 'Permissão para explorar',
        description: 'O primeiro ato de liberdade é permitir-se descobrir o novo. Esta joia simboliza sua coragem em abrir as portas deste Portal e explorar as ferramentas que guiarão sua transformação.',
        unlockedCriteria: 'Completar o Tour de Boas-Vindas',
        unlocked: false, // Unlocked via Tour
        colorHex: '#9B59B6',
        gradient: 'from-[#9B59B6] to-[#71368A]',
    },
    {
        id: 'safira',
        name: 'O Elo do Respiro',
        pillar: 'Maestria na pausa (SOS)',
        description: 'No silêncio de uma pausa, o caos se ordena. Dominar o ímpeto do agir é encontrar a maestria sobre o próprio tempo.',
        unlockedCriteria: '5 usos do SOS Respiração',
        unlocked: true,
        colorHex: '#2980B9',
        gradient: 'from-[#2980B9] to-[#1A5276]',
    },
    {
        id: 'citrino',
        name: 'O Brilho do Sorriso',
        pillar: 'Constância na gratidão (Luz)',
        description: 'O sorriso mais autêntico nasce da alma que se deu permissão para brilhar. Você sustentou sua frequência e agora o seu sol interno é inabalável.',
        unlockedCriteria: '7 registros de Luz',
        unlocked: false,
        colorHex: '#F7E7CE',
        gradient: 'from-[#F7E7CE] to-[#D4AF37]',
    },
    {
        id: 'turmalina',
        name: 'A Trama da Mudança',
        pillar: 'Poder de ressignificação (PNL)',
        description: 'O passado é uma biblioteca viva, e você detém a pena. Ao ressignificar sua dor, você não apaga o que viveu, mas transmuta o peso em sabedoria. Sua narrativa agora te pertence.',
        unlockedCriteria: 'Materializa-se quando você revisita um registro no Diário de Sombras e utiliza uma "Ponte de Permissão" para editá-lo',
        unlocked: false,
        colorHex: '#D4AF37',
        gradient: 'from-[#1a0f1c] to-[#301934]',
        isTramaAmulet: true
    },
    {
        id: 'prisma-aceitacao',
        name: 'O Prisma da Aceitação',
        pillar: 'Integração de opostos',
        description: 'Aceitar não é render-se ao peso, mas sim ganhar a clareza para ver a trama inteira. Ao honrar sua dualidade, você transmuta o conflito em paz e a dor em sabedoria.',
        unlockedCriteria: 'Integração de Luz e Sombra no mesmo período (Heatmap)',
        unlocked: false,
        colorHex: '#D4AF37',
        gradient: 'from-[#D4AF37] to-[#71368A]', // Dourado e Violeta alternados
        isMultifaceted: true // Meta para o ícone customizado
    },
    {
        id: 'diamante-mel',
        name: 'A Essência do Ser',
        pillar: 'Firmeza na identidade (Eu Sou)',
        description: 'A joia final não é sobre o que você faz, mas sobre quem você é. Um diamante lapidado pela integração entre o humano, a técnica e a vida.',
        unlockedCriteria: 'Integração total do sistema',
        unlocked: true,
        colorHex: '#F7E7CE',
        gradient: 'from-[#F7E7CE] to-[#d4af37]',
    },
    {
        id: 'obsidiana-verdade',
        name: 'A Obsidiana da Verdade',
        pillar: 'Coragem de olhar para o escuro',
        description: 'A luz só é percebida porque existe o contraste. Honrar suas sombras é o primeiro passo para não ser mais dominada por elas. Você foi verdadeira consigo mesma.',
        unlockedCriteria: '5 registros realizados no Diário de Sombras',
        unlocked: false,
        colorHex: '#301934',
        gradient: 'from-[#301934] to-[#5F4B8B]',
    }
];

export default function MeuTesouroParticular() {
    const [jewelsState, setJewelsState] = useState<JewelDef[]>(JEWELS);
    const [activeJewel, setActiveJewel] = useState<JewelDef | null>(null);
    const [isFullyOpened, setIsFullyOpened] = useState(false);
    const [init, setInit] = useState(false);
    const [extraStardust, setExtraStardust] = useState(false);
    const [materializing, setMaterializing] = useState(false);
    const [showGuardian, setShowGuardian] = useState(false);
    const [anchoringFlash, setAnchoringFlash] = useState(false);
    const [intention, setIntention] = useState('');

    const play528Hz = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(528, ctx.currentTime);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 4);
        } catch (e) {
            console.log("Audio play failed", e);
        }
    };

    const handleJewelClick = (jewel: JewelDef) => {
        if (!jewel.unlocked) return;

        setActiveJewel(jewel);

        if (jewel.id === 'prisma-aceitacao') {
            play528Hz(); // Reuse the same frequency or old harp chord
            setExtraStardust(true);
            setTimeout(() => {
                setExtraStardust(false);
            }, 3000);
        }
    };

    const handleMaterializeRitual = () => {
        if (!activeJewel || activeJewel.id !== 'ametista') return;
        
        play528Hz();
        setMaterializing(true);
        setExtraStardust(true);

        // Convergence effect: Particles move to center
        // We simulate this by changing stardust settings for a few seconds
        
        setTimeout(() => {
            setShowGuardian(true);
            setMaterializing(false);
            setExtraStardust(false);
        }, 3000);
    };

    const handleAnchorIntention = () => {
        setAnchoringFlash(true);
        setTimeout(() => setAnchoringFlash(false), 1000);
        
        // Save materialized status
        if (activeJewel) {
            localStorage.setItem(`portal_materialized_${activeJewel.id}`, 'true');
            if (intention) {
                localStorage.setItem(`portal_intention_${activeJewel.id}`, intention);
            }
            
            setJewelsState(prev => prev.map(j => 
                j.id === activeJewel.id ? { ...j, materialized: true } : j
            ));
            setActiveJewel(prev => prev ? { ...prev, materialized: true } : null);
        }
    };

    useEffect(() => {
        initParticlesEngine(async (engine: any) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });

        // Check unlocks based on localStorage
        try {
            const stored = localStorage.getItem('portal_logs');
            const isAmetistaUnlocked = localStorage.getItem('portal_ametista_unlocked') === 'true';
            
            // Initial load of materialized states
            const getMaterialized = (id: string) => localStorage.getItem(`portal_materialized_${id}`) === 'true';

            if (stored) {
                const logs = JSON.parse(stored);
                const sombraCount = logs.filter((l: any) => l.type === 'Sombra' && !l.sosTriggered).length;
                const isTramaUnlocked = localStorage.getItem('portal_trama_unlocked') === 'true';
                const citrinoLogsCount = logs.filter((l: any) => l.type === 'Luz').length;
                const isCitrinoUnlocked = localStorage.getItem('portal_citrino_unlocked') === 'true' || citrinoLogsCount >= 7;

                // Check Integration (Luz and Sombra in the same day and hour)
                const map = new Map<string, { luz: number, sombra: number }>();
                logs.forEach((entry: any) => {
                    const key = `${entry.day}-${entry.hour}`;
                    if (!map.has(key)) map.set(key, { luz: 0, sombra: 0 });
                    if (entry.type === 'Luz') map.get(key)!.luz++;
                    if (entry.type === 'Sombra') map.get(key)!.sombra++;
                });

                let hasIntegration = false;
                map.forEach((value) => {
                    if (value.luz > 0 && value.sombra > 0) {
                        hasIntegration = true;
                    }
                });

                setJewelsState(prev => prev.map(j => {
                    const isMat = getMaterialized(j.id);
                    if (j.id === 'obsidiana-verdade') {
                        return { ...j, unlocked: sombraCount >= 5, materialized: isMat };
                    }
                    if (j.id === 'turmalina') {
                        return { ...j, unlocked: isTramaUnlocked, materialized: isMat };
                    }
                    if (j.id === 'ametista') {
                        return { ...j, unlocked: isAmetistaUnlocked, materialized: isMat };
                    }
                    if (j.id === 'citrino') {
                        return { ...j, unlocked: isCitrinoUnlocked, materialized: isMat };
                    }
                    if (j.id === 'prisma-aceitacao') {
                        return { ...j, unlocked: hasIntegration, materialized: isMat };
                    }
                    return { ...j, materialized: isMat };
                }));
            } else {
                const isTramaUnlocked = localStorage.getItem('portal_trama_unlocked') === 'true';
                const isCitrinoUnlocked = localStorage.getItem('portal_citrino_unlocked') === 'true';

                setJewelsState(prev => prev.map(j => {
                    const isMat = getMaterialized(j.id);
                    if (j.id === 'ametista') return { ...j, unlocked: isAmetistaUnlocked, materialized: isMat };
                    if (j.id === 'turmalina') return { ...j, unlocked: isTramaUnlocked, materialized: isMat };
                    if (j.id === 'citrino') return { ...j, unlocked: isCitrinoUnlocked, materialized: isMat };
                    return { ...j, materialized: isMat };
                }));
            }
        } catch (e) { }

        // We wait for the boxOpening animation (1.2s) + the stagger of jewels (5 * 150ms) to finish
        // to turn on extra glows and interactability seamlessly
        const timer = setTimeout(() => setIsFullyOpened(true), 2000);

        // Listen to dynamic unlock
        const handleTramaUnlocked = () => {
            setJewelsState(prev => prev.map(j => j.id === 'turmalina' ? { ...j, unlocked: true } : j));
        };
        window.addEventListener('portal:trama_unlocked', handleTramaUnlocked);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('portal:trama_unlocked', handleTramaUnlocked);
        };
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center mt-12 mb-24 z-10 relative animate-box-open min-h-[80vh] justify-center">

            {/* Névoa de Seda Ativa (Particles Background) */}
            {init && (
                <Particles
                    id="tsparticles-tesouro"
                    className="absolute inset-0 z-[-1] pointer-events-none mix-blend-screen opacity-60"
                    options={{
                        fullScreen: { enable: false },
                        fpsLimit: 60,
                        particles: {
                            color: { value: "#F7E7CE" },
                            links: { enable: false },
                            move: {
                                enable: true,
                                speed: materializing ? 2 : 0.3,
                                direction: "none",
                                random: true,
                                straight: false,
                                outModes: { default: "out" }
                            },
                            number: {
                                density: { enable: false },
                                value: materializing ? 150 : (extraStardust ? 120 : 40)
                            },
                            opacity: {
                                value: materializing ? { min: 0.4, max: 0.8 } : { min: 0.1, max: 0.4 }
                            },
                            shape: { type: "circle" },
                            size: {
                                value: materializing ? { min: 2, max: 4 } : { min: 1, max: 2 }
                            }
                        },
                        interactivity: {
                            detectsOn: "window",
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: materializing ? "attract" : "trail",
                                }
                            },
                            modes: {
                                attract: {
                                    distance: 1000,
                                    duration: 2,
                                    speed: 5
                                },
                                trail: {
                                    delay: 0.1,
                                    pauseOnStop: true,
                                    quantity: 1,
                                    particles: {
                                        color: { value: "#F7E7CE" },
                                        opacity: {
                                            value: 0.8,
                                            animation: { enable: true, speed: 2, minimumValue: 0, sync: false, startValue: "max", destroy: "min" }
                                        },
                                        size: { value: 3 }
                                    }
                                }
                            }
                        },
                        detectRetina: true,
                    }}
                />
            )}

            {/* Aura de Conquista (Radial Glow behind the box) */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-4xl rounded-full blur-[120px] transition-all duration-1000 z-[-1] pointer-events-none"
                style={{
                    backgroundColor: activeJewel ? activeJewel.colorHex : 'transparent',
                    opacity: activeJewel ? 0.15 : 0
                }}
            />

            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-white tracking-wide luxury-text-glow mb-4">
                    Meu Tesouro <span className="text-[#f7e7ce] italic">Particular</span>
                </h2>
                <p className="text-[#f7e7ce]/70 font-light max-w-2xl mx-auto">
                    Cada símbolo aqui representa uma virtude materializada. Suas conquistas emocionais esculpidas para eternidade.
                </p>
            </div>

            <div className="flex w-full mt-4 items-center justify-center relative">

                {/* The Velvet Box (Grid) */}
                <div className={`w-full max-w-4xl bg-gradient-to-br from-[#5F4B8B] to-[#301934] shadow-inner rounded-[2.5rem] p-8 md:p-12 border border-white/5 relative overflow-hidden transition-all duration-700 z-10 ${activeJewel ? 'lg:w-[60%] lg:mr-[400px]' : 'lg:w-[80%]'}`}>

                    {/* Subtle Velvet Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-40 mix-blend-multiply pointer-events-none"></div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative z-10">
                        {jewelsState.map((jewel, index) => (
                            <button
                                key={jewel.id}
                                onClick={() => handleJewelClick(jewel)}
                                className={`flex flex-col items-center group perspective-1000 animate-jewel-reveal ${!jewel.unlocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                style={{ animationDelay: `${(index * 0.15) + 0.5}s` }}
                            >
                                {/* The Niche */}
                                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full mb-4 flex items-center justify-center relative transition-all duration-700 preserve-3d
                  ${activeJewel?.id === jewel.id ? 'scale-110 shadow-[0_0_40px_rgba(247,231,206,0.2)]' : ''}
                  ${activeJewel?.id === 'citrino' && jewel.id !== 'citrino' ? 'shadow-[0_0_30px_rgba(247,231,206,0.15)] bg-black/10' : ''}
                  ${jewel.unlocked ? 'bg-black/40 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.05)]' : 'bg-black/20'}
                `}>

                                    {/* The Jewel Itself */}
                                    <div className={`absolute w-12 h-12 md:w-16 md:h-16 rounded-lg rotate-45 transition-all duration-700 flex items-center justify-center
                    ${jewel.unlocked ? `bg-gradient-to-br ${jewel.gradient} shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4)]` : 'bg-white/10 grayscale opacity-30 shadow-none'}
                    ${activeJewel?.id === jewel.id ? 'rotate-[-315deg] scale-125' : 'group-hover:rotate-[135deg]'}
                  `}
                                        style={jewel.unlocked ? { filter: `drop-shadow(0 0 15px ${jewel.colorHex}80)` } : {}}
                                    >
                                        {/* Fake facets for 3D look inside the jewel */}
                                        {jewel.unlocked && !jewel.isTramaAmulet && (
                                            <div className="absolute inset-1 border border-white/30 rounded-sm"></div>
                                        )}

                                        {/* A Trama da Mudança Custom Amulet */}
                                        {jewel.unlocked && jewel.isTramaAmulet && (
                                            <div className="absolute inset-0 flex items-center justify-center -rotate-45" style={{ filter: 'drop-shadow(0px 0px 5px rgba(212,175,55,0.8))' }}>
                                                <svg viewBox="0 0 100 100" className="w-[120%] h-[120%] opacity-90 relative z-20">
                                                    <defs>
                                                        <linearGradient id="goldSilk" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#F7E7CE" />
                                                            <stop offset="50%" stopColor="#D4AF37" />
                                                            <stop offset="100%" stopColor="#996515" />
                                                        </linearGradient>
                                                        <filter id="glow">
                                                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                            <feMerge>
                                                                <feMergeNode in="coloredBlur" />
                                                                <feMergeNode in="SourceGraphic" />
                                                            </feMerge>
                                                        </filter>
                                                    </defs>
                                                    {/* Obsidiana Base */}
                                                    <circle cx="50" cy="50" r="38" fill="url(#goldSilk)" opacity="0.1" />
                                                    <circle cx="50" cy="50" r="35" fill="#1a0f1c" stroke="#301934" strokeWidth="2" />
                                                    {/* Silk Threads */}
                                                    <path d="M 15 50 Q 50 20, 85 50 T 15 50" fill="none" stroke="url(#goldSilk)" strokeWidth="2" filter="url(#glow)" />
                                                    <path d="M 50 15 Q 80 50, 50 85 T 50 15" fill="none" stroke="url(#goldSilk)" strokeWidth="2" filter="url(#glow)" />
                                                    <path d="M 25 25 Q 75 25, 75 75" fill="none" stroke="url(#goldSilk)" strokeWidth="1.5" filter="url(#glow)" />
                                                    <path d="M 25 75 Q 75 75, 75 25" fill="none" stroke="url(#goldSilk)" strokeWidth="1.5" filter="url(#glow)" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sparkle Particles Layer (Glow) */}
                                    {jewel.unlocked && isFullyOpened && (
                                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${activeJewel?.id === jewel.id ? 'opacity-100' : 'opacity-20 group-hover:opacity-60'}`}>
                                            <Sparkles className={`w-full h-full text-[#f7e7ce] ${activeJewel?.id === jewel.id ? 'animate-pulse' : ''}`} strokeWidth={0.5} />
                                        </div>
                                    )}
                                </div>

                                <span className="text-sm font-medium tracking-wide text-white/80 group-hover:text-white transition-colors">
                                    {jewel.name}
                                </span>

                                {!jewel.unlocked && (
                                    <span className="text-[10px] uppercase tracking-widest text-[#f7e7ce]/40 mt-1">Trancado</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Jewel Details Panel (Overlay/Side Balance) */}
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 lg:w-[380px] w-[90%] flex flex-col items-center text-center p-8 lg:p-10 glass-panel border-[#F7E7CE]/20 transition-all duration-700 z-20 ${activeJewel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'}`}>
                    {activeJewel ? (
                        <>
                            <div className="w-16 h-16 mb-8 rounded-lg rotate-45 flex items-center justify-center animate-spin-slow" style={{ background: `linear-gradient(135deg, ${activeJewel.colorHex}, #000000)` }}>
                                <div className="absolute inset-1 border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                            </div>

                            <h3 className="text-sm tracking-widest uppercase text-[#f7e7ce]/70 mb-2 font-semibold">
                                {activeJewel.pillar}
                            </h3>

                            <h4 className="text-3xl font-light text-[#F7E7CE] mb-6 font-serif tracking-wide">
                                {activeJewel.name}
                            </h4>

                            <p className="text-[#F7E7CE] font-light leading-relaxed mb-6 text-sm md:text-base">
                                {activeJewel.description}
                            </p>

                            <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-10 w-full text-left">
                                <span className="text-[10px] uppercase tracking-widest text-[#F7E7CE]/50 block mb-1">Critério de Desbloqueio</span>
                                <span className="text-xs text-[#F7E7CE] font-light">{activeJewel.unlockedCriteria}</span>
                            </div>

                            {activeJewel.unlocked && !activeJewel.materialized && (
                                <button 
                                    onClick={handleMaterializeRitual}
                                    disabled={materializing}
                                    className={`flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full bg-[#f7e7ce] text-[#301934] font-medium transition-all group overflow-hidden relative mt-4
                                        ${materializing ? 'opacity-50 cursor-wait' : 'hover:bg-white hover:shadow-[0_0_20px_rgba(247,231,206,0.4)] animate-pulsing-glow'}
                                    `}
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Sparkles className={`w-4 h-4 ${materializing ? 'animate-spin' : ''}`} />
                                        {materializing ? 'Iniciando Ritual...' : 'Materializar Permissão'}
                                    </span>
                                </button>
                            )}

                            {activeJewel.materialized && (
                                <button 
                                    onClick={() => setShowGuardian(true)}
                                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full bg-[#301934] text-[#f7e7ce] border border-[#f7e7ce]/30 font-medium hover:bg-black transition-all mt-4"
                                >
                                    <Download className="w-4 h-4" />
                                    Ver Joia Materializada
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-40 text-sm">
                            <Sparkles className="w-10 h-10 mb-4 text-[#f7e7ce]" strokeWidth={1} />
                            <p>Selecione uma joia conquistada para revelar sua essência.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Materialization Guardian Card Modal */}
            {showGuardian && activeJewel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-box-open">
                    <button 
                        onClick={() => setShowGuardian(false)}
                        className="absolute top-6 right-6 text-[#f7e7ce]/70 hover:text-white transition-colors p-2 glass-panel"
                    >
                        <ChevronLeft className="w-6 h-6 rotate-90" />
                    </button>

                    <div className="w-full max-w-sm aspect-[9/16] relative glass-panel overflow-hidden border-[#f7e7ce]/30 flex flex-col items-center group">
                        {/* Background Guardian Image */}
                        <img 
                            src="/assets/guardia-ametista.png" 
                            alt="Guardiã da Ametista" 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518005020250-6eb5f3f2754d?auto=format&fit=crop&q=80&w=800'; // Fallback
                            }}
                        />
                        
                        {/* Overlay Content */}
                        <div className="relative z-10 h-full w-full flex flex-col items-center justify-end p-8 text-center bg-gradient-to-t from-black via-transparent to-transparent">
                            <h3 className="text-2xl font-serif text-[#f7e7ce] mb-2 luxury-text-glow">Guardiã do Início</h3>
                            <p className="text-xs text-[#f7e7ce]/70 italic mb-8 uppercase tracking-widest">A Permissão foi Concedida</p>
                            
                            {/* Upload Area */}
                            <div className="w-full space-y-4 mb-8">
                                {!activeJewel.materialized ? (
                                    <div className="space-y-3">
                                        <textarea 
                                            value={intention}
                                            onChange={(e) => setIntention(e.target.value)}
                                            placeholder="Registre sua intenção ou frase de poder aqui..."
                                            className="w-full bg-black/40 border border-[#f7e7ce]/20 rounded-lg p-3 text-sm text-[#f7e7ce] placeholder:text-[#f7e7ce]/30 focus:outline-none focus:border-[#f7e7ce]/60 h-24 resize-none transition-colors"
                                        />
                                        <button 
                                            onClick={handleAnchorIntention}
                                            className="w-full py-3 bg-[#f7e7ce] text-[#301934] rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(247,231,206,0.3)]"
                                        >
                                            Ancorar Permissão
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-[#f7e7ce]/20">
                                        <p className="text-[10px] uppercase tracking-widest text-[#f7e7ce]/50 mb-2">Sua Intenção Ancorada</p>
                                        <p className="text-sm text-white font-light italic">"{intention || localStorage.getItem(`portal_intention_${activeJewel.id}`) || 'A intenção foi selada.'}"</p>
                                    </div>
                                )}
                            </div>

                            {activeJewel.materialized && (
                                <button className="flex items-center gap-2 text-[#f7e7ce] hover:text-white transition-colors text-xs font-medium uppercase tracking-[3px] border-b border-[#f7e7ce]/30 pb-1">
                                    <Download className="w-3 h-3" />
                                    Download Card
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {anchoringFlash && <div className="flash-anchor" />}
        </div>
    );
}
