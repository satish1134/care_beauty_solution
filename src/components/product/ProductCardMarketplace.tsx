import React, { useState } from 'react';
import { MarketplaceProduct } from '../../types/marketplace';
import { useStore } from '../../context/StoreContext';
import { Star, Heart, Eye, Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: MarketplaceProduct;
  layout?: 'grid' | 'list';
}

export const ProductCardMarketplace: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
}) => {
  const {
    openPdp,
    addToCart,
    cart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const defaultVariant = product.variants[0];

  // Find if this product variant is already in cart
  const cartItem = cart.find(
    (item) => item.productId === product.id && item.variantId === defaultVariant.id
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, defaultVariant.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    } else {
      addToCart(product, defaultVariant.id, 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    }
  };

  if (layout === 'list') {
    return (
      <div
        id={`product-card-list-${product.id}`}
        onClick={() => openPdp(product)}
        className="ecom-card bg-white p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer relative transition hover:border-neutral-400"
      >
        {/* Product Image */}
        <div className="w-full sm:w-44 h-44 bg-[#FAF9F6] rounded-lg p-2 flex items-center justify-center shrink-0 relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain"
          />
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 badge-forest-green text-[10px] px-2 py-0.5 font-bold">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 space-y-1.5 w-full">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
            {product.brand}
          </p>
          <h3 className="text-sm sm:text-base font-medium text-[#1A1A1A] line-clamp-2">
            {product.name}
          </h3>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="bg-[#2D5A3D] text-white px-1.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-0.5">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-[#6B6B6B] text-xs">({product.reviewCount.toLocaleString()})</span>
          </div>

          <p className="text-xs text-[#6B6B6B] line-clamp-2 hidden sm:block">
            {product.description}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-[#1A1A1A]">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-neutral-400 line-through">₹{product.mrp}</span>
            )}
            <span className="text-xs font-bold text-[#2D5A3D]">{product.discount}% OFF</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-36">
          {quantityInCart === 0 ? (
            <button
              onClick={handleAddToCart}
              className="btn-primary-coral w-full py-2.5 text-xs font-bold"
            >
              {justAdded ? (
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4" /> Added
                </span>
              ) : (
                'Add to Bag'
              )}
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-white border-2 border-[#E85D5D] rounded-lg p-1">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center text-[#E85D5D] hover:bg-red-50 rounded"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-[#1A1A1A]">{quantityInCart}</span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center text-[#E85D5D] hover:bg-red-50 rounded"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-lg border border-[#E5E5E5] hover:bg-neutral-50 transition w-full flex items-center justify-center gap-1 text-xs ${
              isFavorite ? 'text-[#E85D5D] font-medium' : 'text-[#6B6B6B]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#E85D5D] text-[#E85D5D]' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Wishlist'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => openPdp(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="ecom-card bg-white flex flex-col justify-between cursor-pointer relative group transition duration-150"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-[#FAF9F6] p-3 flex items-center justify-center overflow-hidden rounded-t-lg">
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 badge-forest-green text-[10px] px-2 py-0.5 font-bold shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist Heart Icon Toggle */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white border border-[#E5E5E5] transition shadow-xs"
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorite ? 'fill-[#E85D5D] text-[#E85D5D]' : 'text-neutral-500 hover:text-[#E85D5D]'
            }`}
          />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="hidden md:flex absolute bottom-2 left-1/2 -translate-x-1/2 items-center gap-1 bg-white/95 hover:bg-white text-[#1A1A1A] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#E5E5E5] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Body Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Brand Name */}
          <p className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#6B6B6B] truncate">
            {product.brand}
          </p>

          {/* Product Name (2 Lines Max) */}
          <h3 className="text-xs sm:text-sm font-medium text-[#1A1A1A] line-clamp-2 min-h-[38px] mt-0.5 leading-snug">
            {product.name}
          </h3>

          {/* Star Rating + Reviews */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="bg-[#2D5A3D] text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-[#6B6B6B]">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Pricing Block & Add To Cart Button */}
        <div>
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-sm sm:text-base font-bold text-[#1A1A1A]">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">
                ₹{product.mrp}
              </span>
            )}
            <span className="text-[11px] font-bold text-[#2D5A3D]">
              {product.discount}% OFF
            </span>
          </div>

          {/* Dynamic Add to Cart / Quantity Stepper */}
          {quantityInCart === 0 ? (
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={handleAddToCart}
              className="btn-primary-coral w-full py-2 text-xs font-bold"
            >
              {justAdded ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Added
                </span>
              ) : (
                'Add to Bag'
              )}
            </button>
          ) : (
            <div
              id={`qty-stepper-${product.id}`}
              className="w-full flex items-center justify-between bg-white border-2 border-[#E85D5D] rounded-lg p-0.5"
            >
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center text-[#E85D5D] hover:bg-red-50 rounded"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-[#1A1A1A]">{quantityInCart}</span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center text-[#E85D5D] hover:bg-red-50 rounded"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
