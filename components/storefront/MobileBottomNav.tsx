'use client';

import React from 'react';
import { Home, Grid, ShieldCheck, ShoppingBag, User, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface MobileBottomNavProps {
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenMenu: () => void;
  onScrollToProducts: () => void;
  onScrollToReviews?: () => void;
  activeCategory?: string;
}

export default function MobileBottomNav({
  onOpenCart,
  onOpenProfile,
  onOpenMenu,
  onScrollToProducts,
  activeCategory,
}: MobileBottomNavProps) {
  const { totalItemCount } = useCart();

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#242129]/95 backdrop-blur-lg border-t border-[#46414f] px-4 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] safe-area-inset-bottom"
    >
      <div className="grid grid-cols-4 items-center justify-between max-w-sm mx-auto">
        {/* 1. Home / Ritual */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('top');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#D5CCB8] hover:text-[#F3CA74] transition cursor-pointer group"
        >
          <Sparkles size={19} className="text-[#F3CA74] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium tracking-tight mt-0.5 whitespace-nowrap">Home</span>
        </button>

        {/* 2. Products */}
        <button
          type="button"
          onClick={onScrollToProducts}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#D5CCB8] hover:text-[#F3CA74] transition cursor-pointer group"
        >
          <Grid size={19} className="text-[#DDD7CB] group-hover:text-[#F3CA74] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium tracking-tight mt-0.5 whitespace-nowrap">Products</span>
        </button>

        {/* 3. Bag with Badge */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-[#F3CA74] transition cursor-pointer group"
        >
          <div className="relative">
            <ShoppingBag size={19} className="text-[#F3CA74] group-hover:scale-110 transition-transform" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#F3CA74] text-[#1C1917] text-[9px] font-mono font-black flex items-center justify-center shadow-xs">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold tracking-tight mt-0.5 text-[#F3CA74] whitespace-nowrap">
            Bag
          </span>
        </button>

        {/* 4. Account */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#D5CCB8] hover:text-[#F3CA74] transition cursor-pointer group"
        >
          <User size={19} className="text-[#DDD7CB] group-hover:text-[#F3CA74] group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium tracking-tight mt-0.5 whitespace-nowrap">Account</span>
        </button>
      </div>
    </nav>
  );
}
