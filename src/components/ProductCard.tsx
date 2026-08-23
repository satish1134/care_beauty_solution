import React, { useState, useRef } from 'react';
import { Star, ShoppingBag, Eye, Check, Sparkles, ShieldCheck, Orbit, Droplet } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onOpenQuickView,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0]?.id || '');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // 3D Tilt Physics State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });

  const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const displayImage = product.images[activeImageIndex]?.url || product.images[0]?.url;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt angles (limit between -8 and +8 deg for subtle luxury float)
    const rotateX = ((y / rect.height) - 0.5) * -14;
    const rotateY = ((x / rect.width) - 0.5) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVariant || currentVariant.stock <= 0) return;
    onAddToCart(product, currentVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenQuickView(product)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${tilt.opacity ? 6 : 0}px)`,
        transition: tilt.opacity ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
      }}
      className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative will-change-transform"
    >
      {/* Specular Refractive Light Glare Overlay */}
      <div
        style={{
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.45) 0%, rgba(16,185,129,0.15) 35%, transparent 70%)`,
          opacity: tilt.opacity,
          transition: 'opacity 0.3s ease',
        }}
        className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay"
      />

      {/* Top Floating Badges with Eye-Catchy Biotech Clinical Styling */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-glow-emerald border border-emerald-300/40 flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3 h-3 text-cyan-200" /> Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-slate-950/90 text-cyan-200 font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md backdrop-blur border border-white/20">
            Zero-G Clinical
          </span>
        )}
      </div>

      {/* Product Photography Display */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-emerald-50/30 to-slate-50 p-3">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Hover Quick View & 3D Orbit Overlays */}
        <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 p-4">
          <button
            onClick={e => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="bg-white text-slate-900 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-1.5 hover:bg-emerald-600 hover:text-white transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4 text-emerald-600 group-hover:text-white" /> Quick View
          </button>
        </div>

        {/* Derm Tested & 3D Ready Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-100 shadow-xs text-[10px] font-bold text-slate-800 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Derm Tested
        </div>
      </div>

      {/* Multi-Angle Image Swatches Strip */}
      {product.images.length > 1 && (
        <div className="px-4 pt-2 flex items-center gap-1 overflow-x-auto scrollbar-none" onClick={e => e.stopPropagation()}>
          {product.images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-7 h-7 rounded-lg overflow-hidden border transition shrink-0 ${
                activeImageIndex === idx
                  ? 'border-emerald-600 ring-2 ring-emerald-400/40'
                  : 'border-slate-200 opacity-60 hover:opacity-100'
              }`}
              title={img.altText}
            >
              <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {product.categoryName}
            </span>

            <div className="flex items-center gap-1 text-amber-900 font-bold text-xs bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.tagline}
          </p>

          {/* Key Ingredient / Concern Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.skinConcerns.slice(0, 2).map(concern => (
              <span key={concern} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                {concern}
              </span>
            ))}
          </div>
        </div>

        {/* Variant Selector & Price */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          {product.variants.length > 1 && (
            <div className="flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
              <label className="text-[11px] font-medium text-slate-500">Volume:</label>
              <select
                value={selectedVariantId}
                onChange={e => setSelectedVariantId(e.target.value)}
                className="text-xs border border-emerald-200 rounded-lg px-2.5 py-1 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-600 font-medium"
              >
                {product.variants.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} — ₹{v.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-slate-900 font-serif">₹{currentVariant?.price}</span>
              {currentVariant?.compareAtPrice && (
                <span className="text-xs text-slate-400 line-through ml-2">
                  ₹{currentVariant.compareAtPrice}
                </span>
              )}
            </div>

            {currentVariant?.compareAtPrice && (
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                SAVE ₹{currentVariant.compareAtPrice - currentVariant.price}
              </span>
            )}
          </div>

          {/* Action CTAs: Buy Now & Add to Cart */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={e => {
                e.stopPropagation();
                if (!currentVariant || currentVariant.stock <= 0) return;
                if (onBuyNow) {
                  onBuyNow(product, currentVariant, 1);
                } else {
                  onAddToCart(product, currentVariant, 1);
                }
              }}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-glow-emerald bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white active:scale-95 cursor-pointer border border-emerald-300/40"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-100" />
              <span>Buy Now</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1 shadow-xs ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : currentVariant && currentVariant.stock > 0
                  ? 'bg-slate-900 hover:bg-black text-emerald-200 border border-slate-800 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {addedAnimation ? <Check className="w-3.5 h-3.5 text-white" /> : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


