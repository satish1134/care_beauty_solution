import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Heart,
  Eye,
  Check,
  ShieldCheck,
  Activity,
  Play,
  Pause,
  Layers,
  Star,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';

interface CyberBentoHeroProps {
  products?: Product[];
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct?: (product: Product) => void;
}

export const CyberBentoHero: React.FC<CyberBentoHeroProps> = ({
  products = [],
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}) => {
  // Active Hero Product Selection (0: Cleanser, 1: Moisturizer, 2: Sunscreen)
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isPlayingReel, setIsPlayingReel] = useState<boolean>(true);
  const [reelLikes, setReelLikes] = useState<number>(34200);
  const [hasLikedReel, setHasLikedReel] = useState<boolean>(false);
  const [addedItemAnimation, setAddedItemAnimation] = useState<boolean>(false);

  // 3 Primary Hero Formulations for Gen Z
  const heroProducts = [
    {
      id: 'prod-refreshing-skin-cleanser',
      slug: 'refreshing-skin-cleanser',
      name: 'BARRIER RESET GEL',
      shortName: '01 / GEL WASH',
      microCopy: 'Zero soap. Zero tightness.',
      punchline: 'SOAP-FREE BARRIER WASH',
      price: 499,
      origPrice: 699,
      discount: '28% OFF',
      accentColor: '#CCFF00',
      accentText: 'text-[#CCFF00]',
      accentBg: 'bg-[#CCFF00]',
      shadowGlow: 'shadow-neon-lime',
      buttonClass: 'clay-button-lime',
      tags: ['#SoapFree', '#pH5.5Balanced', '#0%BS'],
      sticker1: '⚡ 100% CLEAN',
      sticker2: '🫧 NO TIGHTNESS',
      stickerRotate: '-rotate-3',
      imageUrl: '/images/care-cleanser-1-hero-marble.svg',
      textureUrl: '/images/care-cleanser-texture.svg',
      rating: 4.9,
      dropsCount: '18.4k Sold',
    },
    {
      id: 'prod-hydrating-moisturizer',
      slug: 'hydrating-moisturizer',
      name: '72H CERAMIDE LOCK',
      shortName: '02 / MOISTURE',
      microCopy: 'Glass skin without grease.',
      punchline: 'TRIPLE CERAMIDE SHIELD',
      price: 599,
      origPrice: 799,
      discount: '25% OFF',
      accentColor: '#00D4FF',
      accentText: 'text-[#00D4FF]',
      accentBg: 'bg-[#00D4FF]',
      shadowGlow: 'shadow-neon-cyan',
      buttonClass: 'clay-button-cyan',
      tags: ['#3xCeramides', '#72HLock', '#GlassSkin'],
      sticker1: '💧 72H HYDRATION',
      sticker2: '🧪 0% GREASE',
      stickerRotate: 'rotate-2',
      imageUrl: '/images/care-hydrating-moisturizer.svg',
      textureUrl: '/images/care-hydrating-moisturizer.svg',
      rating: 4.8,
      dropsCount: '14.2k Sold',
    },
    {
      id: 'prod-ray-barrier-sunscreen',
      slug: 'ray-barrier-sunscreen',
      name: 'INVISIBLE SPF 50+',
      shortName: '03 / UV GEL',
      microCopy: 'Zero white cast. Pure glow.',
      punchline: 'WATER-LIGHT UV MATRIX',
      price: 649,
      origPrice: 849,
      discount: '23% OFF',
      accentColor: '#FF51FA',
      accentText: 'text-[#FF51FA]',
      accentBg: 'bg-[#FF51FA]',
      shadowGlow: 'shadow-neon-pink',
      buttonClass: 'clay-button-pink',
      tags: ['#ZeroWhiteCast', '#PA++++', '#WaterBurst'],
      sticker1: '☀️ INVISIBLE SPF 50+',
      sticker2: '⚡ SWEAT PROOF',
      stickerRotate: '-rotate-2',
      imageUrl: '/images/care-ray-barrier-sunscreen.svg',
      textureUrl: '/images/care-ray-barrier-sunscreen.svg',
      rating: 4.9,
      dropsCount: '21.9k Sold',
    },
  ];

  const currentHero = heroProducts[activeHeroIndex];
  const activeProductObj = products.find(p => p.id === currentHero.id || p.slug === currentHero.slug) || products[0];

  // TikTok/Reel clips mock feeds with interactive looping soundwave
  const reelFeed = [
    {
      creator: '@ananya_glows',
      handle: 'Verified Derm Creator',
      caption: 'The only cleanser that didn\'t wreck my skin barrier 🔥 #CareGlow #NoFilter',
      views: '128.4K',
      likes: '34.2K',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      activeProduct: 'Soap-Free Cleanser',
      videoCover: '/images/care-cleanser-1-hero-marble.svg',
    },
    {
      creator: '@skinwithrohit',
      handle: 'Skincare Chemist',
      caption: 'Testing the 72H Ceramide Lock under UV light... Zero greasy residue! 💧',
      views: '94.1K',
      likes: '22.8K',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      activeProduct: 'Ceramide Moisture Lock',
      videoCover: '/images/care-hydrating-moisturizer.svg',
    },
  ];

  const handleInstantBuy = () => {
    if (activeProductObj) {
      const variant = activeProductObj.variants[0];
      if (onBuyNow) {
        onBuyNow(activeProductObj, variant, 1);
      } else if (onAddToCart) {
        onAddToCart(activeProductObj, variant, 1);
      }
    }
  };

  const handleDropInBag = () => {
    if (activeProductObj && onAddToCart) {
      const variant = activeProductObj.variants[0];
      onAddToCart(activeProductObj, variant, 1);
      setAddedItemAnimation(true);
      setTimeout(() => setAddedItemAnimation(false), 1400);
    }
  };

  const handleLikeReel = () => {
    if (!hasLikedReel) {
      setReelLikes(prev => prev + 1);
      setHasLikedReel(true);
    } else {
      setReelLikes(prev => prev - 1);
      setHasLikedReel(false);
    }
  };

  return (
    <section
      aria-label="Cyber Bento Hero Showcase"
      className="relative overflow-hidden bg-[#080808] text-slate-100 py-6 sm:py-10 border-b border-white/10"
    >
      {/* Dynamic Animated Shifting Neon Blobs (Fluid Backdrop) */}
      <div className="absolute top-10 -left-20 w-80 sm:w-[480px] h-80 sm:h-[480px] bg-[#CCFF00]/12 rounded-full blur-[140px] pointer-events-none animate-blob-1" />
      <div className="absolute bottom-10 right-0 w-96 sm:w-[520px] h-96 sm:h-[520px] bg-[#00D4FF]/12 rounded-full blur-[160px] pointer-events-none animate-blob-2" />
      <div className="absolute top-1/3 right-1/4 w-72 sm:w-[400px] h-72 sm:h-[400px] bg-[#FF51FA]/10 rounded-full blur-[130px] pointer-events-none animate-blob-3" />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP STATUS TICKER WITH OVERLAPPING STICKER BADGES */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Overlapping Floating Sticker 1 */}
            <span className="sticker-tag bg-[#CCFF00] text-black text-xs px-3.5 py-1 -rotate-2">
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>ACID BEAUTY DROP</span>
            </span>

            {/* Overlapping Floating Sticker 2 */}
            <span className="sticker-tag bg-[#00D4FF] text-black text-xs px-3 py-1 rotate-2 hidden sm:inline-flex">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>100% CLINICAL 0% BS</span>
            </span>

            {/* Live Dropping Telemetry */}
            <span className="flex items-center gap-2 text-xs text-slate-300 font-orbitron bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
              <span>LIVE LAB DISPATCH: PAN-INDIA</span>
            </span>
          </div>

          {/* Social Proof Metric Pill */}
          <div className="flex items-center gap-2 bg-[#141724] px-4 py-1.5 rounded-full border border-white/15 text-xs font-syne font-bold">
            <Flame className="w-4 h-4 text-[#FF51FA] fill-[#FF51FA]" />
            <span className="text-white">VIRAL SENSATION</span>
            <span className="text-[#CCFF00] font-mono font-black">99.4% GLOW RATE</span>
          </div>
        </div>

        {/* =========================================================================
            DYNAMIC BENTO BOX GRID LAYOUT
            - Tile 1 (Large 2x2): Massive Punchy Header, Hero Product 3D Stage & CTAs
            - Tile 2 (Vertical 1x2): TikTok/Reel-Style UGC Live Video Feed
            - Tile 3 (Horizontal 2x1): Sensorial ASMR Formula Selector
            - Tile 4 (Square 1x1): Live Drop Counter & Quick Checkout Box
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* =====================================================================
              BENTO TILE 1 (Col 8): MASSIVE FUTURISTIC HERO & TACTILE 3D STAGE
             ===================================================================== */}
          <div className="lg:col-span-8 clay-card p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group border border-white/15">
            {/* Top Glowing Glass Border */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#CCFF00] via-[#00D4FF] to-[#FF51FA]" />

            {/* Overlapping Border Stickers (Bleeds out of container) */}
            <div className="absolute -top-3.5 left-8 z-20">
              <span className={`sticker-tag ${currentHero.accentBg} text-black text-xs px-4 py-1 shadow-md ${currentHero.stickerRotate}`}>
                {currentHero.sticker1}
              </span>
            </div>

            <div className="absolute -top-3.5 right-8 z-20 hidden sm:block">
              <span className="sticker-tag bg-white text-black text-xs px-4 py-1 shadow-md rotate-2">
                {currentHero.sticker2}
              </span>
            </div>

            {/* Content Top: Massive Syne Typography & Ultra-Minimal Micro-Copy */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-orbitron font-extrabold uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-2.5 py-0.5 rounded-md border border-[#00D4FF]/30">
                  {currentHero.punchline}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentHero.dropsCount}
                </span>
              </div>

              {/* Massive 80px+ Syne Header */}
              <h1 id="hero-main-title" className="font-syne text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white leading-[1.02] uppercase">
                {currentHero.name.split(' ')[0]} <span className={currentHero.accentText}>{currentHero.name.split(' ').slice(1).join(' ')}</span>
              </h1>

              {/* Ultra-Minimal Micro-Copy (3-5 words max!) */}
              <p className="text-base sm:text-xl font-syne font-bold text-slate-200 tracking-tight">
                {currentHero.microCopy}
              </p>

              {/* Floating Glowing Hashtags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {currentHero.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-orbitron font-bold text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:border-[#CCFF00] hover:text-white transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Middle Section: 3D Bottle Stage + Dynamic Multi-Product Thumb Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-6">
              
              {/* Product Visual Centerpiece with Specular Glare */}
              <div className="sm:col-span-7 relative aspect-square sm:aspect-auto sm:h-72 rounded-3xl bg-gradient-to-b from-[#181D2F] via-[#0E121E] to-[#080808] border border-white/10 flex items-center justify-center p-4 overflow-hidden group/img">
                <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentHero.id}
                    src={currentHero.imageUrl}
                    alt={currentHero.name}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain max-h-64 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] group-hover/img:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Inspect Specs Trigger */}
                <button
                  onClick={() => onSelectProduct && onSelectProduct(activeProductObj)}
                  className="absolute bottom-3 right-3 bg-black/80 hover:bg-[#CCFF00] hover:text-black text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Specs</span>
                </button>
              </div>

              {/* Hero Switcher Vertical Selector */}
              <div className="sm:col-span-5 flex flex-col justify-center space-y-2.5">
                <p className="text-[11px] font-orbitron font-bold text-slate-400 uppercase tracking-wider">
                  Select Bio-Active Drop:
                </p>

                {heroProducts.map((prod, idx) => (
                  <button
                    key={prod.id}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      activeHeroIndex === idx
                        ? `bg-[#191D2C] border-[${prod.accentColor}] ring-2 ring-[${prod.accentColor}]/40 shadow-lg scale-[1.02]`
                        : 'bg-[#10131E] border-white/10 text-slate-400 hover:bg-[#161928] hover:text-white'
                    }`}
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-xl shrink-0 border border-white/10 bg-black/40"
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-orbitron font-black uppercase truncate ${activeHeroIndex === idx ? prod.accentText : 'text-slate-300'}`}>
                          {prod.shortName}
                        </span>
                        <span className="text-xs font-mono font-black text-white">
                          ₹{prod.price}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate font-mono">
                        {prod.microCopy}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Pricing & High-Tactile CTAs */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="font-orbitron text-3xl sm:text-4xl font-black text-white">
                  ₹{currentHero.price}
                </span>
                <span className="text-sm font-mono text-slate-400 line-through">
                  ₹{currentHero.origPrice}
                </span>
                <span className={`sticker-tag ${currentHero.accentBg} text-black text-[10px] px-2 py-0.5 -rotate-2`}>
                  {currentHero.discount}
                </span>
              </div>

              {/* Tactile Claymorphic Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleInstantBuy}
                  className={`px-6 sm:px-8 py-3.5 rounded-2xl ${currentHero.buttonClass} text-black font-syne font-black text-xs sm:text-sm uppercase tracking-wider ${currentHero.shadowGlow} transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>INSTANT BUY</span>
                </button>

                <button
                  onClick={handleDropInBag}
                  className="px-5 sm:px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-syne font-black text-xs sm:text-sm uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedItemAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-[#CCFF00]" />
                      <span className="text-[#CCFF00]">DROPPED!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#00D4FF]" />
                      <span>+ DROP IN BAG</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================================
              BENTO TILE 2 (Col 4): TIKTOK/REEL-STYLE VERTICAL VIDEO UGC FEED
             ===================================================================== */}
          <div className="lg:col-span-4 clay-card p-5 relative overflow-hidden flex flex-col justify-between border border-white/15 min-h-[480px]">
            {/* Top Overlapping Sticker */}
            <div className="absolute -top-3 left-6 z-20">
              <h2 id="reel-feed-heading" className="sticker-tag bg-[#FF51FA] text-white text-[11px] px-3.5 py-1 rotate-1 shadow-md font-bold uppercase">
                🔥 TIKTOK VIRAL FEED
              </h2>
            </div>

            {/* Reel Video Player Card Mock */}
            <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1E2337] to-[#0A0D16] border border-white/10 flex flex-col justify-between p-4 group/reel mt-2">
              
              {/* Top Reel Overlay: Live Viewers + Sound Controls */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-orbitron text-[#CCFF00]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>14.8K WATCHING</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* ASMR Sound Wave Bars */}
                  <div className="flex items-end gap-0.5 h-5 px-2 bg-black/60 rounded-lg">
                    <span className="sound-bar" style={{ animationDelay: '0.1s' }} />
                    <span className="sound-bar" style={{ animationDelay: '0.3s' }} />
                    <span className="sound-bar" style={{ animationDelay: '0.5s' }} />
                    <span className="sound-bar" style={{ animationDelay: '0.2s' }} />
                  </div>

                  {/* Audio Mute Toggle */}
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-1.5 rounded-full bg-black/70 text-white hover:text-[#CCFF00] border border-white/20 transition cursor-pointer"
                    title={isAudioMuted ? 'Unmute ASMR audio' : 'Mute'}
                  >
                    {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#CCFF00]" />}
                  </button>
                </div>
              </div>

              {/* Center Reel Media with Interactive Playback State */}
              <div className="relative flex items-center justify-center my-4">
                <img
                  src={reelFeed[0].videoCover}
                  alt="UGC Video Demonstration"
                  className="w-44 h-44 object-contain filter drop-shadow-2xl animate-pulse"
                />

                {/* Quick Pause/Play Indicator overlay */}
                <button
                  onClick={() => setIsPlayingReel(!isPlayingReel)}
                  className="absolute p-3 rounded-full bg-black/60 text-white border border-white/20 opacity-0 group-hover/reel:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
                >
                  {isPlayingReel ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>

              {/* Right Vertical Engagement Column (TikTok Style) */}
              <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3 z-10">
                <button
                  onClick={handleLikeReel}
                  className="flex flex-col items-center gap-0.5 group/like cursor-pointer"
                >
                  <div className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${hasLikedReel ? 'bg-[#FF51FA] text-white border-[#FF51FA]' : 'bg-black/60 text-white border-white/20 group-hover/like:scale-110'}`}>
                    <Heart className={`w-4 h-4 ${hasLikedReel ? 'fill-white' : ''}`} />
                  </div>
                  <span className="text-[10px] font-orbitron font-bold text-white">
                    {hasLikedReel ? '34.3K' : '34.2K'}
                  </span>
                </button>

                <div className="flex flex-col items-center gap-0.5">
                  <div className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-orbitron font-bold text-white">
                    128K
                  </span>
                </div>
              </div>

              {/* Bottom Reel Caption & Creator Metadata */}
              <div className="z-10 space-y-2 pr-12">
                <div className="flex items-center gap-2">
                  <img
                    src={reelFeed[0].avatar}
                    alt={reelFeed[0].creator}
                    className="w-7 h-7 rounded-full object-cover border border-[#CCFF00]"
                  />
                  <div>
                    <p className="text-xs font-syne font-bold text-white flex items-center gap-1">
                      {reelFeed[0].creator} <ShieldCheck className="w-3 h-3 text-[#00D4FF]" />
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono">
                      {reelFeed[0].handle}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-sans text-slate-200 line-clamp-2 leading-tight">
                  {reelFeed[0].caption}
                </p>

                {/* Tagged Product Chip */}
                <div
                  onClick={() => onSelectProduct && onSelectProduct(activeProductObj)}
                  className="bg-white/10 hover:bg-[#CCFF00] hover:text-black text-white p-2 rounded-xl border border-white/15 flex items-center justify-between transition-all cursor-pointer group/chip"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#CCFF00] group-hover/chip:text-black shrink-0" />
                    <span className="text-[11px] font-syne font-bold truncate">
                      {reelFeed[0].activeProduct} • ₹499
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </div>
              </div>

            </div>
          </div>

          {/* =====================================================================
              BENTO TILE 3 (Col 7): SENSORIAL 100% CLEAN PROMISES CHIPS
             ===================================================================== */}
          <div className="lg:col-span-7 glass-cyber-card p-5 rounded-3xl relative overflow-hidden border border-white/15 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <h2 id="clinical-promises-heading" className="text-xs font-orbitron font-extrabold text-[#CCFF00] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> 0% BS CLINICAL PROMISES
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                DERM CERTIFIED 2026
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#121624] p-3 rounded-2xl border border-white/10 text-center space-y-1">
                <span className="text-lg">🫧</span>
                <p className="text-xs font-syne font-black text-white">0% Soap</p>
                <p className="text-[10px] font-mono text-slate-400">pH 5.5 Mantle</p>
              </div>

              <div className="bg-[#121624] p-3 rounded-2xl border border-white/10 text-center space-y-1">
                <span className="text-lg">🌿</span>
                <p className="text-xs font-syne font-black text-white">0% Fragrance</p>
                <p className="text-[10px] font-mono text-slate-400">Allergy Safe</p>
              </div>

              <div className="bg-[#121624] p-3 rounded-2xl border border-white/10 text-center space-y-1">
                <span className="text-lg">💧</span>
                <p className="text-xs font-syne font-black text-white">3x Ceramides</p>
                <p className="text-[10px] font-mono text-slate-400">Lipid Shield</p>
              </div>

              <div className="bg-[#121624] p-3 rounded-2xl border border-white/10 text-center space-y-1">
                <span className="text-lg">⚡</span>
                <p className="text-xs font-syne font-black text-white">0% White Cast</p>
                <p className="text-[10px] font-mono text-slate-400">Clear Finish</p>
              </div>
            </div>
          </div>

          {/* =====================================================================
              BENTO TILE 4 (Col 5): GEN Z EXPRESS REWARD BOX & COUPON CODE
             ===================================================================== */}
          <div className="lg:col-span-5 clay-card p-5 rounded-3xl relative overflow-hidden border border-white/15 flex items-center justify-between gap-4">
            <div>
              <span className="sticker-tag bg-[#CCFF00] text-black text-[10px] px-2.5 py-0.5 -rotate-2">
                CODE: CARE200
              </span>
              <h2 id="express-reward-heading" className="text-base font-syne font-black text-white mt-1.5">
                ₹200 Instant Bag Discount
              </h2>
              <p className="text-xs font-mono text-slate-400">
                + Free Pan-India Doorstep Dispatch on ₹499+
              </p>
            </div>

            <button
              onClick={handleInstantBuy}
              className="clay-button-lime text-black font-syne font-black text-xs px-4 py-3 rounded-2xl uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-neon-lime cursor-pointer"
            >
              CLAIM DROP
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
