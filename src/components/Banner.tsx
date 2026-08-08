import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Truck, Award, CheckCircle2, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Eye } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface BannerProps {
  products?: Product[];
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const Banner: React.FC<BannerProps> = ({ products = [], onAddToCart, onSelectProduct }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Define 3 Full-Size Hero Slides for our 3 Core Products with CARe Refreshing Skin Cleanser as #1 Flagship
  const slides = [
    {
      id: 'prod-refreshing-skin-cleanser',
      badge: '01 / FLAGSHIP SKIN CLEANSER',
      title: 'Soap-Free Barrier Gel Cleanser',
      subtitle: 'CARe A BEAUTY SOLUTION — Formulated for Face & Body with Niacinamide & Panthenol. pH Balanced at 5.5 to gently cleanse without drying or compromising your skin barrier.',
      highlights: ['Soap-Free & pH 5.5', 'With Niacinamide & Panthenol', 'Fragrance-Free & Non-Comedogenic'],
      imageUrl: '/images/care-cleanser-1-hero-marble.svg',
      price: 499,
      originalPrice: 699,
      discount: '28% OFF',
      slug: 'refreshing-skin-cleanser',
      photoAngles: [
        { title: 'Marble Counter', url: '/images/care-cleanser-1-hero-marble.svg' },
        { title: 'Studio View', url: '/images/care-cleanser-2-studio-isolated.svg' },
        { title: 'Bathroom Vanity', url: '/images/care-cleanser-3-lifestyle-vanity.svg' },
        { title: 'Gel Swatch', url: '/images/care-cleanser-texture.svg' },
        { title: 'Pump Detail', url: '/images/care-cleanser-5-pump-closeup.svg' },
        { title: 'Label Detail', url: '/images/care-cleanser-6-label-detail.svg' },
        { title: 'Top Angle', url: '/images/care-cleanser-7-top-view.svg' },
        { title: 'Left Angle', url: '/images/care-cleanser-8-quarter-left.svg' },
        { title: 'Right Angle', url: '/images/care-cleanser-9-quarter-right.svg' },
        { title: 'Ambient Spa', url: '/images/care-cleanser-10-bathroom-ambient.svg' },
      ]
    },
    {
      id: 'prod-hydrating-moisturizer',
      badge: '02 / BARRIER REPAIR & HYDRATION',
      title: '72-Hour Ceramide Moisture Lock',
      subtitle: 'Fast-absorbing barrier cream powered by Ceramides (NP/AP/EOP) + Niacinamide to repair compromised skin barriers and deeply nourish.',
      highlights: ['3x Ceramide Complex', '0% Artificial Fragrances', 'Non-Comedogenic'],
      imageUrl: 'https://images.unsplash.com/photo-1608248597261-e4d354714552?auto=format&fit=crop&w=1000&q=80',
      price: 599,
      originalPrice: 799,
      discount: '25% OFF',
      slug: 'hydrating-moisturizer',
      photoAngles: [
        { title: 'Front Jar', url: 'https://images.unsplash.com/photo-1608248597261-e4d354714552?auto=format&fit=crop&w=1000&q=80' },
      ]
    },
    {
      id: 'prod-ray-barrier-sunscreen',
      badge: '03 / SUN PROTECTION & UV DEFENSE',
      title: 'Photostable Broad Spectrum SPF 50+ PA++++',
      subtitle: 'Ultra-lightweight invisible gel sunscreen engineered for humid tropical weather. Zero white cast, water-resistant for 80 mins.',
      highlights: ['PA++++ Highest Protection', 'Zero White Cast Gel', '80-Min Water Resistant'],
      imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
      price: 649,
      originalPrice: 849,
      discount: '23% OFF',
      slug: 'ray-barrier-sunscreen',
      photoAngles: [
        { title: 'Front Bottle', url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80' },
      ]
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
    setActivePhotoIndex(0);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    setActivePhotoIndex(0);
  };

  // Auto slide effect
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 7000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentSlide]);

  const activeSlideData = slides[currentSlide];
  const activeProduct = products.find(p => p.id === activeSlideData.id || p.slug === activeSlideData.slug);

  const displayImage = activeSlideData.photoAngles && activeSlideData.photoAngles[activePhotoIndex]
    ? activeSlideData.photoAngles[activePhotoIndex].url
    : activeSlideData.imageUrl;

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
      className="Banner relative overflow-hidden bg-[#FAF8F5] text-stone-800 border-b border-stone-200/80 shadow-sm"
    >
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Showcase Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          
          {/* Left Column: Title, Subtitle, Pricing, Action */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Badge & Index */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3"
                >
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>{activeSlideData.badge}</span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-stone-500 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                    0{currentSlide + 1} / 0{totalSlides}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight leading-tight text-stone-900"
                >
                  {activeSlideData.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed font-normal"
                >
                  {activeSlideData.subtitle}
                </motion.p>

                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-1 flex flex-wrap gap-2 text-xs font-medium text-stone-700"
                >
                  {activeSlideData.highlights.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/90 backdrop-blur px-3.5 py-1.5 rounded-xl border border-stone-200 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Pricing & Add to Bag CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-4 flex flex-wrap items-center gap-4"
                >
                  <div className="flex items-baseline gap-2 bg-white border border-stone-200 px-4 py-2.5 rounded-2xl shadow-sm">
                    <span className="text-2xl font-bold text-amber-800">₹{activeSlideData.price}</span>
                    <span className="text-xs text-stone-400 line-through">₹{activeSlideData.originalPrice}</span>
                    <span className="text-[10px] font-bold text-white bg-amber-800 px-2 py-0.5 rounded-full uppercase ml-1">
                      {activeSlideData.discount}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCartClick}
                    className="group relative bg-stone-900 hover:bg-stone-950 text-amber-400 border border-amber-500/40 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-[0_0_16px_rgba(217,119,6,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.55)] hover:border-amber-400 flex items-center gap-2.5 cursor-pointer overflow-hidden"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
                    <span className="relative inline-block">
                      Add to Bag — ₹{activeSlideData.price}
                      <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleExploreClick}
                    className="group bg-stone-900/90 hover:bg-stone-900 text-amber-300 font-semibold text-sm px-5 py-3.5 rounded-2xl border border-stone-700/80 transition-all duration-300 shadow-[0_0_12px_rgba(217,119,6,0.18)] hover:shadow-[0_0_24px_rgba(245,158,11,0.45)] hover:border-amber-500/60 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="relative inline-block text-amber-300">
                      View Full Details
                      <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Interactive Photo Angle Gallery Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* Stage Viewport */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSlide}-${activePhotoIndex}`}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md aspect-square bg-white rounded-3xl p-4 border border-stone-200 shadow-md overflow-hidden group"
              >
                <img
                  src={displayImage}
                  alt={activeSlideData.title}
                  className="w-full h-full object-cover object-center rounded-2xl transition-all duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Angle Label Floating Badge */}
                <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  📷 {activeSlideData.photoAngles && activeSlideData.photoAngles[activePhotoIndex] ? activeSlideData.photoAngles[activePhotoIndex].title : 'Official View'}
                </div>

                {/* Quality Seal */}
                <div className="absolute top-4 right-4 bg-amber-50/90 backdrop-blur border border-amber-300 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  100% Authentic
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExploreClick}
                  className="group absolute bottom-4 left-4 bg-stone-900 text-amber-400 border border-amber-500/30 text-xs font-bold px-4 py-2 rounded-xl shadow-[0_0_12px_rgba(217,119,6,0.2)] hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] hover:border-amber-400 flex items-center gap-2 hover:bg-stone-950 transition-all duration-300"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="relative inline-block">
                    Quick View
                    <span className="absolute bottom-[-1px] left-0 w-0 h-[1.5px] bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Interactive Photo Thumbnails Strip (Utilizing all 10 photoshoot angles) */}
            {activeSlideData.photoAngles && activeSlideData.photoAngles.length > 1 && (
              <div className="w-full max-w-md mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold uppercase text-stone-400 shrink-0 pr-1">Angles ({activeSlideData.photoAngles.length}):</span>
                {activeSlideData.photoAngles.map((angle, photoIdx) => (
                  <button
                    key={photoIdx}
                    onClick={() => setActivePhotoIndex(photoIdx)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border transition shrink-0 ${
                      activePhotoIndex === photoIdx
                        ? 'border-amber-700 ring-2 ring-amber-500/40 scale-105'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                    title={angle.title}
                  >
                    <img src={angle.url} alt={angle.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 3 Core Product Switcher Pills */}
            <div className="w-full max-w-md grid grid-cols-3 gap-2 mt-3">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setActivePhotoIndex(0);
                  }}
                  className={`p-2 rounded-2xl border text-left transition flex items-center gap-2 ${
                    currentSlide === idx
                      ? 'bg-amber-50 border-amber-600 shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-9 h-9 object-cover rounded-xl shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <p className={`text-[9px] font-bold uppercase tracking-wider truncate ${currentSlide === idx ? 'text-amber-900' : 'text-stone-500'}`}>
                      0{idx + 1} Product
                    </p>
                    <p className="text-[11px] font-serif font-bold text-stone-900 truncate">
                      ₹{slide.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-4 z-20">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white text-stone-800 hover:bg-amber-50 border border-stone-200 shadow-md transition active:scale-90 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 text-amber-900" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 lg:right-4 z-20">
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white text-stone-800 hover:bg-amber-50 border border-stone-200 shadow-md transition active:scale-90 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 text-amber-900" />
          </button>
        </div>

        {/* Bottom Trust Row */}
        <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3.5">
            <ShieldCheck className="w-7 h-7 text-amber-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-stone-900">100% Authentic Guarantee</h4>
              <p className="text-[11px] text-stone-500">Sourced directly from our clinical lab.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3.5">
            <Truck className="w-7 h-7 text-teal-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-stone-900">Express Delivery Across India</h4>
              <p className="text-[11px] text-stone-500">Free express shipping on orders over ₹499.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3.5">
            <Award className="w-7 h-7 text-amber-700 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-stone-900">Dermatologist Recommended</h4>
              <p className="text-[11px] text-stone-500">Over 50,000+ satisfied customers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
