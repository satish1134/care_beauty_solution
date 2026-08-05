import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Sparkles, Eye, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onOpenQuickView: (product: Product) => void;
  badgeText?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  subtitle,
  products,
  onAddToCart,
  onOpenQuickView,
  badgeText,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      const newScrollLeft = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollEvent = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.35));
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-10 space-y-6">
      {/* Slider Header Controls */}
      <div className="flex items-end justify-between border-b border-emerald-100 pb-4">
        <div>
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {badgeText}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Carousel Navigation Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2.5 rounded-full border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-950 transition shadow-sm active:scale-95"
            aria-label="Previous Products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2.5 rounded-full border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-950 transition shadow-sm active:scale-95"
            aria-label="Next Products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScrollEvent}
        className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 pt-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => {
          const primaryVariant = product.variants[0];
          const hasDiscount = primaryVariant.compareAtPrice && primaryVariant.compareAtPrice > primaryVariant.price;
          const discountPercent = hasDiscount
            ? Math.round(((primaryVariant.compareAtPrice! - primaryVariant.price) / primaryVariant.compareAtPrice!) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start shrink-0 bg-white rounded-3xl border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square bg-emerald-50/40 overflow-hidden cursor-pointer" onClick={() => onOpenQuickView(product)}>
                <img
                  src={product.images[0]?.url}
                  alt={product.images[0]?.altText || product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {product.isBestSeller && (
                    <span className="bg-amber-400 text-emerald-950 font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                      Best Seller
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-emerald-900 text-white font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Quick View Button Hover Action */}
                <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(product);
                    }}
                    className="bg-white text-emerald-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 hover:bg-emerald-50 transition transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-700" /> View Details
                  </button>
                </div>
              </div>

              {/* Product Details Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    {product.categoryName}
                  </span>

                  <h3
                    onClick={() => onOpenQuickView(product)}
                    className="font-serif font-bold text-base text-slate-900 group-hover:text-emerald-800 transition cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-snug">
                    {product.tagline}
                  </p>
                </div>

                {/* Rating & Concerns */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {product.skinConcerns[0] || 'All Skin Types'}
                  </span>
                </div>

                {/* Price & Add to Bag CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-lg font-bold text-emerald-950">₹{primaryVariant.price}</span>
                    {primaryVariant.compareAtPrice && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">
                        ₹{primaryVariant.compareAtPrice}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(product, primaryVariant, 1)}
                    className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex justify-center items-center gap-1.5 pt-2">
        {products.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex ? 'w-6 bg-emerald-800' : 'w-1.5 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
