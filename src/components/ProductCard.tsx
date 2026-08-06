import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenQuickView,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0]?.id || '');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentVariant || currentVariant.stock <= 0) return;
    onAddToCart(product, currentVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenQuickView(product)}
      className="group bg-white rounded-3xl border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(12,59,46,0.12)] hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span className="bg-emerald-950 text-amber-300 font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md backdrop-blur border border-amber-400/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-teal-900/90 text-teal-100 font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md backdrop-blur border border-teal-500/30">
            Clinical Formula
          </span>
        )}
      </div>

      {/* Product Photography Display with Overlay & Quick View */}
      <div className="relative aspect-[4/4] overflow-hidden bg-stone-100/60 p-4">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Soft Clinical Vignette Overlay on Hover */}
        <div className="absolute inset-0 bg-emerald-950/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4">
          <button
            onClick={e => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="bg-white/95 text-emerald-950 font-semibold text-xs px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-emerald-950 hover:text-amber-300 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4 text-emerald-700 group-hover:text-amber-300" /> Quick View
          </button>
        </div>

        {/* Dermatologist Formula Stamp */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-200 shadow-sm text-[10px] font-medium text-emerald-900 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Derm Tested
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              {product.categoryName}
            </span>

            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50/80 px-2 py-0.5 rounded-full border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-emerald-900 transition-colors duration-200 line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed font-light">
            {product.tagline}
          </p>

          {/* Key Ingredient / Concern Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.skinConcerns.slice(0, 2).map(concern => (
              <span key={concern} className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md border border-stone-200/60">
                {concern}
              </span>
            ))}
          </div>
        </div>

        {/* Variant Selector & Price */}
        <div className="pt-3 border-t border-stone-100 space-y-2.5">
          {product.variants.length > 1 && (
            <div className="flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
              <label className="text-[11px] font-medium text-stone-500">Volume:</label>
              <select
                value={selectedVariantId}
                onChange={e => setSelectedVariantId(e.target.value)}
                className="text-xs border border-stone-200 rounded-lg px-2.5 py-1 bg-stone-50 text-stone-800 focus:outline-none focus:border-emerald-600 font-medium"
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
              <span className="text-xl font-bold text-emerald-950">₹{currentVariant?.price}</span>
              {currentVariant?.compareAtPrice && (
                <span className="text-xs text-stone-400 line-through ml-2">
                  ₹{currentVariant.compareAtPrice}
                </span>
              )}
            </div>

            {currentVariant?.compareAtPrice && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                SAVE ₹{currentVariant.compareAtPrice - currentVariant.price}
              </span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant || currentVariant.stock <= 0}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
              addedAnimation
                ? 'bg-emerald-700 text-white'
                : currentVariant && currentVariant.stock > 0
                ? 'bg-emerald-950 hover:bg-emerald-900 text-amber-300 hover:text-white active:scale-98 shadow-md'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-amber-300 animate-bounce" /> Added to Bag
              </>
            ) : currentVariant && currentVariant.stock > 0 ? (
              <>
                <ShoppingBag className="w-4 h-4 text-amber-300" /> Add to Cart — ₹{currentVariant?.price}
              </>
            ) : (
              'Out of Stock'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

