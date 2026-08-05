import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, ShieldCheck, CheckCircle2, MessageSquare, Send, ChevronRight, Share2, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Product, ProductVariant, Review } from '../types';

interface ProductDetailPageProps {
  product: Product;
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  reviews: Review[];
  onAddReview: (reviewData: { productId: string; userName: string; rating: number; comment: string }) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBackToCatalog,
  onAddToCart,
  reviews,
  onAddReview,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]?.url || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howToUse' | 'reviews'>('benefits');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = reviews.filter(r => r.productId === product.id);

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
        {/* Left: Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-emerald-50/50 rounded-2xl overflow-hidden border border-emerald-100 relative group shadow-sm">
            <img
              src={selectedImage || product.images[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
              referrerPolicy="no-referrer"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Best Seller
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map(img => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                  selectedImage === img.url ? 'border-emerald-700 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.altText} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={selectedVariant.stock <= 0}
                className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : selectedVariant.stock > 0
                    ? 'bg-emerald-900 hover:bg-emerald-800 text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 text-amber-300" /> Added to Bag!
                  </>
                ) : selectedVariant.stock > 0 ? (
                  <>
                    <ShoppingBag className="w-5 h-5 text-amber-300" /> Add {quantity} to Bag • ₹{selectedVariant.price * quantity}
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>
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
    </div>
  );
};
