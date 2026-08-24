import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Shield, Sparkles, ChevronLeft, ChevronRight, ArrowRight, Sun, Droplets } from 'lucide-react';
import { ProductCategory } from '../../types/marketplace';

interface SlideItem {
  id: string;
  badge: string;
  badgeType: 'coral' | 'green' | 'gold';
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaAction: () => void;
  bgGradient: string;
  image: string;
  tagline: string;
}

export const HeroCarousel: React.FC = () => {
  const { openPlp, allProducts, openPdp } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES: SlideItem[] = [
    {
      id: 'slide_sunscreen',
      badge: 'SPF 50+ PA++++ • High Protection',
      badgeType: 'coral',
      title: 'Ray Barrier Sunscreen',
      subtitle: 'Comfortable everyday wear designed for Indian heat & humidity',
      description:
        'A lightweight broad-spectrum sunscreen developed with modern UV filters to help protect skin against UVA and UVB rays. Zero visible white cast, barrier-supportive with Ceramide NP, Niacinamide & Cica.',
      ctaText: 'Shop Ray Barrier',
      ctaAction: () => {
        const prod = allProducts.find((p) => p.id === 'cbs-sunscreen-01');
        if (prod) openPdp(prod);
        else openPlp('Sunscreen');
      },
      bgGradient: 'from-[#FFF8F0] via-[#FAF3EA] to-[#F2E8DC]',
      image: '/images/care-ray-barrier-sunscreen.svg',
      tagline: 'Modern UV Filters • Ceramide NP • Niacinamide • Ectoin',
    },
    {
      id: 'slide_moisturizer',
      badge: 'Lightweight Hydration • Long-Lasting Comfort',
      badgeType: 'gold',
      title: 'Hydrating Moisturizer',
      subtitle: 'Daily barrier support suitable for all skin types & seasons',
      description:
        'A daily moisturiser formulated to replenish moisture while supporting the skin’s natural barrier. Absorbs quickly without leaving a greasy finish and layers comfortably under sunscreen.',
      ctaText: 'Shop Moisturizer',
      ctaAction: () => {
        const prod = allProducts.find((p) => p.id === 'cbs-moisturizer-01');
        if (prod) openPdp(prod);
        else openPlp('Moisturizer');
      },
      bgGradient: 'from-[#FAF6EE] via-[#F3EEDB] to-[#E9E2C9]',
      image: '/images/care-hydrating-moisturizer.svg',
      tagline: 'Ceramides • Niacinamide • Panthenol • Sodium PCA',
    },
    {
      id: 'slide_cleanser',
      badge: 'Clean Without Stripping • Amino Acid Cleansing',
      badgeType: 'green',
      title: 'Refreshing Skin Cleanser',
      subtitle: 'Gentle daily cleanser respecting your natural skin barrier',
      description:
        'Effectively removes dirt, excess oil and sunscreen while leaving skin feeling clean, comfortable and hydrated. Powered by mild amino acids, ceramides, panthenol, and aloe vera.',
      ctaText: 'Shop Cleanser',
      ctaAction: () => {
        const prod = allProducts.find((p) => p.id === 'cbs-cleanser-01');
        if (prod) openPdp(prod);
        else openPlp('Cleanser');
      },
      bgGradient: 'from-[#F2F7F4] via-[#E8F2EC] to-[#DDEAE2]',
      image: '/images/care-refreshing-skin-cleanser.svg',
      tagline: 'Mild Amino Acids • Ceramides • Panthenol • Aloe Vera',
    },
  ];

  // Auto-advance slides every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const slide = SLIDES[currentSlide];

  return (
    <section
      id="hero-carousel-section"
      className="relative overflow-hidden bg-gradient-to-r border-b border-[#E5E5E5] transition-colors duration-700 select-none"
    >
      <div className={`w-full bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 py-8 sm:py-12 lg:py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy & CTA */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                    slide.badgeType === 'coral'
                      ? 'bg-[#E85D5D] text-white shadow-xs'
                      : slide.badgeType === 'green'
                      ? 'bg-[#2D5A3D] text-white shadow-xs'
                      : 'bg-[#C59B27] text-white shadow-xs'
                  }`}
                >
                  {slide.badge}
                </span>
                <span className="text-xs font-bold text-[#6B6B6B] hidden sm:inline">
                  Care Beauty Solution
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-xl font-bold text-[#2D5A3D] mt-1.5 sm:mt-2">
                  {slide.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-xl">
                {slide.description}
              </p>

              {/* Hero Ingredients Tagline */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1A1A] bg-white/70 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-black/5 w-fit">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">{slide.tagline}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={slide.ctaAction}
                  className="btn-primary-coral text-xs sm:text-sm font-bold px-6 py-3 shadow-md flex items-center gap-2"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openPlp()}
                  className="bg-white hover:bg-neutral-50 text-[#1A1A1A] border border-[#E5E5E5] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition shadow-xs"
                >
                  <span>View All 3 Formulations</span>
                </button>
              </div>
            </div>

            {/* Right Product Visual */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl bg-white/80 backdrop-blur-md p-6 sm:p-8 shadow-xl border border-white/60 flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/care-official-gold-logo.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows & Dots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#E85D5D]' : 'w-2 bg-[#E5E5E5] hover:bg-[#6B6B6B]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
            className="p-1.5 rounded-full bg-white hover:bg-[#FAF9F6] border border-[#E5E5E5] text-[#1A1A1A] transition shadow-xs"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="p-1.5 rounded-full bg-white hover:bg-[#FAF9F6] border border-[#E5E5E5] text-[#1A1A1A] transition shadow-xs"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
