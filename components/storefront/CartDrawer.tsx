'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { CORE_PRODUCTS } from '@/lib/products-data';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    appliedPromo,
    applyPromo,
    removePromo,
    total,
    openCheckout,
    addItem
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, error: true });
    }
  };

  // Find products not yet in cart for cross-sell recommendations
  const recommended = CORE_PRODUCTS.filter(
    (p) => !items.some((item) => item.product.id === p.id)
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#FBF9F5] text-[#1C1917] border-l border-[#E8E2D5] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#E8E2D5] bg-[#F5EFE6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#064E3B]" />
                  <h2 className="font-editorial text-xl font-bold text-[#1C1917]">
                    Your Skincare Bag
                  </h2>
                  <span className="text-xs font-mono bg-white px-2 py-0.5 rounded-full border border-[#D5CCB8] text-[#785412] font-semibold">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  aria-label="Close Bag"
                  className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE2D2] transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Free Shipping Meter */}
              <div className="px-5 py-3 bg-[#FAF7F2] border-b border-[#E8E2D5]">
                {freeShippingRemaining > 0 ? (
                  <>
                    <p className="text-xs text-[#57534E] flex items-center justify-between">
                      <span>Add <strong>₹{freeShippingRemaining}</strong> more for Free Express Delivery</span>
                      <span className="font-mono text-[11px] text-[#785412] font-bold">
                        {Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)}%
                      </span>
                    </p>
                    <div className="mt-2 w-full h-1.5 rounded-full bg-[#E8E2D5] overflow-hidden">
                      <div
                        className="h-full bg-[#064E3B] rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, ((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)}%`
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B]">
                    <Check size={14} />
                    <span>Unlocked! Free Express Shipping on your order.</span>
                  </div>
                )}
              </div>

              {/* Scrollable Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-[#F5EFE6] border border-[#D5CCB8] flex items-center justify-center text-[#78716C] mb-4">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-editorial text-lg font-bold text-[#1C1917]">Your bag is currently empty</h3>
                    <p className="text-xs text-[#78716C] mt-1 max-w-xs leading-relaxed">
                      Discover our 3 bio-identical barrier formulations crafted for sensitive and combination skin.
                    </p>
                    <button
                      onClick={() => {
                        addItem(CORE_PRODUCTS[0]);
                        addItem(CORE_PRODUCTS[1]);
                        addItem(CORE_PRODUCTS[2]);
                      }}
                      className="mt-6 px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#064E3B] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm"
                    >
                      Add The Core Trio (Save 15%)
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#E8E2D5] flex gap-3 shadow-sm"
                    >
                      {/* Thumbnail with brand badge */}
                      <div className="w-18 h-20 rounded-xl bg-[#F5EFE6] border border-[#D5CCB8] p-1.5 flex items-center justify-center shrink-0">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-inner border border-[#D5CCB8]">
                          <Image
                            src="/images/hero.png"
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-[#1C1917] leading-tight">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-[#A8A29E] hover:text-rose-600 transition"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <span className="text-[11px] text-[#785412] font-mono block mt-0.5">
                            {item.product.volume}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5EFE6]">
                          {/* Quantity stepper */}
                          <div className="flex items-center rounded-lg border border-[#E8E2D5] bg-[#FAF7F2]">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-[#EDE6D8] text-[#57534E] rounded-l transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2.5 text-xs font-mono font-bold text-[#1C1917]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-[#EDE6D8] text-[#57534E] rounded-r transition"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-sm text-[#1C1917]">
                              ₹{item.product.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Recommended Add-on / Complete Trio Upsell if not all 3 products are in cart */}
                {items.length > 0 && recommended.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#785412] font-bold">
                        Complete The 3-Step Protocol
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Unlock 15% Off
                      </span>
                    </div>

                    <div className="space-y-2">
                      {recommended.map((recProd) => (
                        <div
                          key={recProd.id}
                          className="p-3 rounded-2xl bg-[#F5EFE6] border border-[#E5DEC9] flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-9 h-9 rounded-lg bg-white border border-[#E8E2D5] overflow-hidden shrink-0">
                              <Image
                                src="/images/hero.png"
                                alt={recProd.name}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-[#1C1917] truncate">{recProd.name}</h5>
                              <p className="text-[11px] text-[#785412] font-mono">
                                ₹{recProd.price} • {recProd.volume}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => addItem(recProd)}
                            className="px-3 py-1.5 rounded-full bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] hover:text-white text-[11px] font-bold uppercase tracking-wider transition shrink-0 shadow-2xs"
                          >
                            + Add
                          </button>
                        </div>
                      ))}

                      {recommended.length > 1 && (
                        <button
                          onClick={() => {
                            recommended.forEach((p) => addItem(p));
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-[#064E3B]/10 hover:bg-[#064E3B]/20 border border-[#064E3B]/30 text-[#064E3B] text-[11px] font-mono font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Sparkles size={12} className="text-[#E5B85C]" />
                          <span>Add All Missing Steps (+15% Trio Discount)</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Promo Code Input & Summary Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[#E8E2D5] bg-[#FAF7F2] space-y-3">
                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-3 top-3 text-[#A8A29E]" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Discount code (e.g. BARRIER15)"
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#D5CCB8] bg-white focus:outline-none focus:border-[#1C1917] font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#064E3B] text-white text-xs font-bold uppercase tracking-wider transition"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Promo status */}
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-xs text-[#064E3B] bg-[#ECFDF5] px-3 py-1.5 rounded-lg border border-[#A7F3D0]">
                      <span className="font-mono font-semibold">Code: {appliedPromo} Applied</span>
                      <button
                        onClick={removePromo}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoMessage && !appliedPromo && (
                    <p className={`text-[11px] ${promoMessage.error ? 'text-rose-600' : 'text-[#064E3B]'}`}>
                      {promoMessage.text}
                    </p>
                  )}

                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E8E2D5] text-xs">
                    <div className="flex justify-between text-[#57534E]">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{subtotal}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-[#064E3B] font-semibold">
                        <span>Discount</span>
                        <span className="font-mono">-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#57534E]">
                      <span>Estimated Express Shipping</span>
                      <span className="font-mono">
                        {shippingFee === 0 ? (
                          <span className="text-[#064E3B] font-bold uppercase">Free</span>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#1C1917] text-base font-bold pt-2 border-t border-[#E8E2D5]">
                      <span className="font-editorial">Estimated Total</span>
                      <span className="font-mono">₹{total}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <button
                    onClick={openCheckout}
                    className="w-full py-4 rounded-full bg-[#1C1917] hover:bg-[#064E3B] text-white font-bold text-xs uppercase tracking-[0.18em] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={15} />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-[#78716C] font-mono">
                    <ShieldCheck size={12} className="text-[#064E3B]" />
                    <span>256-Bit Encrypted • 30-Day Barrier Guarantee</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
