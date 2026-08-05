import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Truck, Award, CheckCircle2, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Eye } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface BannerProps {
  products?: Product[];
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const Banner: React.FC<BannerProps> = ({ products = [], onAddToCart, onSelectProduct }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Define 3 Full-Size Hero Slides for our 3 Core Products
  const slides = [
    {
      id: 'prod-hydrating-moisturizer',
      badge: '01 / BARRIER REPAIR & HYDRATION',
      title: '72-Hour Ceramide Moisture Lock',
      subtitle: 'Fast-absorbing barrier cream powered by Ceramides (NP/AP/EOP) + Niacinamide to repair compromised skin barriers and deeply nourish.',
      highlights: ['3x Ceramide Complex', '0% Artificial Fragrances', 'Non-Comedogenic'],
      imageUrl: 'https://images.unsplash.com/photo-1608248597261-e4d354714552?auto=format&fit=crop&w=1000&q=80',
      price: 599,
      originalPrice: 799,
      discount: '25% OFF',
      gradient: 'from-emerald-950 via-teal-950 to-emerald-900',
      slug: 'hydrating-moisturizer',
    },
    {
      id: 'prod-ray-barrier-sunscreen',
      badge: '02 / SUN PROTECTION & UV DEFENSE',
      title: 'Photostable Broad Spectrum SPF 50+ PA++++',
      subtitle: 'Ultra-lightweight invisible gel sunscreen engineered for humid Indian tropical weather. Zero white cast, water-resistant for 80 mins.',
      highlights: ['PA++++ Highest Protection', 'Zero White Cast Gel', '80-Min Water Resistant'],
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      price: 649,
      originalPrice: 849,
      discount: '23% OFF',
      gradient: 'from-teal-950 via-emerald-950 to-emerald-900',
      slug: 'ray-barrier-sunscreen',
    },
    {
      id: 'prod-refreshing-skin-cleanser',
      badge: '03 / pH BALANCED GENTLE CLEANSING',
      title: 'Soap-Free Barrier Gel Cleanser',
      subtitle: 'Enriched with Niacinamide & Panthenol (Pro-Vitamin B5) at pH 5.5. Washes away urban pollution and excess oil without stripping natural lipids.',
      highlights: ['pH 5.5 Skin Identical', 'Sulfate & Soap Free', 'Niacinamide + Panthenol'],
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      price: 499,
      originalPrice: 699,
      discount: '28% OFF',
      gradient: 'from-emerald-950 via-emerald-900 to-teal-950',
      slug: 'refreshing-skin-cleanser',
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto slide effect
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentSlide]);

  const activeSlideData = slides[currentSlide];
  const activeProduct = products.find(p => p.id === activeSlideData.id || p.slug === activeSlideData.slug);

  const handleAddToCartClick = () => {
    if (activeProduct && onAddToCart) {
      const primaryVariant = activeProduct.variants[0];
      onAddToCart(activeProduct, primaryVariant, 1);
    }
  };

  const handleExploreClick = () => {
    if (activeProduct && onSelectProduct) {
      onSelectProduct(activeProduct);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-emerald-950 text-emerald-50 border-b border-emerald-800/80"
    >
      {/* Dynamic Background Glow Layer */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none transition-all duration-700" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none transition-all duration-700" />

      {/* Main Hero Slider Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[440px]">
          
          {/* Left Column: Clinical Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-5 transition-all duration-500">
            {/* Slide Index Badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/80 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{activeSlideData.badge}</span>
              </span>
              <span className="text-xs font-mono text-emerald-300/80 bg-emerald-900/40 px-2.5 py-1 rounded-md border border-emerald-800">
                0{currentSlide + 1} / 0{totalSlides}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight text-emerald-50 drop-shadow-sm">
              {activeSlideData.title}
            </h1>

            {/* Subtitle */}
            <p className="text-emerald-100/90 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              {activeSlideData.subtitle}
            </p>

            {/* Spec Highlights Pills */}
            <div className="pt-1 flex flex-wrap gap-2.5 text-xs font-medium text-emerald-200">
              {activeSlideData.highlights.map((spec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-emerald-900/70 backdrop-blur px-3 py-1.5 rounded-lg border border-emerald-700/60 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {/* Price Banner */}
              <div className="flex items-baseline gap-2 bg-emerald-900/80 border border-emerald-700/80 px-4 py-2 rounded-2xl shadow-inner">
                <span className="text-2xl font-bold text-amber-300">₹{activeSlideData.price}</span>
                <span className="text-xs text-emerald-300/70 line-through">₹{activeSlideData.originalPrice}</span>
                <span className="text-[10px] font-bold text-emerald-950 bg-amber-300 px-2 py-0.5 rounded-full uppercase ml-1">
                  {activeSlideData.discount}
                </span>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCartClick}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm px-6 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-950" />
                <span>Add to Bag — ₹{activeSlideData.price}</span>
              </button>

              {/* Explore PDP Button */}
              <button
                onClick={handleExploreClick}
                className="bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-100 font-semibold text-sm px-5 py-3 rounded-2xl border border-emerald-700/70 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Details</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          </div>

          {/* Right Column: Full-Size Product Photography & Interactive Switcher */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Product Image Stage */}
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-b from-emerald-900/40 to-teal-900/60 rounded-3xl p-6 border border-emerald-700/50 shadow-2xl overflow-hidden group">
              <img
                src={activeSlideData.imageUrl}
                alt={activeSlideData.title}
                className="w-full h-full object-cover object-center rounded-2xl transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Floating Quality Stamp */}
              <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur border border-emerald-600/50 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Dermatologist Formulated
              </div>

              {/* Fullscreen Details Quick-View Floating Button */}
              <button
                onClick={handleExploreClick}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-emerald-950 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 opacity-90 hover:opacity-100 transition"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-800" />
                <span>Quick View</span>
              </button>
            </div>

            {/* 3-Product Mini Switcher Bar */}
            <div className="w-full max-w-md grid grid-cols-3 gap-2 mt-4">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`p-2 rounded-2xl border text-left transition flex items-center gap-2 ${
                    currentSlide === idx
                      ? 'bg-emerald-900 border-amber-400/80 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300/70 hover:bg-emerald-900/50'
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-10 h-10 object-cover rounded-xl shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${currentSlide === idx ? 'text-amber-300' : 'text-emerald-200'}`}>
                      0{idx + 1} Formulation
                    </p>
                    <p className="text-[11px] font-serif font-bold text-emerald-100 truncate">
                      ₹{slide.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Arrow Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-4 z-20">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-emerald-950/80 backdrop-blur text-emerald-100 hover:text-white border border-emerald-700/80 hover:bg-emerald-900 shadow-xl transition active:scale-90"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 lg:right-4 z-20">
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-emerald-950/80 backdrop-blur text-emerald-100 hover:text-white border border-emerald-700/80 hover:bg-emerald-900 shadow-xl transition active:scale-90"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Progress Timer Line */}
        <div className="mt-8 w-full bg-emerald-900/60 h-1 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Bottom Trust Features Row */}
        <div className="mt-8 pt-6 border-t border-emerald-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-900/40 backdrop-blur border border-emerald-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-100">100% Authentic Guarantee</h4>
              <p className="text-[11px] text-emerald-300/80">Sourced directly from our clinical lab in Bengaluru.</p>
            </div>
          </div>

          <div className="bg-emerald-900/40 backdrop-blur border border-emerald-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <Truck className="w-7 h-7 text-teal-300 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-100">Express Delivery in India</h4>
              <p className="text-[11px] text-emerald-300/80">Free shipping over ₹499. Dispatched in 24 hours.</p>
            </div>
          </div>

          <div className="bg-emerald-900/40 backdrop-blur border border-emerald-800/80 p-3.5 rounded-2xl flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-300 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-100">Dermatologist Recommended</h4>
              <p className="text-[11px] text-emerald-300/80">Over 50,000+ satisfied customers across India.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
