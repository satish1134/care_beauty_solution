import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Search, Filter, ShieldCheck } from 'lucide-react';
import { Review, Product } from '../../types';

interface ReviewModeratorProps {
  products: Product[];
}

export const ReviewModerator: React.FC<ReviewModeratorProps> = ({ products }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to remove this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      }
    } catch (err) {
      alert('Error deleting review');
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'ALL') return true;
    return r.rating === filterRating;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Customer Review Moderation</h2>
          <p className="text-slate-400 text-xs mt-1">Audit customer feedback, star ratings, and verified buyer claims.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filter Rating:</span>
          <select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Ratings (1 - 5 Stars)</option>
            <option value={5}>5 Stars ★★★★★</option>
            <option value={4}>4 Stars ★★★★☆</option>
            <option value={3}>3 Stars ★★★☆☆</option>
            <option value={2}>2 Stars ★★☆☆☆</option>
            <option value={1}>1 Star ★☆☆☆☆</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-xs">
            No customer reviews match the selected filter.
          </div>
        ) : (
          filteredReviews.map(review => {
            const product = products.find(p => p.id === review.productId);

            return (
              <div
                key={review.id}
                className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700/80 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-white text-xs">{review.userName}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Verified Purchase
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic">"{review.comment}"</p>

                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                    <span>Product: {product?.name || review.productId}</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Review</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
