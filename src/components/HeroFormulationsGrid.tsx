import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Check, Sparkles, Droplets, Shield, Eye, Star } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface HeroFormulationsGridProps {
  products: Product[];
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onOpenQuickView: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const HeroFormulationsGrid: React.FC<HeroFormulationsGridProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onOpenQuickView,
  onOpenProductDetail,
}) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  // Ensure we have the 3 canonical hero formulations in order: Cleanser -> Moisturizer -> Sunscreen
  const cleanser = products.find(p => p.slug.includes('cleanser') || p.id.includes('cleanser')) || products[0];
  const moisturizer = products.find(p => p.slug.includes('moisturizer') || p.id.includes('moisturizer')) || products[1] || products[0];
  const sunscreen = products.find(p => p.slug.includes('sunscreen') || p.id.includes('sunscreen')) || products[2] || products[0];

  const heroFormulations = [
    {
      num: '01',
      stage: 'PURIFY & PREP',
      product: cleanser,
      textureDescription: 'Crystal water gel matrix that liquefies on contact.',
      actives: ['pH 5.5 Amino Acid', 'Niacinamide', 'Panthenol B5'],
      highlightBadge: 'Acid Mantle Safe',
      imgSrc: '/images/care-refreshing-skin-cleanser.svg',
      basePrice: 499,
      comparePrice: 699,
    },
    {
      num: '02',
      stage: 'FORTIFY & RESTORE',
      product: moisturizer,
      textureDescription: 'Whipped lipid cushion for continuous 72-hour moisture lock.',
      actives: ['3x Ceramides NP/AP/EOP', 'Niacinamide', 'Hyaluronic Acid'],
      highlightBadge: 'Clinical Best Seller',
      imgSrc: '/images/care-hydrating-moisturizer.svg',
      basePrice: 599,
      comparePrice: 799,
    },
    {
      num: '03',
      stage: 'SHIELD & DEFEND',
      product: sunscreen,
      textureDescription: 'Zero-cast invisible fluid with micro-encapsulated water burst.',
      actives: ['SPF 50+ PA++++', 'Broad Spectrum', 'Centella Cica'],
      highlightBadge: 'Zero White Cast',
      imgSrc: '/images/care-ray-barrier-sunscreen.svg',
      basePrice: 649,
      comparePrice: 899,
    },
  ];

  const handleAdd = (product: Product, formulationIndex: number) => {
    if (!product) return;
    const variantIndex = selectedVariants[product.id] || 0;
    const variant = product.variants?.[variantIndex] || {
      id: `var-${product.id}`,
      productId: product.id,
      name: 'Standard Unit',
      price: formulationIndex === 0 ? 499 : formulationIndex === 1 ? 599 : 649,
      stock: 50,
    };

    onAddToCart(product, variant as ProductVariant, 1);
    setAddedItemMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section
      id="hero-formulations-grid"
      className="py-24 px-4 sm:px-8 bg-white border-b border-gray-100 relative overflow-hidden"
    >
      {/* Background Subtle Lighting Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-r from-transparent via-[#FBF8F2] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header: Clinical Apple-meets-Luxury-Dermatology */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gray-100 text-gray-800 text-[10.5px] font-sans font-medium tracking-[0.2em] uppercase">
            <span>Essential 3-Step Routine</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-gray-900 leading-tight">
            The 3 Hero Formulations
          </h2>

          <p className="font-sans text-sm sm:text-base font-light text-gray-600 leading-relaxed max-w-xl mx-auto">
            A scientifically sequenced 3-step routine engineered to cleanse without stripping, rebuild the lipid barrier, and provide invisible broad-spectrum photo-protection.
          </p>
        </div>

        {/* 3-Column Clean Borderless Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
          {heroFormulations.map((item, idx) => {
            const product = item.product;
            if (!product) return null;

            const selectedVarIdx = selectedVariants[product.id] || 0;
            const currentVariant = product.variants?.[selectedVarIdx] || product.variants?.[0] || {
              id: `var-${product.id}`,
              name: 'Standard',
              price: item.basePrice,
              compareAtPrice: item.comparePrice,
            };
            const isAdded = !!addedItemMap[product.id];

            return (
              <div
                key={product.id || idx}
                id={`hero-card-${product.slug || idx}`}
                className="group relative rounded-3xl bg-white p-7 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 shadow-[0_12px_36px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_54px_rgba(201,162,39,0.12)] border border-transparent hover:border-[#E8C76A]/40 overflow-hidden"
              >
                {/* Subtle Gold Shimmer Glow at Top Edge on Hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Card Meta: Stage Number & Active Pill */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xs font-bold tracking-widest text-[#8C6A12] bg-[#FDF8EE] px-2.5 py-0.5 rounded-full border border-[#E8C76A]/40">
                      STEP {item.num}
                    </span>
                    <span className="text-[10px] font-sans font-semibold tracking-wider uppercase text-gray-400">
                      {item.stage}
                    </span>
                  </div>

                  <span className="text-[10.5px] font-sans font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/60">
                    {item.highlightBadge}
                  </span>
                </div>

                {/* Product Title & Tagline */}
                <div className="space-y-1 mb-4">
                  <h3
                    onClick={() => onOpenProductDetail(product)}
                    className="font-serif text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#8C6A12] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 font-light line-clamp-2">
                    {item.textureDescription}
                  </p>
                </div>

                {/* Product Photography Stage */}
                <div
                  onClick={() => onOpenProductDetail(product)}
                  className="relative w-full h-60 sm:h-64 my-2 flex items-center justify-center cursor-pointer select-none"
                >
                  {/* Studio Spotlight Effect */}
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-44 rounded-full bg-gradient-to-b from-[#FAF8F5] to-[#F1EFEA]/60 -z-10 transition-transform duration-500 group-hover:scale-110" />

                  <img
                    src={item.imgSrc}
                    alt={product.name}
                    className="max-h-full w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.08)] group-hover:drop-shadow-[0_20px_36px_rgba(140,106,18,0.2)] transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Floating Quick View Icon Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(product);
                    }}
                    className="absolute bottom-2 right-2 p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/90 text-gray-700 hover:text-[#8C6A12] hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer"
                    title="Quick Clinical View"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Active Key Ingredients Chips */}
                <div className="flex flex-wrap gap-1.5 my-4">
                  {item.actives.map((act, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10.5px] font-sans font-light text-gray-700 tracking-tight"
                    >
                      {act}
                    </span>
                  ))}
                </div>

                {/* Variant Switcher (if product has multiple sizes) */}
                {product.variants && product.variants.length > 1 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-sans text-gray-400 font-light">Size:</span>
                    <div className="flex items-center gap-1.5">
                      {product.variants.map((v, vIdx) => (
                        <button
                          key={v.id || vIdx}
                          onClick={() =>
                            setSelectedVariants(prev => ({ ...prev, [product.id]: vIdx }))
                          }
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium transition-all ${
                            selectedVarIdx === vIdx
                              ? 'bg-[#111827] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {v.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price & Action Row */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-xl font-bold text-gray-900">
                        ₹{currentVariant.price || item.basePrice}
                      </span>
                      <span className="text-xs text-gray-400 line-through font-light">
                        ₹{currentVariant.compareAtPrice || item.comparePrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-sans text-emerald-700 font-medium">
                      Inclusive of all taxes
                    </span>
                  </div>

                  {/* Add to Cart / Added State */}
                  <button
                    id={`btn-add-${product.slug || idx}`}
                    onClick={() => handleAdd(product, idx)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer active:scale-95 shadow-sm ${
                      isAdded
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#111827] hover:bg-black text-white hover:shadow-[0_4px_16px_rgba(201,162,39,0.25)] border border-[#C9A227]/30'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#E8C76A]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-[#E8C76A]" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Complete Routine Bundle Promo Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#111827] via-[#1A2332] to-[#111827] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C9A227]/30">
          <div className="space-y-2 text-center md:text-left z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#E8C76A] text-[10.5px] font-sans font-semibold tracking-wider uppercase border border-[#C9A227]/40">
              <Sparkles className="w-3 h-3 text-[#E8C76A]" />
              <span>Full Clinical Regimen — Save 30%</span>
            </div>
            <h4 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              The 3-Step Barrier Restoration Kit
            </h4>
            <p className="font-sans text-xs sm:text-sm font-light text-gray-300">
              Includes Refreshing Cleanser (120ml), Hydrating Moisturizer (50g), and Ray Barrier Sunscreen (50ml).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
            <div className="text-center sm:text-right">
              <span className="text-xs text-gray-400 line-through mr-2">₹2,397</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#E8C76A]">₹1,599</span>
            </div>

            <button
              onClick={() => {
                // Add all 3 items to cart
                if (cleanser && moisturizer && sunscreen) {
                  onAddToCart(cleanser, cleanser.variants[0], 1);
                  onAddToCart(moisturizer, moisturizer.variants[0], 1);
                  onAddToCart(sunscreen, sunscreen.variants[0], 1);
                }
              }}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#E8C76A] via-[#C9A227] to-[#8C6A12] hover:brightness-110 text-[#111827] font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-lg cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>Add Complete Kit</span>
              <ArrowRight className="w-4 h-4 text-[#111827]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
