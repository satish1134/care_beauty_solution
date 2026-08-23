import React, { useState, useRef } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Cloud,
  Loader2,
} from 'lucide-react';
import { Product, Category } from '../../types';
import { BulkProductEditor } from './BulkProductEditor';
import { uploadImageToCloudinary } from '../../lib/cloudinaryClient';

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
  isDarkMode?: boolean;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  categories,
  onRefreshData,
  isDarkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CATALOG' | 'BULK_EDIT'>('CATALOG');

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('/images/care-hydrating-moisturizer.svg');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadSuccessInfo, setUploadSuccessInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [variantName, setVariantName] = useState('50 ml Tube');
  const [variantPrice, setVariantPrice] = useState('599');
  const [variantComparePrice, setVariantComparePrice] = useState('799');
  const [variantStock, setVariantStock] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingImage(true);
    setUploadSuccessInfo(null);
    setFeedbackMsg(null);

    try {
      const result = await uploadImageToCloudinary(file, 'care_beauty_products');
      if (result && result.url) {
        setImageUrl(result.url);
        setUploadSuccessInfo(result.publicId ? `Hosted on Cloudinary CDN (${result.format?.toUpperCase() || 'WebP'})` : 'Uploaded to CDN');
      }
    } catch (err: any) {
      console.error('[IMAGE UPLOAD FAILED]', err);
      setFeedbackMsg({
        type: 'error',
        message: err.message || 'Image upload failed. Check Cloudinary settings.',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'ALL' || p.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setModalMode('CREATE');
    setSelectedProduct(null);
    setName('');
    setTagline('Dermatologist Formulated Moisture Barrier Protection');
    setDescription('Clinical-grade ceramide formula engineered for maximum moisture retention.');
    setCategoryId(categories[0]?.id || '');
    setImageUrl('/images/care-hydrating-moisturizer.svg');
    setVariantName('50 ml Tube');
    setVariantPrice('599');
    setVariantComparePrice('799');
    setVariantStock('50');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode('EDIT');
    setSelectedProduct(product);
    setName(product.name);
    setTagline(product.tagline || '');
    setDescription(product.description || '');
    setCategoryId(product.categoryId);
    setImageUrl(product.images[0]?.url || '/images/care-hydrating-moisturizer.svg');
    const firstVar = product.variants[0];
    if (firstVar) {
      setVariantName(firstVar.name);
      setVariantPrice(firstVar.price.toString());
      setVariantComparePrice(firstVar.compareAtPrice?.toString() || '');
      setVariantStock(firstVar.stock.toString());
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      const payload = {
        name,
        tagline,
        description,
        categoryId,
        imageUrl,
        variantName,
        price: parseFloat(variantPrice),
        compareAtPrice: variantComparePrice ? parseFloat(variantComparePrice) : null,
        stock: parseInt(variantStock, 10),
      };

      const url = modalMode === 'CREATE' ? '/api/products' : `/api/products/${selectedProduct?.id}`;
      const method = modalMode === 'CREATE' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg({
          type: 'success',
          message: modalMode === 'CREATE' ? 'Formulation added successfully!' : 'Product updated successfully!',
        });
        setTimeout(() => {
          setIsModalOpen(false);
          onRefreshData();
        }, 800);
      } else {
        setFeedbackMsg({ type: 'error', message: data.message || 'Failed to save product.' });
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', message: 'Server communication error while saving.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) return;

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    }
  };

  if (viewMode === 'BULK_EDIT') {
    return (
      <BulkProductEditor
        products={products}
        categories={categories}
        onRefreshData={onRefreshData}
        onClose={() => setViewMode('CATALOG')}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}>
        <div>
          <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>Formulations & SKU Catalog</h2>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>Manage active products, pricing tiers, and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('BULK_EDIT')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition-all shadow-sm ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border-amber-500/30'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Bulk Price & Stock Editor</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Formulation</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border ${cardBg}`}>
        <div className="relative flex-1">
          <Search className={`w-4 h-4 ${textMuted} absolute left-3.5 top-3`} />
          <input
            type="text"
            placeholder="Search products by name or slug..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isDarkMode
                ? 'bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400'
                : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-500'
            }`}
          />
        </div>
        <select
          value={selectedCategoryFilter}
          onChange={e => setSelectedCategoryFilter(e.target.value)}
          className={`rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            isDarkMode
              ? 'bg-slate-800 border border-slate-700 text-slate-100'
              : 'bg-slate-50 border border-slate-300 text-slate-900'
          }`}
        >
          <option value="ALL">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`font-mono text-xs font-bold uppercase tracking-wider border-b ${
                isDarkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-800'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <tr>
                <th className="py-4 px-6">Product & Image</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">SKUs & Pricing</th>
                <th className="py-4 px-4">Stock Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                const primaryImage = product.images[0]?.url || '/images/care-hydrating-moisturizer.svg';

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className={`w-12 h-12 rounded-xl object-contain p-1 border ${
                            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                          }`}
                        />
                        <div>
                          <div className={`font-bold text-sm ${textPrimary}`}>{product.name}</div>
                          <div className={`text-xs font-mono font-medium ${textMuted}`}>/{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {category?.name || 'Skincare'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {product.variants.map(v => (
                          <div key={v.id} className="flex items-center gap-2 text-xs font-mono">
                            <span className={textMuted}>{v.name}:</span>
                            <span className="font-bold text-amber-700 dark:text-amber-400">₹{v.price}</span>
                            {v.compareAtPrice && (
                              <span className={`line-through text-xs font-semibold ${textMuted}`}>₹{v.compareAtPrice}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {product.variants.map(v => (
                          <div key={v.id} className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                v.stock < 15 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                              }`}
                            ></span>
                            <span className={`font-mono text-xs font-bold ${textPrimary}`}>
                              {v.stock} units
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                        }`}
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`border w-full max-w-xl rounded-3xl p-6 space-y-5 relative shadow-2xl ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute right-5 top-5 p-2 rounded-xl transition ${
                isDarkMode ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className={`flex items-center gap-3 border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-xl font-bold font-serif ${textPrimary}`}>
                  {modalMode === 'CREATE' ? 'Add New Formulation' : 'Edit Product Formulation'}
                </h3>
                <p className={`text-xs font-medium ${textMuted}`}>Specify product name, category, pricing, and initial inventory.</p>
              </div>
            </div>

            {feedbackMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {feedbackMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>{feedbackMsg.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Hydrating Ceramide Barrier Cream"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-300 font-medium">Product Image Asset</label>
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <Cloud className="w-3 h-3" /> Cloudinary CDN Supported
                    </span>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        required
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://res.cloudinary.com/... or /images/..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />

                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Image Preview & Status */}
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700"
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/images/care-hydrating-moisturizer.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-slate-300 font-mono truncate">{imageUrl}</p>
                      <p className="text-[10px] text-slate-500 font-sans">
                        {uploadSuccessInfo || (imageUrl.includes('cloudinary.com') ? '⚡ Live on Cloudinary CDN' : 'Local or external image')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tagline / Key Claim</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. 72-Hour Ceramide Moisture Lock"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Primary Variant Fields */}
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="text-slate-300 font-bold text-xs uppercase tracking-wider">
                  Primary SKU Variant Configuration
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Variant Name</label>
                    <input
                      type="text"
                      required
                      value={variantName}
                      onChange={e => setVariantName(e.target.value)}
                      placeholder="50 ml Tube"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={variantPrice}
                      onChange={e => setVariantPrice(e.target.value)}
                      placeholder="599"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-amber-400 font-mono font-bold text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={variantStock}
                      onChange={e => setVariantStock(e.target.value)}
                      placeholder="50"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-emerald-400 font-mono font-bold text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-lg shadow-amber-500/20"
                >
                  {isSubmitting ? 'Saving...' : modalMode === 'CREATE' ? 'Add to Catalog' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
