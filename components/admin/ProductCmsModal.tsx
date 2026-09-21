'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Star,
  Upload,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Save,
  Check,
  Move,
  Tag,
  ShoppingBag
} from 'lucide-react';
import { AdminProduct, AdminProductImage } from '@/lib/admin-store';

interface ProductCmsModalProps {
  product: AdminProduct;
  onClose: () => void;
  onSave: (updated: AdminProduct) => Promise<void>;
}

export default function ProductCmsModal({
  product: initialProduct,
  onClose,
  onSave
}: ProductCmsModalProps) {
  const [product, setProduct] = useState<AdminProduct>({
    ...initialProduct,
    images: initialProduct.images || [],
    bestFor: initialProduct.bestFor || [],
    keyBenefits: initialProduct.keyBenefits || [],
    heroIngredients: initialProduct.heroIngredients || []
  });

  const [activeSubTab, setActiveSubTab] = useState<'content' | 'gallery' | 'pricing' | 'lists'>('content');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [newIngredientInput, setNewIngredientInput] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Update text field
  const handleChange = (field: keyof AdminProduct, value: unknown) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  // Upload image to gallery
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('category', 'product');
      data.append('altText', product.title);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success && result.url) {
        const newImg: AdminProductImage = {
          id: `img-${Date.now()}`,
          url: result.url,
          label: `${product.title} Gallery`,
          type: 'bottle',
          caption: '',
          alt: product.title,
          isPrimary: (product.images || []).length === 0,
          focalPoint: { x: 50, y: 50 }
        };
        setProduct((prev) => ({
          ...prev,
          images: [...(prev.images || []), newImg]
        }));
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const newImg: AdminProductImage = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      label: 'Gallery View',
      alt: product.title,
      isPrimary: (product.images || []).length === 0,
      focalPoint: { x: 50, y: 50 }
    };
    setProduct((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImg]
    }));
    setNewImageUrl('');
  };

  // Set primary image
  const handleSetPrimaryImage = (index: number) => {
    const updated = (product.images || []).map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setProduct((prev) => ({ ...prev, images: updated }));
  };

  // Delete image
  const handleDeleteImage = (index: number) => {
    const updated = (product.images || []).filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setProduct((prev) => ({ ...prev, images: updated }));
  };

  // Move image order
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const list = [...(product.images || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setProduct((prev) => ({ ...prev, images: list }));
  };

  // Update focal point on image click
  const handleFocalPointClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    const updated = [...(product.images || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], focalPoint: { x, y } };
      setProduct((prev) => ({ ...prev, images: updated }));
    }
  };

  // Save handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(product);
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl bg-[#131B2E] border border-[#1E293B] rounded-3xl shadow-2xl text-white my-auto flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between shrink-0 bg-[#0F172A]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#E5B85C]/20 text-[#E5B85C] border border-[#E5B85C]/30 text-[10px] font-mono uppercase font-bold">
                {product.category}
              </span>
              <h3 className="font-bold text-base text-white">{product.title}</h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-6 py-2 border-b border-[#1E293B] flex items-center gap-2 bg-[#0B1120] shrink-0 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('content')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'content'
                ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Basic & Editorial Content
          </button>
          <button
            onClick={() => setActiveSubTab('gallery')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeSubTab === 'gallery'
                ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>2. Gallery & Media ({product.images?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('lists')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'lists'
                ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Benefits, Actives & Tags
          </button>
          <button
            onClick={() => setActiveSubTab('pricing')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'pricing'
                ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Pricing, Inventory & Channels
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs grow">
          {/* TAB 1: BASIC & EDITORIAL CONTENT */}
          {activeSubTab === 'content' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={product.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Subtitle / Formulation Spec
                  </label>
                  <input
                    type="text"
                    value={product.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    placeholder="e.g. 5 Ceramides + 2% Niacinamide"
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-slate-400 mb-1">
                  Homepage Editorial Description
                </label>
                <textarea
                  rows={4}
                  value={product.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">Volume / Size</label>
                  <input
                    type="text"
                    value={product.volume}
                    onChange={(e) => handleChange('volume', e.target.value)}
                    placeholder="e.g. 150ml"
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={product.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono"
                  >
                    <option value="cleanser">Cleanser</option>
                    <option value="moisturizer">Moisturizer</option>
                    <option value="sunscreen">Sunscreen</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">Publish Status</label>
                  <select
                    value={product.status || 'PUBLISHED'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono"
                  >
                    <option value="PUBLISHED">PUBLISHED (Visible)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Homepage Ordering Settings */}
              <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider font-mono text-xs">
                    Homepage Showcase Placement
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Controls whether this product appears on the homepage and its sorting sequence.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.isHomepageFeatured ?? product.featuredOnHomepage ?? true}
                      onChange={(e) => {
                        handleChange('isHomepageFeatured', e.target.checked);
                        handleChange('featuredOnHomepage', e.target.checked);
                        handleChange('showProduct', e.target.checked);
                      }}
                      className="rounded border-[#1E293B] text-[#E5B85C] focus:ring-0"
                    />
                    <span className="text-xs font-mono">Show on Homepage</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-xs">Sort Order:</span>
                    <input
                      type="number"
                      value={product.homepageOrder ?? product.homepagePosition ?? 1}
                      onChange={(e) => {
                        handleChange('homepageOrder', Number(e.target.value));
                        handleChange('homepagePosition', Number(e.target.value));
                      }}
                      className="w-16 bg-[#131B2E] border border-[#1E293B] rounded-lg px-2 py-1 text-center font-mono text-white text-xs"
                      min={1}
                      max={99}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY & 10+ IMAGES WITH FOCAL POINTS */}
          {activeSubTab === 'gallery' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B1120] border border-[#1E293B]">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider font-mono text-xs">
                    Product Image Gallery ({product.images?.length || 0} Assets)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports 10+ high-resolution product photos. Drag or click arrows to reorder. Click thumbnail to calibrate focal point.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#E5B85C] hover:bg-[#F3CA74] text-[#0A0F1D] font-bold text-xs uppercase tracking-wider cursor-pointer transition flex items-center justify-center gap-1.5 shadow-md">
                    <Upload size={13} />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadImage}
                    />
                  </label>
                </div>
              </div>

              {/* Add by URL option */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Or paste external image URL (e.g. /images/products/bottle.jpg)..."
                  className="flex-1 bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2 text-white focus:border-[#E5B85C] outline-none font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-200 text-xs font-mono transition"
                >
                  Add URL
                </button>
              </div>

              {/* Grid of gallery images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(product.images || []).map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className={`bg-[#0B1120] border rounded-2xl p-3 flex flex-col justify-between transition ${
                      img.isPrimary ? 'border-[#E5B85C] shadow-lg shadow-[#E5B85C]/10' : 'border-[#1E293B]'
                    }`}
                  >
                    <div>
                      {/* Image Thumbnail with Interactive Focal Point */}
                      <div
                        onClick={(e) => handleFocalPointClick(idx, e)}
                        className="relative aspect-square w-full rounded-xl overflow-hidden bg-black cursor-crosshair group mb-2.5"
                        title="Click to set focal point"
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || product.title}
                          fill
                          className="object-cover"
                          style={{
                            objectPosition: `${img.focalPoint?.x ?? 50}% ${img.focalPoint?.y ?? 50}%`
                          }}
                        />

                        {/* Primary Badge */}
                        {img.isPrimary && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#E5B85C] text-[#0A0F1D] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Star size={10} className="fill-current" />
                            <span>Primary Image</span>
                          </div>
                        )}

                        {/* Crosshair indicator */}
                        <div
                          className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-[#E5B85C] bg-[#E5B85C]/40 pointer-events-none"
                          style={{
                            left: `${img.focalPoint?.x ?? 50}%`,
                            top: `${img.focalPoint?.y ?? 50}%`
                          }}
                        />
                      </div>

                      {/* Image metadata inputs */}
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={img.label || ''}
                          onChange={(e) => {
                            const updated = [...(product.images || [])];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setProduct({ ...product, images: updated });
                          }}
                          placeholder="Image label (e.g. Bottle, Texture)"
                          className="w-full bg-[#131B2E] border border-[#1E293B] rounded-lg px-2.5 py-1 text-white text-[11px] outline-none"
                        />
                        <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                          <span>
                            Focal: {img.focalPoint?.x ?? 50}%, {img.focalPoint?.y ?? 50}%
                          </span>
                          <span className="text-slate-500">#{idx + 1} of {product.images?.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image Controls: Reorder & Actions */}
                    <div className="mt-3 pt-2 border-t border-[#1E293B] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded bg-[#131B2E] hover:bg-[#1E293B] text-slate-300 disabled:opacity-30 transition"
                          title="Move earlier"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'down')}
                          disabled={idx === (product.images || []).length - 1}
                          className="p-1 rounded bg-[#131B2E] hover:bg-[#1E293B] text-slate-300 disabled:opacity-30 transition"
                          title="Move later"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="px-2 py-1 rounded bg-[#1E293B] hover:bg-[#E5B85C] hover:text-[#0A0F1D] text-[10px] font-mono text-slate-300 transition"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete image"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LISTS (BENEFITS, ACTIVES, BEST FOR) */}
          {activeSubTab === 'lists' && (
            <div className="space-y-6">
              {/* Key Benefits */}
              <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider font-mono text-xs">
                  Key Benefits Bullet Points
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefitInput}
                    onChange={(e) => setNewBenefitInput(e.target.value)}
                    placeholder="e.g. 72-Hour continuous hydration locking"
                    className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-3 py-2 text-white outline-none text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newBenefitInput.trim()) {
                          setProduct({
                            ...product,
                            keyBenefits: [...(product.keyBenefits || []), newBenefitInput.trim()]
                          });
                          setNewBenefitInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newBenefitInput.trim()) {
                        setProduct({
                          ...product,
                          keyBenefits: [...(product.keyBenefits || []), newBenefitInput.trim()]
                        });
                        setNewBenefitInput('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E5B85C] text-[#0A0F1D] font-bold font-mono text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(product.keyBenefits || []).map((ben, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#131B2E] border border-[#1E293B] text-slate-300 text-xs"
                    >
                      <span>• {ben}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (product.keyBenefits || []).filter((_, i) => i !== idx);
                          setProduct({ ...product, keyBenefits: updated });
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Ingredients */}
              <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider font-mono text-xs">
                  Hero Actives & Formulations
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIngredientInput}
                    onChange={(e) => setNewIngredientInput(e.target.value)}
                    placeholder="e.g. 5 Skin-Identical Ceramides"
                    className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-3 py-2 text-white outline-none text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newIngredientInput.trim()) {
                          setProduct({
                            ...product,
                            heroIngredients: [...(product.heroIngredients || []), newIngredientInput.trim()]
                          });
                          setNewIngredientInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newIngredientInput.trim()) {
                        setProduct({
                          ...product,
                          heroIngredients: [...(product.heroIngredients || []), newIngredientInput.trim()]
                        });
                        setNewIngredientInput('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E5B85C] text-[#0A0F1D] font-bold font-mono text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(product.heroIngredients || []).map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131B2E] border border-[#1E293B] text-[#E5B85C] font-mono text-xs"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (product.heroIngredients || []).filter((_, i) => i !== idx);
                          setProduct({ ...product, heroIngredients: updated });
                        }}
                        className="text-slate-400 hover:text-rose-400 ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best For Tags */}
              <div className="bg-[#0B1120] border border-[#1E293B] rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider font-mono text-xs">
                  Skin Target / Best For Tags
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="e.g. Compromised Skin Barrier, Dry Flaky Skin"
                    className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-3 py-2 text-white outline-none text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newTagInput.trim()) {
                          setProduct({
                            ...product,
                            bestFor: [...(product.bestFor || []), newTagInput.trim()]
                          });
                          setNewTagInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTagInput.trim()) {
                        setProduct({
                          ...product,
                          bestFor: [...(product.bestFor || []), newTagInput.trim()]
                        });
                        setNewTagInput('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E5B85C] text-[#0A0F1D] font-bold font-mono text-xs"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(product.bestFor || []).map((tag, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131B2E] border border-[#1E293B] text-slate-300 font-mono text-xs"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (product.bestFor || []).filter((_, i) => i !== idx);
                          setProduct({ ...product, bestFor: updated });
                        }}
                        className="text-slate-500 hover:text-rose-400 ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING, INVENTORY & CHANNELS */}
          {activeSubTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Direct Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => handleChange('price', Number(e.target.value))}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono text-base font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Compare At Price (₹)
                  </label>
                  <input
                    type="number"
                    value={product.compareAtPrice || ''}
                    onChange={(e) => handleChange('compareAtPrice', Number(e.target.value))}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Live Physical Stock
                  </label>
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => handleChange('stock', Number(e.target.value))}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={product.lowStockThreshold}
                    onChange={(e) => handleChange('lowStockThreshold', Number(e.target.value))}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white focus:border-[#E5B85C] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E293B] space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider font-mono text-xs">
                  Omnichannel Marketplace Redirects
                </h4>
                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Amazon Marketplace URL
                  </label>
                  <input
                    type="text"
                    value={product.marketplaceUrls?.amazon || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        marketplaceUrls: { ...product.marketplaceUrls, amazon: e.target.value }
                      })
                    }
                    placeholder="https://amazon.in/dp/..."
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">
                    Nykaa Marketplace URL
                  </label>
                  <input
                    type="text"
                    value={product.marketplaceUrls?.nykaa || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        marketplaceUrls: { ...product.marketplaceUrls, nykaa: e.target.value }
                      })
                    }
                    placeholder="https://nykaa.com/..."
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white focus:border-[#E5B85C] outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] flex items-center justify-between shrink-0 bg-[#0F172A]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1E293B] text-xs font-mono text-slate-300 hover:bg-[#334155] transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#E5B85C] hover:bg-[#F3CA74] text-[#0A0F1D] text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Product Changes'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
