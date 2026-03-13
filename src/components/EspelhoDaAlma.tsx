import { useState, useMemo, useEffect } from 'react';
import { Info, X, Sun, Moon, AlertTriangle, BookOpen, Hourglass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface LogEntry {
    day: string;    // 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
    hour: string;   // '08:00', '14:00', etc.
    type: 'Luz' | 'Sombra';
    sosTriggered: boolean;
    themes: string[];
    date?: string; // Optional for backward compatibility with older local storage logs
    content?: string; // Full text content of the diary entry
    isReframed?: boolean; // Se foi ressignificado alquimicamente
}

// Generate Mock Data with dates for filtering
const today = new Date();
const getPastDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
};

const mockData: LogEntry[] = [
    { day: 'Seg', hour: '08:00', type: 'Luz', sosTriggered: false, themes: ['Gratidão', 'Energia'], date: getPastDate(2), content: 'Acordei sentindo o sol no rosto e de repente me veio uma energia absurda para continuar. Sou muito grata(o) pela minha resiliência de chegar até aqui.' },
    { day: 'Seg', hour: '14:00', type: 'Sombra', sosTriggered: true, themes: ['Ansiedade', 'Trabalho'], date: getPastDate(2), content: 'Uma enxurrada de problemas no trabalho me fez paralisar. Tive que acionar o modo SOS para não surtar no meio de todo mundo. Ainda me sinto pesado(a).' },
    { day: 'Ter', hour: '16:00', type: 'Sombra', sosTriggered: false, themes: ['Cansaço', 'Dúvida'], date: getPastDate(1) },
    { day: 'Ter', hour: '18:00', type: 'Sombra', sosTriggered: true, themes: ['Sobrecarga'], date: getPastDate(1) },
    { day: 'Qua', hour: '10:00', type: 'Luz', sosTriggered: false, themes: ['Foco', 'Paz'], date: getPastDate(14) },
    { day: 'Qui', hour: '20:00', type: 'Luz', sosTriggered: false, themes: ['Relaxamento', 'Família'], date: getPastDate(20), content: 'Tivemos um jantar tão tranquilo hoje. Ver todos rindo e a casa em paz iluminou meu coração. A vida tem sua magia se você olha com calma.' },
    { day: 'Sex', hour: '15:00', type: 'Sombra', sosTriggered: false, themes: ['Frustração', 'Comunicação'], date: getPastDate(45) },
    { day: 'Sáb', hour: '09:00', type: 'Luz', sosTriggered: false, themes: ['Lazer', 'Alegria'], date: getPastDate(60) },
    { day: 'Sáb', hour: '14:00', type: 'Luz', sosTriggered: false, themes: ['Natureza'], date: getPastDate(5) },
    { day: 'Dom', hour: '21:00', type: 'Sombra', sosTriggered: true, themes: ['Medo', 'Futuro'], date: getPastDate(100), content: 'A noite de domingo é cruel. O peso da semana que vai entrar esmaga a mente com preocupações. Tentei respirar, mas é difícil desligar o controle.' },
];

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

const CELEBRACAO_PHRASES = [
    "{nome}, suas {periodo_dia} estão radiantes! ✨ Percebi que o brilho da sua Luz está concentrado aqui. O que essa constância te diz sobre sua força?",
    "Há um fluxo de ouro percorrendo suas {periodo_dia}. Que tal usar essa energia para materializar um novo desejo hoje?"
];

const CELEBRACAO_REFLECTIONS = [
    "Se essa alegria fosse um adorno físico, como você o usaria para iluminar o seu dia?",
    "O que nessa sensação de expansão te faz sentir que você finalmente pertence a si mesma?"
];

const ACOLHIMENTO_PHRASES = [
    "Percebo um peso maior nas suas {periodo_dia}. 🌑 Lembre-se: no Portal, a Sombra não é um erro, é um fio pedindo para ser tecido. Respire.",
    "Suas {periodo_dia} têm sido de entrega profunda às Sombras. Honramos sua coragem de olhar para o que dói sem se abandonar."
];

const ACOLHIMENTO_REFLECTIONS = [
    "Se essa dor fosse uma cor ou textura, como você a descreveria para alguém que só conhece a luz?",
    "O que esse cansaço está tentando proteger agora? Dê permissão para esse escudo descansar."
];

const INTEGRACAO_PHRASES = [
    "O encontro entre o seu sol e sua lua nas {periodo_dia} é poesia pura. Você está aprendendo a ser inteira, com todas as suas cores.",
    "Nem só de sol, nem só de chuva. Suas {periodo_dia} mostram a beleza da sua humanidade integrada. Sinta esse equilíbrio."
];

const INTEGRACAO_REFLECTIONS = [
    "Nesse encontro entre o sol e a chuva na sua alma, qual é a nova tonalidade que você assume?",
    "O que muda na sua respiração quando você para de tentar separar a sua luz da sua sombra?"
];

interface SelectedCellState {
    day: string;
    hour: string;
    entries: LogEntry[];
}

export default function EspelhoDaAlma() {
    const [filterMonth, setFilterMonth] = useState<string | null>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [quickFilter, setQuickFilter] = useState<'mes' | 'ano' | null>(null);
    const [init, setInit] = useState(false);
    const [dynamicData, setDynamicData] = useState<LogEntry[]>(mockData);
    const [selectedCell, setSelectedCell] = useState<SelectedCellState | null>(null);
    const [viewingLogs, setViewingLogs] = useState<LogEntry[] | null>(null);
    const [showReflection, setShowReflection] = useState(false);

    // Alchemical Reframing State
    const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
    const [reframedText, setReframedText] = useState("Eu escolho a realidade onde ");
    const [isTransmuting, setIsTransmuting] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState("");

    // Achievement & Notification States
    const [userName, setUserName] = useState("Janaína");
    const [transmutingCellKey, setTransmutingCellKey] = useState<string | null>(null);
    const [showAchievement, setShowAchievement] = useState(false);

    const POWERFUL_QUESTIONS = [
        "O que essa sombra estava tentando proteger?",
        "Qual é a luz escondida por trás desse medo?",
        "Se essa dor ganhasse voz, o que ela te pediria agora?"
    ];

    const handleStartReframe = (log: LogEntry) => {
        setEditingLog(log);
        setReframedText("Eu escolho a realidade onde ");
        setActiveQuestion(POWERFUL_QUESTIONS[Math.floor(Math.random() * POWERFUL_QUESTIONS.length)]);
    };

    const handleSaveReframe = () => {
        if (!editingLog) return;

        // Exige que o usuário tenha escrito ao menos uma reflexão decente (Ponte de Permissão inicial + conteúdo)
        if (reframedText.trim().length <= 25) {
            return;
        }

        setIsTransmuting(true);
        // Animação de poeira estelar (2 segundos)
        setTimeout(() => {
            const cellKey = `${editingLog.day}-${editingLog.hour}`;
            setTransmutingCellKey(cellKey); // Inicia o brilho dourado no Heatmap

            try {
                const existing = localStorage.getItem('portal_logs');
                if (existing) {
                    const logs: LogEntry[] = JSON.parse(existing);
                    const index = logs.findIndex(l => l.content === editingLog.content && l.day === editingLog.day && l.hour === editingLog.hour);
                    if (index !== -1) {
                        logs[index].isReframed = true;
                        logs[index].content = `${logs[index].content}\n\n--- RESSIGNIFICAÇÃO ALQUÍMICA ---\n${reframedText}`;
                        localStorage.setItem('portal_logs', JSON.stringify(logs));

                        // Gatilho p/ Joalheria ("A Trama da Mudança")
                        localStorage.setItem('portal_trama_unlocked', 'true');
                        window.dispatchEvent(new Event('portal:trama_unlocked'));

                        setDynamicData(prev => {
                            const next = [...prev];
                            const localIdx = next.findIndex(l => l.content === editingLog.content && l.day === editingLog.day && l.hour === editingLog.hour);
                            if (localIdx !== -1) {
                                next[localIdx].isReframed = true;
                                next[localIdx].content = logs[index].content;
                            }
                            return next;
                        });
                    }
                }
            } catch (e) { }

            setEditingLog(null);
            setViewingLogs(null); // Fecha o modal para mostrar a glória do Heatmap
            setIsTransmuting(false);

            // Mostra o amuleto de conquista
            setShowAchievement(true);

            setTimeout(() => {
                setTransmutingCellKey(null);
            }, 3000);

            setTimeout(() => {
                setShowAchievement(false);
            }, 6000); // 6 segundos de notificação
        }, 2000);
    };

    useEffect(() => {
        initParticlesEngine(async (engine: any) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });

        // Toggle body class for SOS Button shifting
        if (selectedCell) {
            document.body.classList.add('drawer-open');
        } else {
            document.body.classList.remove('drawer-open');
        }
    }, [selectedCell]);

    // Load logs on mount
    useEffect(() => {
        const name = localStorage.getItem('portal_user_name');
        if (name) setUserName(name);

        try {
            const stored = localStorage.getItem('portal_logs');
            if (stored) {
                const parsed: LogEntry[] = JSON.parse(stored);
                setDynamicData([...mockData, ...parsed]);
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    // Filter logic based on Exact Month or Presets
    const filteredData = useMemo(() => {
        if (!filterMonth && !quickFilter) return dynamicData;

        const today = new Date();

        return dynamicData.filter(entry => {
            // Fallback to today if no date on legacy logs
            const entryDate = entry.date ? new Date(entry.date) : new Date();

            if (quickFilter === 'mes') {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(today.getMonth() - 1);
                return entryDate >= oneMonthAgo && entryDate <= today;
            }

            if (quickFilter === 'ano') {
                return entryDate.getFullYear() === today.getFullYear();
            }

            if (filterMonth) {
                const [yearStr, monthStr] = filterMonth.split('-');
                const year = parseInt(yearStr);
                const month = parseInt(monthStr);
                return entryDate.getFullYear() === year && (entryDate.getMonth() + 1) === month;
            }

            return true;
        });
    }, [filterMonth, quickFilter, dynamicData]);

    // Group data by Day-Hour for the grid
    const gridData = useMemo(() => {
        const map = new Map<string, LogEntry[]>();
        filteredData.forEach(entry => {
            const key = `${entry.day}-${entry.hour}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(entry);
        });
        return map;
    }, [filteredData]);

    // Determine cell color
    const getCellColor = (entries: LogEntry[] | undefined, day: string, hour: string) => {
        if (!entries || entries.length === 0) return 'bg-white/5 border-white/10'; // empty

        const cellKey = `${day}-${hour}`;
        if (transmutingCellKey === cellKey) {
            // Brilho Dourado de Transmutação Instantânea
            return 'bg-gradient-to-tr from-[#D4AF37] to-[#F7E7CE] border-white shadow-[0_0_30px_rgba(212,175,55,0.8)] animate-pulse';
        }

        const luzCount = entries.filter(e => e.type === 'Luz').length;
        const sombraCount = entries.filter(e => e.type === 'Sombra').length;
        const hasReframed = entries.some(e => e.isReframed);

        const totalEntries = luzCount + sombraCount;

        if (hasReframed) {
            // Integration (Violet with Golden Glow)
            return 'bg-gradient-to-tr from-[#5F4B8B]/80 to-[#D4AF37]/40 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.4)]';
        }

        if (luzCount > 0 && sombraCount > 0) {
            // Mixed / Translucent Integration
            // Blend #F7E7CE (Champagne) with #5F4B8B (Ultra Violet)
            const luzRatio = luzCount / totalEntries;
            const sombraRatio = sombraCount / totalEntries;
            if (luzRatio > sombraRatio) {
                // More Light
                return 'bg-gradient-to-tr from-[#5F4B8B]/40 to-[#F7E7CE]/80 border-[#F7E7CE]/40';
            } else if (sombraRatio > luzRatio) {
                // More Shadow
                return 'bg-gradient-to-tr from-[#5F4B8B]/80 to-[#F7E7CE]/40 border-[#5F4B8B]/60';
            } else {
                // Perfect Balance
                return 'bg-gradient-to-tr from-[#5F4B8B]/60 to-[#F7E7CE]/60 border-white/30';
            }
        } else if (luzCount > 0) {
            // Pure Light
            return entries.length > 1 ? 'bg-[#F7E7CE] border-[#F7E7CE]/40' : 'bg-[#F7E7CE]/60 border-[#F7E7CE]/20';
        } else {
            // Pure Shadow (Deep Violet)
            return entries.length > 1 ? 'bg-[#5F4B8B] border-[#5F4B8B]/40' : 'bg-[#5F4B8B]/60 border-[#5F4B8B]/20';
        }
    };

    const hasSOS = (entries: LogEntry[] | undefined) => {
        return entries?.some(e => e.sosTriggered);
    };

    // Dynamic Insights Logic
    const heartInsights = useMemo(() => {
        if (!filteredData || filteredData.length === 0) {
            return null;
        }

        let luzCount = 0;
        let sombraCount = 0;
        const periodCounts = new Map<string, number>();

        filteredData.forEach(entry => {
            if (entry.type === 'Luz') luzCount++;
            else if (entry.type === 'Sombra') sombraCount++;

            // Calculate Period
            const hourInt = parseInt(entry.hour.split(':')[0]);
            let period = 'noites';
            if (hourInt >= 6 && hourInt < 12) period = 'manhãs';
            else if (hourInt >= 12 && hourInt < 18) period = 'tardes';

            const dayMap: Record<string, string> = {
                'Dom': 'domingo',
                'Seg': 'segunda',
                'Ter': 'terça',
                'Qua': 'quarta',
                'Qui': 'quinta',
                'Sex': 'sexta',
                'Sáb': 'sábado'
            };
            const dayStr = dayMap[entry.day] || entry.day.toLowerCase();

            const periodKey = `${period} de ${dayStr}`;
            periodCounts.set(periodKey, (periodCounts.get(periodKey) || 0) + 1);
        });

        // Find max period
        let maxPeriod = 'tardes de segunda'; // fallback
        let maxCount = 0;
        periodCounts.forEach((count, period) => {
            if (count > maxCount) {
                maxCount = count;
                maxPeriod = period;
            }
        });

        // Determine Category
        let category: 'Luz' | 'Sombra' | 'Integracao' = 'Luz';

        if (luzCount === 0 && sombraCount === 0) {
            return null; // No data, hide insights
        }

        const diff = Math.abs(luzCount - sombraCount);
        if (diff <= 1 && (luzCount > 0 || sombraCount > 0)) {
            category = 'Integracao';
        } else if (luzCount > sombraCount) {
            category = 'Luz';
        } else {
            category = 'Sombra';
        }

        // Randomize phrase based on category
        let phrases = CELEBRACAO_PHRASES;
        let reflections = CELEBRACAO_REFLECTIONS;

        if (category === 'Sombra') {
            phrases = ACOLHIMENTO_PHRASES;
            reflections = ACOLHIMENTO_REFLECTIONS;
        } else if (category === 'Integracao') {
            phrases = INTEGRACAO_PHRASES;
            reflections = INTEGRACAO_REFLECTIONS;
        }

        // Keep random stable per render cycle by using count as a seeded pseudo-random
        const randomIndex = (luzCount + sombraCount) % phrases.length;

        // Attempt to extract name from localStorage or use 'Janaína'
        let userName = 'Janaína';
        try {
            const userPref = localStorage.getItem('portal_user_name') || localStorage.getItem('portal_user');
            if (userPref) {
                if (userPref.startsWith('{')) {
                    const parsed = JSON.parse(userPref);
                    if (parsed.name) userName = parsed.name;
                } else {
                    userName = userPref;
                }
            }
        } catch (e) { }/* ignore */

        const selectedPhrase = phrases[randomIndex]
            .replace('{periodo_dia}', maxPeriod)
            .replace('{nome}', userName);

        const reflectionPrompt = reflections[randomIndex];

        return {
            luzCount,
            sombraCount,
            category,
            densePeriod: maxPeriod,
            insightText: selectedPhrase,
            reflectionPrompt
        };
    }, [filteredData]);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center mt-12 mb-24 z-10 relative">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-light text-white tracking-wide luxury-text-glow mb-4">Espelho da <span className="text-[#F7E7CE] italic">Alma</span></h2>
                <p className="text-[#F7E7CE]/70 font-light">Mapeamento de suas frequências emocionais</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-10 w-full justify-center">

                {/* Visual Quick Filters */}
                <div className="flex gap-2">
                    <button
                        onClick={() => { setQuickFilter('mes'); setFilterMonth(null); }}
                        className={`px-6 py-2 rounded-full border transition-all duration-500 font-medium tracking-wide text-sm ${quickFilter === 'mes' ? 'bg-[#F7E7CE] border-[#F7E7CE] text-[#301934] shadow-[0_0_15px_rgba(247,231,206,0.3)]' : 'border-white/20 text-white/70 hover:border-[#F7E7CE]/40 glass-panel'}`}
                    >
                        Últimos 30 dias
                    </button>
                    <button
                        onClick={() => { setQuickFilter('ano'); setFilterMonth(null); }}
                        className={`px-6 py-2 rounded-full border transition-all duration-500 font-medium tracking-wide text-sm ${quickFilter === 'ano' ? 'bg-[#F7E7CE] border-[#F7E7CE] text-[#301934] shadow-[0_0_15px_rgba(247,231,206,0.3)]' : 'border-white/20 text-white/70 hover:border-[#F7E7CE]/40 glass-panel'}`}
                    >
                        Este Ano
                    </button>
                </div>

                {/* Hourglass Month Picker */}
                <div className={`flex items-center gap-3 rounded-full p-2 pl-6 pr-4 border transition-all shadow-2xl group relative ${!quickFilter && filterMonth ? 'bg-[#301934]/60 border-[#F7E7CE] shadow-[0_0_15px_rgba(247,231,206,0.2)]' : 'bg-[#301934]/40 border-[#F7E7CE]/20 hover:border-[#F7E7CE]/40'}`}>
                    <Hourglass className={`w-5 h-5 ${!quickFilter && filterMonth ? 'text-[#F7E7CE] animate-[pulse_3s_ease-in-out_infinite]' : 'text-[#F7E7CE]/70'}`} />
                    <input
                        type="month"
                        value={filterMonth || ''}
                        onChange={(e) => { setFilterMonth(e.target.value); setQuickFilter(null); }}
                        className="bg-transparent text-[#F7E7CE] font-serif tracking-widest uppercase outline-none cursor-pointer custom-month-input p-2 w-full md:w-auto"
                    />
                </div>

            </div>

            {/* Heatmap Container */}
            <div key={filterMonth || quickFilter} className="glass-panel p-6 md:p-10 w-full relative overflow-hidden group/heatmap animate-[fadeIn_0.5s_ease-out]">

                {/* Reflexos da Jornada Particles */}
                {init && (
                    <Particles
                        id="tsparticles-heatmap"
                        className="absolute inset-0 z-0 transition-opacity duration-1000 opacity-0 group-hover/heatmap:opacity-100 mix-blend-screen"
                        options={{
                            fullScreen: { enable: false },
                            fpsLimit: 60,
                            particles: {
                                color: { value: "#F7E7CE" },
                                links: { enable: false },
                                move: {
                                    enable: true,
                                    speed: 0.5,
                                    direction: "none",
                                    random: true,
                                    straight: false,
                                    outModes: { default: "bounce" }
                                },
                                number: {
                                    density: { enable: false },
                                    value: 30
                                },
                                opacity: {
                                    value: { min: 0.3, max: 0.6 }
                                },
                                shape: { type: "circle" },
                                size: {
                                    value: { min: 1, max: 3 }
                                },
                                shadow: {
                                    enable: true,
                                    color: "#F7E7CE",
                                    blur: 8
                                }
                            },
                            interactivity: {
                                detectsOn: "window",
                                events: {
                                    onHover: {
                                        enable: true,
                                        mode: ["grab", "slow"],
                                    }
                                },
                                modes: {
                                    grab: {
                                        distance: 120,
                                        links: {
                                            opacity: 0.4,
                                            color: "#F7E7CE"
                                        }
                                    },
                                    slow: {
                                        factor: 3,
                                        radius: 150
                                    }
                                }
                            },
                            detectRetina: true,
                        }}
                    />
                )}

                {/* Grid Header (Days) */}
                <div className="flex mb-4 relative z-10 pointer-events-none">
                    <div className="w-16"></div> {/* Offset for time labels */}
                    <div className="flex-1 grid grid-cols-7 gap-2">
                        {DAYS.map(day => (
                            <div key={day} translate="no" className="text-center text-xs font-semibold text-white/50 tracking-wider uppercase notranslate">{day}</div>
                        ))}
                    </div>
                </div>

                {/* Grid Body */}
                <div className="flex flex-col gap-2 relative z-10">
                    {HOURS.map(hour => (
                        <div key={hour} className="flex relative items-center">
                            <div className="w-16 text-xs text-white/40 font-mono text-right pr-4">{hour}</div>
                            <div className="flex-1 grid grid-cols-7 gap-2">
                                {DAYS.map(day => {
                                    const entries = gridData.get(`${day}-${hour}`);
                                    return (
                                        <div
                                            key={`${day}-${hour}`}
                                            onClick={() => entries && entries.length > 0 && setSelectedCell({ day, hour, entries })}
                                            className={`h-12 md:h-16 rounded-lg border transition-all duration-300 relative ${entries && entries.length > 0 ? 'cursor-pointer' : 'cursor-default'} group ${getCellColor(entries, day, hour)}`}
                                        >
                                            {/* Interaction glow */}
                                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-lg transition-colors"></div>

                                            {/* SOS Indicator */}
                                            {hasSOS(entries) && (
                                                <div className="absolute top-1 right-1 z-20">
                                                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
                                                </div>
                                            )}

                                            {/* We rely on onClick to open Side Drawer instead of complex hover tooltips here */}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60 relative z-10">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#F7E7CE]"></div>Luz Intensa (Calor)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#3b82f6]"></div>Sombras Profundas (Frio)</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>SOS Acionado</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10"></div>Sem Registro</div>
                </div>
            </div>

            {/* Insights do Coração */}
            {heartInsights && (
                <div className="w-full mt-10 z-10 relative">
                    <div className={`flex flex-col md:flex-row items-start gap-6 glass-panel p-6 md:p-8 transition-all duration-1000 border ${heartInsights.category === 'Luz'
                        ? 'bg-gradient-to-br from-[#F7E7CE]/5 to-[#F7E7CE]/10 border-[#F7E7CE]/30 shadow-[0_0_40px_rgba(247,231,206,0.15)]'
                        : heartInsights.category === 'Sombra'
                            ? 'bg-gradient-to-br from-[#5F4B8B]/10 to-[#301934]/40 border-[#a78bfa]/30 shadow-[0_0_40px_rgba(167,139,250,0.15)]'
                            : 'bg-gradient-to-br from-[#5F4B8B]/20 to-[#F7E7CE]/10 border-[#F7E7CE]/20 shadow-lg'
                        }`}>
                        <div className={`p-4 rounded-full shrink-0 mt-1 transition-colors duration-1000 ${heartInsights.category === 'Luz'
                            ? 'bg-[#f7e7ce]/20 text-[#F7E7CE]'
                            : heartInsights.category === 'Sombra'
                                ? 'bg-[#a78bfa]/20 text-[#a78bfa]'
                                : 'bg-white/10 text-white'
                            }`}>
                            <Info className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 w-full">
                            <h3 className="text-xl font-medium text-white mb-3 font-serif tracking-wide flex items-center gap-2">
                                Vozes do Portal
                                {heartInsights.category === 'Integracao' && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70 font-sans tracking-widest uppercase">Integração</span>}
                            </h3>
                            <p className="text-white/90 leading-relaxed font-light text-base md:text-lg opacity-90">
                                {heartInsights.insightText}
                            </p>

                            {/* Aprofundar Button */}
                            <div className="mt-6">
                                {!showReflection ? (
                                    <button
                                        onClick={() => setShowReflection(true)}
                                        className="text-sm font-medium px-5 py-2 rounded-full border border-[#F7E7CE]/30 text-[#F7E7CE] hover:bg-[#F7E7CE]/10 transition-colors uppercase tracking-widest"
                                    >
                                        Quero refletir sobre isso
                                    </button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        className="bg-black/20 border border-white/10 rounded-xl p-5"
                                    >
                                        <p className="text-[#F7E7CE] font-serif italic text-lg opacity-90">
                                            "{heartInsights.reflectionPrompt}"
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Painel de Detalhes da Alma (Side Drawer) */}
            <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-[#301934]/95 backdrop-blur-2xl border-l border-[#F7E7CE]/30 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[100] transform transition-transform duration-500 ease-in-out ${selectedCell ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedCell && (
                    <div className="p-8 h-full flex flex-col overflow-y-auto">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#F7E7CE]/20">
                            <div>
                                <h3 className="text-xl font-light text-[#F7E7CE] font-serif tracking-widest uppercase">Detalhes da Alma</h3>
                                <p translate="no" className="text-sm text-white/50 font-mono mt-1 notranslate">{selectedCell.day}, {selectedCell.hour}</p>
                            </div>
                            <button onClick={() => setSelectedCell(null)} className="p-2 text-[#F7E7CE]/60 hover:text-[#F7E7CE] hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col gap-6">
                            {/* Luz Entries Info */}
                            {selectedCell.entries.filter(e => e.type === 'Luz').length > 0 && (
                                <div className="bg-[#F7E7CE]/10 border border-[#F7E7CE]/30 rounded-xl p-5 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#F7E7CE]/20 flex items-center justify-center">
                                            <Sun className="w-4 h-4 text-[#F7E7CE]" />
                                        </div>
                                        <span className="text-[#F7E7CE] font-medium tracking-wide">
                                            ✨ {selectedCell.entries.filter(e => e.type === 'Luz').length} Registro(s) de Luz
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-11">
                                        {Array.from(new Set(selectedCell.entries.filter(e => e.type === 'Luz').flatMap(e => e.themes))).map((t, idx) => (
                                            <span key={idx} className="text-xs bg-[#F7E7CE]/20 text-[#F7E7CE] px-2.5 py-1 rounded-full">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sombras Entries Info */}
                            {selectedCell.entries.filter(e => e.type === 'Sombra').length > 0 && (
                                <div className="bg-[#5F4B8B]/20 border border-[#5F4B8B]/50 rounded-xl p-5 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#5F4B8B]/40 flex items-center justify-center">
                                            <Moon className="w-4 h-4 text-[#a78bfa]" />
                                        </div>
                                        <span className="text-[#a78bfa] font-medium tracking-wide">
                                            🌑 {selectedCell.entries.filter(e => e.type === 'Sombra').length} Registro(s) de Sombra
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-11">
                                        {Array.from(new Set(selectedCell.entries.filter(e => e.type === 'Sombra').flatMap(e => e.themes))).map((t, idx) => (
                                            <span key={idx} className="text-xs bg-[#5F4B8B]/40 text-[#a78bfa] px-2.5 py-1 rounded-full">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SOS Entries Info */}
                            {selectedCell.entries.some(e => e.sosTriggered) && (
                                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <AlertTriangle className="w-4 h-4 text-red-400" />
                                        </div>
                                        <span className="text-red-400 font-medium tracking-wide">
                                            🔴 Pausa de Emergência
                                        </span>
                                    </div>
                                    <p className="text-sm font-light text-red-200/80 leading-relaxed pl-11">
                                        Este registro indica que você escolheu respirar quando o mundo pareceu pesado demais. Honre este respiro, você sobreviveu 100% dos seus dias ruins até agora.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer / Ver Diário Completo Button */}
                        {selectedCell.entries.some(e => e.content) && (
                            <div className="mt-8 pt-6 border-t border-[#F7E7CE]/20 flex justify-center">
                                <button
                                    onClick={() => setViewingLogs(selectedCell.entries.filter(e => e.content))}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#F7E7CE]/30 text-[#F7E7CE] hover:bg-[#F7E7CE]/10 transition-colors bg-[#301934]/50 backdrop-blur-md shadow-lg group"
                                >
                                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm tracking-widest uppercase font-medium">Ver Diário Completo</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Leitura (Ver Diário Completo) */}
            <AnimatePresence>
                {viewingLogs && (
                    <motion.div
                        initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
                        animate={{ backdropFilter: "blur(40px)", backgroundColor: "rgba(0,0,0,0.7)" }}
                        exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
                        transition={{ duration: 1.5, ease: "anticipate" }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
                            className="w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-[#301934] to-[#1a0f1c] rounded-3xl border border-[#F7E7CE]/30 relative overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Papel/Seda Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-mamba.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>

                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-[#F7E7CE]/10 relative z-10 shrink-0">
                                <h3 className="text-[#F7E7CE] font-serif tracking-widest uppercase text-lg">Suas Memórias</h3>
                                <button
                                    onClick={() => {
                                        setViewingLogs(null);
                                        setEditingLog(null);
                                    }}
                                    className="text-[#F7E7CE]/60 hover:text-[#F7E7CE] transition-colors p-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content / Entries */}
                            <div className="p-6 md:p-10 overflow-y-auto relative z-10 flex-1 space-y-10 custom-scrollbar">
                                {viewingLogs.map((log, idx) => (
                                    <div key={idx} className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            {log.type === 'Luz' ? (
                                                <Sun className="w-5 h-5 text-[#F7E7CE]" />
                                            ) : (
                                                <Moon className="w-5 h-5 text-[#a78bfa]" />
                                            )}
                                            <h4 className={`text-xl font-light font-serif ${log.type === 'Luz' ? 'text-[#F7E7CE]' : 'text-[#a78bfa]'}`}>
                                                {log.type === 'Luz' ? 'Memória de Luz' : 'Memória de Sombra'}
                                            </h4>
                                            <div className="h-px flex-1 bg-gradient-to-r from-[#F7E7CE]/20 to-transparent ml-4"></div>
                                        </div>

                                        <div translate="no" className="text-sm font-mono text-white/40 tracking-wider notranslate">
                                            {log.day}, {log.hour}
                                        </div>

                                        <div className={`text-[#F7E7CE] font-light leading-relaxed whitespace-pre-wrap text-base md:text-lg transition-all ${editingLog === log ? 'opacity-30' : 'opacity-90'}`}>
                                            {log.content}
                                        </div>

                                        {log.type === 'Sombra' && !log.isReframed && editingLog !== log && (
                                            <button onClick={() => handleStartReframe(log)} className="mt-2 px-5 py-2 border border-[#a78bfa]/50 text-[#a78bfa] hover:bg-[#a78bfa]/10 rounded-full text-xs uppercase tracking-widest transition-colors self-start">
                                                Editar / Ressignificar
                                            </button>
                                        )}

                                        {log.isReframed && editingLog !== log && (
                                            <div className="mt-2 flex items-center gap-2 text-[#D4AF37]">
                                                <Sparkles className="w-4 h-4 animate-pulse" />
                                                <span className="text-xs uppercase tracking-widest font-medium">Memória Ressignificada</span>
                                            </div>
                                        )}

                                        {editingLog === log && (
                                            <div className="mt-4 border border-[#F7E7CE]/20 bg-black/40 p-6 rounded-2xl relative overflow-hidden">
                                                {/* Particles Effect Layer when Transmuting */}
                                                {isTransmuting && (
                                                    <div className="absolute inset-0 bg-gradient-to-b from-[#301934]/90 to-black z-10 flex items-center justify-center flex-col overflow-hidden">
                                                        <Sparkles className="w-10 h-10 text-[#D4AF37] animate-ping mb-4" />
                                                        <p className="text-[#D4AF37] font-serif italic text-lg animate-pulse tracking-wide">Transmutando Frequência...</p>
                                                        {/* CSS Particles moving down simulated with animated dashed gradient */}
                                                        <div className="absolute inset-0 bg-[radial-gradient(circle,_#D4AF37_1px,_transparent_1px)] bg-[length:20px_20px] opacity-20 animate-[moveDown_1s_linear_infinite]" />
                                                    </div>
                                                )}

                                                <h5 className="text-[#D4AF37] font-serif italic mb-3 text-lg">"{activeQuestion}"</h5>
                                                <textarea
                                                    value={reframedText}
                                                    onChange={(e) => setReframedText(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[#F7E7CE] min-h-[140px] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 font-light resize-none transition-colors"
                                                    placeholder="Eu escolho a realidade onde..."
                                                />
                                                <div className="flex gap-4 mt-4 justify-end">
                                                    <button onClick={() => setEditingLog(null)} className="px-4 py-2 text-white/50 hover:text-white transition-colors text-sm uppercase tracking-wide">Cancelar</button>
                                                    <button onClick={handleSaveReframe} disabled={isTransmuting} className="px-6 py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/30 transition-colors text-sm uppercase tracking-widest font-medium flex items-center gap-2 disabled:opacity-50">
                                                        <Sparkles className="w-4 h-4" /> Salvar Luz
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Modal Footer / Navigation */}
                            <div className="p-6 border-t border-[#F7E7CE]/10 relative z-10 shrink-0 flex justify-center bg-[#301934]/50">
                                <button
                                    onClick={() => setViewingLogs(null)}
                                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#F7E7CE]/5 border border-[#F7E7CE]/20 text-[#F7E7CE] hover:bg-[#F7E7CE]/10 hover:border-[#F7E7CE]/40 transition-all font-medium tracking-wide"
                                >
                                    Voltar ao Espelho
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Achievement Notification: A Trama da Mudança */}
            <AnimatePresence>
                {showAchievement && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-gradient-to-r from-[#D4AF37]/20 to-[#301934]/90 border border-[#D4AF37]/50 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(212,175,55,0.3)] flex items-center gap-4 max-w-lg w-[calc(100%-2rem)]"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h4 className="text-[#D4AF37] font-serif italic text-lg mb-0.5">{userName}, você acaba de reescrever um fragmento da sua história.</h4>
                            <p className="text-[#F7E7CE]/80 font-light text-sm">A Trama da Mudança agora brilha em seu tesouro.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
