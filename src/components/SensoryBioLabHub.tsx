import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders,
  Activity,
  Droplets,
  Zap,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Layers,
  Eye,
  Microscope,
  Check,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface SensoryBioLabHubProps {
  products: Product[];
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const SensoryBioLabHub: React.FC<SensoryBioLabHubProps> = ({
  products,
  onAddToCart,
  onOpenProductDetail,
}) => {
  // Formulation Switcher
  const [activeFormula, setActiveFormula] = useState<'cleanser' | 'moisturizer' | 'sunscreen'>('moisturizer');
  
  // Theme Mode: Dark Laboratory (Default) vs Frosted Cleanroom
  const [labTheme, setLabTheme] = useState<'dark' | 'light'>('dark');

  // Micro-Interactive Sliders State
  const [viscositySlider, setViscositySlider] = useState<number>(75); // 0 to 100
  const [penetrationSpeed, setPenetrationSpeed] = useState<number>(85); // 0 to 100
  const [tewlLevel, setTewlLevel] = useState<number>(18); // g/m²/h (Lower is better)
  const [barrierIntegrity, setBarrierIntegrity] = useState<number>(94); // %

  // Diagnostic View: 'barrier-matrix' | 'active-penetration' | 'molecular-map'
  const [diagnosticTab, setDiagnosticTab] = useState<'barrier-matrix' | 'active-penetration'>('barrier-matrix');
  const [barrierState, setBarrierState] = useState<'restored' | 'compromised'>('restored');
  const [selectedMolecule, setSelectedMolecule] = useState<string>('ceramide');

  // Interaction feedback
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Active product mapping
  const currentProduct = products.find(p => {
    if (activeFormula === 'cleanser') return p.slug.includes('cleanser') || p.id.includes('cleanser');
    if (activeFormula === 'moisturizer') return p.slug.includes('moisturizer') || p.id.includes('moisturizer');
    return p.slug.includes('sunscreen') || p.id.includes('sunscreen');
  }) || products[0];

  // Update parameters when formulation changes
  useEffect(() => {
    if (activeFormula === 'cleanser') {
      setViscositySlider(35);
      setPenetrationSpeed(95);
      setTewlLevel(12);
      setBarrierIntegrity(90);
    } else if (activeFormula === 'moisturizer') {
      setViscositySlider(75);
      setPenetrationSpeed(80);
      setTewlLevel(6);
      setBarrierIntegrity(98);
    } else {
      setViscositySlider(25);
      setPenetrationSpeed(90);
      setTewlLevel(8);
      setBarrierIntegrity(94);
    }
  }, [activeFormula]);

  const handleSimulatePulse = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1200);
  };

  const handleAddCurrent = () => {
    if (currentProduct) {
      onAddToCart(currentProduct, currentProduct.variants[0], 1);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2200);
    }
  };

  const isDark = labTheme === 'dark';

  return (
    <section
      id="interactive-biolab-hub"
      className={`py-24 px-4 sm:px-8 transition-colors duration-500 relative overflow-hidden ${
        isDark ? 'bg-[#0B0F17] text-white' : 'bg-[#F4F6F9] text-gray-900'
      }`}
    >
      {/* Background Micro-Grid & Ambient Fluid Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(rgba(201, 162, 39, 0.15) 1px, transparent 1px)'
              : 'radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Hub Header & Mode Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-gray-800/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A227]/15 text-[#E8C76A] text-[11px] font-sans font-medium tracking-[0.2em] uppercase border border-[#C9A227]/30">
              <Microscope className="w-3.5 h-3.5" />
              <span>CARe Dermatological R&amp;D Platform</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
              3D Sensory Bio-Lab &amp;{' '}
              <span className="italic bg-gradient-to-r from-[#E8C76A] via-[#C9A227] to-[#D4AF37] bg-clip-text text-transparent">
                Texture Simulation Hub
              </span>
            </h2>

            <p className={`font-sans text-sm sm:text-base font-light leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Interact with real-time epidermal rheology simulations, observe trans-epidermal water loss (TEWL) reduction in micro-seconds, and evaluate lipid bilayer reconstitution.
            </p>
          </div>

          {/* Theme & Reset Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className={`p-1 rounded-full flex items-center border ${isDark ? 'bg-black/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <button
                onClick={() => setLabTheme('dark')}
                className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-all ${
                  isDark ? 'bg-[#C9A227] text-black font-semibold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Dark Lab
              </button>
              <button
                onClick={() => setLabTheme('light')}
                className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-all ${
                  !isDark ? 'bg-[#111827] text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Frosted Light
              </button>
            </div>

            <button
              onClick={handleSimulatePulse}
              className={`p-2.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
                isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-[#E8C76A]' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm'
              }`}
              title="Run Live Epidermal Stress Simulation"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Formulation Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { key: 'cleanser', name: '01 Soap-Free Cleanser Gel', sub: 'pH 5.5 Amino Acid Matrix' },
            { key: 'moisturizer', name: '02 Hydrating Moisturizer Cream', sub: '3x Ceramides + Niacinamide' },
            { key: 'sunscreen', name: '03 Ray Barrier SPF 50+ Sunscreen', sub: 'Zero-Cast Invisible Water Fluid' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFormula(tab.key as any)}
              className={`px-5 py-3 rounded-2xl text-left transition-all duration-300 border flex flex-col min-w-[220px] cursor-pointer ${
                activeFormula === tab.key
                  ? isDark
                    ? 'bg-gradient-to-br from-[#1C2538] to-[#121926] border-[#C9A227] text-white shadow-[0_8px_24px_rgba(201,162,39,0.15)]'
                    : 'bg-white border-[#C9A227] text-gray-900 shadow-md'
                  : isDark
                  ? 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]'
                  : 'bg-gray-100/80 border-transparent text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-xs font-sans font-bold tracking-wider">{tab.name}</span>
              <span className={`text-[10px] font-sans font-light mt-0.5 ${activeFormula === tab.key ? 'text-[#C9A227]' : 'text-gray-500'}`}>
                {tab.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Main Bio-Lab Grid: Sliders on Left, Diagnostic Diagram on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Micro-Interactive Rheology & Epidermal Sliders (5 Cols) */}
          <div
            className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
              isDark
                ? 'bg-white/[0.03] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
                : 'bg-white/90 border-gray-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)]'
            }`}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C9A227]" />
                <h3 className="font-serif text-lg font-bold">Micro-Interactive Rheology Sliders</h3>
              </div>
              <span className="text-[10px] font-sans uppercase font-medium tracking-widest px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#E8C76A]">
                Live Sensor
              </span>
            </div>

            <div className="space-y-6">
              {/* Slider 1: Viscosity & Shear Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-medium flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#C9A227]" /> Viscosity &amp; Fluid Shear Rate
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#E8C76A]">
                    {Math.round(viscositySlider * 48)} mPa·s
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={viscositySlider}
                  onChange={e => setViscositySlider(Number(e.target.value))}
                  className="w-full accent-[#C9A227] cursor-pointer h-1.5 rounded-lg bg-gray-700"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-light">
                  <span>Water Burst (5 mPa·s)</span>
                  <span>Crystal Gel (1,200)</span>
                  <span>Lipid Velvet (4,800)</span>
                </div>
              </div>

              {/* Slider 2: Epidermal Penetration Velocity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-medium flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#C9A227]" /> Epidermal Absorption Velocity
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#E8C76A]">
                    {Math.round((100 - penetrationSpeed) * 0.4 + 5)}s to full barrier lock
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={penetrationSpeed}
                  onChange={e => setPenetrationSpeed(Number(e.target.value))}
                  className="w-full accent-[#C9A227] cursor-pointer h-1.5 rounded-lg bg-gray-700"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-light">
                  <span>Sustained 45s</span>
                  <span>Rapid 15s</span>
                  <span>Flash 5s</span>
                </div>
              </div>

              {/* Live Sensor Metrics Display */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <span className="text-[10px] font-sans uppercase text-gray-400 font-medium">TEWL Vapor Loss</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-mono text-xl font-bold text-emerald-400">{tewlLevel}</span>
                    <span className="text-[10px] text-gray-400">g/m²/h</span>
                  </div>
                  <span className="text-[9.5px] text-emerald-400/90 font-light">Optimal Hermetic Seal</span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <span className="text-[10px] font-sans uppercase text-gray-400 font-medium">Lipid Integrity</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-mono text-xl font-bold text-[#E8C76A]">{barrierIntegrity}%</span>
                    <span className="text-[10px] text-gray-400">Matrix</span>
                  </div>
                  <span className="text-[9.5px] text-[#E8C76A]/90 font-light">3x Ceramides Bound</span>
                </div>
              </div>

              {/* Direct Add Formulation Action */}
              <div className="pt-3">
                <button
                  onClick={handleAddCurrent}
                  className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#E8C76A] via-[#C9A227] to-[#8C6A12] text-[#111827] font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-lg hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-[#111827]" />
                  <span>
                    Add {activeFormula === 'cleanser' ? 'Cleanser (₹499)' : activeFormula === 'moisturizer' ? 'Moisturizer (₹599)' : 'Sunscreen (₹649)'}
                  </span>
                </button>

                {addedToast && (
                  <p className="text-center text-xs text-[#E8C76A] font-medium mt-2 flex items-center justify-center gap-1.5 animate-fade-in">
                    <Check className="w-3.5 h-3.5" /> Added to your clinical formulation routine!
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Clinical Skin Diagnostic Diagrams & Stratum Corneum Cellular Matrix (7 Cols) */}
          <div
            className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between ${
              isDark
                ? 'bg-white/[0.03] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
                : 'bg-white/90 border-gray-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)]'
            }`}
          >
            {/* Top Diagnostic Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C9A227]" />
                <h3 className="font-serif text-lg font-bold">Clinical Skin Diagnostic Matrix</h3>
              </div>

              {/* Diagnostic State Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBarrierState('compromised')}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-all ${
                    barrierState === 'compromised'
                      ? 'bg-rose-900/40 text-rose-300 border border-rose-500/50'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Compromised Barrier
                </button>
                <button
                  onClick={() => setBarrierState('restored')}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-all ${
                    barrierState === 'restored'
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/50'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Restored Bio-Matrix
                </button>
              </div>
            </div>

            {/* Visual Stratum Corneum Cellular Diagram (SVG Cellular Cross-Section) */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black/40 border border-white/10 p-4 flex flex-col justify-between select-none">
              
              {/* Diagram Annotation */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8C76A] bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                  Trans-Epidermal Cross-Section (150× Magnification)
                </span>
                <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full ${
                  barrierState === 'restored' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {barrierState === 'restored' ? 'Status: Sealed (72H Lock)' : 'Status: Dehydrated (Vapor Leak)'}
                </span>
              </div>

              {/* SVG Stratum Corneum Corneocyte Tiles */}
              <svg className="w-full h-full absolute inset-0 p-4" viewBox="0 0 600 300" fill="none">
                {/* Stratum Corneum Brick & Mortar Grid */}
                {/* Row 1 Corneocytes */}
                <rect x="20" y="40" width="100" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="130" y="40" width="110" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="250" y="40" width="100" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="360" y="40" width="110" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="480" y="40" width="100" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />

                {/* Row 2 Corneocytes (Staggered) */}
                <rect x="70" y="80" width="110" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="190" y="80" width="100" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="300" y="80" width="110" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="420" y="80" width="110" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />

                {/* Row 3 Corneocytes */}
                <rect x="30" y="120" width="110" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="150" y="120" width="100" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="260" y="120" width="110" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="380" y="120" width="100" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />
                <rect x="490" y="120" width="90" height="28" rx="4" fill={barrierState === 'restored' ? '#1E293B' : '#331B24'} stroke={barrierState === 'restored' ? '#C9A227' : '#E11D48'} strokeWidth="1.5" opacity="0.9" />

                {/* Lipid Bilayer Intercellular Mortar */}
                {barrierState === 'restored' ? (
                  <>
                    {/* Golden Continuous Multi-Ceramide Seal */}
                    <path d="M 20 70 L 580 70" stroke="#E8C76A" strokeWidth="3" strokeDasharray="2 1" opacity="0.8" />
                    <path d="M 20 110 L 580 110" stroke="#E8C76A" strokeWidth="3" strokeDasharray="2 1" opacity="0.8" />
                    <circle cx="125" cy="54" r="3" fill="#E8C76A" />
                    <circle cx="245" cy="54" r="3" fill="#E8C76A" />
                    <circle cx="355" cy="54" r="3" fill="#E8C76A" />
                    <circle cx="475" cy="54" r="3" fill="#E8C76A" />
                  </>
                ) : (
                  <>
                    {/* Red Irritation Leaks & Vapor Escaping */}
                    <path d="M 125 35 L 125 10" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 245 35 L 245 10" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 355 35 L 355 10" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 475 35 L 475 10" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
                  </>
                )}

                {/* Epidermal Baseline */}
                <path d="M 10 170 Q 300 160 590 170" stroke="#64748B" strokeWidth="1" strokeDasharray="4 4" />
                <text x="20" y="200" fill="#94A3B8" fontSize="11" fontFamily="monospace">
                  EPIDERMAL BASAL LAYER (Stratum Basale) • pH 5.5
                </text>
              </svg>

              {/* Bottom Diagram Callout */}
              <div className="z-10 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E8C76A]" />
                  <span className="text-xs text-gray-300 font-light">
                    {barrierState === 'restored'
                      ? '3x Biomimetic Ceramides (NP, AP, EOP) fuse seamlessly with natural intercellular lipids.'
                      : 'Lipid fissures permit moisture evaporation and micro-pollutant penetration.'}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#E8C76A]">
                  {barrierState === 'restored' ? '98% Fortified' : '34% Compromised'}
                </span>
              </div>

            </div>

            {/* Active Molecule Penetration Deep Dive */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-sans font-medium text-gray-300 uppercase tracking-wider text-[11px]">
                  Select Bio-Active Molecule:
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Molecular Weight &lt; 500 Da</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'ceramide', name: 'Ceramides NP/AP/EOP', role: 'Lipid Bilayer Seal' },
                  { id: 'niacinamide', name: 'Niacinamide (B3)', role: 'Micro-Inflammation Barrier' },
                  { id: 'hyaluronic', name: 'Hyaluronic Matrix', role: '1000× Water Reservoir' },
                  { id: 'cica', name: 'Centella Asiatica', role: 'Rapid Calming Matrix' },
                ].map(mol => (
                  <button
                    key={mol.id}
                    onClick={() => setSelectedMolecule(mol.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                      selectedMolecule === mol.id
                        ? 'bg-[#C9A227]/20 border-[#C9A227] text-white shadow-sm'
                        : isDark
                        ? 'bg-black/30 border-white/10 text-gray-400 hover:text-gray-200'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">{mol.name}</div>
                    <div className="text-[9.5px] text-gray-400 truncate mt-0.5">{mol.role}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
