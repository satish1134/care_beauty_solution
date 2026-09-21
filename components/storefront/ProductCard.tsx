/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Sparkles, ShoppingBag, ExternalLink, Check, Eye } from 'lucide-react';
import { Product } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';
import ProductDetailModal from './ProductDetailModal';
import MarketplaceButtons from './MarketplaceButtons';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: index * 0.12 }}
        className="group relative flex flex-col rounded-3xl bg-white border border-[#E8E2D5] p-6 sm:p-7 hover:border-[#D4AF37]/70 transition-all duration-300 shadow-[0_4px_24px_rgba(40,30,20,0.04)] hover:shadow-[0_16px_36px_rgba(40,30,20,0.09)]"
      >
        {/* Top Header Strip - Clean and free of unnecessary badge jargon */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#F5EFE6] border border-[#E5DEC9] text-[#1C1917]">
            <Sparkles size={11} className="text-[#064E3B]" />
            Official Formulation
          </span>
          <span className="text-xs text-[#1C1917] font-mono font-bold">{product.volume}</span>
        </div>

        {/* Product Visual Container */}
        <div
          onClick={() => setShowQuickView(true)}
          className="relative w-full h-64 sm:h-72 rounded-2xl bg-[#F7F4EE] border border-[#EFE9DD] flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden group-hover:bg-[#F3ECE0] transition-all duration-300"
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute inset-0 bg-radial from-white/80 via-transparent to-transparent pointer-events-none" />

          {/* Minimalist Glass Formulation Sculpture OR Uploaded Product Image */}
          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            transition={{ type: 'spring', damping: 18 }}
            className="relative flex flex-col items-center justify-center text-center w-full h-full"
          >
            {product.primaryImage &&
            (product.primaryImage.startsWith('http') ||
              product.primaryImage.startsWith('/uploads') ||
              product.primaryImage.startsWith('data:') ||
              product.primaryImage.includes('.')) ? (
              <div className="relative w-full h-44 sm:h-48 flex items-center justify-center p-2">
                <img
                  src={product.primaryImage}
                  alt={product.name}
                  className="max-h-44 sm:max-h-48 max-w-full object-contain drop-shadow-md transition-transform"
                />
              </div>
            ) : (
              /* Minimalist Bottle Shape Graphic */
              <div className="relative w-28 h-44 sm:w-32 sm:h-48 rounded-2xl border border-[#D5CCB8] bg-white/95 backdrop-blur-md flex flex-col items-center justify-between p-3 shadow-md">
                {/* Dropper / Pump Cap */}
                <div className="w-9 h-4 rounded-t-sm border border-[#D5CCB8] bg-[#EDE4D2]" />
                {/* Official Brand Emblem & Label */}
                <div className="w-full flex flex-col items-center py-2 px-1 border-y border-[#EAE3D2]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mb-1 shadow-sm border border-[#D5CCB8]">
                    <Image
                      src="/images/hero.png"
                      alt="CARE-A"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <span className="block text-[10px] font-serif font-bold text-[#1C1917] leading-tight">
                    {product.category.toUpperCase()}
                  </span>
                  <span className="block text-[7px] text-[#78716C] mt-0.5">
                    {product.heroActives[0]?.name}
                  </span>
                </div>
                {/* Base */}
                <div className="w-14 h-1.5 rounded-full bg-[#E5DCB8]" />
              </div>
            )}
          </motion.div>

          {/* Quick View Prompt */}
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#1C1917] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[#D5CCB8] opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-xs">
            Formulation & Details
          </div>
        </div>

        {/* Product Identity */}
        <div className="mt-5 flex-1 flex flex-col">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-[#B45309]">
              <Star size={13} fill="currentColor" />
            </div>
            <span className="text-xs font-bold text-[#1C1917]">{product.rating}</span>
            <span className="text-xs text-[#57534E] font-medium">({product.reviewCount})</span>
          </div>

          {/* Product Name - Guaranteed 1 Line, Not Wrapped */}
          <h3
            className="text-base sm:text-lg font-editorial font-bold text-[#1C1917] group-hover:text-[#064E3B] transition-colors leading-snug whitespace-nowrap truncate overflow-hidden block"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#064E3B] mt-1 font-bold tracking-wide">{product.subtitle}</p>

          <p className="text-xs text-[#292524] mt-2.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Key Actives Chips */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {product.heroActives.map((active) => (
              <span
                key={active.name}
                className="text-[11px] font-mono bg-[#F7F4EE] border border-[#E0D7C6] text-[#1C1917] font-medium px-2.5 py-1 rounded-lg"
              >
                <strong className="text-[#044E32] font-bold">{active.percentage}</strong> {active.name}
              </span>
            ))}
          </div>

          {/* Price Section */}
          <div className="mt-5 pt-4 border-t border-[#F0EBE1] flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#1C1917]">₹{product.price}</span>
              {product.compareAtPrice && (
                <span className="text-sm font-mono text-[#78716C] line-through font-medium">₹{product.compareAtPrice}</span>
              )}
            </div>
            <span className="text-[11px] text-[#044E32] font-bold font-mono">In Stock • Express Dispatch</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-2.5">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                  addedNotice
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-[#1C1917] hover:bg-[#03290A] text-white hover:shadow-md'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check size={16} />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowQuickView(true)}
                className="px-4 py-3.5 rounded-xl border border-[#D5CCB8] hover:border-[#03290A] bg-white hover:bg-[#FAF8F5] text-[#03290A] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title="View Full Formulation & Clinical Trials"
              >
                <Eye size={14} />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>

            {/* Marketplace "Buy On" Links */}
            <div className="pt-2 border-t border-[#F0EBE1]">
              <span className="block text-center text-[10px] uppercase font-mono font-bold tracking-widest text-[#57534E] mb-2">
                Also Available On Official Stores
              </span>
              <MarketplaceButtons
                amazonUrl={product.marketplaceUrls.amazon}
                nykaaUrl={product.marketplaceUrls.nykaa}
                flipkartUrl={product.marketplaceUrls.flipkart}
                size="compact"
              />
            </div>
          </div>
        </div>
      </motion.article>

      {/* Deep Clinical Product Detail Modal (Phase 4.2 PDP) */}
      <ProductDetailModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
