'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Sparkles, VolumeX, Volume2, RefreshCw } from 'lucide-react';
import { trackHeroEvent } from '@/lib/analytics';

interface StoryboardScene {
  id: number;
  timeRange: string;
  phaseLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  durationMs: number;
  // Scene-specific visual treatment
  mode: 'skin' | 'product_turn' | 'application' | 'trio' | 'settle';
}

const STORYBOARD_SCENES: StoryboardScene[] = [
  {
    id: 1,
    timeRange: '0:00 – 0:03',
    phaseLabel: 'SCENE 1 · REBORN SKIN',
    badge: 'Melanin Barrier Radiance',
    title: 'Natural Indian Skin Texture',
    subtitle: 'Healthy, hydrated barrier with soft cellular light',
    durationMs: 3200,
    mode: 'skin',
  },
  {
    id: 2,
    timeRange: '0:03 – 0:06',
    phaseLabel: 'SCENE 2 · FORMULATION',
    badge: '5 Barrier Ceramides',
    title: 'Active Cellular Vessel',
    subtitle: 'Champagne gold highlights catching slow ambient rotation',
    durationMs: 3200,
    mode: 'product_turn',
  },
  {
    id: 3,
    timeRange: '0:06 – 0:09',
    phaseLabel: 'SCENE 3 · APPLICATION',
    badge: 'Zero White Cast',
    title: 'Invisible Nutrient Melt',
    subtitle: 'Featherlight absorption leaving supple mochi-bounce',
    durationMs: 3200,
    mode: 'application',
  },
  {
    id: 4,
    timeRange: '0:09 – 0:12',
    phaseLabel: 'SCENE 4 · THE SACRED TRIO',
    badge: 'Cleanse · Restore · Protect',
    title: 'Complete 3-Step Ritual',
    subtitle: 'Three disciplined formulas in forest green & gold rim light',
    durationMs: 3400,
    mode: 'trio',
  },
  {
    id: 5,
    timeRange: '0:12 – 0:15',
    phaseLabel: 'SCENE 5 · HERO SETTLE',
    badge: 'Your Skin’s Barrier, Reborn',
    title: 'CARe Official Campaign',
    subtitle: 'Clinically calibrated for Indian climate & melanin richness',
    durationMs: 3200,
    mode: 'settle',
  },
];

interface CinematicVideoPlayerProps {
  desktopVideoSrc?: string;
  mobileVideoSrc?: string;
  posterSrc: string;
  aspectRatioClass?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  campaignId?: string;
  className?: string;
}

export default function CinematicVideoPlayer({
  desktopVideoSrc = '/video/care-hero-desktop.mp4',
  mobileVideoSrc = '/video/care-hero-mobile.mp4',
  posterSrc,
  aspectRatioClass = 'aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/10]',
  isPlaying,
  onTogglePlay,
  campaignId = 'campaign-a',
  className = '',
}: CinematicVideoPlayerProps) {
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Storyboard loop simulation when video file is loading/fallback
  useEffect(() => {
    if (videoAvailable || prefersReducedMotion || !isPlaying) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const intervalMs = 100;
    const currentScene = STORYBOARD_SCENES[activeSceneIndex];
    const stepIncrement = (intervalMs / currentScene.durationMs) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          setActiveSceneIndex((s) => (s + 1) % STORYBOARD_SCENES.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [videoAvailable, prefersReducedMotion, isPlaying, activeSceneIndex]);

  // Video play/pause handling
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        // Autoplay policy prevented playback, fall back to storyboard
        setVideoAvailable(false);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const currentScene = STORYBOARD_SCENES[activeSceneIndex];

  return (
    <div
      className={`relative w-full ${aspectRatioClass} rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#082417] border border-[#1b432e] shadow-[0_25px_60px_rgba(4,20,12,0.45)] group select-none ${className}`}
    >
      {/* 1. ACTUAL HTML5 VIDEO LAYER (Plays automatically when MP4/WebM exists) */}
      <video
        key={`${desktopVideoSrc}-${mobileVideoSrc}`}
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${
          videoAvailable ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        poster={posterSrc}
        onLoadedData={() => {
          setVideoAvailable(true);
          trackHeroEvent('hero_video_play', { campaignId });
        }}
        onError={() => {
          // Graceful fallback to luxury interactive campaign simulation
          setVideoAvailable(false);
        }}
        onEnded={() => {
          trackHeroEvent('hero_video_complete', { campaignId });
        }}
      >
        <source
          src={desktopVideoSrc}
          type={desktopVideoSrc?.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
          media="(min-width: 768px)"
        />
        <source
          src={mobileVideoSrc}
          type={mobileVideoSrc?.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
          media="(max-width: 767px)"
        />
      </video>

      {/* 2. CINEMATIC STORYBOARD & POSTER COMPONENT (Visible as fallback or until video loads) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        {/* Deep Forest Green Base Tone with Subtle Lighting */}
        <div className="absolute inset-0 bg-[#082417]" />

        {/* Ambient Moving Gold & Forest Green Glow */}
        <div className="absolute inset-0 bg-radial from-[#15432c] via-[#082417] to-[#04140c] opacity-90" />

        {/* Dynamic Scene Showcase based on the 15-second Storyboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background Artwork Layer using CARe's Verified Assets */}
            <div className="relative w-full h-full">
              <Image
                src={posterSrc}
                alt="CARe Beauty Solution - Cinematic Skincare Campaign"
                fill
                className={`object-cover transition-transform duration-1000 ${
                  currentScene.mode === 'skin'
                    ? 'scale-105 filter saturate-105'
                    : currentScene.mode === 'product_turn'
                    ? 'scale-110 filter brightness-105'
                    : currentScene.mode === 'application'
                    ? 'scale-100 filter contrast-105'
                    : 'scale-100'
                }`}
                priority
                referrerPolicy="no-referrer"
                sizes="(max-width: 768px) 100vw, 800px"
              />

              {/* Luxury Vignette & Rim Lighting Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#04140c] via-transparent to-[#04140c]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#04140c]/60 via-transparent to-[#04140c]/60" />

              {/* Dynamic Light Sweep Effect */}
              <div
                className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 70% 30%, rgba(243, 202, 116, 0.45) 0%, rgba(8, 36, 23, 0) 70%)',
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 5-Step Progress Indicators */}
        <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 z-20 flex items-center gap-1.5 pointer-events-none">
          {STORYBOARD_SCENES.map((scene, idx) => {
            const isCurrent = idx === activeSceneIndex;
            const isCompleted = idx < activeSceneIndex;
            return (
              <div
                key={scene.id}
                className="flex-1 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-[#e5b85c] transition-all duration-100"
                  style={{
                    width: isCompleted ? '100%' : isCurrent ? `${progressPercent}%` : '0%',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MINIMAL VOLUME / MUTE TOGGLE (Top Right) */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
        <button
          type="button"
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-[#04140c]/80 hover:bg-[#04140c] backdrop-blur-md border border-[#e5b85c]/30 hover:border-[#e5b85c] text-[#e5b85c] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>

      {/* 4. UNOBTRUSIVE PLAY/PAUSE CONTROL (Bottom Right) */}
      <div className="absolute bottom-8 right-4 sm:bottom-8 sm:right-5 z-20">
        <button
          type="button"
          onClick={onTogglePlay}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#04140c]/80 hover:bg-[#04140c] border border-[#e5b85c]/40 hover:border-[#e5b85c] text-[#e5b85c] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
          title={isPlaying ? 'Pause Campaign Video' : 'Play Campaign Video'}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
        </button>
      </div>
    </div>
  );
}
