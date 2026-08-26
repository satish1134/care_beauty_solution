import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import product1Img from '../../assets/product-1.jpeg';
import product2Img from '../../assets/product-2.jpeg';
import product3Img from '../../assets/product-3.jpeg';
import heroImg from '../../assets/hero.png';

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
      image: product1Img,
      tagline: 'Modern UV Filters • Ceramide NP • Niacinamide • Ectoin',
    },
    {
      id: 'slide_moisturizer',
      badge: 'Lightweight Hydration • Barrier Support',
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
      image: product2Img,
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
      image: product3Img,
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
      <div className={`w-full bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 py-6 sm:py-10 lg:py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Top on Mobile / Left on Desktop: Copy & CTA */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-6 text-left order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full ${
                    slide.badgeType === 'coral'
                      ? 'bg-[#E85D5D] text-white shadow-xs'
                      : slide.badgeType === 'green'
                      ? 'bg-[#2D5A3D] text-white shadow-xs'
                      : 'bg-[#C59B27] text-white shadow-xs'
                  }`}
                >
                  {slide.badge}
                </span>
                <span className="text-[11px] font-bold text-[#6B6B6B] hidden sm:inline">
                  Care Beauty Solution
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-lg lg:text-xl font-bold text-[#2D5A3D] mt-1 sm:mt-2">
                  {slide.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-xl">
                {slide.description}
              </p>

              {/* Hero Ingredients Tagline */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-[#1A1A1A] bg-white/80 backdrop-blur-xs px-3 py-1.5 sm:py-2 rounded-xl border border-black/5 w-fit max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">{slide.tagline}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                <button
                  onClick={slide.ctaAction}
                  className="btn-primary-coral text-xs sm:text-sm font-bold px-5 sm:px-6 py-2.5 sm:py-3 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openPlp()}
                  className="bg-white hover:bg-neutral-50 text-[#1A1A1A] border border-[#E5E5E5] text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition shadow-xs w-full sm:w-auto text-center"
                >
                  <span>View All 3 Formulations</span>
                </button>
              </div>
            </div>

            {/* Product Visual Container (Shown above on mobile or right on desktop) */}
            <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
              <div className="relative w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl border border-white/70 flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = heroImg;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows & Dots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-6 sm:w-8 bg-[#E85D5D]' : 'w-2 bg-[#E5E5E5] hover:bg-[#6B6B6B]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
            className="p-1 sm:p-1.5 rounded-full bg-white hover:bg-[#FAF9F6] border border-[#E5E5E5] text-[#1A1A1A] transition shadow-xs"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="p-1 sm:p-1.5 rounded-full bg-white hover:bg-[#FAF9F6] border border-[#E5E5E5] text-[#1A1A1A] transition shadow-xs"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

