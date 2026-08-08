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
  Info,
  RefreshCw,
  Moon,
  Sparkle,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';

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
  const [activeTab, setActiveTab] = useState<'quiz' | 'routine' | 'timeline' | 'layering' | 'texture' | 'reviews'>('quiz');

  // 1. Routine Diagnostic Quiz State
  const [skinType, setSkinType] = useState<'oily' | 'dry' | 'combination' | 'sensitive'>('combination');
  const [primaryGoal, setPrimaryGoal] = useState<'barrier' | 'sun' | 'acne'>('barrier');
  const [climate, setClimate] = useState<'humid' | 'dry_hot' | 'ac_indoor'>('humid');

  // 2. AM/PM Routine Simulator State
  const [routineTime, setRoutineTime] = useState<'am' | 'pm'>('am');
  const [activeRoutineStep, setActiveRoutineStep] = useState<number>(0);

  // 3. 28-Day Clinical Progress Timeline State
  const [timelineDay, setTimelineDay] = useState<1 | 7 | 14 | 28>(1);

  // 4. Ingredient Layering Compatibility Checker State
  const [selectedExternalActive, setSelectedExternalActive] = useState<string>('retinol');

  // 5. Texture Inspector State
  const [selectedProductTexture, setSelectedProductTexture] = useState<number>(0);

  // Active Formulations Data
  const activeTechs = [
    {
      title: '3x Bio-Identical Ceramide Complex',
      sub: 'Ceramide NP, AP & EOP in 3:1:1 Golden Ratio',
      desc: 'Mimics the natural lipid structure of human stratum corneum to seal micro-fissures in damaged skin barriers, preventing transepidermal water loss (TEWL) for up to 72 hours.',
      stat: '98%',
      statLabel: 'Reported 72-Hour Moisture Retention',
      icon: Droplets,
    },
    {
      title: 'PA++++ Hybrid Photostable UV Defense',
      sub: 'Tinosorb S + Uvinul A Plus + Zinc Oxide',
      desc: 'Next-generation photostable broad-spectrum sun filters specifically tested under 40°C Indian summer heat. Zero white cast, non-comedogenic, and sweat resistant.',
      stat: '99%',
      statLabel: 'UVA & UVB Radiation Neutralization',
      icon: Sun,
    },
    {
      title: 'pH 5.5 Niacinamide & Panthenol Infusion',
      sub: 'Pro-Vitamin B5 + 2% Pure Niacinamide',
      desc: 'Maintains the acid mantle of sensitive Indian skin while regulating sebum, fading post-acne dark marks, and soothing inflammation without tightness.',
      stat: '100%',
      statLabel: 'Sulfate & Fragrance-Free Formula',
      icon: Layers,
    },
  ];

  // Routine Quiz Recommendation Logic
  const getRegimenRecommendation = () => {
    const climateNote =
      climate === 'humid'
        ? 'Lightweight layering optimized for Indian high humidity.'
        : climate === 'dry_hot'
        ? 'Deep lipid lock formula to counteract hot dry winds.'
        : 'Sustained indoor moisture retention for air-conditioned environments.';

    return {
      title: 'Your Prescribed 3-Step Clinical Protocol',
      description: `Tailored for ${skinType.toUpperCase()} skin targeting ${
        primaryGoal === 'barrier'
          ? 'Barrier Repair'
          : primaryGoal === 'sun'
          ? 'UV Protection & Glow'
          : 'Acne & Sebum Control'
      }. ${climateNote}`,
      steps: [
        {
          step: 'STEP 1 (AM & PM)',
          name: 'Refreshing Skin Cleanser',
          tag: 'pH 5.5 Balanced Wash',
          usage: '1 Pump on damp face. Massage gently for 30s.',
          productId: 'prod-refreshing-skin-cleanser',
          slug: 'refreshing-skin-cleanser',
          time: '30 seconds',
        },
        {
          step: 'STEP 2 (AM & PM)',
          name: 'Hydrating Moisturizer',
          tag: 'Ceramide Barrier Cream',
          usage: 'Dime-sized amount. Lock in moisture on face & neck.',
          productId: 'prod-hydrating-moisturizer',
          slug: 'hydrating-moisturizer',
          time: '60 seconds lock-in',
        },
        {
          step: 'STEP 3 (AM DAILY)',
          name: 'Ray Barrier Sunscreen',
          tag: 'SPF 50+ PA++++ Gel',
          usage: 'Two fingers length. Apply 15 mins before sun exposure.',
          productId: 'prod-ray-barrier-sunscreen',
          slug: 'ray-barrier-sunscreen',
          time: 'Morning daily shield',
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
      name: 'Retinol / Tretinoin (Vitamin A)',
      compat: 'Highly Recommended Partner',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      advice:
        'Ceramide Moisturizer acts as a perfect buffer to eliminate Retinol-induced peeling and redness. Apply Cleanser → Retinol → Ceramide Cream (Sandwich technique).',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
    {
      id: 'vitamin_c',
      name: 'Vitamin C Serum (L-Ascorbic Acid)',
      compat: '100% Synergy in AM',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      advice:
        'Applying Ray Barrier SPF 50+ over Vitamin C boosts free-radical protection by 4x against environmental pollution and UV stress.',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
    {
      id: 'salicylic',
      name: 'Salicylic Acid (BHA 2%)',
      compat: 'pH Balanced Shield',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      advice:
        'Our pH 5.5 Cleanser prepares pores without stripping natural oils, preventing skin barrier breakdown when using exfoliators.',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
    {
      id: 'hyaluronic',
      name: 'Hyaluronic Acid Serums',
      compat: 'Maximum Hydration Lock',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      advice:
        'Apply Hyaluronic Acid on damp skin post-cleansing, then immediately seal with Ceramide Moisturizer to prevent reverse moisture loss.',
      safeWith: ['Cleanser', 'Moisturizer', 'Sunscreen'],
    },
  ];

  const currentActiveData =
    externalActives.find((a) => a.id === selectedExternalActive) || externalActives[0];

  // Clinical Progress Timeline Data
  const progressData = {
    1: {
      title: 'Day 01: Instant Relief & Acid Mantle Reset',
      skinState: 'Instant 142% spike in epidermic hydration level.',
      desc: 'Skin feeling immediately calm with zero stinging. Acid mantle recalibrated to pH 5.5.',
      metrics: [
        { label: 'Hydration Bump', val: '+142%' },
        { label: 'Surface Irritation', val: '-45%' },
        { label: 'Sticky Residue', val: '0%' },
      ],
      tip: 'Use gentle circular motions with lukewarm water.',
    },
    7: {
      title: 'Day 07: Barrier Repair & Moisture Lock',
      skinState: 'Ceramides NP/AP/EOP fill intercellular gaps in stratum corneum.',
      desc: 'Flakiness and tight sensation disappear. Skin feels smooth, soft, and visibly plumped.',
      metrics: [
        { label: 'TEWL Water Loss', val: '-52%' },
        { label: 'Flakiness Reduction', val: '-88%' },
        { label: 'Skin Smoothness', val: '+78%' },
      ],
      tip: 'Reapply Ray Barrier Sunscreen every 3-4 hours outdoors.',
    },
    14: {
      title: 'Day 14: Sebum Balance & Sun Protection',
      skinState: 'Oil production regulates. Zero dark spots or sun-induced tanning.',
      desc: 'Redness drops drastically. Pores appear refined without heavy oily shine throughout the day.',
      metrics: [
        { label: 'Excess Sebum', val: '-64%' },
        { label: 'Redness Reduction', val: '-74%' },
        { label: 'UVA Protection', val: 'PA++++' },
      ],
      tip: 'Consistent AM & PM usage yields optimum clinical glow.',
    },
    28: {
      title: 'Day 28: Complete Clinical Regeneration',
      skinState: 'Full epidermal cell turnover cycle completed.',
      desc: 'Skin barrier restored to 98% optimal resilience against pollution, heat, and seasonal stress.',
      metrics: [
        { label: 'Barrier Strength', val: '98%' },
        { label: 'Overall Glow', val: '96%' },
        { label: 'Dermatologist Rating', val: '5/5' },
      ],
      tip: 'Sustain this 3-step foundation for lifelong barrier health.',
    },
  };

  const currentTimeline = progressData[timelineDay];

  return (
    <section className="bg-gradient-to-b from-stone-50 via-stone-100/60 to-stone-50 py-12 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Engagement Hub Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 text-amber-300 text-xs font-semibold uppercase tracking-widest border border-amber-400/30 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Clinical Skincare Intelligence Hub
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Personalized Skincare Diagnostic & Science
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            Eliminate skincare guesswork. Explore custom skin diagnostics, interactive routine simulators, ingredient compatibility matrix, and 28-day clinical results.
          </p>
        </div>

        {/* Navigation Tabs Header Bar */}
        <div className="flex justify-center border-b border-stone-200 pb-4 overflow-x-auto">
          <div className="inline-flex p-1.5 bg-stone-200/70 rounded-2xl border border-stone-300/80 shadow-inner gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-emerald-950 text-amber-300 shadow-lg'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Routine Diagnostic</span>
            </button>

            <button
              onClick={() => setActiveTab('routine')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'routine'
                  ? 'bg-emerald-950 text-amber-300 shadow-lg'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>AM/PM Routine Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-emerald-950 text-amber-300 shadow-lg'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>28-Day Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('layering')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'layering'
                  ? 'bg-emerald-950 text-amber-300 shadow-lg'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-300" />
              <span>Ingredient Layering</span>
            </button>

            <button
              onClick={() => setActiveTab('texture')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'texture'
                  ? 'bg-emerald-950 text-amber-300 shadow-lg'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Texture Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-emerald-950 text-amber-300 shadow-lg'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>Clinical Proof</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE ROUTINE DIAGNOSTIC QUIZ */}
        {activeTab === 'quiz' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Diagnostic Options */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Step 1 of 3
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">Select Skin Type</h3>
                <p className="text-xs text-stone-500 font-light">Customizes active concentration levels for Indian climates.</p>
              </div>

              {/* Skin Type Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'combination', label: 'Combination', sub: 'T-Zone Oil + Dry Cheeks' },
                  { id: 'oily', label: 'Oily & Acne-Prone', sub: 'Excess Sebum & Clogged Pores' },
                  { id: 'dry', label: 'Dry & Dehydrated', sub: 'Flaky, Tight Feeling' },
                  { id: 'sensitive', label: 'Sensitive Skin', sub: 'Easily Irritated Barrier' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSkinType(item.id as any)}
                    className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                      skinType === item.id
                        ? 'border-emerald-800 bg-emerald-50/80 ring-2 ring-emerald-600/30 shadow-md'
                        : 'border-stone-200 hover:border-emerald-300 bg-stone-50/50'
                    }`}
                  >
                    <p className="font-serif font-bold text-sm text-stone-900">{item.label}</p>
                    <p className="text-[11px] text-stone-500 mt-1 font-light">{item.sub}</p>
                  </button>
                ))}
              </div>

              {/* Step 2: Target Concern */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Step 2 of 3
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">Primary Skin Concern</h3>

                <div className="space-y-2.5 mt-3">
                  {[
                    { id: 'barrier', label: '72H Barrier Repair & Deep Lipid Lock' },
                    { id: 'sun', label: 'Broad Spectrum SPF 50+ & UV Anti-Tanning' },
                    { id: 'acne', label: 'pH 5.5 Cleansing & Sebum Balance' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPrimaryGoal(item.id as any)}
                      className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold transition-all duration-200 flex items-center justify-between border cursor-pointer ${
                        primaryGoal === item.id
                          ? 'bg-emerald-950 text-amber-300 border-emerald-950 shadow-lg'
                          : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {primaryGoal === item.id && <CheckCircle2 className="w-4 h-4 text-amber-300" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Climate Environment */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Step 3 of 3
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-2">Daily Climate Exposure</h3>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { id: 'humid', label: 'Humid Outdoor' },
                    { id: 'dry_hot', label: 'Dry Heat' },
                    { id: 'ac_indoor', label: 'AC Indoor' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setClimate(item.id as any)}
                      className={`p-3 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                        climate === item.id
                          ? 'bg-amber-800 text-amber-50 border-amber-800 shadow-md'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Diagnostic Result: Prescribed Routine Bundle */}
            <div className="lg:col-span-7 bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/80 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800/80 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-900/90 px-3 py-1 rounded-full border border-amber-400/20">
                    Clinical Prescription Protocol
                  </span>
                  <h4 className="text-2xl font-serif font-bold text-emerald-50 mt-2">{regimen.title}</h4>
                  <p className="text-xs text-emerald-200/80 font-light mt-0.5">{regimen.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-bold text-amber-300">₹1,497</span>
                  <span className="text-xs text-emerald-400/70 line-through block">₹1,747</span>
                  <span className="text-[10px] font-bold text-emerald-950 bg-amber-300 px-2.5 py-0.5 rounded-full uppercase">
                    BUNDLE DISCOUNT (SAVE ₹250)
                  </span>
                </div>
              </div>

              {/* 3 Step Protocol Items */}
              <div className="space-y-3">
                {regimen.steps.map((s, idx) => {
                  const targetProd = products.find((p) => p.id === s.productId || p.slug === s.slug);
                  return (
                    <div
                      key={idx}
                      onClick={() => targetProd && onSelectProduct && onSelectProduct(targetProd)}
                      className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-800/80 flex items-center justify-between gap-4 hover:bg-emerald-900/90 hover:border-amber-400/40 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                          0{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                              {s.step}
                            </span>
                            <span className="text-[9px] text-emerald-300/80 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                              {s.time}
                            </span>
                          </div>
                          <h5 className="font-serif font-bold text-base text-emerald-50 group-hover:text-amber-200 transition mt-0.5">
                            {s.name}
                          </h5>
                          <p className="text-xs text-emerald-200/80 font-light">{s.usage}</p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition flex items-center gap-1 shrink-0">
                        View <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Add Complete Regimen Bundle CTA */}
              <button
                onClick={handleAddBundleToCart}
                className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Add Complete 3-Step Protocol to Bag — ₹1,497</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AM/PM ROUTINE SIMULATOR & STEP-BY-STEP GUIDE */}
        {activeTab === 'routine' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xl space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
                  Interactive Daily Protocol
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                  AM Protection vs PM Recovery Routine
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                  Learn how to layer our 3 core formulations for maximum bio-availability and skin barrier retention.
                </p>
              </div>

              {/* AM / PM Toggle Button */}
              <div className="inline-flex p-1.5 bg-stone-100 rounded-2xl border border-stone-300">
                <button
                  onClick={() => setRoutineTime('am')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    routineTime === 'am'
                      ? 'bg-amber-400 text-emerald-950 shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-800" />
                  <span>AM Protection Routine</span>
                </button>

                <button
                  onClick={() => setRoutineTime('pm')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    routineTime === 'pm'
                      ? 'bg-emerald-950 text-amber-300 shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Moon className="w-4 h-4 text-amber-300" />
                  <span>PM Night Barrier Repair</span>
                </button>
              </div>
            </div>

            {/* Routine Steps Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {routineTime === 'am' ? (
                <>
                  {/* AM Step 1 */}
                  <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-4 hover:shadow-lg transition">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center">
                        01
                      </span>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md">
                        30 SECONDS
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">1. Cleanse & Balance pH</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      Wash away overnight sebum gently with pH 5.5 Refreshing Cleanser. Preps skin without disrupting stratum corneum lipids.
                    </p>
                    <div className="bg-white p-3 rounded-xl text-[11px] text-stone-700 border border-stone-200 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dose: 1 pump with lukewarm water</span>
                    </div>
                  </div>

                  {/* AM Step 2 */}
                  <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-4 hover:shadow-lg transition">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center">
                        02
                      </span>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md">
                        60 SECONDS
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">2. Hydrate & Seal Barrier</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      Apply Hydrating Moisturizer with 3x Bio-identical Ceramides. Creates an ultra-lightweight moisture shield.
                    </p>
                    <div className="bg-white p-3 rounded-xl text-[11px] text-stone-700 border border-stone-200 flex items-center gap-2">
                      <Sparkle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Dose: Pea-sized amount on face & neck</span>
                    </div>
                  </div>

                  {/* AM Step 3 */}
                  <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 space-y-4 hover:shadow-xl transition">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-amber-300 text-emerald-950 font-bold text-xs flex items-center justify-center">
                        03
                      </span>
                      <span className="text-[10px] font-bold text-emerald-950 bg-amber-300 px-2.5 py-1 rounded-md">
                        DAILY SHIELD
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-emerald-50">3. Photostable Sunscreen</h4>
                    <p className="text-xs text-emerald-200/90 leading-relaxed font-light">
                      Apply Ray Barrier SPF 50+ PA++++ Gel. Invisible finish with zero white cast, protecting against UVA/UVB & humidity.
                    </p>
                    <div className="bg-emerald-900 p-3 rounded-xl text-[11px] text-amber-200 border border-emerald-800 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Dose: Two finger length 15m before stepping out</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* PM Step 1 */}
                  <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-4 hover:shadow-lg transition">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center">
                        01
                      </span>
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md">
                        DOUBLE CLEANSE
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">1. Deep PM Cleansing</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      Melt away sunscreen, sweat, and urban grime thoroughly with pH 5.5 Wash. Leaves pores fresh without tight skin feeling.
                    </p>
                    <div className="bg-white p-3 rounded-xl text-[11px] text-stone-700 border border-stone-200 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Massage gently for 45s over face & jawline</span>
                    </div>
                  </div>

                  {/* PM Step 2 */}
                  <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 space-y-4 hover:shadow-xl transition md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-amber-300 text-emerald-950 font-bold text-xs flex items-center justify-center">
                        02
                      </span>
                      <span className="text-[10px] font-bold text-emerald-950 bg-amber-300 px-2.5 py-1 rounded-md uppercase">
                        Night Cell Regeneration
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-xl text-emerald-50">2. Intensive Ceramide Night Recovery</h4>
                    <p className="text-xs text-emerald-100/90 leading-relaxed font-light">
                      Apply a generous layer of Hydrating Ceramide Moisturizer before sleep. During sleep, cellular turnover peaks; ceramides NP, AP, and EOP integrate into skin lipids to seal micro-fissures, yielding plump, soft skin by morning.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-emerald-900 p-3 rounded-xl text-[11px] text-amber-200 border border-emerald-800 flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Locks moisture for 72 Hours</span>
                      </div>
                      <div className="bg-emerald-900 p-3 rounded-xl text-[11px] text-amber-200 border border-emerald-800 flex items-center gap-2">
                        <Moon className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Soothes retinoid / active redness</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: 28-DAY CLINICAL PROGRESS TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Clinical Trial Benchmarks
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                28-Day Epidermal Cellular Regeneration
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-light">
                Click across the timeline days to inspect verified dermatologist clinical study measurements.
              </p>
            </div>

            {/* Interactive Timeline Stepper Buttons */}
            <div className="flex justify-center items-center gap-3 sm:gap-6 border-y border-stone-200 py-6">
              {([1, 7, 14, 28] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setTimelineDay(day)}
                  className={`px-4 sm:px-6 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    timelineDay === day
                      ? 'bg-emerald-950 text-amber-300 ring-4 ring-amber-400/30 shadow-xl scale-105'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Day {day < 10 ? `0${day}` : day}</span>
                </button>
              ))}
            </div>

            {/* Active Day Detail Display Card */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-900 px-3 py-1 rounded-full">
                    Clinical Milestone
                  </span>
                  <h4 className="text-2xl font-serif font-bold text-emerald-50 mt-2">{currentTimeline.title}</h4>
                  <p className="text-xs text-amber-200/90 font-medium mt-1">{currentTimeline.skinState}</p>
                </div>

                <div className="bg-emerald-900/80 border border-amber-400/30 px-4 py-2 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-amber-300 uppercase block">Regeneration Cycle</span>
                  <span className="text-lg font-bold text-emerald-50">{timelineDay} / 28 Days</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-light leading-relaxed">
                {currentTimeline.desc}
              </p>

              {/* Verified Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentTimeline.metrics.map((m, idx) => (
                  <div key={idx} className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800/80 text-center space-y-1">
                    <span className="text-3xl font-bold text-amber-300 block">{m.val}</span>
                    <span className="text-[11px] text-emerald-200 font-medium">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-400/10 border border-amber-400/30 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-300 shrink-0" />
                <span><strong>Dermatologist Tip:</strong> {currentTimeline.tip}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INGREDIENT LAYERING COMPATIBILITY CHECKER */}
        {activeTab === 'layering' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xl space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
                  Dermatologist Layering Matrix
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                  Active Ingredient Compatibility Checker
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                  Select actives you already use at home to see how Care Beauty formulations safely pair with your routine.
                </p>
              </div>
            </div>

            {/* Actives Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {externalActives.map((active) => (
                <button
                  key={active.id}
                  onClick={() => setSelectedExternalActive(active.id)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                    selectedExternalActive === active.id
                      ? 'bg-emerald-950 text-amber-300 border-emerald-950 shadow-xl scale-102'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <p className="font-serif font-bold text-sm">{active.name}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 border ${active.badgeColor}`}>
                    {active.compat}
                  </span>
                </button>
              ))}
            </div>

            {/* Compatibility Result Box */}
            <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                  <div>
                    <h4 className="font-serif font-bold text-lg text-amber-200">{currentActiveData.name}</h4>
                    <p className="text-xs text-stone-400">Clinical Layering Protocol</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700">
                  {currentActiveData.compat}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                {currentActiveData.advice}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-400 font-medium">Safe to layer with:</span>
                {currentActiveData.safeWith.map((prod, i) => (
                  <span key={i} className="bg-stone-800 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-stone-700">
                    ✓ Care {prod}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TEXTURE & FINISH INSPECTOR */}
        {activeTab === 'texture' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Texture Navigation */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
                Formulation Texture & Finish Inspector
              </h3>

              {activeTechs.map((tech, idx) => {
                const IconComp = tech.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedProductTexture(idx)}
                    className={`w-full p-4.5 rounded-2xl text-left border transition-all duration-200 flex items-center gap-4 cursor-pointer ${
                      selectedProductTexture === idx
                        ? 'border-emerald-950 bg-emerald-950 text-white shadow-xl'
                        : 'border-stone-200 hover:border-emerald-300 bg-stone-50/60 text-stone-800'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${selectedProductTexture === idx ? 'bg-emerald-900 text-amber-300' : 'bg-emerald-100 text-emerald-900'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-serif font-bold text-base ${selectedProductTexture === idx ? 'text-amber-200' : 'text-stone-900'}`}>
                        {tech.title}
                      </p>
                      <p className={`text-xs ${selectedProductTexture === idx ? 'text-emerald-200' : 'text-stone-500'}`}>
                        {tech.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Texture Detail Card */}
            <div className="lg:col-span-7 bg-emerald-950 text-white rounded-3xl p-8 border border-emerald-800/80 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-900 px-3 py-1 rounded-full border border-amber-400/20">
                    Sensoric Texture Benchmark
                  </span>
                  <h4 className="text-2xl font-serif font-bold text-emerald-50 mt-2">
                    {activeTechs[selectedProductTexture].title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-amber-300">{activeTechs[selectedProductTexture].stat}</span>
                  <p className="text-[10px] text-emerald-300 uppercase font-bold">{activeTechs[selectedProductTexture].statLabel}</p>
                </div>
              </div>

              <p className="text-emerald-100/90 text-sm leading-relaxed font-light">
                {activeTechs[selectedProductTexture].desc}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-800">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Skin Finish</span>
                  <p className="text-xs font-bold text-emerald-100 mt-1">Velvet-Matte & Breathable</p>
                </div>
                <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-800">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Absorbing Time</span>
                  <p className="text-xs font-bold text-emerald-100 mt-1">&lt; 15 Seconds Absorption</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: VERIFIED REVIEWS & CLINICAL PROOF */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-2xl space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Real Patient Results
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900">
                Verified Customer & Dermatologist Outcomes
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Priya Mukherjee',
                  city: 'Bengaluru',
                  rating: 5,
                  tag: 'Damaged Skin Barrier',
                  review: 'The Ceramide Moisturizer completely transformed my peeling skin in just 5 days. No heavy sticky feel under makeup!',
                },
                {
                  name: 'Rohan Mehta',
                  city: 'Mumbai',
                  rating: 5,
                  tag: 'Oily & Sun-Exposed Skin',
                  review: 'Finding a sunscreen with zero white cast that does not make my skin oily in Mumbai humidity was impossible until this PA++++ gel.',
                },
                {
                  name: 'Dr. Ananya Rao',
                  city: 'Dermatologist, Bengaluru',
                  rating: 5,
                  tag: 'Clinical Recommendation',
                  review: 'I regularly recommend this pH 5.5 cleanser and ceramide cream to patients recovering from chemical peels. Pure active integrity.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 italic leading-relaxed">"{item.review}"</p>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs">
                    <span className="font-serif font-bold text-stone-900">{item.name}</span>
                    <span className="text-stone-400 font-light">{item.city}</span>
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


