import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Search, Filter, ShieldCheck } from 'lucide-react';
import { Review, Product } from '../../types';

interface ReviewModeratorProps {
  products: Product[];
  isDarkMode?: boolean;
}

export const ReviewModerator: React.FC<ReviewModeratorProps> = ({ products, isDarkMode = false }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

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
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}>
        <div>
          <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>Customer Review Moderation</h2>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>Audit customer feedback, star ratings, and verified buyer claims.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${textSecondary}`}>Filter Rating:</span>
          <select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className={`rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isDarkMode
                ? 'bg-slate-800 border border-slate-700 text-slate-100'
                : 'bg-slate-50 border border-slate-300 text-slate-900'
            }`}
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
          <div className={`text-center py-12 rounded-3xl border text-xs font-semibold ${cardBg} ${textMuted}`}>
            No customer reviews match the selected filter.
          </div>
        ) : (
          filteredReviews.map(review => {
            const product = products.find(p => p.id === review.productId);

            return (
              <div
                key={review.id}
                className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors ${cardBg}`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
                        />
                      ))}
                    </div>
                    <span className={`font-bold text-sm ${textPrimary}`}>{review.userName}</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Verified Purchase
                    </span>
                  </div>

                  <p className={`text-sm italic font-medium ${textSecondary}`}>"{review.comment}"</p>

                  <div className={`text-xs font-mono font-medium flex items-center gap-2 ${textMuted}`}>
                    <span>Product: {product?.name || review.productId}</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
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
