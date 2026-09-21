'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import CinematicCanvas from './CinematicCanvas';
import CinematicVideoPlayer from './CinematicVideoPlayer';
import { HERO_CAMPAIGNS, HeroCampaign } from '@/lib/campaign-config';
import { HeroCmsConfig } from '@/lib/admin-store';
import { trackHeroEvent } from '@/lib/analytics';

interface CinematicHeroProps {
  onOpenRoutineModal: () => void;
  onScrollToProducts: () => void;
  heroConfig?: HeroCmsConfig | null;
}

export default function CinematicHero({
  onOpenRoutineModal,
  onScrollToProducts,
  heroConfig,
}: CinematicHeroProps) {
  // Campaign A/B/C state (Configurable & switchable for campaign managers)
  const [selectedCampaignId] = useState<'campaign-a' | 'campaign-b' | 'campaign-c'>('campaign-a');
  // Visual Treatment: Option A (Split Hero - Recommended) vs Option B (Full-Bleed Video)
  const [treatment, setTreatment] = useState<'split' | 'fullbleed'>('split');
  // Video playback toggle
  const [isPlaying, setIsPlaying] = useState(true);

  const campaign: HeroCampaign = HERO_CAMPAIGNS[selectedCampaignId] || HERO_CAMPAIGNS['campaign-a'];

  // Content-Managed Fallbacks
  const eyebrow = heroConfig?.eyebrow || campaign.eyebrow;
  const headlineMain = heroConfig?.headlineMain || (heroConfig?.headline ? heroConfig.headline.split(',')[0] : campaign.headlineMain);
  const headlineHighlight = heroConfig?.headlineHighlight || (heroConfig?.headline && heroConfig.headline.includes(',') ? heroConfig.headline.split(',').slice(1).join(',').trim() : campaign.headlineHighlight);
  const description = heroConfig?.description || campaign.description;
  const primaryLabel = heroConfig?.primaryCtaLabel || campaign.primaryCTA.label;
  const cleanPrimaryLabel = (primaryLabel || 'SHOP THE 3-STEP RITUAL').replace(/→|->/g, '').trim();
  const secondaryLabel = heroConfig?.secondaryCtaLabel || campaign.secondaryCTA.label;
  const secondaryHref = heroConfig?.secondaryCtaUrl || heroConfig?.secondaryCtaLink || campaign.secondaryCTA.href;
  const proofPoints = heroConfig?.proofPoints || campaign.proofPoints;
  const isImageMedia = (heroConfig?.desktopMediaType === 'image' || heroConfig?.mediaType === 'image');
  const mediaImageUrl = heroConfig?.heroImageUrl || heroConfig?.posterUrl || campaign.poster;
  const desktopVideo = heroConfig?.desktopVideoUrl || campaign.desktopVideo;
  const mobileVideo = heroConfig?.mobileVideoUrl || heroConfig?.desktopVideoUrl || campaign.mobileVideo;
  const poster = heroConfig?.posterUrl || heroConfig?.heroImageUrl || campaign.poster;
  const focalX = heroConfig?.focalPoint?.x ?? 50;
  const focalY = heroConfig?.focalPoint?.y ?? 50;

  // Track initial hero view
  useEffect(() => {
    trackHeroEvent('hero_view', {
      campaignId: campaign.id,
      treatment,
    });
  }, [campaign.id, treatment]);

  const handlePrimaryClick = () => {
    trackHeroEvent('hero_primary_cta_click', {
      campaignId: campaign.id,
      treatment,
      ctaLabel: primaryLabel,
    });

    if (heroConfig?.primaryCtaAction === 'routine_modal' || campaign.primaryCTA.actionType === 'routine_modal') {
      onOpenRoutineModal();
    } else if (heroConfig?.primaryCtaUrl?.startsWith('#')) {
      const el = document.querySelector(heroConfig.primaryCtaUrl);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else onScrollToProducts();
    } else {
      onScrollToProducts();
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackHeroEvent('hero_secondary_cta_click', {
      campaignId: campaign.id,
      treatment,
      ctaLabel: secondaryLabel,
    });
  };

  const toggleVideoPlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      trackHeroEvent('hero_video_play', { campaignId: campaign.id });
    } else {
      trackHeroEvent('hero_video_pause', { campaignId: campaign.id });
    }
  };

  return (
    <section
      id="top"
      className="relative min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#082417] text-[#FBF9F5] select-none border-b border-[#1b432e]"
    >
      {/* 1. CINEMATIC CANVASES & LIGHTING VOLUMETRICS */}
      <CinematicCanvas isPlaying={isPlaying} />

      {/* Deep Forest Green Radial Base Gradient (#082417) */}
      <div className="absolute inset-0 bg-radial from-[#123e2a]/70 via-[#082417] to-[#04140c] pointer-events-none z-0" />

      {/* Subtle Botanical Ambient Shadowing */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(229, 184, 92, 0.15) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(10, 48, 28, 0.6) 0%, transparent 60%)',
        }}
      />

      {/* 3. PRIMARY HERO COMPOSITION */}
      {treatment === 'split' ? (
        /* ================= OPTION A: SPLIT HERO (RECOMMENDED) ================= */
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-8 sm:py-12 lg:py-16 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* 0.3s Micro Campaign Label */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#123e2a]/80 border border-[#e5b85c]/40 text-[#e5b85c] text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase mb-3 sm:mb-4 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#e5b85c] animate-pulse" />
              <span>{eyebrow}</span>
            </motion.div>

            {/* 0.5s Main Editorial Headline */}
            <motion.h1
              key={(heroConfig?.id || campaign.id) + '-heading'}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-3xl sm:text-5xl lg:text-[64px] font-editorial tracking-tight text-[#FBF9F5] leading-[1.1] sm:leading-[1.04] font-normal"
            >
              {headlineMain}{' '}
              <span
                className="block italic font-normal text-[#e5b85c] drop-shadow-sm mt-1 sm:mt-0"
                style={{
                  textShadow: '0 2px 20px rgba(229, 184, 92, 0.25)',
                }}
              >
                {headlineHighlight}
              </span>
            </motion.h1>

            {/* 0.8s Supporting Copy */}
            <motion.p
              key={(heroConfig?.id || campaign.id) + '-desc'}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-4 sm:mt-5 max-w-lg text-[#D5CCB8] text-sm sm:text-base lg:text-lg leading-relaxed font-normal"
            >
              {description}
            </motion.p>

            {/* 1.1s Proof Points Strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="mt-6 pt-5 border-t border-[#1b432e] w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left"
            >
              {proofPoints.map((point, i) => (
                <div key={i} className="flex flex-col bg-[#04140c]/40 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border border-[#1b432e]/60 sm:border-0">
                  <span className="text-[#e5b85c] font-mono font-bold text-xs tracking-wider block">
                    {point.label}
                  </span>
                  <span className="text-[#EDE6D8] text-[11px] leading-tight mt-0.5 font-medium">
                    {point.sublabel}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* 1.3s Primary CTA & Secondary Action */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.15 }}
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              {/* Primary Champagne Gold CTA */}
              <button
                type="button"
                onClick={handlePrimaryClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-[#e5b85c] hover:bg-[#f3ca74] text-[#082417] font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <Sparkles size={14} className="text-[#082417] shrink-0" />
                <span className="whitespace-nowrap">{cleanPrimaryLabel}</span>
                <ArrowRight size={14} className="text-[#082417] shrink-0" />
              </button>

              {/* Secondary Clean Editorial Button */}
              <a
                href={secondaryHref}
                onClick={handleSecondaryClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#04140c]/70 hover:bg-[#04140c] border border-[#e5b85c]/40 hover:border-[#e5b85c] text-[#FBF9F5] font-bold text-xs uppercase tracking-[0.16em] transition shadow-sm cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <span className="whitespace-nowrap">{secondaryLabel}</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Cinematic Skincare Campaign Media */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-6 flex items-center justify-center w-full"
          >
            {isImageMedia ? (
              <div className="relative w-full aspect-video sm:aspect-16/10 rounded-3xl overflow-hidden border border-[#e5b85c]/30 shadow-2xl bg-black">
                <Image
                  src={mediaImageUrl}
                  alt={heroConfig?.campaignName || 'CARe Campaign Visual'}
                  fill
                  className="object-cover"
                  style={{ objectPosition: `${focalX}% ${focalY}%` }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082417]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              <CinematicVideoPlayer
                desktopVideoSrc={desktopVideo}
                mobileVideoSrc={mobileVideo}
                posterSrc={poster}
                isPlaying={isPlaying}
                onTogglePlay={toggleVideoPlay}
                campaignId={campaign.id}
              />
            )}
          </motion.div>
        </div>
      ) : (
        /* ================= OPTION B: FULL-BLEED VIDEO HERO (OVERLAY TEXT HIDDEN) ================= */
        <div className="relative z-10 w-full min-h-[82vh] flex flex-col justify-end">
          {/* Full-Bleed Video Background Container */}
          <div className="absolute inset-0 z-0">
            {isImageMedia ? (
              <div className="relative w-full h-full min-h-full">
                <Image
                  src={mediaImageUrl}
                  alt={heroConfig?.campaignName || 'CARe Campaign Visual'}
                  fill
                  className="object-cover"
                  style={{ objectPosition: `${focalX}% ${focalY}%` }}
                  priority
                />
              </div>
            ) : (
              <CinematicVideoPlayer
                desktopVideoSrc={desktopVideo}
                mobileVideoSrc={mobileVideo}
                posterSrc={poster}
                aspectRatioClass="h-full min-h-full"
                isPlaying={isPlaying}
                onTogglePlay={toggleVideoPlay}
                campaignId={campaign.id}
                className="!rounded-none !border-none"
              />
            )}
            {/* Soft perimeter gradient so video is clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#082417]/80 via-transparent to-[#082417]/20 pointer-events-none z-15" />
          </div>

          {/* Minimal Floating Controls at bottom (Overlay text hidden to let full-bleed video shine) */}
          <div className="relative z-20 max-w-7xl mx-auto w-full px-5 md:px-12 pb-10 mt-auto flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handlePrimaryClick}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#e5b85c] hover:bg-[#f3ca74] text-[#082417] font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-[0_10px_30px_rgba(229,184,92,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <Sparkles size={14} className="text-[#082417] shrink-0" />
              <span className="whitespace-nowrap">{cleanPrimaryLabel}</span>
              <ArrowRight size={14} className="text-[#082417] shrink-0" />
            </button>

            <a
              href={secondaryHref}
              onClick={handleSecondaryClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#04140c]/80 hover:bg-[#04140c] border border-[#e5b85c]/40 text-[#FBF9F5] font-bold text-xs uppercase tracking-[0.16em] transition backdrop-blur-md cursor-pointer whitespace-nowrap"
            >
              <span>{secondaryLabel}</span>
            </a>
          </div>
        </div>
      )}

      {/* 4. CLINICAL PROOF BAR AT BOTTOM OF HERO */}
      <div className="relative z-20 border-t border-[#1b432e] bg-[#04140c]/80 backdrop-blur-md py-3 px-5 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono tracking-wider text-[#d5ccb8]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#e5b85c]" />
            <span className="text-[#e5b85c] font-bold uppercase">Clinical Protocol:</span>
            <span>Indian Melanin Tested · Zero Ashiness · Humid-Climate Weightless</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[#a89e8c]">
            <span>01 CLEANSE</span>
            <span>•</span>
            <span>02 RESTORE</span>
            <span>•</span>
            <span>03 PROTECT</span>
            <span className="text-[#e5b85c] font-semibold">| 100% Non-Comedogenic</span>
          </div>
        </div>
      </div>
    </section>
  );
}
