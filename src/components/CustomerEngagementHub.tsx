import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Zap,
  Droplets,
  Sun,
  Layers,
  HeartHandshake,
  Star,
  Clock,
  Activity,
  Calendar,
  SlidersHorizontal,
  Check,
  ShoppingBag,
  Eye,
  RefreshCw,
  Moon,
  Flame,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { AsmrTextureLab } from './AsmrTextureLab';

interface CustomerEngagementHubProps {
  products: Product[];
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const CustomerEngagementHub: React.FC<CustomerEngagementHubProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'texture' | 'quiz' | 'routine' | 'timeline' | 'layering' | 'reviews'>('texture');

  // 1. Routine Diagnostic Quiz State
  const [skinType, setSkinType] = useState<'oily' | 'dry' | 'combination' | 'sensitive'>('combination');
  const [primaryGoal, setPrimaryGoal] = useState<'barrier' | 'sun' | 'acne'>('barrier');
  const [climate, setClimate] = useState<'humid' | 'dry_hot' | 'ac_indoor'>('humid');

  // 2. AM/PM Routine Simulator State
  const [routineTime, setRoutineTime] = useState<'am' | 'pm'>('am');

  // 3. 28-Day Clinical Progress Timeline State
  const [timelineDay, setTimelineDay] = useState<1 | 7 | 14 | 28>(1);

  // 4. Ingredient Layering Compatibility Checker State
  const [selectedExternalActive, setSelectedExternalActive] = useState<string>('retinol');

  // Regimen Recommendation Logic
  const getRegimenRecommendation = () => {
    return {
      title: 'YOUR 3-STEP GLOW PROTOCOL',
      description: `Engineered for ${skinType.toUpperCase()} skin targeting ${
        primaryGoal === 'barrier'
          ? '72H Barrier Repair'
          : primaryGoal === 'sun'
          ? 'Zero-Cast UV Shield'
          : 'pH 5.5 Sebum Balance'
      }.`,
      steps: [
        {
          step: '01 / AM & PM',
          name: 'Refreshing Skin Cleanser',
          tag: '#SoapFreeWash',
          usage: '1 Pump on damp skin. Lather 30s. Zero tightness.',
          productId: 'prod-refreshing-skin-cleanser',
          slug: 'refreshing-skin-cleanser',
          time: '30s Refresh',
          price: 499,
          color: '#CCFF00',
        },
        {
          step: '02 / AM & PM',
          name: 'Hydrating Moisturizer',
          tag: '#3xCeramides',
          usage: 'Pea-sized amount. Melts into dewy velvet cushion.',
          productId: 'prod-hydrating-moisturizer',
          slug: 'hydrating-moisturizer',
          time: '72H Lock',
          price: 599,
          color: '#00D4FF',
        },
        {
          step: '03 / AM DAILY',
          name: 'Ray Barrier Sunscreen',
          tag: '#ZeroWhiteCast',
          usage: 'Two fingers length. Pure invisible water-burst glow.',
          productId: 'prod-ray-barrier-sunscreen',
          slug: 'ray-barrier-sunscreen',
          time: 'SPF 50+ PA++++',
          price: 649,
          color: '#FF51FA',
        },
      ],
    };
  };

  const regimen = getRegimenRecommendation();

  // Handle Add All 3 Products Bundle
  const handleAddBundleToCart = () => {
    products.forEach((p) => {
      if (p.variants && p.variants[0]) {
        onAddToCart(p, p.variants[0], 1);
      }
    });
  };

  // External Actives Matrix for Layering Compatibility Tool
  const externalActives = [
    {
      id: 'retinol',
      name: 'Retinol / Tretinoin',
      compat: '⚡ 100% PERFECT BUFFER',
      badgeColor: 'bg-[#CCFF00] text-black border-[#CCFF00]',
      advice:
        'The 3x Ceramide Moisturizer cancels out Retinol flakiness & burning. Use the Sandwich Method: Cleanser → Retinol → Ceramide Lock.',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
    {
      id: 'vitamin_c',
      name: 'Vitamin C (L-Ascorbic)',
      compat: '☀️ 4X UV SYNERGY',
      badgeColor: 'bg-[#00D4FF] text-black border-[#00D4FF]',
      advice:
        'Layer Ray Barrier SPF 50+ right over Vitamin C in the morning. Multiplies free-radical defense against pollution and UV heat.',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
    {
      id: 'salicylic',
      name: 'Salicylic Acid (BHA)',
      compat: '🫧 ZERO-STRIP BALANCE',
      badgeColor: 'bg-[#FF51FA] text-white border-[#FF51FA]',
      advice:
        'Our pH 5.5 Cleanser keeps the acid mantle intact so strong BHA exfoliators do not trigger redness or barrier damage.',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
    {
      id: 'hyaluronic',
      name: 'Hyaluronic Acid Drops',
      compat: '💧 72H MOISTURE SEAL',
      badgeColor: 'bg-white text-black border-white',
      advice:
        'Apply Hyaluronic Acid on damp skin, then immediately lock it in with Ceramide Moisturizer to prevent reverse moisture loss.',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
  ];

  const currentActiveData =
    externalActives.find((a) => a.id === selectedExternalActive) || externalActives[0];

  // 28-Day Visual Progress Data
  const progressData = {
    1: {
      title: 'DAY 01 // INSTANT ACID RESET',
      skinState: 'Immediate 142% spike in epidermic hydration.',
      desc: 'Zero tightness post-wash. Skin barrier instantly calm with no stinging.',
      metrics: [
        { label: 'Hydration Spike', val: '+142%' },
        { label: 'Redness Sensation', val: '-45%' },
        { label: 'Greasy Residue', val: '0%' },
      ],
      tip: 'Wash with lukewarm water and pat dry with a soft towel.',
    },
    7: {
      title: 'DAY 07 // 72H MOISTURE LOCK',
      skinState: '3x Ceramides NP/AP/EOP seal microscopic moisture leaks.',
      desc: 'Flakiness vanishes completely. Makeup applies seamlessly with zero dry patches.',
      metrics: [
        { label: 'Moisture Retention', val: '72 Hours' },
        { label: 'Flake Reduction', val: '-88%' },
        { label: 'Velvet Softness', val: '+78%' },
      ],
      tip: 'Reapply Ray Barrier Sunscreen every 3-4 hours outdoors.',
    },
    14: {
      title: 'DAY 14 // SEBUM EQUILIBRIUM',
      skinState: 'T-zone oil regulates. Pores appear ultra-clean.',
      desc: 'Skin stays fresh throughout the day with zero shiny forehead or clogged breakouts.',
      metrics: [
        { label: 'Excess Sebum', val: '-64%' },
        { label: 'Inflammation', val: '-74%' },
        { label: 'UV Shield', val: 'PA++++' },
      ],
      tip: 'Stick with the 3-step routine AM & PM for best glow.',
    },
    28: {
      title: 'DAY 28 // FULL GLASS SKIN RESET',
      skinState: 'Complete cellular regeneration cycle completed.',
      desc: 'Skin barrier is 98% resilient against pollution, heat, and environmental stress.',
      metrics: [
        { label: 'Barrier Strength', val: '98%' },
        { label: 'Clear Glow', val: '96%' },
        { label: 'Derm Rating', val: '5/5 ★' },
      ],
      tip: 'Maintain this core barrier trifecta as your daily foundation.',
    },
  };

  const currentTimeline = progressData[timelineDay];

  return (
    <section id="bio-lab" aria-label="Cyber Skin Intelligence Hub" className="bg-[#080808] text-slate-100 py-12 border-b border-white/10 relative overflow-hidden scroll-mt-24">
      
      {/* Background Neon Blobs */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#CCFF00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Engagement Hub Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="sticker-tag bg-[#00D4FF] text-black text-xs px-3.5 py-1 -rotate-2">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>INTERACTIVE BIO-LAB</span>
            </span>
            <h2 id="skincare-intelligence-heading" className="font-syne text-3xl sm:text-4xl font-extrabold text-white mt-2 uppercase tracking-tight">
              SKINCARE INTELLIGENCE <span className="text-gradient-acid">MODULES</span>
            </h2>
            <p className="text-xs sm:text-sm font-syne font-bold text-slate-300 mt-1">
              Zero guesswork. Test formulations, simulate routines, and check active compatibility in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#141724] px-4 py-1.5 rounded-full border border-white/15 text-xs font-orbitron font-bold text-[#CCFF00]">
            <Activity className="w-4 h-4 text-[#CCFF00]" />
            <span>REAL-TIME SENSORY ENGINE</span>
          </div>
        </div>

        {/* Navigation Tabs Header Bar (Cyber-Glow Pills) */}
        <div className="flex justify-start sm:justify-center border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
          <div className="inline-flex p-1.5 bg-[#121624] rounded-2xl border border-white/15 gap-1.5 min-w-max">
            
            <button
              onClick={() => setActiveTab('texture')}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'texture'
                  ? 'bg-[#CCFF00] text-black shadow-neon-lime'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D TEXTURE LAB</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-[#00D4FF] text-black shadow-neon-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>ROUTINE QUIZ</span>
            </button>

            <button
              onClick={() => setActiveTab('routine')}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'routine'
                  ? 'bg-[#FF51FA] text-white shadow-neon-pink'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>AM/PM PROTOCOL</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>28-DAY TIMELINE</span>
            </button>

            <button
              onClick={() => setActiveTab('layering')}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'layering'
                  ? 'bg-[#CCFF00] text-black shadow-neon-lime'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>ACTIVE LAYERING</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#00D4FF] text-black shadow-neon-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>VERIFIED OUTCOMES</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 3D TEXTURE LAB (DIRECT ASMR EMBED) */}
        {activeTab === 'texture' && (
          <AsmrTextureLab
            products={products}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
          />
        )}

        {/* TAB 2: INTERACTIVE ROUTINE DIAGNOSTIC QUIZ */}
        {activeTab === 'quiz' && (
          <div className="clay-card p-6 sm:p-8 border border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Diagnostic Options */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="sticker-tag bg-[#CCFF00] text-black text-[10px] px-2.5 py-0.5 -rotate-2">
                  STEP 01
                </span>
                <h3 className="text-xl font-syne font-black text-white mt-1.5 uppercase">
                  Select Your Skin Type
                </h3>
              </div>

              {/* Skin Type Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'combination', label: 'Combination', sub: 'T-Zone Shine + Dry Cheeks' },
                  { id: 'oily', label: 'Oily / Breakout', sub: 'Excess Sebum & Shine' },
                  { id: 'dry', label: 'Dry / Tight', sub: 'Flaky Barrier & Dullness' },
                  { id: 'sensitive', label: 'Sensitive Skin', sub: 'Easily Flushed Barrier' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSkinType(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      skinType === item.id
                        ? 'bg-[#191D2C] border-[#CCFF00] ring-2 ring-[#CCFF00]/40 text-white shadow-neon-lime'
                        : 'bg-[#10131E] border-white/10 text-slate-300 hover:bg-[#151826]'
                    }`}
                  >
                    <p className="font-syne font-bold text-sm text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sub}</p>
                  </button>
                ))}
              </div>

              {/* Step 2: Target Concern */}
              <div className="pt-2">
                <span className="sticker-tag bg-[#00D4FF] text-black text-[10px] px-2.5 py-0.5 rotate-2">
                  STEP 02
                </span>
                <h3 className="text-xl font-syne font-black text-white mt-1.5 uppercase">
                  Primary Skin Objective
                </h3>

                <div className="space-y-2 mt-3">
                  {[
                    { id: 'barrier', label: '72H Barrier Repair & Deep Lipid Lock' },
                    { id: 'sun', label: 'Broad Spectrum SPF 50+ Invisible Shield' },
                    { id: 'acne', label: 'pH 5.5 Cleansing & Pore Clarity' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPrimaryGoal(item.id as any)}
                      className={`w-full p-3 rounded-2xl text-left text-xs font-syne font-bold transition-all flex items-center justify-between border cursor-pointer ${
                        primaryGoal === item.id
                          ? 'bg-[#191D2C] text-[#00D4FF] border-[#00D4FF] shadow-neon-cyan'
                          : 'bg-[#10131E] text-slate-300 border-white/10 hover:bg-[#151826]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {primaryGoal === item.id && <CheckCircle2 className="w-4 h-4 text-[#00D4FF]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Diagnostic Result: Prescribed Trifecta */}
            <div className="lg:col-span-6 glass-cyber-card p-6 rounded-3xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-orbitron font-extrabold text-[#CCFF00] uppercase">
                    PRESCRIBED PROTOCOL
                  </span>
                  <h4 className="text-lg font-syne font-black text-white">{regimen.title}</h4>
                </div>
                <span className="sticker-tag bg-[#CCFF00] text-black text-[10px] px-2 py-0.5 -rotate-2">
                  BUNDLE & SAVE 25%
                </span>
              </div>

              <p className="text-xs font-mono text-slate-300">
                {regimen.description}
              </p>

              {/* 3 Step Protocol Cards */}
              <div className="space-y-2.5 pt-1">
                {regimen.steps.map((st) => (
                  <div
                    key={st.step}
                    className="p-3 bg-[#121624] rounded-2xl border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-orbitron font-bold text-[#00D4FF]">
                          {st.step}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {st.tag}
                        </span>
                      </div>
                      <p className="text-xs font-syne font-bold text-white mt-0.5">{st.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{st.usage}</p>
                    </div>

                    <span className="text-xs font-orbitron font-black text-white shrink-0">
                      ₹{st.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Instant Bundle Add CTA */}
              <button
                onClick={handleAddBundleToCart}
                className="w-full clay-button-lime text-black font-syne font-black text-xs py-3.5 rounded-2xl uppercase tracking-wider shadow-neon-lime hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 mt-2"
              >
                <ShoppingBag className="w-4 h-4 fill-black" />
                <span>+ ADD FULL 3-STEP BUNDLE (₹1,599)</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 3: AM/PM ROUTINE PROTOCOL */}
        {activeTab === 'routine' && (
          <div className="clay-card p-6 sm:p-8 border border-white/15 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="sticker-tag bg-[#FF51FA] text-white text-[10px] px-2.5 py-0.5 rotate-1">
                  DAILY CYCLE
                </span>
                <h3 className="text-2xl font-syne font-black text-white mt-1.5 uppercase">
                  AM PROTECTION VS PM RECOVERY
                </h3>
              </div>

              {/* AM / PM Toggle */}
              <div className="inline-flex p-1 bg-[#121624] rounded-2xl border border-white/15">
                <button
                  onClick={() => setRoutineTime('am')}
                  className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    routineTime === 'am'
                      ? 'bg-[#CCFF00] text-black shadow-neon-lime'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>AM PROTOCOL</span>
                </button>

                <button
                  onClick={() => setRoutineTime('pm')}
                  className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    routineTime === 'pm'
                      ? 'bg-[#00D4FF] text-black shadow-neon-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>PM RECOVERY</span>
                </button>
              </div>
            </div>

            {/* Routine Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routineTime === 'am' ? (
                <>
                  <div className="bg-[#121624] rounded-2xl p-5 border border-white/10 space-y-2">
                    <span className="text-[10px] font-orbitron font-bold text-[#CCFF00]">01 // WASH</span>
                    <h4 className="font-syne font-bold text-base text-white">pH 5.5 Cleanser</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Purges overnight oil while maintaining the natural skin barrier. Zero tightness or squeak.
                    </p>
                  </div>

                  <div className="bg-[#121624] rounded-2xl p-5 border border-white/10 space-y-2">
                    <span className="text-[10px] font-orbitron font-bold text-[#00D4FF]">02 // LOCK</span>
                    <h4 className="font-syne font-bold text-base text-white">72H Ceramide Cream</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      3:1:1 golden ceramide ratio creates an ultra-light dewy cushion with zero makeup pilling.
                    </p>
                  </div>

                  <div className="bg-[#181D2E] rounded-2xl p-5 border border-[#FF51FA]/40 space-y-2">
                    <span className="text-[10px] font-orbitron font-bold text-[#FF51FA]">03 // SHIELD</span>
                    <h4 className="font-syne font-bold text-base text-white">Invisible SPF 50+</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Broad-spectrum PA++++ protection with water-burst finish. 0% white cast, non-comedogenic.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#121624] rounded-2xl p-5 border border-white/10 space-y-2">
                    <span className="text-[10px] font-orbitron font-bold text-[#CCFF00]">01 // PURGE</span>
                    <h4 className="font-syne font-bold text-base text-white">PM Double Wash</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Melts away sunscreen, pollution, and sweat in 45s without compromising natural lipids.
                    </p>
                  </div>

                  <div className="bg-[#181D2E] md:col-span-2 rounded-2xl p-5 border border-[#00D4FF]/40 space-y-2">
                    <span className="text-[10px] font-orbitron font-bold text-[#00D4FF]">02 // INTENSIVE RECOVERY</span>
                    <h4 className="font-syne font-bold text-base text-white">Night Ceramide Infusion</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Apply a generous layer before sleep. Cellular turnover peaks overnight; ceramides NP, AP, and EOP integrate into skin lipids for plump glass skin by morning.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: 28-DAY CLINICAL PROGRESS TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="clay-card p-6 sm:p-8 border border-white/15 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="sticker-tag bg-white text-black text-[10px] px-2.5 py-0.5 rotate-[-2deg]">
                  28-DAY CELLULAR CYCLE
                </span>
                <h3 className="text-2xl font-syne font-black text-white mt-1.5 uppercase">
                  VERIFIED CLINICAL BENCHMARKS
                </h3>
              </div>

              {/* Day Stepper Buttons */}
              <div className="flex items-center gap-2">
                {([1, 7, 14, 28] as const).map((day) => (
                  <button
                    key={day}
                    onClick={() => setTimelineDay(day)}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
                      timelineDay === day
                        ? 'bg-[#CCFF00] text-black shadow-neon-lime scale-105'
                        : 'bg-[#121624] text-slate-400 hover:text-white'
                    }`}
                  >
                    DAY {day < 10 ? `0${day}` : day}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Day Detail Card */}
            <div className="glass-cyber-card p-6 rounded-3xl border border-white/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-lg font-syne font-black text-white">{currentTimeline.title}</h4>
                <span className="text-xs font-mono text-[#00D4FF]">{currentTimeline.skinState}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {currentTimeline.desc}
              </p>

              {/* Metric Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {currentTimeline.metrics.map((m, idx) => (
                  <div key={idx} className="bg-[#121624] p-3.5 rounded-2xl border border-white/10 text-center">
                    <span className="text-2xl font-orbitron font-black text-[#CCFF00] block">{m.val}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACTIVE INGREDIENT COMPATIBILITY CHECKER */}
        {activeTab === 'layering' && (
          <div className="clay-card p-6 sm:p-8 border border-white/15 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="sticker-tag bg-[#CCFF00] text-black text-[10px] px-2.5 py-0.5 -rotate-2">
                LAYERING MATRIX
              </span>
              <h3 className="text-2xl font-syne font-black text-white mt-1.5 uppercase">
                ACTIVE COMPATIBILITY CHECKER
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Select your home actives to check zero-irritation compatibility with Care formulations.
              </p>
            </div>

            {/* Actives Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {externalActives.map((active) => (
                <button
                  key={active.id}
                  onClick={() => setSelectedExternalActive(active.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedExternalActive === active.id
                      ? 'bg-[#191D2C] border-[#00D4FF] ring-2 ring-[#00D4FF]/40 text-white shadow-neon-cyan'
                      : 'bg-[#10131E] border-white/10 text-slate-300 hover:bg-[#151826]'
                  }`}
                >
                  <p className="font-syne font-bold text-xs sm:text-sm text-white">{active.name}</p>
                  <span className={`inline-block text-[9px] font-orbitron font-bold px-2 py-0.5 rounded-full mt-2 border ${active.badgeColor}`}>
                    {active.compat}
                  </span>
                </button>
              ))}
            </div>

            {/* Protocol Result */}
            <div className="bg-[#121624] p-5 rounded-3xl border border-white/15 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-syne font-bold text-[#CCFF00]">{currentActiveData.name} Protocol</span>
                <span className="text-xs font-orbitron font-bold text-[#00D4FF]">{currentActiveData.compat}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentActiveData.advice}</p>
            </div>
          </div>
        )}

        {/* TAB 6: VERIFIED CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="clay-card p-6 sm:p-8 border border-white/15 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="sticker-tag bg-[#FF51FA] text-white text-[10px] px-2.5 py-0.5 rotate-1">
                COMMUNITY LOVED
              </span>
              <h3 className="text-2xl font-syne font-black text-white mt-1.5 uppercase">
                VERIFIED GEN Z COMMUNITY REVIEWS
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Priya M.',
                  city: 'Bengaluru',
                  tag: 'Damaged Barrier',
                  review: 'The Ceramide Moisturizer completely saved my flaky skin in 4 days. Zero grease under sunscreen!',
                },
                {
                  name: 'Rohan K.',
                  city: 'Mumbai',
                  tag: 'Oily T-Zone',
                  review: 'Invisible sunscreen with literally zero white cast in Mumbai humidity. 10/10 Holy Grail.',
                },
                {
                  name: 'Dr. Ananya R.',
                  city: 'Dermatologist',
                  tag: 'Clinical Grade',
                  review: 'pH 5.5 without fragrance or sulfates. The gold standard for post-active recovery.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#121624] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#CCFF00] font-orbitron font-bold">★★★★★</span>
                    <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 italic">"{item.review}"</p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                    {item.name} • {item.city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
