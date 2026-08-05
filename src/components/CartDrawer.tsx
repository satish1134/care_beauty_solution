import React, { useState } from 'react';
import { X, Trash2, Tag, ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  discountAmount: number;
  onApplyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const effectiveSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(effectiveSubtotal * 0.18 * 100) / 100; // 18% GST
  const shippingFee = effectiveSubtotal >= 499 || items.length === 0 ? 0 : 50;
  const totalAmount = Math.round((effectiveSubtotal + taxAmount + shippingFee) * 100) / 100;

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setIsApplying(true);
    setCouponError(null);
    setCouponSuccess(null);

    const res = await onApplyCoupon(couponInput);
    setIsApplying(false);

    if (res.success) {
      setCouponSuccess(`Coupon ${couponInput.toUpperCase()} applied successfully!`);
      setCouponInput('');
    } else {
      setCouponError(res.message || 'Failed to apply coupon');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-emerald-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideLeft">
        {/* Header */}
        <div className="p-4 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-serif font-bold text-lg">Your Skincare Cart</h2>
            <span className="bg-emerald-800 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-800 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 text-xs font-medium text-emerald-900 flex items-center justify-between">
          {subtotal >= 499 ? (
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <Sparkles className="w-4 h-4 text-amber-500" /> 🎉 You unlocked Free Express Shipping!
            </span>
          ) : (
            <span>Add ₹{499 - subtotal} more for Free Shipping</span>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-medium text-sm">Your shopping bag is empty.</p>
              <button
                onClick={onClose}
                className="bg-emerald-950 text-white text-xs px-4 py-2 rounded-xl font-semibold hover:bg-emerald-900 transition"
              >
                Explore Products
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.variantId}
                className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{item.productName}</h4>
                  <p className="text-[11px] text-slate-500">{item.variantName}</p>
                  <div className="font-bold text-emerald-950 text-xs mt-1">₹{item.price}</div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                  <button
                    onClick={() => onUpdateQuantity(item.variantId, -1)}
                    className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-1.5 font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.variantId, 1)}
                    className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.variantId)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Coupon & Summary Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            {/* Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-100/70 border border-emerald-300 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Coupon: {appliedCoupon} (-₹{discountAmount})</span>
                  </div>
                  <button onClick={onRemoveCoupon} className="text-red-600 text-[11px] font-bold underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code (WELCOME10 / GLOW200)"
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 uppercase focus:outline-none focus:border-emerald-700"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="bg-emerald-950 text-white font-semibold text-xs px-3 py-2 rounded-xl hover:bg-emerald-900 transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-700 mt-1">{couponSuccess}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST (18% Included)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-emerald-950 text-base">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-sm py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
