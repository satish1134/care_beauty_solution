import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, ShieldCheck, CheckCircle2, MessageSquare, Send, ChevronRight, ChevronLeft, Share2, ArrowLeft, Check, Sparkles, Maximize2, Eye } from 'lucide-react';
import { Product, ProductVariant, Review } from '../types';
import { ProductSlider } from './ProductSlider';
import { getOptimizedCloudinaryUrl } from '../lib/cloudinaryClient';

interface ProductDetailPageProps {
  product: Product;
  allProducts?: Product[];
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
  reviews: Review[];
  onAddReview: (reviewData: { productId: string; userName: string; rating: number; comment: string }) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts = [],
  onBackToCatalog,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  reviews,
  onAddReview,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howToUse' | 'reviews'>('benefits');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = reviews.filter(r => r.productId === product.id);
  const images = product.images.length > 0 ? product.images : [{ id: 'default', url: '/images/care-refreshing-skin-cleanser.svg', altText: product.name, isPrimary: true }];
  const currentImage = images[selectedImageIndex] || images[0];

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Update URL and document title for SSR / SPA parity
  useEffect(() => {
    document.title = `${product.name} — Care Beauty Solution`;
    window.history.replaceState(null, '', `/product/${product.slug}`);

    // Inject Schema.org JSON-LD dynamically into head
    const existingLd = document.getElementById('pdp-jsonld');
    if (existingLd) existingLd.remove();

    const ldScript = document.createElement('script');
    ldScript.id = 'pdp-jsonld';
    ldScript.type = 'application/ld+json';
    ldScript.text = JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product.name,
      'image': product.images.map(img => img.url),
      'description': product.description,
      'sku': selectedVariant?.sku || product.id,
      'brand': {
        '@type': 'Brand',
        'name': 'Care Beauty Solution',
      },
      'offers': {
        '@type': 'Offer',
        'url': window.location.href,
        'priceCurrency': 'INR',
        'price': selectedVariant?.price || 0,
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': selectedVariant?.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product.rating,
        'reviewCount': product.reviewCount,
      },
    });
    document.head.appendChild(ldScript);

    return () => {
      const scriptToRemove = document.getElementById('pdp-jsonld');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [product, selectedVariant]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant.stock <= 0) return;
    onAddToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    onAddReview({
      productId: product.id,
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div id="product-detail-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={onBackToCatalog} className="hover:text-emerald-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-400">{product.categoryName}</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-emerald-950 font-bold">{product.name}</span>
      </nav>

      {/* Hero PDP Layout Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery Column with Interactive Image Slider */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-emerald-50/50 rounded-3xl overflow-hidden border border-emerald-100 relative group shadow-sm">
            <img
              src={getOptimizedCloudinaryUrl(currentImage.url, { width: 1000, height: 1000, quality: 'auto', crop: 'limit' })}
              alt={currentImage.altText || product.name}
              className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
              {product.isBestSeller && (
                <span className="bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Best Seller
                </span>
              )}
            </div>

            {/* Slider Image Count Indicator */}
            {images.length > 1 && (
              <span className="absolute bottom-4 right-4 bg-emerald-950/80 backdrop-blur text-white text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-700/50">
                {selectedImageIndex + 1} / {images.length}
              </span>
            )}

            {/* Overlay Navigation Arrows (Minimalist Style) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 backdrop-blur text-emerald-950 hover:bg-white shadow-lg transition transform -translate-x-2 group-hover:translate-x-0 opacity-80 group-hover:opacity-100"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 backdrop-blur text-emerald-950 hover:bg-white shadow-lg transition transform translate-x-2 group-hover:translate-x-0 opacity-80 group-hover:opacity-100"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen Preview Icon */}
            <button
              onClick={() => setIsFullscreenImage(true)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-emerald-950 shadow transition opacity-0 group-hover:opacity-100"
              title="Expand Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Gallery Thumbnails Carousel Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                  selectedImageIndex === idx ? 'border-emerald-800 shadow-md scale-105 ring-2 ring-emerald-300/50' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={getOptimizedCloudinaryUrl(img.url, { width: 160, height: 160, quality: 'auto', crop: 'fill' })}
                  alt={img.altText}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.categoryName}
              </span>

              <button
                onClick={handleShare}
                className="text-xs text-slate-500 hover:text-emerald-800 flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 transition"
              >
                <Share2 className="w-3.5 h-3.5" /> {copiedLink ? 'Link Copied!' : 'Share'}
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-3">
              {product.name}
            </h1>

            <p className="text-base text-emerald-800 font-medium mt-1">{product.tagline}</p>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating} / 5.0</span>
              <span className="text-xs text-slate-500 font-medium">({product.reviewCount} Verified Customer Ratings)</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Key Features Bullet List */}
          {product.features && product.features.length > 0 && (
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" /> Clinical Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variant Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Packaging Variant:</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition flex items-center gap-2 ${
                    selectedVariant.id === v.id
                      ? 'bg-emerald-950 text-white border-emerald-900 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
                  }`}
                >
                  <span>{v.name}</span>
                  <span className={selectedVariant.id === v.id ? 'text-amber-300' : 'text-emerald-800'}>₹{v.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add to Cart Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-emerald-950">₹{selectedVariant.price}</span>
              {selectedVariant.compareAtPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{selectedVariant.compareAtPrice}
                </span>
              )}
              {selectedVariant.compareAtPrice && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  SAVE ₹{selectedVariant.compareAtPrice - selectedVariant.price}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>

              {/* Action Buttons: Buy Now & Add to Bag */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
                {/* BUY NOW Button */}
                <button
                  onClick={() => {
                    if (selectedVariant.stock <= 0) return;
                    if (onBuyNow) {
                      onBuyNow(product, selectedVariant, quantity);
                    } else {
                      onAddToCart(product, selectedVariant, quantity);
                    }
                  }}
                  disabled={selectedVariant.stock <= 0}
                  className="flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white active:scale-95 cursor-pointer border border-amber-400/30"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-200" />
                  <span>BUY NOW • ₹{selectedVariant.price * quantity}</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stock <= 0}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : selectedVariant.stock > 0
                      ? 'bg-stone-900 hover:bg-stone-950 text-amber-300 border border-amber-500/30 active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5 text-amber-300" /> Added to Bag!
                    </>
                  ) : selectedVariant.stock > 0 ? (
                    <>
                      <span>+ Add to Bag</span>
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Dermatologically Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>100% Fragrance Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Active Ingredients, INCI, Ritual, Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex space-x-8 border-b border-slate-200 text-sm font-bold pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 transition shrink-0 ${activeTab === 'benefits' ? 'text-emerald-950 border-b-2 border-emerald-950' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Formula Overview
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 transition shrink-0 ${activeTab === 'ingredients' ? 'text-emerald-950 border-b-2 border-emerald-950' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Ingredients (INCI)
          </button>
          <button
            onClick={() => setActiveTab('howToUse')}
            className={`pb-3 transition shrink-0 ${activeTab === 'howToUse' ? 'text-emerald-950 border-b-2 border-emerald-950' : 'text-slate-400 hover:text-slate-700'}`}
          >
            How To Use
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition shrink-0 ${activeTab === 'reviews' ? 'text-emerald-950 border-b-2 border-emerald-950' : 'text-slate-400 hover:text-slate-700'}`}
          >
            Customer Reviews ({productReviews.length})
          </button>
        </div>

        <div className="py-2 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'benefits' && (
            <div className="space-y-6 max-w-3xl">
              <p>{product.description}</p>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Targeted Skin Concerns:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.skinConcerns.map(sc => (
                    <span key={sc} className="bg-teal-50 text-teal-900 font-semibold text-xs px-3 py-1 rounded-full border border-teal-200">
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Suitable Skin Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.skinTypes.map(st => (
                    <span key={st} className="bg-emerald-50 text-emerald-900 font-semibold text-xs px-3 py-1 rounded-full border border-emerald-200">
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Hero Active Ingredients:</h4>
                <ul className="list-disc list-inside space-y-1 font-medium text-emerald-900">
                  {product.keyIngredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Full International Nomenclature (INCI):</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono leading-relaxed">
                  {product.fullIngredients}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 max-w-3xl space-y-2">
              <h4 className="font-bold text-emerald-950 text-base">Application Ritual:</h4>
              <p className="text-slate-800">{product.howToUse}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              {/* Existing Reviews */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No reviews yet. Be the first to review this formulation!</p>
                ) : (
                  productReviews.map(r => (
                    <div key={r.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{r.userName} <span className="text-xs font-normal text-slate-400">({r.userCity})</span></span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      <h5 className="font-semibold text-xs text-emerald-900">{r.title}</h5>
                      <p className="text-xs text-slate-600">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="bg-emerald-900/5 p-6 rounded-3xl border border-emerald-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-700" /> Leave a Verified Customer Review
                </h4>

                {reviewSubmitted && (
                  <div className="bg-emerald-700 text-white text-xs p-3 rounded-xl font-bold">
                    Thank you! Your verified review has been published.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Full Name (e.g. Radhika Sharma)"
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    required
                    className="text-xs bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800"
                  />

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={e => setReviewRating(Number(e.target.value))}
                      className="text-xs bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 flex-1"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                    </select>
                  </div>
                </div>

                <textarea
                  placeholder="Tell us how this formulation improved your skin..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  required
                  rows={3}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl p-4 text-slate-800"
                />

                <button
                  type="submit"
                  className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" /> Post Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Recommended / Complementary Formulations Slider */}
      {allProducts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm">
          <ProductSlider
            title="Complete Your Skincare Ritual"
            subtitle="Dermatologist-curated active formulations designed to layer seamlessly with this product."
            products={allProducts.filter(p => p.id !== product.id)}
            onAddToCart={onAddToCart}
            onOpenQuickView={p => {
              if (onSelectProduct) onSelectProduct(p);
            }}
            badgeText="Pairs Well With"
          />
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {isFullscreenImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-6 right-6 bg-white/20 text-white hover:bg-white/40 p-3 rounded-full font-bold transition text-xs"
          >
            ✕ Close Preview
          </button>
          <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20">
            <img
              src={currentImage.url}
              alt={currentImage.altText || product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
