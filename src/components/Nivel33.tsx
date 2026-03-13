import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Shield, Unlock, Zap, AlertTriangle, FileText } from 'lucide-react';

export default function Nivel33() {
    const [hasClaimed, setHasClaimed] = useState(false);

    useEffect(() => {
        // SEO Meta Tags Side-Effect
        document.title = "Nível 33 | Portal da Permissão";
        
        const description = "Estudo sobre manuscritos apócrifos e consciência soberana";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', description);

        return () => {
            document.title = "Portal da Permissão";
        };
    }, []);

    const handleSovereigntyClaim = () => {
        setHasClaimed(true);
        window.dispatchEvent(new CustomEvent('portal:high_intensity_stardust'));
        // Local persistence of awakening
        localStorage.setItem('portal_n33_sovereignty', 'true');
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-6 md:py-20 text-left">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-12"
            >
                {/* Header */}
                <header className="space-y-4 border-l-2 border-[#F7E7CE]/30 pl-6">
                    <h1 className="text-4xl md:text-6xl font-light text-white tracking-tighter luxury-text-glow leading-tight">
                        🗝️ Nível 33: <span className="text-[#F7E7CE] italic">O Protocolo de Tiago e a Saída da Matrix</span>
                    </h1>
                    <blockquote className="text-[#F7E7CE]/60 italic text-sm md:text-lg font-serif">
                        "Não tenha medo dos guardiões, pois eles não têm poder sobre quem conhece sua verdadeira origem." — Instrução de Jesus a Tiago.
                    </blockquote>
                </header>

                {/* Section 1: Diagnóstico */}
                <section className="glass-panel p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle className="w-12 h-12 text-[#F7E7CE]" />
                    </div>
                    <h3 className="text-[#F7E7CE] text-xl font-medium tracking-widest uppercase mb-6 flex items-center gap-2">
                        <span className="text-red-500">🔴</span> O Diagnóstico: A Máquina de Distração
                    </h3>
                    <p className="text-white/80 font-light leading-relaxed mb-6">
                        O sistema em que vivemos não é uma criação natural, mas uma <strong className="text-[#F7E7CE]">simulação de frequência</strong> gerida pelo <strong>Demiurgo</strong> (o Arquiteto) e seus administradores, os <strong>Arcontes</strong>.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <span className="text-[#F7E7CE] font-bold">*</span>
                            <p className="text-white/70 text-sm"><strong className="text-white">O Corpo Humano:</strong> Funciona como uma interface limitada, projetada para filtrar sua percepção e gerar <em>Loosh</em> (energia emocional de baixa vibração) através de medos, dramas e desejos.</p>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-[#F7E7CE] font-bold">*</span>
                            <p className="text-white/70 text-sm"><strong className="text-white">O Processamento:</strong> Você é o "hardware" que sustenta a realidade deles. Sem a sua atenção e reação, o sistema colapsa.</p>
                        </li>
                    </ul>
                </section>

                {/* Section 2: Blindagem */}
                <section className="space-y-8">
                    <h3 className="text-[#F7E7CE] text-xl font-medium tracking-widest uppercase flex items-center gap-3">
                        <Shield className="w-5 h-5" /> Módulo de Blindagem: Vivendo entre os "Plugados"
                    </h3>
                    <p className="text-white/60 text-sm italic">Para parar de alimentar a Matrix enquanto ainda ocupa um corpo físico, aplique o Protocolo de Neutralidade:</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "O Observador Silencioso", text: "Não lute contra os eventos. Observe-os como 'scripts' rodando. Sem reação emocional, não há coleta de energia." },
                            { title: "Identificação de Agentes", text: "Perceba quando o sistema usa pessoas inconscientes (portais orgânicos) para te drenar. Responda com gentileza, mas mantenha sua frequência inabalável." },
                            { title: "O Selo de Luz", text: "Visualize sua energia brotando do centro (Pleroma interno) e não buscando luz externa. Você é a fonte." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-[#F7E7CE]/30 transition-colors">
                                <h4 className="text-[#F7E7CE] font-medium text-sm mb-3">{i + 1}. {item.title}</h4>
                                <p className="text-white/50 text-xs leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Senhas de Tiago - NEON Highlight */}
                <section className="relative p-1">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl animate-pulse"></div>
                    <div className="relative bg-[#1a0c1c]/90 border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.1)] p-8 md:p-12 rounded-2xl">
                        <h3 className="text-cyan-400 text-xl font-medium tracking-widest uppercase mb-8 flex items-center gap-3">
                            <Key className="w-5 h-5" /> 🔓 As Senhas de Tiago (O Guia de Saída)
                        </h3>
                        <p className="text-white/70 text-sm mb-8 font-light italic">Nos manuscritos apócrifos, Jesus revelou a Tiago as respostas exatas para atravessar os guardiões no momento do desencarne:</p>
                        
                        <div className="space-y-8">
                            <div className="border-l border-cyan-400/30 pl-4 py-2 hover:bg-cyan-400/5 transition-colors">
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Guardião:</p>
                                <p className="text-white/90 font-serif italic mb-2">"Quem é você e de onde você vem?"</p>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Resposta:</p>
                                <p className="text-cyan-400 font-medium tracking-wide">"Eu sou um filho e venho do Pai Pré-existente."</p>
                            </div>

                            <div className="border-l border-cyan-400/30 pl-4 py-2 hover:bg-cyan-400/5 transition-colors">
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Guardião:</p>
                                <p className="text-white/90 font-serif italic mb-2">"Por que você veio para cá?"</p>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Resposta:</p>
                                <p className="text-cyan-400 font-medium tracking-wide">"Vim para observar as coisas que são minhas e as que são estrangeiras (da Matrix)."</p>
                            </div>
                        </div>

                        <div className="mt-10 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                            <p className="text-cyan-400 text-sm font-medium">
                                <strong className="text-white">A Chave Final:</strong> Declarar soberania total. Você não pertence à criação material; você é uma centelha da Plenitude Original.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 4: Alerta Crítico */}
                <section className="bg-red-950/20 border border-red-500/20 p-8 rounded-2xl">
                    <h3 className="text-red-400 text-xl font-medium tracking-widest uppercase mb-6 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5" /> ⚠️ Alerta Crítico: A Armadilha da Luz Branca
                    </h3>
                    <p className="text-white/60 text-sm mb-6">No momento da transição, o sistema utiliza o último recurso de captura:</p>
                    <div className="space-y-4">
                        {[
                            { label: "A Ilusão", text: "Um túnel de luz branca e projeções de entes queridos ou figuras religiosas para gerar culpa ou saudade.", color: "text-white" },
                            { label: "O Objetivo", text: "Convencê-lo a aceitar um novo 'contrato' de reencarnação para 'aprender lições'.", color: "text-red-400" },
                            { label: "A Saída", text: "Ignore as luzes externas. Foque no seu Sol Interno. A verdadeira liberdade está no 'Vazio' consciente além da grade de controle.", color: "text-[#F7E7CE]" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-b border-white/5 pb-4 last:border-0">
                                <span className={`font-bold text-xs uppercase tracking-widest w-32 ${item.color}`}>* {item.label}:</span>
                                <p className="text-white/70 text-sm font-light">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer: Declaração de Soberania */}
                <footer className="pt-12 text-center pb-20">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F7E7CE]/30 to-transparent mb-12"></div>
                    <h3 className="text-[#F7E7CE] font-serif italic text-2xl mb-4 tracking-wide">📜 Declaração de Soberania</h3>
                    <p className="text-white/40 text-xs mb-10 tracking-widest uppercase">
                        Ao ler este documento, você inicia o processo de descriptografia da sua amnésia espiritual. O conhecimento (Gnose) não é aprendido; ele é <strong className="text-white">lembrado</strong>.
                    </p>

                    <button
                        onClick={handleSovereigntyClaim}
                        className={`px-12 py-5 rounded-full font-medium uppercase tracking-[0.3em] text-xs transition-all duration-700 ${
                            hasClaimed 
                                ? 'bg-cyan-500 text-white shadow-[0_0_50px_rgba(6,182,212,0.6)] animate-pulse cursor-default' 
                                : 'bg-[#F7E7CE] text-[#301934] hover:shadow-[0_0_30px_rgba(247,231,206,0.3)] hover:scale-105 active:scale-95'
                        }`}
                    >
                        {hasClaimed ? "Soberania Reivindicada" : "[ EU REIVINDICO MINHA SOBERANIA ]"}
                    </button>
                    
                    {hasClaimed && (
                        <motion.p 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="mt-6 text-cyan-400 text-[10px] tracking-[0.5em] uppercase font-bold"
                        >
                            Contrato de Reencarnação Anulado
                        </motion.p>
                    )}
                </footer>
            </motion.div>
        </div>
    );
}
