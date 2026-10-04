'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  Check,
  AlertCircle,
  Save,
  RefreshCw,
  Sliders,
  Palette,
  Eye,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { StorefrontCmsData, SectionContentConfig } from '@/lib/admin-store';

interface BrandLogoCmsManagerProps {
  storefrontCms: StorefrontCmsData;
  onUpdate: (updated: StorefrontCmsData) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  errorMessage?: string;
}

export default function BrandLogoCmsManager({
  storefrontCms,
  onUpdate,
  onSave,
  isSaving,
  saveStatus,
  errorMessage,
}: BrandLogoCmsManagerProps) {
  const section = storefrontCms.sectionContent;

  const [headerLogo, setHeaderLogo] = useState<string>(
    section.headerLogoUrl || '/images/logos/logo_sample1_black.png'
  );
  const [headerHeight, setHeaderHeight] = useState<number>(section.headerLogoHeight || 54);
  const [headerBgMode, setHeaderBgMode] = useState<'white' | 'black' | 'custom'>(
    section.headerBgMode || 'black'
  );
  const [headerBgCustom, setHeaderBgCustom] = useState<string>(
    section.headerBgCustom || '#000000'
  );

  const [footerLogo, setFooterLogo] = useState<string>(
    section.footerLogoUrl || '/images/logos/logo_sample1_black.png'
  );
  const [footerHeight, setFooterHeight] = useState<number>(section.footerLogoHeight || 64);
  const [footerBgMode, setFooterBgMode] = useState<'black' | 'white' | 'custom'>(
    section.footerBgMode || 'black'
  );
  const [footerBgCustom, setFooterBgCustom] = useState<string>(
    section.footerBgCustom || '#000000'
  );

  // Uploading status
  const [isUploadingHeader, setIsUploadingHeader] = useState(false);
  const [isUploadingFooter, setIsUploadingFooter] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const footerFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if external storefrontCms updates
  useEffect(() => {
    if (section.headerLogoUrl) setHeaderLogo(section.headerLogoUrl);
    if (section.headerLogoHeight) setHeaderHeight(section.headerLogoHeight);
    if (section.headerBgMode) setHeaderBgMode(section.headerBgMode);
    if (section.headerBgCustom) setHeaderBgCustom(section.headerBgCustom);

    if (section.footerLogoUrl) setFooterLogo(section.footerLogoUrl);
    if (section.footerLogoHeight) setFooterHeight(section.footerLogoHeight);
    if (section.footerBgMode) setFooterBgMode(section.footerBgMode);
    if (section.footerBgCustom) setFooterBgCustom(section.footerBgCustom);
  }, [section]);

  const commitChanges = (overrides: Partial<SectionContentConfig> = {}) => {
    const updatedSection: SectionContentConfig = {
      ...section,
      headerLogoUrl: headerLogo,
      headerLogoHeight: headerHeight,
      headerBgMode: headerBgMode,
      headerBgCustom: headerBgCustom,
      footerLogoUrl: footerLogo,
      footerLogoHeight: footerHeight,
      footerBgMode: footerBgMode,
      footerBgCustom: footerBgCustom,
      ...overrides,
    };

    onUpdate({
      ...storefrontCms,
      sectionContent: updatedSection,
      updatedAt: new Date().toISOString(),
    });
  };

  // Upload handler
  const handleFileUpload = async (file: File, target: 'header' | 'footer') => {
    setUploadError('');
    if (target === 'header') setIsUploadingHeader(true);
    else setIsUploadingFooter(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'brand');
      formData.append('altText', `CARe Brand Logo ${target}`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!json.success || !json.url) {
        throw new Error(json.error || 'Upload failed');
      }

      if (target === 'header') {
        setHeaderLogo(json.url);
        commitChanges({ headerLogoUrl: json.url });
      } else {
        setFooterLogo(json.url);
        commitChanges({ footerLogoUrl: json.url });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      if (target === 'header') setIsUploadingHeader(false);
      else setIsUploadingFooter(false);
    }
  };

  const getEffectiveHeaderBg = () => {
    if (headerBgMode === 'white') return '#FFFFFF';
    if (headerBgMode === 'black') return '#000000';
    return headerBgCustom;
  };

  const getEffectiveFooterBg = () => {
    if (footerBgMode === 'black') return '#000000';
    if (footerBgMode === 'white') return '#FFFFFF';
    return footerBgCustom;
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E5B85C]/20 text-[#E5B85C] border border-[#E5B85C]/30">
              Identity Management
            </span>
            <span className="text-xs text-[#E8E2D5]/60">• Direct Logo Upload &amp; Sizing</span>
          </div>
          <h2 className="text-2xl font-editorial font-bold text-[#FAF8F5]">
            Header &amp; Footer Brand Logos
          </h2>
          <p className="text-xs text-[#E8E2D5]/70 mt-1 max-w-2xl">
            Upload custom high-resolution logo PNGs, adjust dimensions, and configure background matching to eliminate visible seams and squishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              commitChanges();
              await onSave();
            }}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#E5B85C] text-[#1C1917] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#F3CA74] transition shadow-lg shadow-[#E5B85C]/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? 'Saving...' : 'Save & Publish Logos'}</span>
          </button>
        </div>
      </div>

      {/* Save / Error Alerts */}
      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check size={16} />
          <span>Brand logos and sizing updated successfully! Storefront is now displaying your saved logos.</span>
        </div>
      )}

      {(saveStatus === 'error' || uploadError) && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{uploadError || errorMessage || 'Failed to update brand logos'}</span>
        </div>
      )}

      {/* Dimension & Aspect Ratio Explanation Box */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#FAF8F5] text-xs flex items-start gap-3">
        <Info size={18} className="text-[#E5B85C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#E5B85C]">
            Why original dimensions might have looked mismatched:
          </p>
          <p className="text-[#E8E2D5]/80 leading-relaxed">
            Sample 1 (Black) is <strong>2158 × 729 px</strong> (~2.96:1 ratio) with generous margins, whereas Sample 2 (White) is <strong>1838 × 856 px</strong> (~2.15:1 ratio). Inside fixed-width containers, different aspect ratios leave empty gaps or get scaled down.
          </p>
          <p className="text-[#E8E2D5]/80">
            <strong>Solution:</strong> The new sizing engine below uses exact height sliders with dynamic auto-aspect ratios, so your logo expands to its natural width without distortion!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: HEADER LOGO
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#1E293B] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E5B85C]/15 border border-[#E5B85C]/30 flex items-center justify-center text-[#E5B85C]">
                <Sparkles size={15} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Header Logo</h3>
                <span className="text-[11px] font-mono text-[#E8E2D5]/60">Top sticky navigation bar</span>
              </div>
            </div>
            <span className="text-xs font-mono text-[#E5B85C]">Height: {headerHeight}px</span>
          </div>

          {/* Live Header Logo Preview Box */}
          <div>
            <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-2">
              Live Header Mockup:
            </label>
            <div
              className="p-4 rounded-2xl border transition-colors duration-200 flex items-center justify-between shadow-inner"
              style={{
                backgroundColor: getEffectiveHeaderBg(),
                borderColor: getEffectiveHeaderBg() === '#FFFFFF' ? '#EAE5DB' : '#27272A',
              }}
            >
              <div
                className="relative transition-all duration-150"
                style={{
                  height: `${headerHeight}px`,
                  width: `${headerHeight * 3.4}px`,
                  maxWidth: '260px',
                }}
              >
                <Image
                  src={headerLogo}
                  alt="Header Logo"
                  fill
                  className="object-contain object-left"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                className="text-[11px] font-mono px-3 py-1.5 rounded-full border text-xs"
                style={{
                  backgroundColor: getEffectiveHeaderBg() === '#FFFFFF' ? '#F4F0E8' : '#1C1917',
                  borderColor: getEffectiveHeaderBg() === '#FFFFFF' ? '#D6CEC1' : '#332E28',
                  color: getEffectiveHeaderBg() === '#FFFFFF' ? '#1C1917' : '#E5B85C',
                }}
              >
                Search • Bag (2)
              </div>
            </div>
          </div>

          {/* Upload Button + Presets */}
          <div className="space-y-3">
            <label className="block text-xs font-mono text-[#E8E2D5]/70">
              Upload New Header Logo File:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={headerFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'header');
                }}
              />
              <button
                type="button"
                onClick={() => headerFileInputRef.current?.click()}
                disabled={isUploadingHeader}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#E5B85C]/50 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploadingHeader ? (
                  <RefreshCw size={15} className="animate-spin text-[#E5B85C]" />
                ) : (
                  <Upload size={15} className="text-[#E5B85C]" />
                )}
                <span>{isUploadingHeader ? 'Uploading Logo...' : 'Choose File to Upload'}</span>
              </button>
            </div>

            {/* Logo URL Input */}
            <div>
              <span className="text-[11px] font-mono text-[#E8E2D5]/60 block mb-1">
                Or direct image path:
              </span>
              <input
                type="text"
                value={headerLogo}
                onChange={(e) => {
                  setHeaderLogo(e.target.value);
                  commitChanges({ headerLogoUrl: e.target.value });
                }}
                placeholder="/images/logos/..."
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:border-[#E5B85C] outline-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-mono text-[#E8E2D5]/60 self-center">Quick Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setHeaderLogo('/images/logos/logo_sample2_white.png');
                  setHeaderBgMode('white');
                  commitChanges({
                    headerLogoUrl: '/images/logos/logo_sample2_white.png',
                    headerBgMode: 'white',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-[#E8E2D5] cursor-pointer"
              >
                Sample 2 (Trimmed White)
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeaderLogo('/images/logos/logo_sample2_transparent.png');
                  setHeaderBgMode('white');
                  commitChanges({
                    headerLogoUrl: '/images/logos/logo_sample2_transparent.png',
                    headerBgMode: 'white',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#E5B85C]/10 hover:bg-[#E5B85C]/20 border border-[#E5B85C]/30 text-[10px] font-mono text-[#E5B85C] cursor-pointer"
              >
                Sample 2 (Transparent ✨)
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeaderLogo('/images/logos/logo_sample1_black.png');
                  setHeaderBgMode('black');
                  commitChanges({
                    headerLogoUrl: '/images/logos/logo_sample1_black.png',
                    headerBgMode: 'black',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-[#E8E2D5] cursor-pointer"
              >
                Sample 1 (Pure Black)
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeaderLogo('/images/logos/logo_sample1_transparent.png');
                  setHeaderBgMode('black');
                  commitChanges({
                    headerLogoUrl: '/images/logos/logo_sample1_transparent.png',
                    headerBgMode: 'black',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#E5B85C]/10 hover:bg-[#E5B85C]/20 border border-[#E5B85C]/30 text-[10px] font-mono text-[#E5B85C] cursor-pointer"
              >
                Sample 1 (Transparent ✨)
              </button>
            </div>
          </div>

          {/* Height Slider */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#E8E2D5]/80 flex items-center gap-1.5">
                <Sliders size={13} className="text-[#E5B85C]" />
                <span>Logo Height Size</span>
              </span>
              <span className="text-[#E5B85C] font-bold">{headerHeight} px</span>
            </div>
            <input
              type="range"
              min={28}
              max={80}
              step={2}
              value={headerHeight}
              onChange={(e) => {
                const val = Number(e.target.value);
                setHeaderHeight(val);
                commitChanges({ headerLogoHeight: val });
              }}
              className="w-full accent-[#E5B85C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#E8E2D5]/50">
              <span>Compact (28px)</span>
              <span>Default (44px)</span>
              <span>Spacious (80px)</span>
            </div>
          </div>

          {/* Background Color Matching */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-xs font-mono text-[#E8E2D5]/80 flex items-center gap-1.5">
              <Palette size={13} className="text-[#E5B85C]" />
              <span>Header Background Match:</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setHeaderBgMode('white');
                  commitChanges({ headerBgMode: 'white' });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  headerBgMode === 'white'
                    ? 'bg-white text-[#1C1917] border-white shadow'
                    : 'bg-white/5 text-[#E8E2D5] border-white/10'
                }`}
              >
                {headerBgMode === 'white' && <Check size={12} />}
                <span>White (#FFF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeaderBgMode('black');
                  commitChanges({ headerBgMode: 'black' });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  headerBgMode === 'black'
                    ? 'bg-black text-[#E5B85C] border-[#E5B85C] shadow'
                    : 'bg-white/5 text-[#E8E2D5] border-white/10'
                }`}
              >
                {headerBgMode === 'black' && <Check size={12} />}
                <span>Black (#000)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeaderBgMode('custom');
                  commitChanges({ headerBgMode: 'custom' });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  headerBgMode === 'custom'
                    ? 'bg-[#E5B85C] text-[#1C1917] border-[#E5B85C]'
                    : 'bg-white/5 text-[#E8E2D5] border-white/10'
                }`}
              >
                {headerBgMode === 'custom' && <Check size={12} />}
                <span>Custom Hex</span>
              </button>
            </div>

            {headerBgMode === 'custom' && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={headerBgCustom}
                  onChange={(e) => {
                    setHeaderBgCustom(e.target.value);
                    commitChanges({ headerBgCustom: e.target.value });
                  }}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={headerBgCustom}
                  onChange={(e) => {
                    setHeaderBgCustom(e.target.value);
                    commitChanges({ headerBgCustom: e.target.value });
                  }}
                  className="flex-1 bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: FOOTER LOGO
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-[#1E293B] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E5B85C]/15 border border-[#E5B85C]/30 flex items-center justify-center text-[#E5B85C]">
                <Sparkles size={15} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Footer Logo</h3>
                <span className="text-[11px] font-mono text-[#E8E2D5]/60">Bottom brand anchor &amp; seal</span>
              </div>
            </div>
            <span className="text-xs font-mono text-[#E5B85C]">Height: {footerHeight}px</span>
          </div>

          {/* Live Footer Logo Preview Box */}
          <div>
            <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-2">
              Live Footer Mockup:
            </label>
            <div
              className="p-5 rounded-2xl border transition-colors duration-200 flex flex-col justify-between shadow-inner"
              style={{
                backgroundColor: getEffectiveFooterBg(),
                borderColor: getEffectiveFooterBg() === '#FFFFFF' ? '#EAE5DB' : '#27272A',
              }}
            >
              <div
                className="relative mb-2 transition-all duration-150"
                style={{
                  height: `${footerHeight}px`,
                  width: `${footerHeight * 3.6}px`,
                  maxWidth: '300px',
                }}
              >
                <Image
                  src={footerLogo}
                  alt="Footer Logo"
                  fill
                  className="object-contain object-left"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p
                className="text-[11px] leading-relaxed max-w-sm"
                style={{
                  color: getEffectiveFooterBg() === '#FFFFFF' ? '#57534E' : '#D6D3D1',
                }}
              >
                Bio-compatible dermatological skincare designed to restore, replenish, and protect the cellular barrier.
              </p>
            </div>
          </div>

          {/* Upload Button + Presets */}
          <div className="space-y-3">
            <label className="block text-xs font-mono text-[#E8E2D5]/70">
              Upload New Footer Logo File:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={footerFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'footer');
                }}
              />
              <button
                type="button"
                onClick={() => footerFileInputRef.current?.click()}
                disabled={isUploadingFooter}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#E5B85C]/50 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploadingFooter ? (
                  <RefreshCw size={15} className="animate-spin text-[#E5B85C]" />
                ) : (
                  <Upload size={15} className="text-[#E5B85C]" />
                )}
                <span>{isUploadingFooter ? 'Uploading Logo...' : 'Choose File to Upload'}</span>
              </button>
            </div>

            {/* Logo URL Input */}
            <div>
              <span className="text-[11px] font-mono text-[#E8E2D5]/60 block mb-1">
                Or direct image path:
              </span>
              <input
                type="text"
                value={footerLogo}
                onChange={(e) => {
                  setFooterLogo(e.target.value);
                  commitChanges({ footerLogoUrl: e.target.value });
                }}
                placeholder="/images/logos/..."
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:border-[#E5B85C] outline-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-mono text-[#E8E2D5]/60 self-center">Quick Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setFooterLogo('/images/logos/logo_sample1_black.png');
                  setFooterBgMode('black');
                  commitChanges({
                    footerLogoUrl: '/images/logos/logo_sample1_black.png',
                    footerBgMode: 'black',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-[#E8E2D5] cursor-pointer"
              >
                Sample 1 (Pure Black)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFooterLogo('/images/logos/logo_sample1_transparent.png');
                  setFooterBgMode('black');
                  commitChanges({
                    footerLogoUrl: '/images/logos/logo_sample1_transparent.png',
                    footerBgMode: 'black',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#E5B85C]/10 hover:bg-[#E5B85C]/20 border border-[#E5B85C]/30 text-[10px] font-mono text-[#E5B85C] cursor-pointer"
              >
                Sample 1 (Transparent ✨)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFooterLogo('/images/logos/logo_sample2_white.png');
                  setFooterBgMode('white');
                  commitChanges({
                    footerLogoUrl: '/images/logos/logo_sample2_white.png',
                    footerBgMode: 'white',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-[#E8E2D5] cursor-pointer"
              >
                Sample 2 (Trimmed White)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFooterLogo('/images/logos/logo_sample2_transparent.png');
                  setFooterBgMode('white');
                  commitChanges({
                    footerLogoUrl: '/images/logos/logo_sample2_transparent.png',
                    footerBgMode: 'white',
                  });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#E5B85C]/10 hover:bg-[#E5B85C]/20 border border-[#E5B85C]/30 text-[10px] font-mono text-[#E5B85C] cursor-pointer"
              >
                Sample 2 (Transparent ✨)
              </button>
            </div>
          </div>

          {/* Height Slider */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#E8E2D5]/80 flex items-center gap-1.5">
                <Sliders size={13} className="text-[#E5B85C]" />
                <span>Footer Logo Height</span>
              </span>
              <span className="text-[#E5B85C] font-bold">{footerHeight} px</span>
            </div>
            <input
              type="range"
              min={36}
              max={100}
              step={2}
              value={footerHeight}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFooterHeight(val);
                commitChanges({ footerLogoHeight: val });
              }}
              className="w-full accent-[#E5B85C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#E8E2D5]/50">
              <span>Compact (36px)</span>
              <span>Default (60px)</span>
              <span>Grand (100px)</span>
            </div>
          </div>

          {/* Background Color Matching */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-xs font-mono text-[#E8E2D5]/80 flex items-center gap-1.5">
              <Palette size={13} className="text-[#E5B85C]" />
              <span>Footer Background Match:</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFooterBgMode('black');
                  commitChanges({ footerBgMode: 'black' });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  footerBgMode === 'black'
                    ? 'bg-black text-[#E5B85C] border-[#E5B85C] shadow'
                    : 'bg-white/5 text-[#E8E2D5] border-white/10'
                }`}
              >
                {footerBgMode === 'black' && <Check size={12} />}
                <span>Black (#000)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFooterBgMode('white');
                  commitChanges({ footerBgMode: 'white' });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  footerBgMode === 'white'
                    ? 'bg-white text-[#1C1917] border-white shadow'
                    : 'bg-white/5 text-[#E8E2D5] border-white/10'
                }`}
              >
                {footerBgMode === 'white' && <Check size={12} />}
                <span>White (#FFF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFooterBgMode('custom');
                  commitChanges({ footerBgMode: 'custom' });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  footerBgMode === 'custom'
                    ? 'bg-[#E5B85C] text-[#1C1917] border-[#E5B85C]'
                    : 'bg-white/5 text-[#E8E2D5] border-white/10'
                }`}
              >
                {footerBgMode === 'custom' && <Check size={12} />}
                <span>Custom Hex</span>
              </button>
            </div>

            {footerBgMode === 'custom' && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={footerBgCustom}
                  onChange={(e) => {
                    setFooterBgCustom(e.target.value);
                    commitChanges({ footerBgCustom: e.target.value });
                  }}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={footerBgCustom}
                  onChange={(e) => {
                    setFooterBgCustom(e.target.value);
                    commitChanges({ footerBgCustom: e.target.value });
                  }}
                  className="flex-1 bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Storefront Preview Shortcut */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Eye size={18} className="text-[#E5B85C]" />
          <div>
            <h4 className="text-sm font-bold text-white">Preview Changes on Storefront</h4>
            <p className="text-xs text-[#E8E2D5]/70">
              Changes saved here reflect live on the homepage header and footer immediately.
            </p>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF8F5] text-xs font-mono font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <span>Open Live Homepage</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
