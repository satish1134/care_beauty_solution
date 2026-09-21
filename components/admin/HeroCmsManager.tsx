'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Save,
  CheckCircle2,
  Upload,
  Layers,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  Video,
  ImageIcon,
  Move,
  GripVertical
} from 'lucide-react';
import { HeroCmsConfig } from '@/lib/admin-store';

interface HeroCmsManagerProps {
  heroCms: HeroCmsConfig;
  onSave: (updated: HeroCmsConfig) => Promise<void>;
}

export default function HeroCmsManager({ heroCms: initialData, onSave }: HeroCmsManagerProps) {
  const [formData, setFormData] = useState<HeroCmsConfig>({ ...initialData });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const handleTextChange = (field: keyof HeroCmsConfig, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'desktopVideoUrl' | 'mobileVideoUrl' | 'heroImageUrl' | 'posterUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(targetField);
      const data = new FormData();
      data.append('file', file);
      data.append('category', 'hero');
      data.append('altText', formData.campaignName || 'Hero Media');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, [targetField]: result.url }));
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload error');
    } finally {
      setUploading(null);
    }
  };

  const handleProofPointChange = (index: number, key: 'label' | 'sublabel', val: string) => {
    const updated = [...(formData.proofPoints || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [key]: val };
      setFormData((prev) => ({ ...prev, proofPoints: updated }));
    }
  };

  const handleAddProofPoint = () => {
    setFormData((prev) => ({
      ...prev,
      proofPoints: [...(prev.proofPoints || []), { label: 'NEW STAT', sublabel: 'Clinical metric' }]
    }));
  };

  const handleRemoveProofPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      proofPoints: (prev.proofPoints || []).filter((_, i) => i !== index)
    }));
  };

  const handleFocalPointClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setFormData((prev) => ({ ...prev, focalPoint: { x, y } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5B85C]/20 text-[#E5B85C] border border-[#E5B85C]/30">
              <Layers size={18} />
            </span>
            <h2 className="text-xl font-bold text-white">Homepage Hero & Section CMS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure live headlines, responsive video/image assets, CTAs, proof points, and campaign versions without source code edits.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-200 text-xs font-mono transition flex items-center justify-center gap-2"
          >
            <Eye size={14} />
            <span>Preview Storefront</span>
            <ExternalLink size={12} className="text-slate-400" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#E5B85C] hover:bg-[#F3CA74] text-[#0A0F1D] text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <span className="animate-pulse">Publishing...</span>
            ) : (
              <>
                <Save size={15} />
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Changes Published Successfully!</span> The live homepage has been updated instantly.
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. CAMPAIGN METADATA & STATUS */}
        <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              1. Campaign Release & Publishing Status
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Status:</span>
              <button
                type="button"
                onClick={() =>
                  handleTextChange('status', formData.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')
                }
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition cursor-pointer ${
                  formData.status === 'PUBLISHED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {formData.status || 'PUBLISHED'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Campaign Name / ID
              </label>
              <input
                type="text"
                value={formData.campaignName || ''}
                onChange={(e) => handleTextChange('campaignName', e.target.value)}
                placeholder="e.g. Monsoon Sacred Ritual 2026"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Top Eyebrow Badge
              </label>
              <input
                type="text"
                value={formData.eyebrow || ''}
                onChange={(e) => handleTextChange('eyebrow', e.target.value)}
                placeholder="e.g. CLINICALLY ENGINEERED SKINCARE"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. EDITORIAL HEADLINE & COPY */}
        <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            2. Editorial Headlines & Copywriting
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Headline Primary (Bold Sans)
              </label>
              <input
                type="text"
                value={formData.headlineMain || ''}
                onChange={(e) => handleTextChange('headlineMain', e.target.value)}
                placeholder="e.g. Skin Health Reimagined,"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none text-base"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Renders in crisp white font</span>
            </div>

            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Headline Highlight (Golden Serif Italic)
              </label>
              <input
                type="text"
                value={formData.headlineHighlight || ''}
                onChange={(e) => handleTextChange('headlineHighlight', e.target.value)}
                placeholder="e.g. Naturally Pure."
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-[#E5B85C] focus:border-[#E5B85C] outline-none text-base font-serif italic"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Renders with warm golden glow shadow</span>
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-mono uppercase text-slate-400 mb-1">
              Supporting Editorial Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => handleTextChange('description', e.target.value)}
              placeholder="Detailed formulation science message..."
              className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* 3. CALL TO ACTION (CTA) BUTTONS */}
        <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            3. Call to Action (CTA) Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={formData.primaryCtaLabel || ''}
                onChange={(e) => handleTextChange('primaryCtaLabel', e.target.value)}
                placeholder="e.g. Build Custom Routine"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Primary CTA Action Mode
              </label>
              <select
                value={formData.primaryCtaAction || 'routine_modal'}
                onChange={(e) => handleTextChange('primaryCtaAction', e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
              >
                <option value="routine_modal">Open Routine Builder Modal</option>
                <option value="scroll_to_products">Scroll to Products (#products)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Primary CTA Target URL (Optional)
              </label>
              <input
                type="text"
                value={formData.primaryCtaUrl || '#products'}
                onChange={(e) => handleTextChange('primaryCtaUrl', e.target.value)}
                placeholder="#products"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-[#1E293B]">
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={formData.secondaryCtaLabel || ''}
                onChange={(e) => handleTextChange('secondaryCtaLabel', e.target.value)}
                placeholder="e.g. Explore The Science"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1">
                Secondary Button Target Anchor / URL
              </label>
              <input
                type="text"
                value={formData.secondaryCtaUrl || formData.secondaryCtaLink || '#clinical-evidence'}
                onChange={(e) => {
                  handleTextChange('secondaryCtaUrl', e.target.value);
                  handleTextChange('secondaryCtaLink', e.target.value);
                }}
                placeholder="#clinical-evidence"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 4. RESPONSIVE HERO MEDIA & FOCAL POINT CALIBRATION */}
        <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              4. Responsive Hero Media & Focal Calibration
            </h3>
            <div className="flex items-center gap-2 bg-[#0B1120] p-1 rounded-xl border border-[#1E293B] text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  handleTextChange('desktopMediaType', 'video');
                  handleTextChange('mediaType', 'video');
                }}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  formData.desktopMediaType !== 'image'
                    ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video size={13} />
                <span>Video Mode</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleTextChange('desktopMediaType', 'image');
                  handleTextChange('mediaType', 'image');
                }}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  formData.desktopMediaType === 'image'
                    ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon size={13} />
                <span>High-Res Image Mode</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Left Media Controls */}
            <div className="space-y-4">
              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Desktop Video Source (MP4 / WebM)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.desktopVideoUrl || ''}
                    onChange={(e) => handleTextChange('desktopVideoUrl', e.target.value)}
                    placeholder="/videos/barrier-hero-desktop.mp4 or URL"
                    className="flex-1 bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-200 cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                    <Upload size={12} />
                    <span>{uploading === 'desktopVideoUrl' ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'desktopVideoUrl')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Mobile Optimized Video Source
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.mobileVideoUrl || ''}
                    onChange={(e) => handleTextChange('mobileVideoUrl', e.target.value)}
                    placeholder="/videos/barrier-hero-mobile.mp4 or URL"
                    className="flex-1 bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-200 cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                    <Upload size={12} />
                    <span>{uploading === 'mobileVideoUrl' ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'mobileVideoUrl')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Poster / Fallback Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.posterUrl || formData.heroImageUrl || ''}
                    onChange={(e) => {
                      handleTextChange('posterUrl', e.target.value);
                      handleTextChange('heroImageUrl', e.target.value);
                    }}
                    placeholder="e.g. /images/hero-poster.jpg"
                    className="flex-1 bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-200 cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                    <Upload size={12} />
                    <span>{uploading === 'posterUrl' ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'posterUrl')}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1120] border border-[#1E293B]">
                <div className="text-slate-400 font-mono text-[11px]">
                  Focal Point Coordinates:
                  <span className="text-[#E5B85C] font-bold ml-2">
                    X: {formData.focalPoint?.x ?? 50}% · Y: {formData.focalPoint?.y ?? 50}%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, focalPoint: { x: 50, y: 50 } }))}
                  className="text-[10px] text-slate-400 hover:text-white uppercase font-mono"
                >
                  Reset (Center)
                </button>
              </div>
            </div>

            {/* Right: Interactive Focal Point Target */}
            <div className="space-y-2">
              <label className="block font-mono uppercase text-slate-400">
                Focal Point Picker (Click image to align crop)
              </label>
              <div
                onClick={handleFocalPointClick}
                className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E5B85C]/40 bg-black cursor-crosshair group shadow-inner"
              >
                {formData.posterUrl || formData.heroImageUrl ? (
                  <Image
                    src={formData.posterUrl || formData.heroImageUrl || ''}
                    alt="Hero Visual Preview"
                    fill
                    className="object-cover pointer-events-none"
                    style={{
                      objectPosition: `${formData.focalPoint?.x ?? 50}% ${formData.focalPoint?.y ?? 50}%`
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                    No image URL specified
                  </div>
                )}

                {/* Crosshair indicator */}
                <div
                  className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-[#E5B85C] bg-[#E5B85C]/30 shadow-[0_0_10px_rgba(229,184,92,0.8)] pointer-events-none transition-all duration-75 flex items-center justify-center"
                  style={{
                    left: `${formData.focalPoint?.x ?? 50}%`,
                    top: `${formData.focalPoint?.y ?? 50}%`
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#E5B85C] pointer-events-none">
                  Click to re-position focal center
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. CLINICAL PROOF POINTS STRIP */}
        <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              5. Clinical Proof Points (4 Metrics)
            </h3>
            <button
              type="button"
              onClick={handleAddProofPoint}
              className="px-3 py-1 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {(formData.proofPoints || []).map((pt, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#0B1120] border border-[#1E293B]"
              >
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={pt.label}
                    onChange={(e) => handleProofPointChange(idx, 'label', e.target.value)}
                    placeholder="e.g. 98% BARRIER"
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-lg px-2.5 py-1 text-[#E5B85C] font-mono font-bold text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={pt.sublabel}
                    onChange={(e) => handleProofPointChange(idx, 'sublabel', e.target.value)}
                    placeholder="e.g. In Vivo Corneometer"
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-lg px-2.5 py-1 text-slate-300 text-[11px] outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProofPoint(idx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-[#E5B85C] hover:bg-[#F3CA74] text-[#0A0F1D] font-bold text-xs uppercase tracking-widest transition shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Publishing Updates...' : 'Publish Hero CMS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
