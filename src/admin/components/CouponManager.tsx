import React, { useState } from 'react';
import { Tag, Plus, CheckCircle2, Trash2, Percent, DollarSign, Clock } from 'lucide-react';
import { Coupon } from '../../types';

interface CouponManagerProps {
  coupons: Coupon[];
  onRefreshData: () => void;
  isDarkMode?: boolean;
}

export const CouponManager: React.FC<CouponManagerProps> = ({ coupons, onRefreshData, isDarkMode = false }) => {
  const [code, setCode] = useState('');
  const [value, setValue] = useState('150');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [minOrderAmount, setMinOrderAmount] = useState('699');
  const [usageLimit, setUsageLimit] = useState('500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discountType: type,
          discountValue: parseFloat(value),
          minOrderAmount: parseFloat(minOrderAmount),
          usageLimit: parseInt(usageLimit, 10),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNotice({ type: 'success', message: `Coupon code "${code.toUpperCase()}" created!` });
        setCode('');
        onRefreshData();
      } else {
        setNotice({ type: 'error', message: data.message || 'Failed to create coupon.' });
      }
    } catch (err) {
      setNotice({ type: 'error', message: 'Error communicating with backend server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}>
        <div>
          <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>Promotions & Coupon Rules Engine</h2>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>Configure promotional codes, percentage discounts, and order thresholds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Coupon Form */}
        <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
          <div className={`flex items-center gap-2 border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <Tag className="w-5 h-5 text-amber-500" />
            <h3 className={`text-base font-bold ${textPrimary}`}>Create New Coupon Code</h3>
          </div>

          {notice && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                notice.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
              }`}
            >
              {notice.message}
            </div>
          )}

          <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
            <div>
              <label className={`block font-bold mb-1 ${textSecondary}`}>Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. GLOW200"
                className={`w-full rounded-xl px-3.5 py-2 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDarkMode
                    ? 'bg-slate-800 border border-slate-700 text-amber-300'
                    : 'bg-slate-50 border border-slate-300 text-amber-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block font-bold mb-1 ${textSecondary}`}>Discount Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className={`w-full rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-100'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="FIXED">Flat Discount (₹)</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label className={`block font-bold mb-1 ${textSecondary}`}>Value</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="150"
                  className={`w-full rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-100'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block font-bold mb-1 ${textSecondary}`}>Min Order Subtotal (₹)</label>
              <input
                type="number"
                required
                value={minOrderAmount}
                onChange={e => setMinOrderAmount(e.target.value)}
                placeholder="699"
                className={`w-full rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDarkMode
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-50 border border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block font-bold mb-1 ${textSecondary}`}>Usage Limit Cap</label>
              <input
                type="number"
                required
                value={usageLimit}
                onChange={e => setUsageLimit(e.target.value)}
                placeholder="500"
                className={`w-full rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isDarkMode
                    ? 'bg-slate-800 border border-slate-700 text-slate-100'
                    : 'bg-slate-50 border border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
            >
              {isSubmitting ? 'Generating...' : 'Publish Coupon Code'}
            </button>
          </form>
        </div>

        {/* Existing Coupons Table */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 ${cardBg}`}>
          <h3 className={`text-base font-bold ${textPrimary}`}>Active Store Coupons</h3>

          <div className="space-y-3">
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className={`p-4 rounded-2xl border flex items-center justify-between font-mono text-xs ${
                  isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold text-amber-700 dark:text-amber-300 text-base tracking-wide">{coupon.code}</div>
                  <div className={`text-xs font-sans font-semibold mt-0.5 ${textMuted}`}>
                    {coupon.discountType === 'FIXED' ? `₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`} • Min order: ₹{coupon.minOrderAmount}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs">
                    {coupon.usedCount} / {coupon.usageLimit} Used
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
