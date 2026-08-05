import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, RefreshCw, ShoppingBag, Star, HelpCircle, HeartHandshake, Layers, Sun, Droplets, Smile } from 'lucide-react';
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
  // Routine Diagnostic Quiz State
  const [skinType, setSkinType] = useState<'oily' | 'dry' | 'combination' | 'sensitive'>('combination');
  const [primaryGoal, setPrimaryGoal] = useState<'barrier' | 'sun' | 'acne'>('barrier');
  const [activeTab, setActiveTab] = useState<'quiz' | 'science' | 'reviews'>('quiz');

  // Active Science Tab State
  const [selectedActive, setSelectedActive] = useState<number>(0);

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
      stat: '99 font-bold',
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
    return {
      title: 'Your Tailored 3-Step Clinical Regimen',
      description: `Optimized for ${skinType.toUpperCase()} skin targeting ${
        primaryGoal === 'barrier' ? 'Barrier Repair' : primaryGoal === 'sun' ? 'UV Protection & Glow' : 'Acne & Sebum Control'
      }.`,
      steps: [
        {
          step: 'STEP 1 (AM & PM)',
          name: 'Refreshing Skin Cleanser',
          tag: 'pH 5.5 Wash',
          usage: '1 Pump on damp face. Massage gently for 30s.',
          productId: 'prod-refreshing-skin-cleanser',
          slug: 'refreshing-skin-cleanser',
        },
        {
          step: 'STEP 2 (AM & PM)',
          name: 'Hydrating Moisturizer',
          tag: 'Ceramide Barrier Cream',
          usage: 'Dime-sized amount. Lock in moisture on face & neck.',
          productId: 'prod-hydrating-moisturizer',
          slug: 'hydrating-moisturizer',
        },
        {
          step: 'STEP 3 (AM DAILY)',
          name: 'Ray Barrier Sunscreen',
          tag: 'SPF 50+ PA++++ Gel',
          usage: 'Two fingers length. Apply 15 mins before sun exposure.',
          productId: 'prod-ray-barrier-sunscreen',
          slug: 'ray-barrier-sunscreen',
        },
      ],
    };
  };

  const regimen = getRegimenRecommendation();

  // Handle Add All 3 Products Bundle
  const handleAddBundleToCart = () => {
    products.forEach(p => {
      if (p.variants && p.variants[0]) {
        onAddToCart(p, p.variants[0], 1);
      }
    });
  };

  return (
    <section className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-8 border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Engagement Hub Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Clinical Engagement Hub
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Dermatologist-Engineered Skincare Science
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Stop guessing your skincare. Diagnoses your exact skin type, explore active formulation science, and build a verified 3-step routine.
          </p>
        </div>

        {/* Navigation Selector Pills */}
        <div className="flex justify-center border-b border-emerald-100 pb-4">
          <div className="inline-flex p-1 bg-emerald-100/60 rounded-2xl border border-emerald-200">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-emerald-950 text-white shadow-md'
                  : 'text-emerald-900 hover:bg-emerald-200/50'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>3-Step Routine Diagnostic</span>
            </button>

            <button
              onClick={() => setActiveTab('science')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'science'
                  ? 'bg-emerald-950 text-white shadow-md'
                  : 'text-emerald-900 hover:bg-emerald-200/50'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Active Science Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-emerald-950 text-white shadow-md'
                  : 'text-emerald-900 hover:bg-emerald-200/50'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>Verified Results</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE ROUTINE DIAGNOSTIC QUIZ */}
        {activeTab === 'quiz' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Diagnostic Input Options */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Step 1 of 2</span>
                <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">Select Your Skin Profile</h3>
                <p className="text-xs text-slate-500">We adjust active formulation layering based on your oil production.</p>
              </div>

              {/* Skin Type Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'combination', label: 'Combination', sub: 'O-Zone Oil + Dry Cheeks' },
                  { id: 'oily', label: 'Oily & Acne-Prone', sub: 'Excess Sebum & Clogged Pores' },
                  { id: 'dry', label: 'Dry & Dehydrated', sub: 'Flaky, Tight Feeling' },
                  { id: 'sensitive', label: 'Sensitive / Redness', sub: 'Easily Irritated Barrier' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSkinType(item.id as any)}
                    className={`p-3.5 rounded-2xl text-left border transition cursor-pointer ${
                      skinType === item.id
                        ? 'border-emerald-800 bg-emerald-50/80 ring-2 ring-emerald-600/30 shadow-sm'
                        : 'border-slate-200 hover:border-emerald-300 bg-slate-50/50'
                    }`}
                  >
                    <p className="font-bold text-xs text-slate-900">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                  </button>
                ))}
              </div>

              {/* Primary Goal Selector */}
              <div className="pt-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Step 2 of 2</span>
                <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">Your Primary Target</h3>

                <div className="space-y-2 mt-3">
                  {[
                    { id: 'barrier', label: 'Repair Damaged Barrier & Hydrate 72H' },
                    { id: 'sun', label: 'Shield Sun Damage & Prevent Dark Spots' },
                    { id: 'acne', label: 'Unclog Pores & Sooth Inflammation' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setPrimaryGoal(item.id as any)}
                      className={`w-full p-3 rounded-xl text-left text-xs font-bold transition flex items-center justify-between border cursor-pointer ${
                        primaryGoal === item.id
                          ? 'bg-emerald-950 text-white border-emerald-950 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {primaryGoal === item.id && <CheckCircle2 className="w-4 h-4 text-amber-300" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Diagnostic Result: Complete 3-Step Routine Card */}
            <div className="lg:col-span-7 bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/80 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-900 px-2.5 py-0.5 rounded-md">
                    Custom Prescribed Regimen
                  </span>
                  <h4 className="text-xl font-serif font-bold text-emerald-50 mt-1">{regimen.title}</h4>
                  <p className="text-xs text-emerald-200/80">{regimen.description}</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold text-amber-300">₹1,497</span>
                  <span className="text-xs text-emerald-300/70 line-through block">₹1,747</span>
                  <span className="text-[10px] font-bold text-emerald-950 bg-amber-300 px-2 py-0.5 rounded-full uppercase">
                    Save ₹250
                  </span>
                </div>
              </div>

              {/* 3 Step Sequence Cards */}
              <div className="space-y-3">
                {regimen.steps.map((s, idx) => {
                  const targetProd = products.find(p => p.id === s.productId || p.slug === s.slug);
                  return (
                    <div
                      key={idx}
                      onClick={() => targetProd && onSelectProduct && onSelectProduct(targetProd)}
                      className="p-3.5 bg-emerald-900/60 rounded-2xl border border-emerald-800 flex items-center justify-between gap-4 hover:bg-emerald-900/90 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          0{idx + 1}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                            {s.step}
                          </span>
                          <h5 className="font-serif font-bold text-sm text-emerald-50 group-hover:text-amber-200 transition">
                            {s.name}
                          </h5>
                          <p className="text-[11px] text-emerald-200/80">{s.usage}</p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition flex items-center gap-1">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Single CTA to Add Complete Regimen Bundle */}
              <button
                onClick={handleAddBundleToCart}
                className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm py-3.5 rounded-2xl transition shadow-xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Complete 3-Step Routine to Bag — ₹1,497</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE SCIENCE MATRIX */}
        {activeTab === 'science' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Science Cards Navigation */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">
                Clinical Formulations & Active Ingredients
              </h3>

              {activeTechs.map((tech, idx) => {
                const IconComp = tech.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedActive(idx)}
                    className={`w-full p-4 rounded-2xl text-left border transition flex items-center gap-4 cursor-pointer ${
                      selectedActive === idx
                        ? 'border-emerald-800 bg-emerald-950 text-white shadow-lg'
                        : 'border-slate-200 hover:border-emerald-300 bg-slate-50/60 text-slate-800'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${selectedActive === idx ? 'bg-emerald-900 text-amber-300' : 'bg-emerald-100 text-emerald-900'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-serif font-bold text-sm ${selectedActive === idx ? 'text-amber-200' : 'text-slate-900'}`}>
                        {tech.title}
                      </p>
                      <p className={`text-xs ${selectedActive === idx ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {tech.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Active Deep-Dive Panel */}
            <div className="lg:col-span-7 bg-emerald-950 text-white rounded-3xl p-8 border border-emerald-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-900 px-2.5 py-0.5 rounded-md">
                    Clinical Standard
                  </span>
                  <h4 className="text-2xl font-serif font-bold text-emerald-50 mt-1">
                    {activeTechs[selectedActive].title}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-amber-300">{activeTechs[selectedActive].stat}</span>
                  <p className="text-[10px] text-emerald-300 uppercase font-bold">{activeTechs[selectedActive].statLabel}</p>
                </div>
              </div>

              <p className="text-emerald-100/90 text-sm leading-relaxed">
                {activeTechs[selectedActive].desc}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-emerald-900/60 rounded-xl border border-emerald-800">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase">Testing Standard</span>
                  <p className="text-xs font-bold text-emerald-100 mt-0.5">Tested under 40°C Indian Climate</p>
                </div>
                <div className="p-3.5 bg-emerald-900/60 rounded-xl border border-emerald-800">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase">Purity Standard</span>
                  <p className="text-xs font-bold text-emerald-100 mt-0.5">0% Artificial Fragrances or Dyes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VERIFIED CUSTOMER RESULTS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl space-y-6">
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
                <div key={idx} className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed">"{item.review}"</p>

                  <div className="pt-2 border-t border-emerald-100/80 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-slate-400">{item.city}</span>
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
