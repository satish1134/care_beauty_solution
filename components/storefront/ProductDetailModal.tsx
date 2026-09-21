/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  Star,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Check,
  Clock,
  Droplets,
  Layers,
  ChevronRight,
  Sun,
  Moon,
  ThumbsUp,
  Share2,
  AlertCircle,
  Truck,
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move
} from 'lucide-react';
import { Product, ProductGalleryItem, CORE_PRODUCTS } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';
import SmartBundleBuilder from './SmartBundleBuilder';
import MarketplaceButtons from './MarketplaceButtons';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { addItem, openCart, totalItemCount } = useCart();
  const [activeProduct, setActiveProduct] = useState<Product | null>(product);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  // Sync active product when prop changes
  React.useEffect(() => {
    if (product) {
      setActiveProduct(product);
      setSelectedGalleryIdx(0);
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [product]);

  const currentProduct = activeProduct || product;
  const [activeTab, setActiveTab] = useState<'clinicals' | 'inci' | 'protocol' | 'reviews'>('clinicals');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Interactive Zoom & Pan State
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const resetZoom = () => {
    setZoomScale(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomScale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panPosition.x,
        y: e.touches[0].clientY - panPosition.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomScale > 1 && e.touches.length === 1) {
      setPanPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleDoubleTapZoom = () => {
    if (zoomScale > 1) {
      resetZoom();
    } else {
      setZoomScale(2);
    }
  };

  if (!isOpen || !product) return null;

  const fallbackGallery: ProductGalleryItem[] = [
    { id: '1', label: 'Primary Vessel', type: 'bottle', caption: 'Clinical formulation bottle' },
    { id: '2', label: 'Texture', type: 'texture', caption: 'Microscopic texture swatch' },
    { id: '3', label: 'Application', type: 'application', caption: 'Application on skin' },
    { id: '4', label: 'Routine', type: 'routine', caption: 'Step in daily regimen' }
  ];

  const currentGallery: ProductGalleryItem[] =
    product.images && product.images.length > 0
      ? product.images
      : product.gallery && product.gallery.length > 0
      ? product.gallery
      : fallbackGallery;

  const activeImage = currentGallery[selectedGalleryIdx] || currentGallery[0];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  const handleInstantBuy = () => {
    addItem(product, quantity);
    onClose();
    openCart();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleHelpfulVote = (reviewId: string, initialCount: number) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? initialCount) + 1
    }));
  };

  const handleSwitchCategory = (catId: string) => {
    const next = CORE_PRODUCTS.find((p) => p.category === catId);
    if (next) {
      setActiveProduct(next);
      setSelectedGalleryIdx(0);
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const NAVIGATION_CATEGORIES = [
    { id: 'cleanser', label: 'Refreshing Cleanser', icon: Droplets },
    { id: 'moisturizer', label: 'Hydrating Moisturizer', icon: ShieldCheck },
    { id: 'sunscreen', label: 'Ray Barrier Sunscreen', icon: Sun },
  ];

  if (!isOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        className="w-full max-w-5xl bg-white text-[#1C1917] rounded-3xl border border-[#E8E2D5] shadow-2xl overflow-hidden flex flex-col my-auto relative max-h-[92vh]"
      >
        {/* UNIFIED GLOBAL HEADER - EXACT UNIFORMITY WITH STOREFRONT */}
        <div className="sticky top-0 z-40 bg-[#4f4b55] text-white shadow-md border-b border-[#3c3942] shrink-0">
          {/* Top Notification Strip */}
          <div className="bg-[#3e3a44] text-[#F3CA74] py-1.5 px-4 text-center text-[11px] font-mono font-medium tracking-wide flex items-center justify-between border-b border-[#35313a]">
            <div className="flex items-center gap-2 mx-auto">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F3CA74] animate-pulse" />
              <span>Complimentary Express Dispatch on The 3-Step Sacred Ritual • Zero White Cast</span>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden p-1 text-[#F3CA74] hover:text-white cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Primary Navbar */}
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-8 sm:h-9 w-36 sm:w-44">
                <Image
                  src="/images/header.png"
                  alt="CARE-A"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 border-l border-[#635e6b]/60 pl-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#27232d] text-[#F3CA74] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#F3CA74]/30">
                  Clinical Dossier
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  {currentProduct.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Shopping Bag Button with Live Item Count */}
              <button
                onClick={openCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2c2833] hover:bg-[#221e28] border border-[#777180] text-white transition cursor-pointer"
                title="View Shopping Bag"
              >
                <ShoppingBag size={14} className="text-[#F3CA74]" />
                <span className="text-xs font-bold text-[#F3CA74] hidden sm:inline">Bag</span>
                {totalItemCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#F3CA74] text-[#1C1917] text-[10px] font-mono flex items-center justify-center font-black">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-full bg-[#2c2833] hover:bg-[#221e28] border border-[#777180] text-white hover:text-[#F3CA74] transition cursor-pointer"
                title="Share Formulation"
              >
                {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#2c2833] hover:bg-[#221e28] border border-[#777180] hover:border-[#F3CA74] text-white hover:text-[#F3CA74] transition cursor-pointer"
                aria-label="Close"
                title="Close Dossier"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Prominent Category Navigation Bar - Exact Match with app/page.tsx */}
          <div className="bg-[#3e3a44] border-t border-[#3c3942] py-2 px-3 sm:px-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 min-w-max">
              {NAVIGATION_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = currentProduct.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSwitchCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#27232d] text-[#F3CA74] border-b-2 border-[#F3CA74] shadow-xs scale-102'
                        : 'text-white hover:text-[#F3CA74] hover:bg-[#322e38]'
                    }`}
                  >
                    <Icon size={13} className={isActive ? 'text-[#F3CA74]' : 'text-stone-300'} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8 bg-[#FAF8F5]">
          {/* Top Section: Split Gallery & Commercial Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 1. LEFT COLUMN: INTERACTIVE GALLERY & TEXTURE VIEWER (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Visual Display */}
              <div 
                className="relative w-full h-80 sm:h-96 rounded-3xl bg-[#F4EFE6] border border-[#E8E2D5] flex flex-col items-center justify-center p-6 overflow-hidden shadow-inner group select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="absolute inset-0 bg-radial from-white/90 via-transparent to-transparent pointer-events-none" />

                {/* Perspective Tag Badge */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/90 backdrop-blur-sm border border-[#E5DEC9] text-[#785412] font-semibold flex items-center gap-1.5 shadow-sm">
                    <Sparkles size={11} className="text-[#E5B85C]" />
                    <span>{activeImage.label}</span>
                  </span>
                </div>

                {/* Interactive Zoom Controls Toolbar */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full border border-[#E5DEC9] shadow-sm">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    disabled={zoomScale <= 1}
                    className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5EFE6] disabled:opacity-30 disabled:pointer-events-none transition"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-[#1C1917] px-1 select-none min-w-[32px] text-center">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    disabled={zoomScale >= 3.5}
                    className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5EFE6] disabled:opacity-30 disabled:pointer-events-none transition"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>
                  {zoomScale > 1 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                      className="p-1 ml-0.5 rounded-full text-[#785412] hover:bg-[#F5EFE6] transition"
                      title="Reset View"
                      aria-label="Reset View"
                    >
                      <RotateCcw size={12} />
                    </button>
                  )}
                  <div className="w-[1px] h-3 bg-[#E5DEC9] mx-0.5" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                    className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5EFE6] transition"
                    title="Inspect Fullscreen"
                    aria-label="Inspect Fullscreen"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>

                {/* Drag Hint when Zoomed */}
                {zoomScale > 1 && (
                  <div className="absolute bottom-12 right-4 z-10 bg-black/60 backdrop-blur-sm text-white text-[9px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none">
                    <Move size={10} className="animate-pulse text-[#E5B85C]" />
                    <span>Drag to pan & inspect</span>
                  </div>
                )}

                {/* Main Visual Presentation based on perspective with transform */}
                <div 
                  className="relative z-0 flex flex-col items-center justify-center text-center w-full min-h-[220px] transition-transform duration-75 ease-out"
                  style={{
                    transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                    cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                  }}
                  onDoubleClick={toggleDoubleTapZoom}
                >
                  {activeImage.url ? (
                    <motion.div
                      key={`img-${activeImage.id || selectedGalleryIdx}`}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center w-full h-full max-h-72 p-2"
                    >
                      <img
                        src={activeImage.url}
                        alt={activeImage.alt || activeImage.caption || product.name}
                        className="max-h-64 max-w-full object-contain drop-shadow-md rounded-xl"
                        style={
                          activeImage.focalPoint
                            ? {
                                objectPosition: `${activeImage.focalPoint.x}% ${activeImage.focalPoint.y}%`,
                              }
                            : undefined
                        }
                      />
                    </motion.div>
                  ) : activeImage.type === 'bottle' ? (
                    <motion.div
                      key="bottle-view"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative w-32 h-52 sm:w-36 sm:h-56 rounded-3xl border-2 border-[#D5CCB8] bg-white/95 backdrop-blur-md flex flex-col items-center justify-between p-4 shadow-xl">
                        <div className="w-10 h-5 rounded-t-sm border border-[#D5CCB8] bg-[#EDE4D2]" />
                        <div className="w-full flex flex-col items-center py-2 px-1 border-y border-[#EAE3D2]">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden mb-1.5 shadow-sm border border-[#D5CCB8]">
                            <Image
                              src="/images/hero.png"
                              alt="CARE-A"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="block text-[11px] font-serif font-bold text-[#1C1917]">
                            CARE-A
                          </span>
                          <span className="block text-[8px] uppercase tracking-wider text-[#785412] font-mono font-bold mt-0.5">
                            {product.category}
                          </span>
                          <span className="block text-[8px] text-[#78716C] mt-0.5">
                            {product.volume}
                          </span>
                        </div>
                        <div className="w-16 h-2 rounded-full bg-[#E5DCB8]" />
                      </div>
                    </motion.div>
                  ) : activeImage.type === 'texture' ? (
                    <motion.div
                      key="texture-view"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-[#E8E2D5] shadow-lg max-w-xs"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FAF5EC] via-[#E8DEC8] to-[#CFC1A2] border-2 border-[#D4AF37] shadow-inner mb-3 flex items-center justify-center">
                        <Droplets size={28} className="text-[#03290A]/70" />
                      </div>
                      <span className="font-bold text-xs text-[#1C1917] mb-1">Microscopic Texture</span>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                        {product.texture}
                      </p>
                    </motion.div>
                  ) : activeImage.type === 'application' ? (
                    <motion.div
                      key="app-view"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-[#E8E2D5] shadow-lg max-w-xs"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/40 shadow-inner mb-3 flex items-center justify-center">
                        <Check size={32} className="text-emerald-700" />
                      </div>
                      <span className="font-bold text-xs text-[#1C1917] mb-1">Skin Finish &amp; Absorption</span>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                        {product.finish}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="routine-view"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center p-6 bg-white/80 rounded-2xl border border-[#E8E2D5] shadow-lg max-w-xs"
                    >
                      <div className="w-20 h-20 rounded-full bg-[#03290A] border-2 border-[#E5B85C] shadow-inner mb-3 flex items-center justify-center text-[#E5B85C]">
                        <Sparkles size={28} className="text-[#E5B85C]" />
                      </div>
                      <span className="font-bold text-xs text-[#1C1917] mb-1">
                        Regimen Ritual
                      </span>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                        {currentProduct.protocol?.timeOfDay || 'AM & PM'} • {currentProduct.protocol?.frequency || 'Daily'}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Caption Strip */}
                <div className="absolute bottom-3 inset-x-4 text-center">
                  <span className="text-[11px] font-medium text-[#78716C] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E8E2D5] inline-block max-w-full truncate shadow-xs">
                    {activeImage.caption || activeImage.label || currentProduct.name}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row - Supports 10+ images with horizontal scrolling */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {currentGallery.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => {
                      setSelectedGalleryIdx(idx);
                      resetZoom();
                    }}
                    className={`py-1.5 px-2.5 rounded-xl text-center border shrink-0 transition flex items-center gap-2 ${
                      selectedGalleryIdx === idx
                        ? 'border-[#03290A] bg-white ring-2 ring-[#03290A]/20 shadow-sm'
                        : 'border-[#E8E2D5] bg-[#F7F4EE] hover:bg-white text-[#78716C]'
                    }`}
                  >
                    {item.url ? (
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-[#E8E2D5] shrink-0 flex items-center justify-center">
                        <img
                          src={item.url}
                          alt={item.label || ''}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : null}
                    <div className="text-left">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#1C1917] block truncate max-w-[80px]">
                        {item.label || `Image ${idx + 1}`}
                      </span>
                      <span className="text-[8px] text-[#78716C] uppercase font-mono">
                        {item.type || 'view'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Guarantees Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#03290A]">
                  <ShieldCheck size={16} className="text-[#064E3B] shrink-0" />
                  <span className="font-semibold text-[#1C1917]">100% Bio-Identical Actives (EWG 1-2)</span>
                </div>
                <div className="flex items-center gap-2 text-[#03290A]">
                  <Truck size={16} className="text-[#064E3B] shrink-0" />
                  <span className="font-semibold text-[#1C1917]">Complimentary Express Dispatch</span>
                </div>
              </div>
            </div>

            {/* 2. RIGHT COLUMN: PRODUCT IDENTITY & COMMERCIAL ACTIONS (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                {/* Clean Category & Volume Strip (No numbers or badge jargon) */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-white border border-[#D5CCB8] text-[#1C1917] shadow-2xs">
                    <Sparkles size={11} className="text-[#064E3B]" />
                    Official Formulation
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono text-[#1C1917] bg-[#FAF8F5] border border-[#D5CCB8] font-bold uppercase tracking-wider">
                    {currentProduct.volume}
                  </span>
                </div>

                {/* Product Name - Guaranteed 1 Line, Not Wrapped */}
                <h1
                  className="text-xl sm:text-2xl md:text-3xl font-editorial font-bold text-[#1C1917] leading-tight whitespace-nowrap truncate block"
                  title={currentProduct.name}
                >
                  {currentProduct.name}
                </h1>
                <p className="text-sm text-[#064E3B] mt-1 font-bold">{currentProduct.subtitle}</p>

                {/* Rating & Social Proof */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-white border border-[#D5CCB8] px-2.5 py-0.5 rounded-full text-xs font-bold text-[#B45309] shadow-2xs">
                    <Star size={13} fill="currentColor" />
                    <span>{currentProduct.rating}</span>
                  </div>
                  <span className="text-xs text-[#1C1917] font-mono font-semibold">
                    Based on {currentProduct.reviewCount} verified clinical evaluations
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#D5CCB8] flex items-baseline justify-between shadow-2xs">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-bold font-mono text-[#1C1917]">₹{currentProduct.price}</span>
                    {currentProduct.compareAtPrice && (
                      <span className="text-base font-mono text-[#57534E] line-through font-bold">
                        ₹{currentProduct.compareAtPrice}
                      </span>
                    )}
                    {currentProduct.compareAtPrice && (
                      <span className="px-2 py-0.5 rounded-full bg-[#064E3B] text-white text-[10px] font-bold font-mono shadow-2xs">
                        SAVE {Math.round(((currentProduct.compareAtPrice - currentProduct.price) / currentProduct.compareAtPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#1C1917] font-semibold mt-1 block">
                    Inclusive of all taxes • Volume: <strong className="text-[#064E3B] font-black">{currentProduct.volume}</strong>
                  </span>
                </div>

                <span className="text-[11px] text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full font-black border border-emerald-400 font-mono">
                  ● In Stock
                </span>
              </div>

              {/* Short Editorial Description */}
              <p className="text-xs sm:text-sm text-[#1C1917] font-normal leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Best For Tags */}
              {currentProduct.bestFor && currentProduct.bestFor.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono text-[#1C1917] uppercase font-black mr-1">
                    Ideal For:
                  </span>
                  {currentProduct.bestFor.map((skin) => (
                    <span
                      key={skin}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#1C1917] border border-[#D5CCB8] shadow-2xs"
                    >
                      {skin}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Benefits List */}
              {currentProduct.keyBenefits && currentProduct.keyBenefits.length > 0 && (
                <div className="space-y-1.5 pt-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#1C1917] font-black block">
                    Key Clinical Benefits:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {currentProduct.keyBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-[#1C1917] font-medium">
                        <Check size={12} className="text-[#064E3B] shrink-0 font-bold" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Hero Actives Showcase */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1C1917] font-black block">
                  Core Bio-Actives Concentration:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.heroActives.map((active) => (
                    <span
                      key={active.name}
                      className="text-xs font-mono bg-white border-2 border-[#D5CCB8] text-[#1C1917] px-3 py-1.5 rounded-xl shadow-2xs font-semibold"
                    >
                      <strong className="text-[#064E3B] font-black">{active.percentage}</strong> {active.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Dual Action Buttons */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#D5CCB8] bg-white p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-[#F5EFE6] text-sm font-bold text-[#1C1917] flex items-center justify-center transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm text-[#1C1917]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg hover:bg-[#F5EFE6] text-sm font-bold text-[#1C1917] flex items-center justify-center transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                      addedNotice
                        ? 'bg-[#064E3B] text-white'
                        : 'bg-[#03290A] hover:bg-[#074614] text-[#F3CA74]'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check size={16} />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} />
                        <span>Add to Bag • ₹{currentProduct.price * quantity}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant 1-Click Buy Now */}
                <button
                  onClick={handleInstantBuy}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#F7F4EE] border-2 border-[#03290A] text-[#03290A] font-bold text-xs uppercase tracking-[0.15em] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Instant 1-Click Checkout</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Marketplace Links */}
              <div className="pt-2 border-t border-[#E8E2D5]">
                <span className="block text-[11px] uppercase font-mono font-bold tracking-widest text-[#1C1917] mb-2.5">
                  Prefer To Buy On Official Storefronts?
                </span>
                <MarketplaceButtons
                  amazonUrl={currentProduct.marketplaceUrls?.amazon}
                  nykaaUrl={currentProduct.marketplaceUrls?.nykaa}
                  flipkartUrl={currentProduct.marketplaceUrls?.flipkart}
                  size="standard"
                />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SMART BUNDLE BUILDER ("Frequently Bought Together")
          ══════════════════════════════════════════════════════════════════ */}
          <SmartBundleBuilder currentProduct={currentProduct} />

          {/* ══════════════════════════════════════════════════════════════════
              BOTTOM SECTION: DEEP CLINICAL TABS & EVIDENCE DOSSIER
          ══════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Tab Selectors */}
            <div className="flex border-b border-[#E8E2D5] overflow-x-auto gap-2 sm:gap-4 no-scrollbar">
              <button
                onClick={() => setActiveTab('clinicals')}
                className={`pb-3 px-2 text-xs font-bold uppercase tracking-wider transition relative whitespace-nowrap cursor-pointer ${
                  activeTab === 'clinicals'
                    ? 'text-[#03290A]'
                    : 'text-[#44403C] hover:text-[#03290A]'
                }`}
              >
                <span>Clinical Trials &amp; Efficacy</span>
                {activeTab === 'clinicals' && (
                  <motion.div
                    layoutId="pdp-active-tab"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#03290A]"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('inci')}
                className={`pb-3 px-2 text-xs font-bold uppercase tracking-wider transition relative whitespace-nowrap cursor-pointer ${
                  activeTab === 'inci'
                    ? 'text-[#03290A]'
                    : 'text-[#44403C] hover:text-[#03290A]'
                }`}
              >
                <span>Transparent INCI Matrix</span>
                {activeTab === 'inci' && (
                  <motion.div
                    layoutId="pdp-active-tab"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#03290A]"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('protocol')}
                className={`pb-3 px-2 text-xs font-bold uppercase tracking-wider transition relative whitespace-nowrap cursor-pointer ${
                  activeTab === 'protocol'
                    ? 'text-[#03290A]'
                    : 'text-[#44403C] hover:text-[#03290A]'
                }`}
              >
                <span>AM / PM Ritual Protocol</span>
                {activeTab === 'protocol' && (
                  <motion.div
                    layoutId="pdp-active-tab"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#03290A]"
                  />
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 px-2 text-xs font-bold uppercase tracking-wider transition relative whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'text-[#03290A]'
                    : 'text-[#44403C] hover:text-[#03290A]'
                }`}
              >
                <span>Verified Reviews ({currentProduct.reviews?.length || 2})</span>
                {activeTab === 'reviews' && (
                  <motion.div
                    layoutId="pdp-active-tab"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#03290A]"
                  />
                )}
              </button>
            </div>

            {/* TAB 1: CLINICAL RESULTS & EVIDENCE */}
            {activeTab === 'clinicals' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-editorial text-xl font-bold text-[#1C1917]">
                    In-Vivo Clinical Verification
                  </h4>
                  <p className="text-xs text-[#57534E] mt-0.5 font-medium">
                    Tested across 45 participants in randomized 14-day barrier evaluation trials.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentProduct.clinicalResults.map((res, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-white border border-[#D5CCB8] flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <span className="text-3xl font-editorial font-bold text-[#064E3B] block mb-2">
                          {res.metric}
                        </span>
                        <p className="text-xs text-[#1C1917] leading-relaxed font-medium">{res.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#EFE9DD] flex items-center gap-1.5 text-[11px] font-mono text-[#064E3B] font-bold">
                        <Check size={13} className="text-emerald-700" />
                        <span>Independently Verified In-Vivo</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulation Safety Table */}
                <div className="p-4 rounded-2xl bg-[#03290A] text-[#EDE6D8] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase text-[#F3CA74] font-bold block">
                      Skin Safety Certification
                    </span>
                    <p className="text-xs text-[#EDE6D8] font-medium">
                      Non-Comedogenic • 100% Fragrance-Free • Essential Oil Free • Hypoallergenic
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#053d10] border border-[#F3CA74]/40 text-[#F3CA74] text-xs font-mono font-bold">
                      pH 5.5 Balanced
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#053d10] border border-[#F3CA74]/40 text-[#F3CA74] text-xs font-mono font-bold">
                      EWG Green
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DETAILED INCI MATRIX */}
            {activeTab === 'inci' && (
              <div className="space-y-5 text-xs">
                <div>
                  <h4 className="font-editorial text-xl font-bold text-[#1C1917]">
                    Ingredient Transparency Matrix
                  </h4>
                  <p className="text-xs text-[#57534E] mt-0.5 font-medium">
                    Every active is calibrated to bio-identical physiological levels with zero fillers.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#D5CCB8] text-[11px] font-mono text-[#1C1917] font-bold uppercase bg-[#F5EFE6]">
                        <th className="py-2.5 px-3">Active Compound</th>
                        <th className="py-2.5 px-3">Dose</th>
                        <th className="py-2.5 px-3">Functional Role</th>
                        <th className="py-2.5 px-3">EWG Score</th>
                        <th className="py-2.5 px-3">Cellular Mechanism</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D5]">
                      {(currentProduct.detailedInci || []).map((inci, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF8F5] transition">
                          <td className="py-3 px-3 font-bold text-[#1C1917]">{inci.name}</td>
                          <td className="py-3 px-3 font-mono font-black text-[#064E3B]">
                            {inci.percentage || '—'}
                          </td>
                          <td className="py-3 px-3 text-[#1C1917] font-medium">{inci.role}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono font-bold text-[10px]">
                              EWG {inci.ewgRating}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#1C1917] max-w-xs leading-relaxed font-normal">
                            {inci.cellularFunction}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Raw INCI string */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D5CCB8]">
                  <span className="text-[10px] font-mono uppercase text-[#1C1917] font-black block mb-1">
                    Complete INCI List (International Nomenclature):
                  </span>
                  <p className="font-mono text-[11px] text-[#1C1917] leading-relaxed">
                    {currentProduct.ingredients}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: AM / PM APPLICATION PROTOCOL */}
            {activeTab === 'protocol' && (
              <div className="space-y-6 text-xs">
                <div>
                  <h4 className="font-editorial text-xl font-bold text-[#1C1917]">
                    Application Ritual &amp; Protocol
                  </h4>
                  <p className="text-xs text-[#57534E] mt-0.5 font-medium">
                    How and when to integrate into your daily barrier recovery routine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#D5CCB8] space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 text-[#03290A] font-bold text-sm">
                      <Clock size={16} />
                      <span>Ritual Timing &amp; Cadence</span>
                    </div>
                    <p className="text-xs text-[#1C1917]">
                      <strong>When to use:</strong> {currentProduct.protocol?.timeOfDay || 'AM & PM'}
                    </p>
                    <p className="text-xs text-[#1C1917]">
                      <strong>Cadence:</strong> {currentProduct.protocol?.frequency || 'Daily'}
                    </p>
                    <p className="text-xs text-[#1C1917]">
                      <strong>Texture feel:</strong> {currentProduct.protocol?.textureDescription}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#D5CCB8] space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 text-[#B45309] font-bold text-sm">
                      <Sparkles size={16} />
                      <span>Dermatologist Tip</span>
                    </div>
                    <p className="text-xs text-[#1C1917] leading-relaxed italic font-medium">
                      &ldquo;{currentProduct.protocol?.dermatologistTip}&rdquo;
                    </p>
                    <p className="text-xs text-[#064E3B] font-bold pt-1">
                      Pairs best with: {currentProduct.protocol?.pairsBestWith}
                    </p>
                  </div>
                </div>

                {/* Step by step directions */}
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#1C1917] mb-3">
                    Step-by-Step Directions
                  </h5>
                  <div className="space-y-2">
                    {currentProduct.directions.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white border border-[#D5CCB8] flex items-center gap-3 shadow-2xs"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#03290A] text-[#F3CA74] font-mono font-bold flex items-center justify-center text-xs shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-[#1C1917] font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VERIFIED CUSTOMER REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-[#1C1917]">
                      Verified Patient &amp; Customer Evaluations
                    </h4>
                    <p className="text-xs text-[#57534E] mt-0.5 font-medium">
                      Real reviews from authenticated skincare community members.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-[#D5CCB8] px-4 py-2 rounded-2xl shadow-2xs">
                    <Star size={16} className="text-[#B45309]" fill="currentColor" />
                    <span className="text-base font-bold font-mono text-[#1C1917]">{currentProduct.rating}</span>
                    <span className="text-xs text-[#57534E] font-medium">/ 5.0 Rating</span>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {(currentProduct.reviews || []).map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white border border-[#D5CCB8] space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1C1917]">{rev.author}</span>
                          {rev.verified && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <Check size={10} /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#57534E] font-mono">{rev.date}</span>
                      </div>

                      {/* Stars & Skin Profile */}
                      <div className="flex items-center gap-3">
                        <div className="flex text-[#B45309]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-[#1C1917] bg-[#F5EFE6] px-2 py-0.5 rounded-md font-bold">
                          Skin Type: {rev.skinType}
                        </span>
                      </div>

                      <h5 className="font-bold text-sm text-[#1C1917]">{rev.title}</h5>
                      <p className="text-xs text-[#1C1917] leading-relaxed font-normal">{rev.comment}</p>

                      <div className="pt-2 flex items-center justify-between border-t border-[#EFE9DD] text-[11px] text-[#57534E]">
                        <span className="font-medium">Was this review helpful?</span>
                        <button
                          onClick={() => handleHelpfulVote(rev.id, rev.helpfulCount)}
                          className="flex items-center gap-1.5 text-[#064E3B] font-bold hover:underline cursor-pointer"
                        >
                          <ThumbsUp size={12} />
                          <span>Helpful ({helpfulVotes[rev.id] ?? rev.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div 
            className="absolute top-4 inset-x-6 flex items-center justify-between z-20 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-serif font-bold text-[#E5B85C] tracking-wide">
                {currentProduct.name}
              </span>
              <span className="text-xs font-mono text-white/60">
                — {activeImage.label || activeImage.caption}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 1}
                  className="p-1 rounded-full text-white/80 hover:text-white disabled:opacity-30 transition"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="font-mono font-bold px-2 text-white min-w-[42px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 3.5}
                  className="p-1 rounded-full text-white/80 hover:text-white disabled:opacity-30 transition"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                {zoomScale > 1 && (
                  <button
                    type="button"
                    onClick={resetZoom}
                    className="p-1 ml-1 rounded-full text-[#E5B85C] hover:text-white transition"
                    title="Reset Zoom"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
                title="Close Fullscreen"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lightbox Image Container with Drag & Pan */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {activeImage.url ? (
              <img
                src={activeImage.url}
                alt={activeImage.alt || product.name}
                className="max-h-[85vh] max-w-[85vw] object-contain drop-shadow-2xl transition-transform duration-75 ease-out"
                style={{
                  transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                  cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                }}
                onDoubleClick={toggleDoubleTapZoom}
              />
            ) : (
              <div 
                className="p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-lg flex flex-col items-center justify-center text-white"
                style={{
                  transform: `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                }}
              >
                <Sparkles size={48} className="text-[#E5B85C] mb-4" />
                <h4 className="text-xl font-bold font-serif mb-2">{product.name}</h4>
                <p className="text-sm text-white/80 max-w-sm text-center">{product.description}</p>
              </div>
            )}

            {/* Bottom thumbnail strip in lightbox */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20 pointer-events-auto">
              <div className="flex gap-2 p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-[90vw] overflow-x-auto scrollbar-thin">
                {currentGallery.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => { setSelectedGalleryIdx(idx); resetZoom(); }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono shrink-0 transition flex items-center gap-2 ${
                      selectedGalleryIdx === idx
                        ? 'bg-[#E5B85C] text-black font-bold'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {item.url && (
                      <img src={item.url} alt="" className="w-5 h-5 object-contain rounded" />
                    )}
                    <span>{item.label || `View ${idx + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
