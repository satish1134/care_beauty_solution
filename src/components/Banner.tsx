import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, Award, CheckCircle2, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Eye, Image as ImageIcon, Droplets, Star, RefreshCw, ZoomIn, Layers } from 'lucide-react';
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
  const [isZoomed, setIsZoomed] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // 3 Core Clinical Hero Formulations with Authentic Studio Angles & Dermatological Profiles
  const slides = [
    {
      id: 'prod-refreshing-skin-cleanser',
      badge: 'FLAGSHIP FORMULATION • pH 5.5 BALANCED',
      title: 'Soap-Free Barrier Gel Cleanser',
      tagline: 'Pure Niacinamide & Panthenol Gentle Facial & Body Wash',
      subtitle: 'Dermatologist-engineered soap-free clinical cleanser that deeply dissolves impurities and environmental pollutants without stripping vital epidermal lipids.',
      clinicalClaims: [
        'Soap-Free & pH 5.5 Balanced',
        'Pure Niacinamide + Panthenol B5',
        'Non-Comedogenic & 0% Fragrance',
        'Preserves Natural Skin Barrier'
      ],
      price: 499,
      originalPrice: 699,
      discount: '28% OFF',
      rating: 4.9,
      reviewCount: 1240,
      slug: 'refreshing-skin-cleanser',
      formulaHighlights: {
        active: '2% Niacinamide + 1% D-Panthenol',
        texture: 'Crystal Clear Non-Foaming Gel',
        skinType: 'All Skin Types (Sensitive & Acne-Prone)',
        usage: 'Morning & Night Daily Wash'
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
      badge: '72-HOUR HYDRATION • 3X CERAMIDES',
      title: '72-Hour Ceramide Moisture Lock',
      tagline: 'Ceramides NP/AP/EOP + Hyaluronic Acid Deep Barrier Repair',
      subtitle: 'Clinical restorative barrier cream designed to rapidly repair dry, compromised, and sensitized skin while restoring lipid equilibrium.',
      clinicalClaims: [
        '3x Essential Ceramide Complex',
        'Hyaluronic Acid Moisture Magnet',
        '0% Artificial Fragrances or Dyes',
        'Clinically Proven 72-Hour Retention'
      ],
      price: 599,
      originalPrice: 799,
      discount: '25% OFF',
      rating: 4.8,
      reviewCount: 980,
      slug: 'hydrating-moisturizer',
      formulaHighlights: {
        active: 'Ceramide NP/AP/EOP Complex + 2% HA',
        texture: 'Rich Velvet Non-Greasy Cream',
        skinType: 'Dry, Dehydrated & Damaged Barrier',
        usage: 'Twice daily after cleansing'
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
      badge: 'MAXIMUM PHOTOPROTECTION • SPF 50+ PA++++',
      title: 'Broad Spectrum SPF 50+ PA++++',
      tagline: 'Invisible Water-Light Gel Sunscreen with Anti-Pollution Shield',
      subtitle: 'Ultra-lightweight invisible gel sunscreen engineered for humid Indian climates. Leaves zero white cast and delivers 80-minute water resistance.',
      clinicalClaims: [
        'PA++++ Highest UVA/UVB Defense',
        'Zero White Cast Clear Matte Finish',
        '80-Minute Water & Sweat Resistant',
        'Infused with Blue Light Filters'
      ],
      price: 649,
      originalPrice: 849,
      discount: '23% OFF',
      rating: 4.9,
      reviewCount: 1120,
      slug: 'ray-barrier-sunscreen',
      formulaHighlights: {
        active: 'Next-Gen Photostable UV Filters',
        texture: 'Ultra-Lightweight Invisible Gel',
        skinType: 'All Skin Types (Oil-Control)',
        usage: 'Apply 15 mins before sun exposure'
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

  // Autoplay carousel
  useEffect(() => {
    if (!isPaused && !isZoomed) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 8000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentSlide, isZoomed]);

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
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-slate-50 border-b border-amber-200/50"
    >
      {/* Subtle Warm Golden & Ambient Radial Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/20 via-yellow-100/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/20 via-amber-100/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 relative z-10">
        
        {/* Top Announcement & Social Proof Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-amber-50 text-[11px] font-black uppercase tracking-wider shadow-[0_2px_10px_rgba(180,83,9,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>CARe A BEAUTY SOLUTION</span>
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-white/90 px-3 py-1 rounded-full border border-amber-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Dermatologist Formulated for Indian Skin</span>
            </div>
          </div>

          {/* Social Proof Star Rating */}
          <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1 rounded-full border border-slate-200 shadow-xs text-xs">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-900">{activeSlide.rating}</span>
            <span className="text-slate-500 font-medium">({activeSlide.reviewCount.toLocaleString()} Verified Reviews)</span>
          </div>
        </div>

        {/* Main 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Semantic H1, Clinical Copy, Pricing, Instant CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {/* Clinical Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-900 bg-amber-100/80 px-3 py-1 rounded-md border border-amber-300/80">
                    {activeSlide.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Slide 0{currentSlide + 1} of 0{totalSlides}
                  </span>
                </div>

                {/* Primary Semantic H1 Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-black tracking-tight leading-[1.12] text-slate-950">
                  {activeSlide.title}
                </h1>

                {/* Tagline & Descriptive Subtitle */}
                <p className="text-sm sm:text-base font-semibold text-amber-950/80">
                  {activeSlide.tagline}
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {activeSlide.subtitle}
                </p>

                {/* Clinical Guarantee Badges */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {activeSlide.clinicalClaims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/95 px-3 py-2 rounded-xl border border-slate-200/90 shadow-xs text-xs font-medium text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{claim}</span>
                    </div>
                  ))}
                </div>

                {/* Transparent Visible Pricing Box */}
                <div className="pt-2">
                  <div className="bg-white p-4 rounded-2xl border border-amber-300/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-serif font-black text-slate-950">
                          ₹{activeSlide.price}
                        </span>
                        <span className="text-sm text-slate-400 line-through font-medium">
                          MRP: ₹{activeSlide.originalPrice}
                        </span>
                        <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase border border-amber-300">
                          Save {activeSlide.discount}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        ✓ Inclusive of all taxes • Free express doorstep delivery
                      </p>
                    </div>

                    {/* Stock status */}
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        In Stock (Fresh Lab Batch)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conversion Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* BUY NOW Button */}
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-serif font-black text-sm tracking-wide shadow-[0_4px_18px_rgba(180,83,9,0.35)] transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-200" />
                    <span>BUY NOW — ₹{activeSlide.price}</span>
                  </button>

                  {/* ADD TO BAG Button */}
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-amber-100 font-bold text-sm border border-slate-800 shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>+ Add to Bag</span>
                  </button>

                  {/* EXPLORE DETAILS Button */}
                  <button
                    onClick={handleExplore}
                    className="px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: High-Definition Multi-Angle Studio Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* View Mode Switcher (Studio Multi-Angle vs Clinical Formula vs Texture Swatch) */}
            <div className="w-full max-w-lg mb-3 flex items-center justify-between">
              <div className="bg-white/90 p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1">
                <button
                  onClick={() => setActiveViewMode('STUDIO')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeViewMode === 'STUDIO'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>360° Studio Photos</span>
                </button>

                <button
                  onClick={() => setActiveViewMode('FORMULA')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeViewMode === 'FORMULA'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Formula Breakdown</span>
                </button>

                <button
                  onClick={() => setActiveViewMode('TEXTURE')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeViewMode === 'TEXTURE'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5 text-amber-400" />
                  <span>Texture Swatch</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500 font-semibold hidden sm:block">
                {activeSlide.photoAngles ? `${activeSlide.photoAngles.length} Angle Views` : 'Studio View'}
              </div>
            </div>

            {/* Main Stage Card */}
            <div className="w-full max-w-lg relative bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xl overflow-hidden">
              
              {/* Studio Mode View */}
              {activeViewMode === 'STUDIO' && (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 via-white to-amber-50/30 flex items-center justify-center p-4 border border-slate-100 group">
                    <img
                      src={currentDisplayImage}
                      alt={activeSlide.title}
                      className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Floating Angle Seal */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-white/10">
                      📷 {activeSlide.photoAngles && activeSlide.photoAngles[activePhotoIndex] ? activeSlide.photoAngles[activePhotoIndex].title : 'Studio Front'}
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={handleExplore}
                      className="absolute bottom-3 right-3 bg-white/95 backdrop-blur hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-md border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-700" />
                      <span>Full Specs</span>
                    </button>
                  </div>

                  {/* Multi-Angle Interactive Thumbnails Carousel Strip */}
                  {activeSlide.photoAngles && activeSlide.photoAngles.length > 1 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span className="uppercase tracking-wider">Select Photoshoot Angle:</span>
                        <span className="text-amber-800">{activeSlide.photoAngles[activePhotoIndex]?.label}</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {activeSlide.photoAngles.map((angle, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIndex(idx)}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 p-0.5 bg-slate-50 cursor-pointer ${
                              activePhotoIndex === idx
                                ? 'border-amber-700 ring-2 ring-amber-500/30 scale-105 shadow-md'
                                : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
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

              {/* Clinical Formula Mode View */}
              {activeViewMode === 'FORMULA' && (
                <div className="aspect-square flex flex-col justify-between p-4 bg-slate-900 text-white rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                      🔬 Lab Formulation Analysis
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      ISO 9001:2026 Verified
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Key Active Concentration:</p>
                      <p className="font-bold text-amber-300 text-sm mt-0.5">{activeSlide.formulaHighlights.active}</p>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Galenic Formula Texture:</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{activeSlide.formulaHighlights.texture}</p>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Target Epidermal Profile:</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{activeSlide.formulaHighlights.skinType}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveViewMode('STUDIO')}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition text-center cursor-pointer"
                  >
                    Back to 360° Studio Photography
                  </button>
                </div>
              )}

              {/* Texture Swatch Mode View */}
              {activeViewMode === 'TEXTURE' && (
                <div className="aspect-square flex flex-col justify-between p-4 bg-gradient-to-b from-amber-50 to-white rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">
                      💧 Sensorial Gel / Cream Texture
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Lightweight & Non-Sticky
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-2">
                    <img
                      src={activeSlide.photoAngles && activeSlide.photoAngles.find(a => a.label.includes('Texture') || a.label.includes('Swatch'))?.url || activeSlide.imageUrl}
                      alt="Texture Swatch"
                      className="max-h-48 object-contain rounded-xl shadow-md border border-amber-100"
                    />
                  </div>

                  <p className="text-xs text-slate-600 text-center font-medium">
                    Fast-absorbing, non-comedogenic texture formulated specifically for tropical & humid climates.
                  </p>

                  <button
                    onClick={() => setActiveViewMode('STUDIO')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-amber-100 font-bold text-xs transition text-center cursor-pointer"
                  >
                    Return to Product View
                  </button>
                </div>
              )}
            </div>

            {/* 3 Core Product Quick Select Cards (Cleanser, Moisturizer, Sunscreen) */}
            <div className="w-full max-w-lg grid grid-cols-3 gap-2.5 mt-4">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setActivePhotoIndex(0);
                    setActiveViewMode('STUDIO');
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                    currentSlide === idx
                      ? 'bg-white border-amber-600 shadow-[0_4px_16px_rgba(180,83,9,0.2)] ring-2 ring-amber-500/40 scale-[1.02]'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-amber-50/50'
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-9 h-9 object-cover rounded-xl shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <p className={`text-[9px] font-bold uppercase tracking-wider truncate ${currentSlide === idx ? 'text-amber-800 font-black' : 'text-slate-500'}`}>
                      0{idx + 1} {slide.title.split(' ')[0]}
                    </p>
                    <p className="text-[11px] font-serif font-black text-slate-900 truncate">
                      ₹{slide.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-4 z-20">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/95 text-slate-800 hover:bg-amber-50 border border-slate-200 shadow-lg transition active:scale-90 cursor-pointer"
            aria-label="Previous Clinical Formulation"
          >
            <ChevronLeft className="w-5 h-5 text-slate-800" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 lg:right-4 z-20">
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/95 text-slate-800 hover:bg-amber-50 border border-slate-200 shadow-lg transition active:scale-90 cursor-pointer"
            aria-label="Next Clinical Formulation"
          >
            <ChevronRight className="w-5 h-5 text-slate-800" />
          </button>
        </div>

        {/* Bottom Trust & Authenticity Badges */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/95 p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">100% Authentic Clinical Skincare</h3>
              <p className="text-[11px] text-slate-500">Freshly manufactured in certified laboratory.</p>
            </div>
          </div>

          <div className="bg-white/95 p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-emerald-800" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Free Express Shipping in India</h3>
              <p className="text-[11px] text-slate-500">Fast 2-4 day dispatch with real-time tracking.</p>
            </div>
          </div>

          <div className="bg-white/95 p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-100 border border-cyan-300 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-cyan-800" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Dermatologist Recommended</h3>
              <p className="text-[11px] text-slate-500">Formulated with 0% parabens, 0% sulfates.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
