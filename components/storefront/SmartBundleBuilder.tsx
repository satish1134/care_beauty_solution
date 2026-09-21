'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Check, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { CORE_PRODUCTS, Product } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';

interface SmartBundleBuilderProps {
  currentProduct?: Product;
  onBundleAdded?: () => void;
  className?: string;
}

export default function SmartBundleBuilder({
  currentProduct,
  onBundleAdded,
  className = '',
}: SmartBundleBuilderProps) {
  const { addItem, openCart } = useCart();

  // Pre-select all 3 products by default for the maximum trio discount,
  // or at minimum the current product + complementaries
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return CORE_PRODUCTS.map((p) => p.id);
  });

  const [added, setAdded] = useState(false);

  const toggleProduct = (id: string) => {
    // If it's the current product on PDP, keep it selected or allow toggling if >= 1
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedProducts = CORE_PRODUCTS.filter((p) => selectedIds.includes(p.id));

  // Pricing & Tier Discount Calculation
  // 1 item = 0% discount
  // 2 items (Duo) = 10% discount
  // 3 items (Sacred Trio) = 15% discount
  const originalTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  let discountPercent = 0;
  if (selectedProducts.length === 2) discountPercent = 10;
  if (selectedProducts.length >= 3) discountPercent = 15;

  const bundleDiscount = Math.round((originalTotal * discountPercent) / 100);
  const bundlePrice = originalTotal - bundleDiscount;

  const handleAddBundle = () => {
    selectedProducts.forEach((product) => {
      addItem(product, 1);
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);

    if (onBundleAdded) {
      onBundleAdded();
    } else {
      openCart();
    }
  };

  return (
    <div
      className={`rounded-3xl bg-[#FAF8F5] border border-[#E8E2D5] p-5 sm:p-6 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#E5B85C]/20 border border-[#E5B85C]/50 flex items-center justify-center text-[#785412]">
            <Sparkles size={13} className="text-[#E5B85C]" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-editorial font-bold text-[#1C1917]">
              Frequently Bought Together
            </h4>
            <p className="text-[11px] text-[#78716C]">
              Clinically formulated to work synchronously without ingredient collision
            </p>
          </div>
        </div>

        {discountPercent > 0 && (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
            BUNDLE SAVINGS: {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Product Cards Row with '+' Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {CORE_PRODUCTS.map((prod, idx) => {
          const isSelected = selectedIds.includes(prod.id);
          const isCurrent = currentProduct?.id === prod.id;

          return (
            <div
              key={prod.id}
              onClick={() => toggleProduct(prod.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-white border-[#064E3B] shadow-sm ring-1 ring-[#064E3B]/20'
                  : 'bg-white/60 border-[#E8E2D5] opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                    isSelected
                      ? 'bg-[#064E3B] border-[#064E3B] text-white'
                      : 'bg-white border-[#D5CCB8]'
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>

                {/* Thumbnail */}
                <div className="relative w-12 h-12 rounded-xl bg-[#F5EFE6] border border-[#E8E2D5] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src="/images/hero.png"
                    alt={prod.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#785412]">
                      Step 0{idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FAF5E6] text-[#785412] border border-[#E5DEC9]">
                        This item
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-[#1C1917] truncate leading-tight mt-0.5">
                    {prod.name}
                  </h5>
                  <span className="text-xs font-mono font-bold text-[#1C1917] block mt-1">
                    ₹{prod.price}
                  </span>
                </div>
              </div>

              {/* Micro Actives Tag */}
              <div className="mt-2.5 pt-2 border-t border-[#F0EBE0] text-[10px] text-[#78716C] truncate font-mono">
                {prod.heroActives[0]?.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tiered Savings Incentive Bar */}
      <div className="bg-[#F5EFE6] border border-[#E5DEC9] rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#064E3B]" />
          <span className="text-[#1C1917] font-medium">
            {selectedProducts.length === 3 ? (
              <span className="text-[#064E3B] font-bold">
                ✓ Full 3-Step Protocol activated (15% Bundle Discount applied)
              </span>
            ) : selectedProducts.length === 2 ? (
              <span>
                Add 1 more step to unlock <strong className="text-[#785412]">15% Trio Discount</strong>
              </span>
            ) : (
              <span>
                Select at least 2 steps to unlock <strong className="text-[#785412]">Bundle Savings</strong>
              </span>
            )}
          </span>
        </div>

        <span className="font-mono text-[11px] text-[#78716C] hidden sm:inline">
          Free Insured Delivery
        </span>
      </div>

      {/* Pricing Summary & Action CTA */}
      <div className="mt-4 pt-4 border-t border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[#78716C] uppercase font-mono">Total Bundle Price:</span>
            <span className="text-2xl font-bold font-mono text-[#1C1917]">
              ₹{bundlePrice}
            </span>
            {bundleDiscount > 0 && (
              <span className="text-sm font-mono text-[#A8A29E] line-through">
                ₹{originalTotal}
              </span>
            )}
          </div>
          {bundleDiscount > 0 && (
            <p className="text-[11px] text-emerald-800 font-mono font-medium">
              You save ₹{bundleDiscount} with this bundle ({selectedProducts.length} items)
            </p>
          )}
        </div>

        <button
          onClick={handleAddBundle}
          disabled={selectedProducts.length === 0}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 transition shadow-md ${
            added
              ? 'bg-[#064E3B] text-white'
              : 'bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] hover:text-white'
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              <span>Bundle Added to Bag</span>
            </>
          ) : (
            <>
              <Plus size={15} />
              <span>Add Selected ({selectedProducts.length}) to Bag</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
