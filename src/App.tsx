import { useState, useEffect } from 'react';
import { Feather, Sparkles, Map, ChevronLeft, Activity } from 'lucide-react';
import SOSButton from './components/SOSButton';
import EspelhoDaAlma from './components/EspelhoDaAlma';
import MeuTesouroParticular from './components/MeuTesouroParticular';
import OasisEstelar from './components/OasisEstelar';
import DiarioDeSombras from './components/DiarioDeSombras';
import DiarioDeLuz from './components/DiarioDeLuz';
import AcessoEscrita from './components/AcessoEscrita';
import StarDustCursor from './components/StarDustCursor';
import TopNav from './components/TopNav';
import WelcomeTour, { getTourSteps } from './components/WelcomeTour';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'espelho' | 'tesouro' | 'oasis' | 'escrita' | 'sombras' | 'luz'>('home');
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(1);
  const [isSolarMode, setIsSolarMode] = useState(false);

  useEffect(() => {
    // Check Solar Mode persistence (24h)
    const solarActiveUntil = localStorage.getItem('portal_solar_mode_until');
    if (solarActiveUntil && parseInt(solarActiveUntil) > Date.now()) {
      setIsSolarMode(true);
      document.body.classList.add('solar-mode');
    }

    const handleSolarActivation = () => {
      setIsSolarMode(true);
      document.body.classList.add('solar-mode');
    };

    window.addEventListener('portal:solar_mode_activated', handleSolarActivation);
    return () => window.removeEventListener('portal:solar_mode_activated', handleSolarActivation);
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('portal_tour_completed');
    if (!hasSeenTour) {
      setIsTourActive(true);
    }
  }, []);

  // Fetch user name to dynamically count steps
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

  const [stardustColor, setStardustColor] = useState<string | undefined>(undefined);
  const [isFocusing, setIsFocusing] = useState(false);
  const [attractId, setAttractId] = useState<string | undefined>(undefined);
  const tourSteps = getTourSteps(userName);

  const handleTourNext = () => {
    if (currentTourStep >= tourSteps.length) {
      setIsTourActive(false);
      localStorage.setItem('portal_tour_completed', 'true');
      localStorage.setItem('portal_ametista_unlocked', 'true');
      setCurrentView('home');
      return;
    }
    const nextStep = currentTourStep + 1;
    setCurrentTourStep(nextStep);

    // Unlock ametista when reaching step 6 (after step 5)
    if (nextStep === 6) {
      localStorage.setItem('portal_ametista_unlocked', 'true');
    }

    const targetView = tourSteps[nextStep - 1].targetView;
    if (targetView) {
      setCurrentView(targetView as any);
    }
  };

  const handleTourPrev = () => {
    if (currentTourStep <= 1) return;

    const prevStep = currentTourStep - 1;
    setCurrentTourStep(prevStep);

    const targetView = tourSteps[prevStep - 1].targetView;
    if (targetView) {
      setCurrentView(targetView as any);
    }
  };

  const handleTourClose = () => {
    setIsTourActive(false);
    localStorage.setItem('portal_tour_completed', 'true');
    setCurrentView('home');
  };

  const startTourManually = () => {
    setCurrentTourStep(1);
    setIsTourActive(true);
    setCurrentView('home');
    localStorage.removeItem('portal_tour_completed'); // optional, but good practice
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 selection:bg-[#F7E7CE]/30 selection:text-white ${isTourActive ? `is-tour-step-${currentTourStep}` : ''}`} data-solar-mode={isSolarMode}>

      {/* Global Elements */}
      {!isTourActive && <TopNav currentView={currentView} setCurrentView={setCurrentView} />}
      <StarDustCursor particleColor={stardustColor} attractTargetId={attractId} />
      <div className="absolute bottom-4 left-4 text-white/20 text-xs font-mono">v1.3.0 - Neural Engine</div>

      {currentView !== 'home' && currentView !== 'oasis' && currentView !== 'sombras' && currentView !== 'luz' && currentView !== 'escrita' && (
        <button
          onClick={() => setCurrentView('home')}
          className="absolute top-8 left-8 flex items-center gap-2 text-[#F7E7CE]/70 hover:text-[#F7E7CE] transition-colors z-50 group glass-panel px-4 py-2"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-wide">Voltar</span>
        </button>
      )}

      {/* Central Content */}
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center text-center z-10 relative mt-10 sm:mt-0">

        {currentView === 'home' ? (
          <>
            <StarDustCursor particleColor={stardustColor} isHighIntensity={isFocusing} attractTargetId={attractId} />
            {/* Decorative subtle element above title */}
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#F7E7CE]/50 to-transparent mb-8"></div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-16 px-4 luxury-text-glow leading-tight">
              Para o que você se dá permissão <span className="text-[#F7E7CE] font-normal italic">hoje?</span>
            </h1>

            {/* Navigation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4 max-w-4xl mx-auto">

              {/* Card 1: Meu Espaço de Escrita (AcessoEscrita Gateway) */}
              <button
                onClick={() => setCurrentView('escrita')}
                onMouseEnter={() => { setStardustColor('#D4AF37'); setIsFocusing(true); }}
                onMouseLeave={() => { setStardustColor(undefined); setIsFocusing(false); }}
                className="group glass-panel p-8 flex flex-col items-center justify-center text-center hover-seda h-64 relative overflow-hidden w-full"
              >
                {/* Soft highlight effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="bg-white/5 p-4 rounded-full mb-6 border border-white/10 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/10 transition-colors duration-500">
                  <Feather className="w-8 h-8 text-[#F7E7CE] group-hover:scale-110 transition-transform duration-500 group-hover:text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white mb-2 tracking-wide">Meu Espaço de Escrita</h3>
                <p className="text-sm text-[#F7E7CE]/70 font-light px-2 mt-auto">Diários de luz e sombras</p>
              </button>

              {/* Card 2: Oásis Estelar */}
              <button
                onClick={() => setCurrentView('oasis')}
                onMouseEnter={() => { setStardustColor('#D4AF37'); setIsFocusing(true); setAttractId('logo-particle'); }}
                onMouseLeave={() => { setStardustColor(undefined); setIsFocusing(false); setAttractId(undefined); }}
                className="group glass-panel p-8 flex flex-col items-center justify-center text-center hover-seda h-64 relative overflow-hidden w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="bg-white/5 p-4 rounded-full mb-6 border border-white/10 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/10 transition-colors duration-500">
                  <Sparkles className="w-8 h-8 text-[#F7E7CE] group-hover:scale-110 transition-transform duration-500 group-hover:text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white mb-2 tracking-wide">Oásis Estelar</h3>
                <p className="text-sm text-[#F7E7CE]/70 font-light px-2 mt-auto">Relaxamento sensorial profundo</p>
              </button>

              {/* Card 3: Meu Tesouro Particular (Substituindo Minha Jornada para navegação local) */}
              <button
                onClick={() => setCurrentView('tesouro')}
                onMouseEnter={() => { setStardustColor('#D4AF37'); setIsFocusing(true); }}
                onMouseLeave={() => { setStardustColor(undefined); setIsFocusing(false); }}
                className="group glass-panel p-8 flex flex-col items-center justify-center text-center hover-seda h-64 relative overflow-hidden w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="bg-white/5 p-4 rounded-full mb-6 border border-white/10 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/10 transition-colors duration-500">
                  <Map className="w-8 h-8 text-[#F7E7CE] group-hover:scale-110 transition-transform duration-500 group-hover:text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white mb-2 tracking-wide">Meu Tesouro</h3>
                <p className="text-sm text-[#F7E7CE]/70 font-light px-2 mt-auto">Relembre suas virtudes</p>
              </button>

              {/* Card 4: Espelho da Alma */}
              <button
                onClick={() => setCurrentView('espelho')}
                onMouseEnter={() => { setStardustColor('#D4AF37'); setIsFocusing(true); }}
                onMouseLeave={() => { setStardustColor(undefined); setIsFocusing(false); }}
                className="group glass-panel p-8 flex flex-col items-center justify-center text-center hover-seda h-64 relative overflow-hidden w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="bg-white/5 p-4 rounded-full mb-6 border border-white/10 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/10 transition-colors duration-500">
                  <Activity className="w-8 h-8 text-[#F7E7CE] group-hover:scale-110 transition-transform duration-500 group-hover:text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white mb-2 tracking-wide">Espelho da Alma</h3>
                <p className="text-sm text-[#F7E7CE]/70 font-light px-2 mt-auto">Mapeie suas frequências</p>
              </button>

            </div>
          </>
        ) : currentView === 'espelho' ? (
          <EspelhoDaAlma />
        ) : currentView === 'tesouro' ? (
          <MeuTesouroParticular />
        ) : currentView === 'oasis' ? (
          <OasisEstelar onBack={() => setCurrentView('home')} />
        ) : currentView === 'escrita' ? (
          <AcessoEscrita onBack={() => setCurrentView('home')} onSuccess={() => setCurrentView('espelho')} />
        ) : currentView === 'sombras' ? (
          <DiarioDeSombras onBack={() => setCurrentView('escrita')} onSuccess={() => setCurrentView('espelho')} />
        ) : (
          <DiarioDeLuz onBack={() => setCurrentView('escrita')} onSuccess={() => setCurrentView('espelho')} />
        )}
      </main>

      {/* Footer / Bottom minimalist decor */}
      {currentView !== 'oasis' && currentView !== 'sombras' && currentView !== 'luz' && currentView !== 'escrita' && (
        <footer className="mt-auto pt-16 pb-4 w-full flex flex-col items-center gap-3 z-10 relative">
          <p className="text-xs text-white/40 tracking-widest uppercase font-light pointer-events-none">
            Portal da Permissão
          </p>
          <button
            onClick={startTourManually}
            className="text-xs text-[#F7E7CE]/40 hover:text-[#F7E7CE] transition-colors tracking-wide"
          >
            Iniciar Tour de Boas-Vindas
          </button>
        </footer>
      )}

      {currentView !== 'oasis' && <SOSButton />}

      {isTourActive && (
        <WelcomeTour
          currentStep={currentTourStep}
          onNext={handleTourNext}
          onPrev={handleTourPrev}
          onClose={handleTourClose}
        />
      )}
    </div>
  );
}

export default App;
