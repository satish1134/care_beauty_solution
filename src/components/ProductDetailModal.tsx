import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, CheckCircle2, MessageSquare, Send, Orbit } from 'lucide-react';
import { Product, ProductVariant, Review } from '../types';
import { AntiGravityProductViewer } from './AntiGravityProductViewer';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  reviews: Review[];
  onAddReview: (reviewData: { productId: string; userName: string; rating: number; comment: string }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  reviews,
  onAddReview,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]?.url || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'3dView' | 'benefits' | 'ingredients' | 'howToUse' | 'reviews'>('3dView');

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = reviews.filter(r => r.productId === product.id);

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col my-auto border border-emerald-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Image Gallery Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                <img
                  src={selectedImage || product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.images.length} Photoshoot Views
                </div>
              </div>

              {/* Thumbnails Strip */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map(img => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImage === img.url ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Header & Variant Purchasing */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.categoryName}
                </span>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
                  {product.name}
                </h2>

                <p className="text-sm text-slate-600 mt-1 font-normal">{product.tagline}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-amber-500' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviewCount} Reviews)</span>
                </div>
              </div>

              {/* Variant Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Size / Variant:</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
                        selectedVariant.id === v.id
                          ? 'bg-emerald-800 text-emerald-50 border-emerald-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
                      }`}
                    >
                      {v.name} - ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-bold text-emerald-950">₹{selectedVariant.price}</div>
                  {selectedVariant.compareAtPrice && (
                    <div className="text-xs text-slate-400 line-through">
                      MRP: ₹{selectedVariant.compareAtPrice} (Incl. of all taxes)
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, selectedVariant, quantity);
                      onClose();
                    }}
                    disabled={selectedVariant.stock <= 0}
                    className="flex-1 sm:flex-initial bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-glow-emerald transition active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-100" />
                    Add to Bag
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Dermatologically Tested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Non-Comedogenic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex space-x-4 sm:space-x-6 border-b border-slate-200 text-sm font-semibold pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('3dView')}
                className={`transition flex items-center gap-1.5 pb-2 ${activeTab === '3dView' ? 'text-emerald-900 border-b-2 border-emerald-800 font-extrabold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Orbit className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>3D Anti-Gravity View</span>
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`transition pb-2 ${activeTab === 'benefits' ? 'text-emerald-900 border-b-2 border-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                Key Benefits
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`transition pb-2 ${activeTab === 'ingredients' ? 'text-emerald-900 border-b-2 border-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('howToUse')}
                className={`transition pb-2 ${activeTab === 'howToUse' ? 'text-emerald-900 border-b-2 border-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                How to Use
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`transition pb-2 ${activeTab === 'reviews' ? 'text-emerald-900 border-b-2 border-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                Reviews ({productReviews.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-4 text-sm text-slate-700 leading-relaxed">
              {activeTab === '3dView' && (
                <div className="pt-2">
                  <AntiGravityProductViewer product={product} />
                </div>
              )}

              {activeTab === 'benefits' && (
                <div className="space-y-4">
                  <p>{product.description}</p>
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
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Hero Active Ingredients:</h4>
                    <ul className="list-disc list-inside space-y-1 font-medium text-emerald-900">
                      {product.keyIngredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Full INCI Formula:</h4>
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {product.fullIngredients}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'howToUse' && (
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-950 mb-1">Application Ritual:</h4>
                  <p>{product.howToUse}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews List */}
                  <div className="space-y-4">
                    {productReviews.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">No reviews yet. Be the first to review this product!</p>
                    ) : (
                      productReviews.map(r => (
                        <div key={r.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{r.userName} <span className="text-xs font-normal text-slate-400">({r.userCity})</span></span>
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                              ))}
                            </div>
                          </div>
                          <h5 className="font-semibold text-xs text-emerald-900">{r.title}</h5>
                          <p className="text-xs text-slate-600">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-emerald-900/5 p-4 rounded-2xl border border-emerald-200 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-700" /> Leave a Verified Customer Review
                    </h4>

                    {reviewSubmitted && (
                      <div className="bg-emerald-700 text-white text-xs p-2.5 rounded-xl font-semibold">
                        Thank you! Your review has been submitted and posted.
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Radhika S.)"
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                        required
                        className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">Rating:</span>
                        <select
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                          <option value={3}>⭐⭐⭐ (3/5)</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      placeholder="Write your experience with this formulation..."
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      required
                      rows={2}
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />

                    <button
                      type="submit"
                      className="bg-emerald-950 hover:bg-emerald-900 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-300" /> Post Review
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
