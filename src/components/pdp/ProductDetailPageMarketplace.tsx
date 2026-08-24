import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { MarketplaceProduct, ReviewItem } from '../../types/marketplace';
import { MARKETPLACE_PRODUCTS } from '../../data/marketplaceData';
import { ProductCardMarketplace } from '../product/ProductCardMarketplace';
import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ShoppingBag,
  Zap,
  MapPin,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

export const ProductDetailPageMarketplace: React.FC = () => {
  const {
    selectedProduct,
    goHome,
    openPlp,
    openPdp,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartDrawerOpen,
    setIsCheckoutModalOpen,
    selectedCity,
    selectedPincode,
    showToast,
  } = useStore();

  const product = selectedProduct || MARKETPLACE_PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'howToUse' | 'ingredients' | 'reviews'>('description');
  const [pincodeInput, setPincodeInput] = useState(selectedPincode || '560038');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  // Zoom preview states
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: '0% 0%', transform: 'scale(1)' });
  const [isZooming, setIsZooming] = useState(false);

  // Write Review form states
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [customReviews, setCustomReviews] = useState<ReviewItem[]>(product.reviews || []);

  // Frequently Bought Together Selection (The other 2 companion products in the 3-step routine)
  const otherProducts = MARKETPLACE_PRODUCTS.filter((p) => p.id !== product.id);
  const bundleProduct1 = otherProducts[0] || MARKETPLACE_PRODUCTS[0];
  const bundleProduct2 = otherProducts[1] || MARKETPLACE_PRODUCTS[1];
  const [bundleChecked1, setBundleChecked1] = useState(true);
  const [bundleChecked2, setBundleChecked2] = useState(true);

  const isFavorite = isInWishlist(product.id);
  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const savings = currentVariant.mrp - currentVariant.price;

  // Mouse move for Amazon-style image zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleAddToCartClick = () => {
    addToCart(product, currentVariant.id, quantity);
  };

  const handleBuyNowClick = () => {
    addToCart(product, currentVariant.id, quantity);
    setIsCheckoutModalOpen(true);
  };

  const handleAddBundleToCart = () => {
    addToCart(product, currentVariant.id, 1);
    if (bundleChecked1) addToCart(bundleProduct1, bundleProduct1.variants[0].id, 1);
    if (bundleChecked2) addToCart(bundleProduct2, bundleProduct2.variants[0].id, 1);
    setIsCartDrawerOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      userName: reviewName,
      userCity: reviewCity || selectedCity,
      rating: reviewRating,
      title: reviewTitle || 'Excellent Formulation',
      comment: reviewComment,
      date: 'Just Now',
      isVerified: true,
      helpfulCount: 0,
    };
    setCustomReviews((prev) => [newRev, ...prev]);
    setIsReviewFormOpen(false);
    setReviewName('');
    setReviewComment('');
    setReviewTitle('');
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  // Bundle pricing
  let bundleTotal = currentVariant.price;
  let bundleMrp = currentVariant.mrp;
  if (bundleChecked1) {
    bundleTotal += bundleProduct1.variants[0].price;
    bundleMrp += bundleProduct1.variants[0].mrp;
  }
  if (bundleChecked2) {
    bundleTotal += bundleProduct2.variants[0].price;
    bundleMrp += bundleProduct2.variants[0].mrp;
  }

  // Related companion products (The other 2 essential formulations)
  const relatedProducts = MARKETPLACE_PRODUCTS.filter((p) => p.id !== product.id);

  return (
    <div id="product-detail-page-root" className="min-h-screen bg-[#FAF9F6] py-6">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
          <button onClick={goHome} className="hover:text-[#1A1A1A]">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            onClick={() => openPlp({ category: product.category })}
            className="hover:text-[#1A1A1A]"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            onClick={() => openPlp({ category: product.category, subCategory: product.subCategory })}
            className="hover:text-[#1A1A1A]"
          >
            {product.subCategory}
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-[#1A1A1A] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2. Top Product Showcase: Left Gallery + Right Sticky Buy Box */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Amazon-style vertical thumbnail list + large zoomable image (5 cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border p-1 bg-[#FAF9F6] transition ${
                    activeImageIndex === idx
                      ? 'border-[#E85D5D] ring-2 ring-red-100'
                      : 'border-[#E5E5E5] hover:border-neutral-400'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main Stage with Zoom */}
            <div
              className="flex-1 aspect-square bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-6 relative flex items-center justify-center zoom-container overflow-hidden"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => {
                setIsZooming(false);
                setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
              }}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain pointer-events-none"
                style={isZooming ? zoomStyle : undefined}
              />
              <span className="absolute bottom-3 right-3 text-[10px] text-[#6B6B6B] bg-white/80 px-2 py-1 rounded backdrop-blur-xs border border-[#E5E5E5]">
                Hover to Zoom
              </span>
            </div>
          </div>

          {/* Right: Buy Box & Product Details (7 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  {product.brand}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2D5A3D] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Genuine Lab Certified
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Star Rating & Review Count */}
              <div className="flex items-center gap-3 mt-2.5">
                <div className="bg-[#2D5A3D] text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <a href="#reviews-section" className="text-xs text-[#6B6B6B] hover:text-[#E85D5D] hover:underline">
                  {product.reviewCount.toLocaleString()} Verified Ratings &amp; 140 Reviews
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-4 space-y-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  ₹{currentVariant.price}
                </span>
                {currentVariant.mrp > currentVariant.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    MRP ₹{currentVariant.mrp}
                  </span>
                )}
                <span className="badge-forest-green text-xs px-2.5 py-0.5 font-bold">
                  {Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100)}% OFF
                </span>
              </div>
              <p className="text-xs text-[#2D5A3D] font-semibold">
                You Save: ₹{savings} (Inclusive of all Indian Taxes)
              </p>
            </div>

            {/* Size / Variant Selector */}
            {product.variants.length > 1 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] block mb-2">
                  Select Size / Pack:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`text-xs px-4 py-2 rounded-lg border font-semibold transition ${
                        selectedVariantIndex === idx
                          ? 'border-[#E85D5D] bg-red-50 text-[#E85D5D]'
                          : 'border-[#E5E5E5] bg-white text-[#1A1A1A] hover:border-neutral-400'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="block text-[10px] font-normal text-[#6B6B6B]">
                        ₹{v.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E5E5E5] rounded-lg bg-[#FAF9F6]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-neutral-200 text-[#1A1A1A] transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#1A1A1A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-neutral-200 text-[#1A1A1A] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  id="pdp-add-to-bag-button"
                  onClick={handleAddToCartClick}
                  className="btn-primary-coral flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-lg border border-[#E5E5E5] hover:bg-neutral-50 transition ${
                    isFavorite ? 'text-[#E85D5D]' : 'text-neutral-500'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#E85D5D]' : ''}`} />
                </button>
              </div>

              <button
                id="pdp-buy-now-button"
                onClick={handleBuyNowClick}
                className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="border-t border-[#E5E5E5] pt-4">
              <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#E85D5D]" />
                <span>Delivery &amp; Services Check:</span>
              </label>
              <div className="flex max-w-xs">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="bg-[#FAF9F6] border border-[#E5E5E5] text-xs px-3 py-2 rounded-l-lg focus:outline-none focus:border-[#E85D5D] flex-1"
                />
                <button
                  onClick={() => {
                    if (pincodeInput.length === 6) {
                      setPincodeChecked(true);
                      showToast(`Delivery available for ${pincodeInput}`, 'info');
                    }
                  }}
                  className="bg-neutral-800 text-white text-xs font-bold px-3 py-2 rounded-r-lg hover:bg-black"
                >
                  Check
                </button>
              </div>

              {pincodeChecked && (
                <div className="mt-2 space-y-1 text-xs text-[#2D5A3D] font-medium">
                  <p className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#2D5A3D]" />
                    <span>FREE Express Delivery by <strong>Tomorrow, 4:00 PM</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 text-neutral-600">
                    <Check className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Cash on Delivery &amp; UPI on Delivery Available</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-neutral-600">
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                    <span>15-Day Hassle-Free Returns</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Frequently Bought Together Bundle */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
          <h3 className="text-base font-bold text-[#1A1A1A] mb-4">
            Frequently Bought Together (Dermat Barrier Repair Routine)
          </h3>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Products Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Product 1 (Current) */}
              <div className="flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-16 object-contain rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-1"
                />
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] max-w-[140px] truncate">{product.name}</p>
                  <p className="text-xs text-[#E85D5D] font-bold">₹{currentVariant.price}</p>
                </div>
              </div>

              <span className="text-neutral-400 font-bold text-lg">+</span>

              {/* Product 2 */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={bundleChecked1}
                  onChange={(e) => setBundleChecked1(e.target.checked)}
                  className="rounded text-[#E85D5D] focus:ring-[#E85D5D]"
                />
                <img
                  src={bundleProduct1.images[0]}
                  alt={bundleProduct1.name}
                  className="w-16 h-16 object-contain rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-1"
                />
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] max-w-[140px] truncate">{bundleProduct1.name}</p>
                  <p className="text-xs text-[#E85D5D] font-bold">₹{bundleProduct1.variants[0].price}</p>
                </div>
              </div>

              <span className="text-neutral-400 font-bold text-lg">+</span>

              {/* Product 3 */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={bundleChecked2}
                  onChange={(e) => setBundleChecked2(e.target.checked)}
                  className="rounded text-[#E85D5D] focus:ring-[#E85D5D]"
                />
                <img
                  src={bundleProduct2.images[0]}
                  alt={bundleProduct2.name}
                  className="w-16 h-16 object-contain rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-1"
                />
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] max-w-[140px] truncate">{bundleProduct2.name}</p>
                  <p className="text-xs text-[#E85D5D] font-bold">₹{bundleProduct2.variants[0].price}</p>
                </div>
              </div>
            </div>

            {/* Total & Action */}
            <div className="border-t lg:border-t-0 lg:border-l border-[#E5E5E5] pt-4 lg:pt-0 lg:pl-6 shrink-0 space-y-2">
              <div>
                <span className="text-xs text-[#6B6B6B]">Total Combined Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-[#1A1A1A]">₹{bundleTotal}</span>
                  <span className="text-xs text-neutral-400 line-through">₹{bundleMrp}</span>
                  <span className="badge-forest-green text-[10px] px-2 py-0.5 font-bold">
                    Save ₹{bundleMrp - bundleTotal}
                  </span>
                </div>
              </div>
              <button
                onClick={handleAddBundleToCart}
                className="btn-primary-coral text-xs px-6 py-2.5 font-bold w-full"
              >
                Add All 3 Items to Bag
              </button>
            </div>
          </div>
        </div>

        {/* 4. Product Description Tabs: Description, How to Use, Ingredients, Verified Reviews */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#E5E5E5] overflow-x-auto no-scrollbar bg-[#FAF9F6]">
            {[
              { key: 'description', label: 'Product Details & Benefits' },
              { key: 'howToUse', label: 'How to Apply & AM/PM Ritual' },
              { key: 'ingredients', label: 'Full Active Ingredients' },
              { key: 'reviews', label: `Verified Reviews (${customReviews.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-6 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-b-2 border-[#E85D5D] text-[#E85D5D] bg-white'
                    : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8">
            {activeTab === 'description' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base font-bold text-[#1A1A1A]">Clinical Formulation Overview</h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                  {product.description}
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pt-2">
                  Key Physiological Benefits:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#6B6B6B]">
                  {product.keyBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#2D5A3D] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base font-bold text-[#1A1A1A]">Dermatologist Application Guidelines</h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                  {product.howToUse}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-4 rounded-lg">
                    <h5 className="text-xs font-bold text-[#1A1A1A] mb-1">AM Morning Protocol</h5>
                    <p className="text-xs text-[#6B6B6B]">
                      Cleanse face with gentle wash → Apply Active Serums → Seal with this formulation → Always finish with Ray Barrier SPF 50+.
                    </p>
                  </div>
                  <div className="bg-[#FAF9F6] border border-[#E5E5E5] p-4 rounded-lg">
                    <h5 className="text-xs font-bold text-[#1A1A1A] mb-1">PM Night Protocol</h5>
                    <p className="text-xs text-[#6B6B6B]">
                      Double cleanse → Apply night exfoliants / retinoids → Massage 2 pumps of barrier repair cream for overnight cellular restoration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base font-bold text-[#1A1A1A]">Full Transparency INCI Matrix</h3>
                <p className="text-xs font-mono bg-[#FAF9F6] p-4 rounded-lg border border-[#E5E5E5] text-[#1A1A1A] leading-relaxed">
                  {product.ingredients}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] bg-neutral-100 px-3 py-1 rounded-full text-neutral-700 font-semibold">Paraben Free</span>
                  <span className="text-[11px] bg-neutral-100 px-3 py-1 rounded-full text-neutral-700 font-semibold">Sulfate Free</span>
                  <span className="text-[11px] bg-neutral-100 px-3 py-1 rounded-full text-neutral-700 font-semibold">Fragrance Free</span>
                  <span className="text-[11px] bg-neutral-100 px-3 py-1 rounded-full text-neutral-700 font-semibold">Non-Comedogenic</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div id="reviews-section" className="space-y-8">
                {/* Ratings Breakdown Top */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pb-6 border-b border-[#E5E5E5]">
                  <div className="text-center md:text-left">
                    <span className="text-4xl sm:text-5xl font-bold text-[#1A1A1A]">
                      {product.rating}
                    </span>
                    <div className="flex justify-center md:justify-start text-amber-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-[#6B6B6B]">
                      Based on {product.reviewCount.toLocaleString()} verified ratings
                    </p>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-1 text-xs">
                    {[
                      { star: 5, pct: 82 },
                      { star: 4, pct: 14 },
                      { star: 3, pct: 3 },
                      { star: 2, pct: 1 },
                      { star: 1, pct: 0 },
                    ].map((row) => (
                      <div key={row.star} className="flex items-center gap-2">
                        <span className="w-6 text-right text-neutral-600">{row.star}★</span>
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2D5A3D]" style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="w-8 text-neutral-500 text-[10px]">{row.pct}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Write a Review Button */}
                  <div className="text-center md:text-right">
                    <button
                      onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                      className="btn-primary-coral text-xs px-6 py-2.5 font-bold"
                    >
                      {isReviewFormOpen ? 'Cancel Review' : 'Write a Customer Review'}
                    </button>
                  </div>
                </div>

                {/* Interactive Write Review Form */}
                {isReviewFormOpen && (
                  <form onSubmit={handleReviewSubmit} className="bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-[#1A1A1A]">Write Your Verified Review</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Dr. Riya Sen"
                          className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Your City</label>
                        <input
                          type="text"
                          value={reviewCity}
                          onChange={(e) => setReviewCity(e.target.value)}
                          placeholder="e.g. Mumbai, Maharashtra"
                          className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button
                            type="button"
                            key={r}
                            onClick={() => setReviewRating(r)}
                            className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                              reviewRating >= r ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white'
                            }`}
                          >
                            <span>{r}</span>
                            <Star className="w-3 h-3 fill-amber-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Restored my damaged skin barrier overnight"
                        className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#1A1A1A] block mb-1">Detailed Review *</label>
                      <textarea
                        rows={3}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe texture, skin feel, hydration retention, etc."
                        className="w-full bg-white border border-[#E5E5E5] text-xs p-2.5 rounded-lg"
                      />
                    </div>

                    <button type="submit" className="btn-primary-coral text-xs px-6 py-2.5 font-bold">
                      Submit Verified Review
                    </button>
                  </form>
                )}

                {/* Review Cards List */}
                <div className="space-y-4">
                  {customReviews.map((rev) => (
                    <div key={rev.id} className="border-b border-[#E5E5E5] pb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1A1A1A]">{rev.userName}</span>
                          <span className="text-[10px] text-[#6B6B6B]">({rev.userCity})</span>
                          {rev.isVerified && (
                            <span className="badge-forest-green text-[10px] px-1.5 py-0.2 font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400">{rev.date}</span>
                      </div>

                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>

                      <h5 className="text-xs font-bold text-[#1A1A1A]">{rev.title}</h5>
                      <p className="text-xs text-[#6B6B6B] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Companion Essentials */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#1A1A1A]">Complete the Routine (Companion Essentials)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {relatedProducts.map((p) => (
              <ProductCardMarketplace key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
