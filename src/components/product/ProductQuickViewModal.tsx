import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Star, Heart, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    openPdp,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorite = isInWishlist(product.id);
  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const handleAdd = () => {
    addToCart(product, currentVariant.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      id="product-quickview-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        id="product-quickview-modal-dialog"
        className="bg-white rounded-xl max-w-3xl w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Product Gallery Left */}
          <div className="space-y-3">
            <div className="w-full aspect-square bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-4 flex items-center justify-center">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg border p-1 bg-[#FAF9F6] ${
                      selectedImageIndex === idx ? 'border-[#E85D5D] ring-2 ring-red-100' : 'border-[#E5E5E5]'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specs Right */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                {product.brand}
              </p>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="bg-[#2D5A3D] text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs text-[#6B6B6B]">
                  {product.reviewCount.toLocaleString()} Verified Ratings
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-2 pb-2 border-b border-[#E5E5E5]">
              <span className="text-2xl font-bold text-[#1A1A1A]">₹{currentVariant.price}</span>
              {currentVariant.mrp > currentVariant.price && (
                <span className="text-sm text-neutral-400 line-through">₹{currentVariant.mrp}</span>
              )}
              <span className="badge-forest-green text-xs px-2.5 py-0.5 font-bold">
                {Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100)}% OFF
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants.length > 1 && (
              <div>
                <label className="text-xs font-bold text-[#1A1A1A] block mb-1.5">
                  Select Size / Variant:
                </label>
                <div className="flex gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        selectedVariantIndex === idx
                          ? 'border-[#E85D5D] bg-red-50 text-[#E85D5D]'
                          : 'border-[#E5E5E5] bg-white text-[#1A1A1A] hover:border-neutral-400'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAdd}
                className="btn-primary-coral flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border border-[#E5E5E5] hover:bg-neutral-50 transition ${
                  isFavorite ? 'text-[#E85D5D]' : 'text-neutral-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#E85D5D]' : ''}`} />
              </button>
            </div>

            {/* View Full Product Details Link */}
            <button
              onClick={() => {
                openPdp(product);
                setQuickViewProduct(null);
              }}
              className="w-full text-center text-xs font-bold text-[#1A1A1A] hover:text-[#E85D5D] flex items-center justify-center gap-1 pt-1"
            >
              <span>View Full Details, Active Ingredients & Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
