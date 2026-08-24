import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Heart,
} from 'lucide-react';

export const CartDrawerMarketplace: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartTotalDiscount,
    cartShippingFee,
    cartFinalTotal,
    setIsCheckoutModalOpen,
    openPlp,
    showToast,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 499;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const success = applyCoupon(couponCodeInput.trim().toUpperCase());
    if (success) {
      setCouponCodeInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" />
            <h2 className="text-base font-bold text-[#1A1A1A]">
              My Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Free Shipping Progress Bar */}
        <div className="bg-[#FAF9F6] border-b border-[#E5E5E5] px-4 py-3">
          {amountNeededForFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs text-[#1A1A1A] font-medium">
                Add <span className="font-bold text-[#E85D5D]">₹{amountNeededForFreeShipping}</span> more for{' '}
                <strong className="text-[#2D5A3D]">FREE Shipping</strong>! 🎉
              </p>
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E85D5D] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A3D]">
              <Check className="w-4 h-4 bg-[#2D5A3D] text-white rounded-full p-0.5" />
              <span>You unlocked FREE Express Delivery! 🚀</span>
            </div>
          )}
        </div>

        {/* 3. Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#E5E5E5]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E5E5E5] flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Your Bag is Currently Empty</h3>
              <p className="text-xs text-[#6B6B6B] max-w-xs">
                Explore our dermatologically verified barrier repair formulas and sunscreens.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  openPlp();
                }}
                className="btn-primary-coral text-xs px-6 py-2.5 font-bold"
              >
                Shop Bestsellers
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-start">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-1 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                    {item.product.brand}
                  </p>
                  <h4 className="text-xs font-medium text-[#1A1A1A] line-clamp-1">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-[#6B6B6B]">Size: {item.variant.name}</p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-[#1A1A1A]">
                        ₹{item.variant.price * item.quantity}
                      </span>
                      {item.variant.mrp > item.variant.price && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          ₹{item.variant.mrp * item.quantity}
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#E5E5E5] rounded-md bg-[#FAF9F6]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-neutral-200 text-neutral-700 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-neutral-200 text-neutral-700 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-neutral-400 hover:text-red-500 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* 4. Footer & Bill Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E5E5E5] bg-[#FAF9F6] space-y-4">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-[#2D5A3D] font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedCoupon.code}' applied (-₹{cartTotalDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. CARE15)"
                    className="flex-1 bg-white border border-[#E5E5E5] text-xs px-3 py-2 rounded-lg uppercase font-semibold focus:outline-none focus:border-[#E85D5D]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Item Subtotal</span>
                <span className="text-[#1A1A1A] font-semibold">₹{cartSubtotal}</span>
              </div>
              {cartTotalDiscount > 0 && (
                <div className="flex justify-between text-[#2D5A3D] font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{cartTotalDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Estimated Shipping</span>
                <span className={cartShippingFee === 0 ? 'text-[#2D5A3D] font-bold' : 'text-[#1A1A1A]'}>
                  {cartShippingFee === 0 ? 'FREE' : `₹${cartShippingFee}`}
                </span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-2 flex justify-between text-sm font-bold text-[#1A1A1A]">
                <span>Total Amount Payable</span>
                <span className="text-base text-[#E85D5D]">₹{cartFinalTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="cart-drawer-checkout-button"
              onClick={handleProceedToCheckout}
              className="btn-primary-coral w-full py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A3D]" />
              <span>100% Safe Payments &amp; 15-Day Guaranteed Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
