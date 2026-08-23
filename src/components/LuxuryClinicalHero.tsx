import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Droplets, ShieldCheck, ArrowRight, Check, Eye, ChevronRight, Activity, Zap } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { CareBrandLogo } from './CareBrandLogo';

interface LuxuryClinicalHeroProps {
  moisturizerProduct?: Product;
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onExploreLabClick?: () => void;
  onViewProductDetail?: (product: Product) => void;
}

export const LuxuryClinicalHero: React.FC<LuxuryClinicalHeroProps> = ({
  moisturizerProduct,
  onAddToCart,
  onBuyNow,
  onExploreLabClick,
  onViewProductDetail,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'benefits' | 'actives' | 'clinical'>('benefits');
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move for subtle 3D parallax lighting tilt on the hero bottle
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const currentVariant = moisturizerProduct?.variants?.[selectedVariantIndex] || {
    id: 'var-hm-50g',
    productId: 'prod-hydrating-moisturizer',
    name: '50g Clinical Tube',
    price: 599,
    compareAtPrice: 799,
    stock: 50,
  };

  const handleQuickAdd = () => {
    if (moisturizerProduct && onAddToCart) {
      onAddToCart(moisturizerProduct, currentVariant as ProductVariant, 1);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  return (
    <section
      id="hero-section"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] pt-28 pb-16 px-4 sm:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#FAFAFA] to-[#F5F5F7] overflow-hidden flex items-center border-b border-gray-100"
    >
      {/* Background Water Curves & Clinical Refractive Ripples (High-End Studio Lighting) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Organic Water Curves SVG */}
        <svg
          className="absolute w-full h-full opacity-40 mix-blend-multiply"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 450 C300 200, 600 700, 1100 350 C1300 200, 1500 500, 1600 400"
            stroke="url(#waterCurveGrad1)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <path
            d="M-50 250 C400 450, 750 150, 1200 480 C1400 580, 1550 300, 1650 350"
            stroke="url(#waterCurveGrad2)"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M100 800 C450 600, 800 850, 1300 620"
            stroke="url(#waterCurveGrad1)"
            strokeWidth="1"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="waterCurveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A227" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="waterCurveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#E8C76A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Studio Lighting Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#E8C76A]/10 via-[#F1F5F9]/60 to-white/80 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 1.5}px), ${mousePos.y * 1.5}px)`,
          }}
        />

        <div className="absolute -top-32 right-10 w-96 h-96 bg-gradient-to-bl from-[#C9A227]/8 via-transparent to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-slate-200/40 via-transparent to-transparent rounded-full blur-2xl" />
      </div>

      {/* Main Hero Container */}
      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Clinical Title, Authority Value Proposition, Actions (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-7">
          
          {/* Clinical Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8C6A12]"></span>
            </span>
            <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-gray-700">
              Dermatological Grade • Stratum Corneum Bio-Matrix
            </span>
          </div>

          {/* Main Headline in Sophisticated Serif Typography */}
          <div className="space-y-2">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-normal tracking-tight text-gray-900 leading-[1.12]">
              Clinical Active Skincare &amp;{' '}
              <span className="italic font-light bg-gradient-to-r from-gray-900 via-[#8C6A12] to-[#C9A227] bg-clip-text text-transparent">
                Barrier Formulations
              </span>
            </h1>
            <p className="font-sans text-base sm:text-lg font-light text-gray-600 leading-relaxed max-w-2xl pt-1">
              Precision dermatological care engineered with multi-molecular <strong className="font-medium text-gray-900">3x Ceramides</strong>, <strong className="font-medium text-gray-900">Niacinamide</strong>, and biomimetic hydrators to restore stratum corneum lipid integrity for continuous 72-hour moisture lock.
            </p>
          </div>

          {/* Key Clinical Metric Highlights (Frosted Glass Pill Row) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold text-gray-900">72H</span>
              <span className="text-[11px] font-sans text-gray-500 font-light tracking-wide uppercase mt-0.5">
                Hydration Lock
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#8C6A12]">3x</span>
              <span className="text-[11px] font-sans text-gray-500 font-light tracking-wide uppercase mt-0.5">
                Bio-Ceramides
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold text-gray-900">pH 5.5</span>
              <span className="text-[11px] font-sans text-gray-500 font-light tracking-wide uppercase mt-0.5">
                Acid Mantle Safe
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-800">98%</span>
              <span className="text-[11px] font-sans text-gray-500 font-light tracking-wide uppercase mt-0.5">
                Barrier Recovery
              </span>
            </div>
          </div>

          {/* Action CTAs and Price Indicator */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            {/* Primary Action Button */}
            <button
              id="hero-buy-moisturizer-btn"
              onClick={handleQuickAdd}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#111827] hover:bg-black text-white font-sans text-sm font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_10px_28px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(201,162,39,0.3)] group cursor-pointer active:scale-95 border border-[#C9A227]/30"
            >
              <span className="bg-gradient-to-r from-white via-[#FDF8EE] to-[#E8C76A] bg-clip-text text-transparent group-hover:text-white">
                Add Hydrating Moisturizer — ₹{currentVariant.price}
              </span>
              <ArrowRight className="w-4 h-4 text-[#E8C76A] transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary Sensory Bio-Lab Trigger */}
            <button
              id="hero-explore-biolab-btn"
              onClick={() => {
                const biolab = document.getElementById('interactive-biolab-hub');
                if (biolab) {
                  biolab.scrollIntoView({ behavior: 'smooth' });
                } else if (onExploreLabClick) {
                  onExploreLabClick();
                }
              }}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-white/80 hover:bg-white text-gray-800 border border-gray-300/80 hover:border-[#C9A227]/60 font-sans text-xs font-medium tracking-wider uppercase transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#C9A227]" />
              <span>3D Sensory Bio-Lab Hub</span>
            </button>
          </div>

          {/* Quick Trust Strip */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-500 font-light pt-2">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#C9A227]" /> Non-Comedogenic
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#C9A227]" /> 0% Synthetic Fragrance
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#C9A227]" /> Dermatologically Tested
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#C9A227]" /> Free Express India Shipping
            </span>
          </div>

        </div>

        {/* Right Column: High-End Luxury Product Shot of Hydrating Moisturizer with Gold Cap (5 Cols) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          {/* Frosted Glass Floating Presentation Stage */}
          <div
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-[32px] bg-gradient-to-b from-white/95 via-white/80 to-[#FAFAFA]/90 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_25px_70px_rgba(201,162,39,0.12)] group"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
            }}
          >
            {/* Top Card Badges */}
            <div className="flex items-center justify-between z-20">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#111827] text-[#E8C76A] text-[10px] font-sans font-semibold tracking-widest uppercase">
                FLAGSHIP NO. 02
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-sans font-medium text-gray-500 bg-gray-100/80 px-2.5 py-0.5 rounded-full">
                <span className="text-[#C9A227]">★</span> 4.9 (148 Reviews)
              </span>
            </div>

            {/* Studio Lighting Radial Highlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-[#E8C76A]/20 via-[#F3F4F6]/60 to-transparent blur-xl pointer-events-none" />

            {/* Main Luxury Product Shot (Hydrating Moisturizer with Metallic Gold Cap) */}
            <div className="relative flex-1 flex items-center justify-center my-2 select-none">
              <div className="relative w-full h-[280px] sm:h-[310px] flex items-center justify-center">
                
                {/* SVG High-End Product Bottle Graphic with Metallic Gold Cap */}
                <img
                  src="/images/care-hydrating-moisturizer.svg"
                  alt="Care Beauty Solution - Hydrating Moisturizer with Gold Cap"
                  className="max-h-full w-auto object-contain drop-shadow-[0_24px_36px_rgba(140,106,18,0.22)] transition-transform duration-500 group-hover:scale-105"
                />

                {/* Micro Sensory Texture Zoom Tag */}
                <div className="absolute bottom-4 right-2 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-lg flex items-center gap-2.5 animate-bounce-subtle">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FCFAF7] to-[#F1E9DA] border border-[#C9A227]/40 flex items-center justify-center overflow-hidden shadow-inner">
                    {/* Visual texture droplet */}
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#C9A227]/40 via-white to-white/90 shadow-sm blur-[0.5px]" />
                  </div>
                  <div className="flex flex-col pr-1">
                    <span className="text-[10px] font-sans font-bold text-gray-900 tracking-tight">Velvet Cushion</span>
                    <span className="text-[9px] font-sans text-gray-500">Non-Greasy Finish</span>
                  </div>
                </div>

                {/* Active Ingredient Pip */}
                <div className="absolute top-6 left-0 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-md flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span className="text-[10px] font-sans font-medium text-gray-800 tracking-wider">
                    Ceramides NP/AP/EOP
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Card Controls: Variant Selector & Direct Add */}
            <div className="relative z-20 pt-2 border-t border-gray-100/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {(moisturizerProduct?.variants || [
                  { id: 'v1', name: '50g', price: 599 },
                  { id: 'v2', name: '100g', price: 999 },
                ]).map((v, i) => (
                  <button
                    key={v.id || i}
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 ${
                      selectedVariantIndex === i
                        ? 'bg-[#111827] text-[#E8C76A] shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {v.name.includes('50g') ? '50g' : v.name.includes('100g') ? '100g' : v.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs text-gray-400 line-through mr-1.5">₹{currentVariant.compareAtPrice || 799}</span>
                  <span className="font-serif text-lg font-bold text-gray-900">₹{currentVariant.price}</span>
                </div>

                <button
                  onClick={handleQuickAdd}
                  className="p-2.5 rounded-full bg-[#C9A227] hover:bg-[#8C6A12] text-white transition-colors duration-200 shadow-md cursor-pointer active:scale-95"
                  title="Add to Cart"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Added Toast */}
            {addedToast && (
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-30 py-3 px-4 rounded-2xl bg-[#111827]/95 backdrop-blur-md text-white text-center text-xs font-sans font-medium tracking-wide shadow-2xl flex items-center justify-center gap-2 border border-[#C9A227]">
                <Check className="w-4 h-4 text-[#E8C76A]" />
                <span>Added to Clinical Routine!</span>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
