import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
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
      className="group bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span className="bg-amber-400 text-emerald-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-teal-700 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
            New Formula
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-emerald-50/40">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <button
            onClick={e => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="bg-white text-emerald-950 font-semibold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-emerald-50 transition"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-700" /> Quick View
          </button>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Concerns */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>

            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {product.categoryName}
            </span>
          </div>

          <h3 className="font-serif font-bold text-slate-900 text-base group-hover:text-emerald-800 transition line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>

          {/* Skin Concern Pills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.skinConcerns.slice(0, 2).map(concern => (
              <span key={concern} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {concern}
              </span>
            ))}
          </div>
        </div>

        {/* Variant Selector & Price */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {product.variants.length > 1 && (
            <div className="flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
              <label className="text-[11px] font-medium text-slate-500">Size:</label>
              <select
                value={selectedVariantId}
                onChange={e => setSelectedVariantId(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                {product.variants.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} - ₹{v.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-emerald-950">₹{currentVariant?.price}</span>
              {currentVariant?.compareAtPrice && (
                <span className="text-xs text-slate-400 line-through ml-2">
                  ₹{currentVariant.compareAtPrice}
                </span>
              )}
            </div>

            {currentVariant?.stock <= 5 && currentVariant?.stock > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Only {currentVariant.stock} left
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant || currentVariant.stock <= 0}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : currentVariant && currentVariant.stock > 0
                ? 'bg-emerald-900 hover:bg-emerald-800 text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-amber-300" /> Added to Cart!
              </>
            ) : currentVariant && currentVariant.stock > 0 ? (
              <>
                <ShoppingBag className="w-4 h-4 text-amber-300" /> Add to Cart
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
