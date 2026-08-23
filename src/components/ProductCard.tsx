import React, { useState, useRef } from 'react';
import { Star, ShoppingBag, Eye, Check, Sparkles, ShieldCheck, Zap, Droplet, Flame } from 'lucide-react';
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
    
    // Calculate tilt angles
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;

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
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${tilt.opacity ? 8 : 0}px)`,
        transition: tilt.opacity ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
      }}
      className="group clay-card clay-card-hover text-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer relative will-change-transform transition-all duration-300"
    >
      {/* Specular Neon Glare Reflection Overlay */}
      <div
        style={{
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(204,255,0,0.25) 0%, rgba(0,240,255,0.15) 35%, transparent 70%)`,
          opacity: tilt.opacity,
          transition: 'opacity 0.3s ease',
        }}
        className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
      />

      {/* Top Floating Acid Stickers */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span className="sticker-tag bg-[#CCFF00] text-black text-[10px] px-2.5 py-0.5 rotate-[-3deg]">
            <Zap className="w-3 h-3 fill-black" /> BESTSELLER
          </span>
        )}
        {product.isNewArrival && (
          <span className="sticker-tag bg-[#00F0FF] text-black text-[10px] px-2.5 py-0.5 rotate-[2deg]">
            <Sparkles className="w-3 h-3 fill-black" /> ACID DROP
          </span>
        )}
      </div>

      {/* Product Photography Display with Cyber Canvas */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[#181D2F] to-[#0A0D16] p-4 flex items-center justify-center">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain object-center rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Hover Quick View & 3D Orbit Overlays */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 p-4">
          <button
            onClick={e => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="bg-[#CCFF00] text-black font-black text-xs px-4 py-2.5 rounded-2xl shadow-neon-lime flex items-center gap-1.5 uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-black" /> Quick Inspect
          </button>
        </div>

        {/* Derm Tested Mini Seal */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded-xl border border-white/15 text-[10px] font-mono text-[#00F0FF] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#CCFF00]" /> 100% ACTIVES
        </div>
      </div>

      {/* Multi-Angle Image Swatches Strip */}
      {product.images.length > 1 && (
        <div className="px-4 pt-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none" onClick={e => e.stopPropagation()}>
          {product.images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-7 h-7 rounded-lg overflow-hidden border transition shrink-0 p-0.5 bg-[#090B12] cursor-pointer ${
                activeImageIndex === idx
                  ? 'border-[#CCFF00] ring-1 ring-[#CCFF00]'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
              title={img.altText}
            >
              <img src={img.url} alt={img.altText} className="w-full h-full object-cover rounded-md" />
            </button>
          ))}
        </div>
      )}

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-0.5 rounded-md border border-[#00F0FF]/30">
              {product.categoryName}
            </span>

            <div className="flex items-center gap-1 text-[#FFE600] font-bold text-xs bg-black/50 px-2 py-0.5 rounded-full border border-white/10">
              <Star className="w-3.5 h-3.5 fill-[#FFE600] text-[#FFE600]" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-black text-white text-lg group-hover:text-[#CCFF00] transition-colors duration-200 line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.tagline}
          </p>

          {/* Skin Concern Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.skinConcerns.slice(0, 2).map(concern => (
              <span key={concern} className="text-[10px] font-mono bg-white/5 text-slate-300 px-2 py-0.5 rounded-md border border-white/10">
                {concern}
              </span>
            ))}
          </div>
        </div>

        {/* Variant Selector & Price */}
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          {product.variants.length > 1 && (
            <div className="flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
              <label className="text-[11px] font-mono text-slate-400">Volume:</label>
              <select
                value={selectedVariantId}
                onChange={e => setSelectedVariantId(e.target.value)}
                className="text-xs border border-white/20 rounded-xl px-2.5 py-1 bg-[#121624] text-white focus:outline-none focus:border-[#CCFF00] font-mono"
              >
                {product.variants.map(v => (
                  <option key={v.id} value={v.id} className="bg-[#090C16] text-white">
                    {v.name} — ₹{v.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-white font-mono">₹{currentVariant?.price}</span>
              {currentVariant?.compareAtPrice && (
                <span className="text-xs text-slate-500 line-through font-mono ml-2">
                  ₹{currentVariant.compareAtPrice}
                </span>
              )}
            </div>

            {currentVariant?.compareAtPrice && (
              <span className="sticker-tag bg-[#CCFF00] text-black text-[9px] px-2 py-0.5 rotate-[-2deg]">
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
              className="flex-1 py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 clay-button-lime text-black shadow-neon-lime hover:opacity-95 active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Instant Buy</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className={`py-2.5 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                addedAnimation
                  ? 'bg-[#00F0FF] text-black shadow-neon-cyan'
                  : currentVariant && currentVariant.stock > 0
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
              }`}
            >
              {addedAnimation ? <Check className="w-3.5 h-3.5 text-black" /> : '+ Bag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
