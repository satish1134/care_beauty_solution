import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, ShieldCheck, Flame, Star, ShoppingBag, ArrowRight, Eye, Droplets, Image as ImageIcon, Layers, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface BannerProps {
  products?: Product[];
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const Banner: React.FC<BannerProps> = ({ products = [], onAddToCart, onBuyNow, onSelectProduct }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'STUDIO' | 'FORMULA' | 'TEXTURE'>('STUDIO');
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // 3 Core Clinical Hero Formulations
  const slides = [
    {
      id: 'prod-refreshing-skin-cleanser',
      sticker: '⚡ 100% SOAP-FREE • pH 5.5',
      stickerColor: 'bg-[#CCFF00] text-black',
      viralTag: '🔥 #1 BESTSELLER',
      title: 'Soap-Free Barrier Gel Cleanser',
      tagline: '2% Niacinamide + D-Panthenol B5 Deep Epidermal Cleanser',
      subtitle: 'Clinical high-potency barrier wash engineered to purge daily micro-pollutants and sebum without stripping your moisture barrier.',
      clinicalClaims: [
        'Soap-Free & pH 5.5 Balanced',
        '2% Niacinamide + Panthenol B5',
        'Zero White Foam & 0% Stripping',
        'Acne & Sensitive Skin Safe'
      ],
      price: 499,
      originalPrice: 699,
      discount: '28% OFF',
      rating: 4.9,
      reviewCount: 1240,
      slug: 'refreshing-skin-cleanser',
      formulaHighlights: {
        active: '2.0% Niacinamide + 1.0% D-Panthenol',
        texture: 'Crystal Clear Non-Foaming Gel',
        skinType: 'All Skin Types (Acne & Sensitive)',
        usage: 'AM / PM Daily Barrier Reset'
      },
      imageUrl: '/images/care-cleanser-1-hero-marble.svg',
      photoAngles: [
        { title: 'Marble Studio', label: 'Primary Hero', url: '/images/care-cleanser-1-hero-marble.svg' },
        { title: 'Isolated Bottle', label: 'Studio Cutout', url: '/images/care-cleanser-2-studio-isolated.svg' },
        { title: 'Luxury Vanity', label: 'Lifestyle Shot', url: '/images/care-cleanser-3-lifestyle-vanity.svg' },
        { title: 'Gel Swatch', label: 'Texture Macro', url: '/images/care-cleanser-texture.svg' },
        { title: 'Precision Pump', label: 'Dispenser Macro', url: '/images/care-cleanser-5-pump-closeup.svg' },
        { title: 'Label Clinical', label: 'Active Specs', url: '/images/care-cleanser-6-label-detail.svg' },
        { title: 'Quarter Left', label: '30° Rotation', url: '/images/care-cleanser-8-quarter-left.svg' },
        { title: 'Quarter Right', label: '330° Rotation', url: '/images/care-cleanser-9-quarter-right.svg' },
        { title: 'Ambient Spa', label: 'Spa Aesthetic', url: '/images/care-cleanser-10-bathroom-ambient.svg' },
      ]
    },
    {
      id: 'prod-hydrating-moisturizer',
      sticker: '💧 72H HYDRATION LOCK',
      stickerColor: 'bg-[#00F0FF] text-black',
      viralTag: '🧪 3X CERAMIDES NP/AP/EOP',
      title: '72-Hour Ceramide Moisture Lock',
      tagline: 'Triple Ceramide Complex + Hyaluronic Acid Lipid Shield',
      subtitle: 'Clinical intensive recovery matrix designed to instantly soothe dry, compromised barriers and lock in high-gloss moisture.',
      clinicalClaims: [
        '3x Essential Ceramide Complex',
        'Hyaluronic Acid Moisture Magnet',
        'Non-Greasy Velvet Absorption',
        '72-Hour Continuous Hydration'
      ],
      price: 599,
      originalPrice: 799,
      discount: '25% OFF',
      rating: 4.8,
      reviewCount: 980,
      slug: 'hydrating-moisturizer',
      formulaHighlights: {
        active: 'Ceramides NP/AP/EOP + 2% HA',
        texture: 'Ultra-Rich Velvet Barrier Cream',
        skinType: 'Dry, Dehydrated & Damaged Skin',
        usage: 'Twice Daily Post-Cleanse'
      },
      imageUrl: '/images/care-hydrating-moisturizer.svg',
      photoAngles: [
        { title: 'Front Dispenser', label: 'Primary View', url: '/images/care-hydrating-moisturizer.svg' },
        { title: 'Studio Lighting', label: 'Isolated Shot', url: '/images/care-hydrating-moisturizer.svg' },
        { title: 'Cream Texture', label: 'Rich Swatch', url: '/images/care-hydrating-moisturizer.svg' },
      ]
    },
    {
      id: 'prod-ray-barrier-sunscreen',
      sticker: '☀️ SPF 50+ PA++++ DEFENSE',
      stickerColor: 'bg-[#FF007F] text-white',
      viralTag: '⚡ ZERO WHITE CAST',
      title: 'Broad Spectrum SPF 50+ PA++++',
      tagline: 'Invisible Water-Light Gel Sunscreen + Anti-Pollution Shield',
      subtitle: 'Ultra-lightweight invisible shield formulated for hot and humid climates. Leaves zero sticky residue and delivers 80-minute sweat resistance.',
      clinicalClaims: [
        'PA++++ Highest Defense Rating',
        'Zero White Cast Clear Finish',
        '80-Min Sweat & Water Resistant',
        'Blue Light & Infrared Filter'
      ],
      price: 649,
      originalPrice: 849,
      discount: '23% OFF',
      rating: 4.9,
      reviewCount: 1120,
      slug: 'ray-barrier-sunscreen',
      formulaHighlights: {
        active: 'Photostable Hybrid UV Filters',
        texture: 'Water-Burst Clear Matte Gel',
        skinType: 'All Skin Types (Oil-Control)',
        usage: 'Apply generously 15m prior to sun'
      },
      imageUrl: '/images/care-ray-barrier-sunscreen.svg',
      photoAngles: [
        { title: 'Front Sunscreen', label: 'Primary Shield', url: '/images/care-ray-barrier-sunscreen.svg' },
        { title: 'Clear Gel Swatch', label: 'Zero Cast Swatch', url: '/images/care-ray-barrier-sunscreen.svg' },
        { title: 'Clinical UV Pack', label: 'Studio Detail', url: '/images/care-ray-barrier-sunscreen.svg' },
      ]
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
    setActivePhotoIndex(0);
    setActiveViewMode('STUDIO');
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    setActivePhotoIndex(0);
    setActiveViewMode('STUDIO');
  };

  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 7500);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentSlide]);

  const activeSlide = slides[currentSlide];
  const activeProduct = products.find(p => p.id === activeSlide.id || p.slug === activeSlide.slug) || products[0];

  const currentDisplayImage = activeSlide.photoAngles && activeSlide.photoAngles[activePhotoIndex]
    ? activeSlide.photoAngles[activePhotoIndex].url
    : activeSlide.imageUrl;

  const handleBuyNow = () => {
    if (activeProduct) {
      const primaryVariant = activeProduct.variants[0];
      if (onBuyNow) {
        onBuyNow(activeProduct, primaryVariant, 1);
      } else if (onAddToCart) {
        onAddToCart(activeProduct, primaryVariant, 1);
      }
    }
  };

  const handleAddToCart = () => {
    if (activeProduct && onAddToCart) {
      const primaryVariant = activeProduct.variants[0];
      onAddToCart(activeProduct, primaryVariant, 1);
    }
  };

  const handleExplore = () => {
    if (activeProduct && onSelectProduct) {
      onSelectProduct(activeProduct);
    }
  };

  return (
    <section
      aria-label="Acid Beauty Cyber Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#06070B] text-slate-100 py-8 lg:py-14 border-b border-white/10 bg-cyber-grid"
    >
      {/* High-Energy Neon Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#CCFF00]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00F0FF]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#FF007F]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetric Cyber Header Bar with Holographic Stickers */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Sticker Pill 1 */}
            <span className="sticker-tag bg-[#CCFF00] text-black text-[11px] px-3.5 py-1 rotate-[-2deg]">
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>ACID BEAUTY PROTOCOL</span>
            </span>

            {/* Sticker Pill 2 */}
            <span className="sticker-tag bg-[#00F0FF] text-black text-[11px] px-3 py-1 rotate-[1deg] hidden sm:inline-flex">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>CLINICAL ZERO-G LAB</span>
            </span>

            {/* Live Lab Batch Status */}
            <span className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
              <span>LAB BATCH: FRESH 2026-AUG</span>
            </span>
          </div>

          {/* Social Proof Counter */}
          <div className="flex items-center gap-2 bg-[#121624] px-4 py-1.5 rounded-2xl border border-white/15 shadow-neon-lime text-xs">
            <div className="flex items-center text-[#FFE600]">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-3.5 h-3.5 fill-[#FFE600] text-[#FFE600]" />
              ))}
            </div>
            <span className="font-black text-white">{activeSlide.rating}</span>
            <span className="text-slate-400 font-medium">({activeSlide.reviewCount.toLocaleString()} Verified Drops)</span>
          </div>
        </div>

        {/* Main Asymmetric 2-Column Cyber Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Neon Typography, Clinical Specs, Pricing & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-5"
              >
                {/* Floating Sticker Tags */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`sticker-tag ${activeSlide.stickerColor} text-xs px-3.5 py-1 rotate-[-1deg]`}>
                    {activeSlide.sticker}
                  </span>
                  <span className="sticker-tag bg-white text-black text-xs px-3 py-1 rotate-[2deg]">
                    {activeSlide.viralTag}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#CCFF00] bg-black/60 px-2.5 py-1 rounded-md border border-[#CCFF00]/40">
                    SLIDE 0{currentSlide + 1} / 0{totalSlides}
                  </span>
                </div>

                {/* Primary Semantic H1 Heading with Cyber-Glow */}
                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.08] text-white">
                  {activeSlide.title}
                </h1>

                {/* Tagline & Subtitle */}
                <p className="text-base sm:text-lg font-bold text-[#00F0FF]">
                  {activeSlide.tagline}
                </p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {activeSlide.subtitle}
                </p>

                {/* Clinical Proof Matrix with Tactile Claymorphic Chips */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {activeSlide.clinicalClaims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#121624] px-3.5 py-2.5 rounded-2xl border border-white/10 shadow-inner text-xs font-bold text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0" />
                      <span className="truncate">{claim}</span>
                    </div>
                  ))}
                </div>

                {/* Claymorphic Cyber Pricing Container */}
                <div className="pt-2">
                  <div className="clay-card p-4 sm:p-5 border border-white/15 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          ₹{activeSlide.price}
                        </span>
                        <span className="text-base text-slate-400 line-through font-mono">
                          ₹{activeSlide.originalPrice}
                        </span>
                        <span className="sticker-tag bg-[#CCFF00] text-black text-[11px] px-2.5 py-0.5 rotate-[-2deg]">
                          SAVE {activeSlide.discount}
                        </span>
                      </div>
                      <p className="text-xs text-[#00F0FF] font-mono mt-1 font-semibold">
                        ✓ All Taxes Included • Free Express Courier
                      </p>
                    </div>

                    {/* Stock status indicator */}
                    <div className="flex items-center gap-2 bg-black/60 px-3.5 py-1.5 rounded-xl border border-[#CCFF00]/40">
                      <Activity className="w-4 h-4 text-[#CCFF00] animate-pulse" />
                      <span className="text-xs font-mono font-bold text-slate-200">
                        In Stock (Ships Today)
                      </span>
                    </div>
                  </div>
                </div>

                {/* High-Energy Tactile CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  {/* BUY NOW Button (Claymorphic Lime Button) */}
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 sm:flex-initial px-8 py-4 rounded-2xl clay-button-lime text-black font-black text-sm uppercase tracking-wider shadow-neon-lime transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    <span>INSTANT BUY — ₹{activeSlide.price}</span>
                  </button>

                  {/* ADD TO BAG Button (Claymorphic Cyan Button) */}
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-4 rounded-2xl clay-button-cyan text-black font-black text-sm uppercase tracking-wider shadow-neon-cyan transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 fill-black" />
                    <span>+ DROP IN BAG</span>
                  </button>

                  {/* EXPLORE Button */}
                  <button
                    onClick={handleExplore}
                    className="px-4 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Full Specs</span>
                    <ArrowRight className="w-4 h-4 text-[#CCFF00]" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Glassmorphic 3D Showcase & Multi-Angle Controller */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* View Mode Pill Selector */}
            <div className="w-full max-w-md mb-3 flex items-center justify-between">
              <div className="bg-[#121624] p-1 rounded-2xl border border-white/15 flex items-center gap-1">
                <button
                  onClick={() => setActiveViewMode('STUDIO')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 cursor-pointer ${
                    activeViewMode === 'STUDIO'
                      ? 'bg-[#CCFF00] text-black shadow-neon-lime'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>360° Studio</span>
                </button>

                <button
                  onClick={() => setActiveViewMode('FORMULA')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 cursor-pointer ${
                    activeViewMode === 'FORMULA'
                      ? 'bg-[#00F0FF] text-black shadow-neon-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Formula</span>
                </button>

                <button
                  onClick={() => setActiveViewMode('TEXTURE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 cursor-pointer ${
                    activeViewMode === 'TEXTURE'
                      ? 'bg-[#FF007F] text-white shadow-neon-pink'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Texture</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#00F0FF] font-bold">
                {activeSlide.photoAngles?.length || 1} ANGLES
              </span>
            </div>

            {/* Main Stage Glassmorphic Container with Neon Glares */}
            <div className="w-full max-w-md relative glass-cyber-glow rounded-3xl p-5 border border-white/20 shadow-2xl overflow-hidden">
              
              {/* Top Cyber Accent Lines */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#CCFF00] via-[#00F0FF] to-[#FF007F]" />

              {/* STUDIO MODE */}
              {activeViewMode === 'STUDIO' && (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-[#151928] via-[#0e121d] to-[#090b12] flex items-center justify-center p-4 border border-white/10 group">
                    <img
                      src={currentDisplayImage}
                      alt={activeSlide.title}
                      className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Floating Holographic Badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-[#CCFF00] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase border border-[#CCFF00]/40">
                      📷 {activeSlide.photoAngles?.[activePhotoIndex]?.title || 'Hero View'}
                    </div>

                    {/* Full Specs Button */}
                    <button
                      onClick={handleExplore}
                      className="absolute bottom-3 right-3 bg-black/80 backdrop-blur hover:bg-[#CCFF00] hover:text-black text-white text-xs font-bold px-3.5 py-1.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Inspect</span>
                    </button>
                  </div>

                  {/* Multi-Angle Interactive Thumbnails Strip */}
                  {activeSlide.photoAngles && activeSlide.photoAngles.length > 1 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                        <span className="uppercase tracking-wider font-bold">Select Angle:</span>
                        <span className="text-[#CCFF00]">{activeSlide.photoAngles[activePhotoIndex]?.label}</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {activeSlide.photoAngles.map((angle, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 p-0.5 bg-[#090B12] cursor-pointer ${
                              activePhotoIndex === idx
                                ? 'border-[#CCFF00] ring-2 ring-[#CCFF00]/40 scale-105 shadow-neon-lime'
                                : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/40'
                            }`}
                            title={angle.title}
                          >
                            <img src={angle.url} alt={angle.title} className="w-full h-full object-cover rounded-lg" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FORMULA MODE */}
              {activeViewMode === 'FORMULA' && (
                <div className="aspect-square flex flex-col justify-between p-4 bg-[#090C16] text-white rounded-2xl space-y-4 border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-xs font-black text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> Actives Breakdown
                    </span>
                    <span className="text-[10px] font-mono text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/30">
                      ISO 9001:2026
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Concentration Target:</p>
                      <p className="font-bold text-[#CCFF00] text-sm mt-0.5">{activeSlide.formulaHighlights.active}</p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Galenic Matrix:</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{activeSlide.formulaHighlights.texture}</p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Target Epidermal Barrier:</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{activeSlide.formulaHighlights.skinType}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveViewMode('STUDIO')}
                    className="w-full py-2.5 rounded-xl bg-[#00F0FF] text-black font-black text-xs uppercase transition text-center cursor-pointer shadow-neon-cyan"
                  >
                    Back to 360° Studio
                  </button>
                </div>
              )}

              {/* TEXTURE MODE */}
              {activeViewMode === 'TEXTURE' && (
                <div className="aspect-square flex flex-col justify-between p-4 bg-[#090C16] rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black text-[#FF007F] uppercase tracking-wider flex items-center gap-1.5">
                      <Droplets className="w-4 h-4" /> Sensorial Texture Macro
                    </span>
                    <span className="text-[10px] font-bold text-white bg-[#FF007F]/20 px-2 py-0.5 rounded border border-[#FF007F]/40">
                      Non-Comedogenic
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={activeSlide.photoAngles?.find(a => a.label.includes('Texture') || a.label.includes('Swatch'))?.url || activeSlide.imageUrl}
                      alt="Texture Swatch"
                      className="max-h-44 object-contain rounded-xl shadow-neon-pink border border-white/20"
                    />
                  </div>

                  <p className="text-xs text-slate-300 text-center font-mono">
                    Zero white-cast, rapid penetration matrix designed for tropical climates.
                  </p>

                  <button
                    onClick={() => setActiveViewMode('STUDIO')}
                    className="w-full py-2.5 rounded-xl bg-[#FF007F] text-white font-black text-xs uppercase transition text-center cursor-pointer shadow-neon-pink"
                  >
                    Return to Product View
                  </button>
                </div>
              )}
            </div>

            {/* Quick Product Select Chips */}
            <div className="w-full max-w-md grid grid-cols-3 gap-2 mt-4">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setActivePhotoIndex(0);
                    setActiveViewMode('STUDIO');
                  }}
                  className={`p-2 rounded-2xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    currentSlide === idx
                      ? 'bg-[#181D2F] border-[#CCFF00] shadow-neon-lime ring-1 ring-[#CCFF00] scale-[1.02]'
                      : 'bg-[#0E121E] border-white/10 text-slate-400 hover:bg-[#151928]'
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-8 h-8 object-cover rounded-lg shrink-0 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <p className={`text-[9px] font-mono font-bold uppercase truncate ${currentSlide === idx ? 'text-[#CCFF00]' : 'text-slate-400'}`}>
                      0{idx + 1} {slide.title.split(' ')[0]}
                    </p>
                    <p className="text-[11px] font-black text-white truncate">
                      ₹{slide.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Carousel Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-4 z-20">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-black/80 text-white hover:bg-[#CCFF00] hover:text-black border border-white/20 transition active:scale-90 cursor-pointer shadow-lg"
            aria-label="Previous Formulation"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 lg:right-4 z-20">
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-black/80 text-white hover:bg-[#CCFF00] hover:text-black border border-white/20 transition active:scale-90 cursor-pointer shadow-lg"
            aria-label="Next Formulation"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Acid Beauty Trust Ribbon */}
        <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="clay-card p-4 flex items-center gap-3.5 border border-white/10">
            <div className="w-11 h-11 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">100% Bio-Active Formulations</h3>
              <p className="text-[11px] text-slate-400 font-mono">0% Sulfates, 0% Parabens, 0% Artificial Fillers.</p>
            </div>
          </div>

          <div className="clay-card p-4 flex items-center gap-3.5 border border-white/10">
            <div className="w-11 h-11 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Derm Tested for Indian Skin</h3>
              <p className="text-[11px] text-slate-400 font-mono">Clinically trialed under tropical humidity.</p>
            </div>
          </div>

          <div className="clay-card p-4 flex items-center gap-3.5 border border-white/10">
            <div className="w-11 h-11 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/30 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-[#FF007F]" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Fast 2-4 Day Pan-India Dispatch</h3>
              <p className="text-[11px] text-slate-400 font-mono">Real-time SMS &amp; WhatsApp order tracking.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
