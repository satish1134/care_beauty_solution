import React, { useState } from 'react';
import { Tag, Plus, CheckCircle2, Trash2, Percent, DollarSign, Clock } from 'lucide-react';
import { Coupon } from '../../types';

interface CouponManagerProps {
  coupons: Coupon[];
  onRefreshData: () => void;
}

export const CouponManager: React.FC<CouponManagerProps> = ({ coupons, onRefreshData }) => {
  const [code, setCode] = useState('');
  const [value, setValue] = useState('150');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [minOrderAmount, setMinOrderAmount] = useState('699');
  const [usageLimit, setUsageLimit] = useState('500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Promotions & Coupon Rules Engine</h2>
          <p className="text-slate-400 text-xs mt-1">Configure promotional codes, percentage discounts, and order thresholds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Coupon Form */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Tag className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Create New Coupon Code</h3>
          </div>

          {notice && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                notice.type === 'success'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {notice.message}
            </div>
          )}

          <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. GLOW200"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="FIXED">Flat Discount (₹)</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Value</label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="150"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Min Order Subtotal (₹)</label>
              <input
                type="number"
                required
                value={minOrderAmount}
                onChange={e => setMinOrderAmount(e.target.value)}
                placeholder="699"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Usage Limit Cap</label>
              <input
                type="number"
                required
                value={usageLimit}
                onChange={e => setUsageLimit(e.target.value)}
                placeholder="500"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
            >
              {isSubmitting ? 'Generating...' : 'Publish Coupon Code'}
            </button>
          </form>
        </div>

        {/* Existing Coupons Table */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Active Store Coupons</h3>

          <div className="space-y-3">
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between font-mono text-xs"
              >
                <div>
                  <div className="font-bold text-amber-300 text-sm tracking-wide">{coupon.code}</div>
                  <div className="text-slate-400 text-[11px] font-sans mt-0.5">
                    {coupon.discountType === 'FIXED' ? `₹${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`} • Min order: ₹{coupon.minOrderAmount}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 text-[11px]">
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
