import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Sparkles, ShieldCheck } from 'lucide-react';
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

  const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const displayImage = product.images[activeImageIndex]?.url || product.images[0]?.url;

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
      className="group bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span className="bg-amber-900 text-amber-100 font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md backdrop-blur border border-amber-400/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-stone-900/90 text-stone-100 font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md backdrop-blur">
            Clinical Formula
          </span>
        )}
      </div>

      {/* Product Photography Display */}
      <div className="relative aspect-square overflow-hidden bg-stone-50 p-3">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4">
          <button
            onClick={e => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="bg-white text-stone-900 font-bold text-xs px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-amber-800 hover:text-white transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-4 h-4 text-amber-800 group-hover:text-amber-100" /> Quick View ({product.images.length} Photos)
          </button>
        </div>

        {/* Derm Tested Badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-200 shadow-sm text-[10px] font-bold text-stone-800 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-amber-700" /> Derm Tested
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
                  ? 'border-amber-700 ring-2 ring-amber-500/40'
                  : 'border-stone-200 opacity-60 hover:opacity-100'
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
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
              {product.categoryName}
            </span>

            <div className="flex items-center gap-1 text-amber-700 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif font-bold text-stone-900 text-lg group-hover:text-amber-900 transition-colors duration-200 line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.tagline}
          </p>

          {/* Key Ingredient / Concern Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.skinConcerns.slice(0, 2).map(concern => (
              <span key={concern} className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md border border-stone-200">
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
                className="text-xs border border-stone-200 rounded-lg px-2.5 py-1 bg-stone-50 text-stone-800 focus:outline-none focus:border-amber-700 font-medium"
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
              <span className="text-xl font-bold text-stone-900">₹{currentVariant?.price}</span>
              {currentVariant?.compareAtPrice && (
                <span className="text-xs text-stone-400 line-through ml-2">
                  ₹{currentVariant.compareAtPrice}
                </span>
              )}
            </div>

            {currentVariant?.compareAtPrice && (
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
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
              className="flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white active:scale-95 cursor-pointer border border-amber-400/30"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
              <span>Buy Now</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!currentVariant || currentVariant.stock <= 0}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1 shadow-sm ${
                addedAnimation
                  ? 'bg-emerald-700 text-white'
                  : currentVariant && currentVariant.stock > 0
                  ? 'bg-stone-900 hover:bg-stone-950 text-amber-300 border border-stone-800 active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {addedAnimation ? <Check className="w-3.5 h-3.5 text-amber-300" /> : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

