'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Film,
  ImageIcon,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Plus
} from 'lucide-react';
import { MediaAsset } from '@/lib/admin-store';

interface MediaLibraryManagerProps {
  onSelectMedia?: (asset: MediaAsset) => void;
  selectionMode?: boolean;
}

export default function MediaLibraryManager({
  onSelectMedia,
  selectionMode = false
}: MediaLibraryManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<'hero' | 'product' | 'campaign' | 'brand'>('product');
  const [uploadAlt, setUploadAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin?resource=media-library');
      const data = await res.json();
      if (data.mediaAssets) {
        setAssets(data.mediaAssets);
      }
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append('file', file);
        data.append('category', uploadCategory);
        data.append('altText', uploadAlt || file.name.replace(/\.[^/.]+$/, ''));

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data
        });
        const json = await res.json();
        if (!json.success) {
          alert(`Upload failed for ${file.name}: ${json.error}`);
        }
      }
      setUploadAlt('');
      await fetchAssets();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this media asset?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_MEDIA_ASSET',
          payload: { id }
        })
      });
      const data = await res.json();
      if (data.success && data.mediaAssets) {
        setAssets(data.mediaAssets);
      }
    } catch (err) {
      console.error('Failed to delete asset:', err);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.altText && asset.altText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      categoryFilter === 'ALL' || asset.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E5B85C]/20 text-[#E5B85C] border border-[#E5B85C]/30">
              <HardDrive size={18} />
            </span>
            <h2 className="text-xl font-bold text-white">Centralized Media Storage</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store and retrieve optimized WebP, AVIF, and MP4 assets. Files are served directly from file storage with metadata tracked in PostgreSQL.
          </p>
        </div>

        <button
          onClick={fetchAssets}
          className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 transition"
          title="Refresh Assets"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Upload Dropzone & Controls */}
      <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Upload size={15} className="text-[#E5B85C]" />
            <span>Upload New High-Res Assets</span>
          </h3>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Target Category:</span>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as any)}
              className="bg-[#0B1120] border border-[#1E293B] rounded-lg px-2.5 py-1 text-white focus:border-[#E5B85C] outline-none"
            >
              <option value="product">Product Gallery</option>
              <option value="hero">Hero Media</option>
              <option value="campaign">Campaigns</option>
              <option value="brand">Brand Assets</option>
            </select>
          </div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#1E293B] hover:border-[#E5B85C]/60 rounded-2xl p-8 text-center cursor-pointer transition bg-[#0B1120]/40 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <div className="w-12 h-12 rounded-2xl bg-[#E5B85C]/10 border border-[#E5B85C]/30 text-[#E5B85C] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
            <Upload size={20} />
          </div>
          <p className="text-sm font-bold text-white mb-1">
            {uploading ? 'Uploading and Optimizing Assets...' : 'Click to Upload or Drag & Drop Media'}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Supports WebP, AVIF, PNG, JPG, MP4, WebM (up to 50MB per file)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name or alt tag..."
            className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-[#E5B85C] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-mono">
          {['ALL', 'product', 'hero', 'campaign', 'brand'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl uppercase tracking-wider transition ${
                categoryFilter === cat
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold'
                  : 'bg-[#131B2E] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Media Assets */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          Loading media library...
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#131B2E] border border-[#1E293B] text-slate-400 font-mono text-xs">
          No media files match your query. Upload new files above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isVideo = asset.mimeType.startsWith('video');

            return (
              <div
                key={asset.id}
                className="group bg-[#131B2E] border border-[#1E293B] hover:border-[#E5B85C]/50 rounded-2xl overflow-hidden transition flex flex-col justify-between"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-square w-full bg-[#0B1120] overflow-hidden">
                  {isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2">
                      <Film size={28} className="text-[#E5B85C] mb-2" />
                      <span className="text-[10px] font-mono uppercase bg-black/60 px-2 py-0.5 rounded">
                        Video
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={asset.url}
                      alt={asset.altText || asset.filename}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  )}

                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#E5B85C] uppercase tracking-wider backdrop-blur-xs">
                    {asset.category}
                  </span>

                  {/* Quick Copy Link Button */}
                  <button
                    onClick={() => handleCopyUrl(asset.url, asset.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-[#E5B85C] hover:text-[#0A0F1D] text-white transition backdrop-blur-xs cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>

                {/* Metadata details */}
                <div className="p-3 text-xs flex flex-col justify-between grow">
                  <div>
                    <p className="font-bold text-white truncate text-[11px]" title={asset.filename}>
                      {asset.filename}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                      {asset.altText || 'No alt description'}
                    </p>
                    <div className="mt-2 text-[9px] font-mono text-slate-500 flex items-center justify-between">
                      <span>{(((asset.fileSize || asset.sizeBytes || 0)) / 1024).toFixed(0)} KB</span>
                      {asset.width && asset.height && (
                        <span>
                          {asset.width}x{asset.height}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-3 pt-2 border-t border-[#1E293B] flex items-center justify-between">
                    {selectionMode ? (
                      <button
                        onClick={() => onSelectMedia?.(asset)}
                        className="w-full py-1 rounded-lg bg-[#E5B85C] text-[#0A0F1D] text-[10px] font-bold uppercase tracking-wider"
                      >
                        Select
                      </button>
                    ) : (
                      <>
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <ExternalLink size={10} />
                          <span>View</span>
                        </a>

                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete file"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
