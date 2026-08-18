import React, { useState } from 'react';
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
} from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductManagerProps {
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  categories,
  onRefreshData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

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
  const [variantName, setVariantName] = useState('50 ml Tube');
  const [variantPrice, setVariantPrice] = useState('599');
  const [variantComparePrice, setVariantComparePrice] = useState('799');
  const [variantStock, setVariantStock] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Formulations & SKU Catalog</h2>
          <p className="text-slate-400 text-xs mt-1">Manage active products, pricing tiers, and stock levels.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Formulation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search products by name or slug..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={selectedCategoryFilter}
          onChange={e => setSelectedCategoryFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
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
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Product & Image</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKUs & Pricing</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                const primaryImage = product.images[0]?.url || '/images/care-hydrating-moisturizer.svg';

                return (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-contain bg-slate-800 p-1 border border-slate-700/60"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{product.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">/{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-emerald-400">
                      {category?.name || 'Skincare'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {product.variants.map(v => (
                          <div key={v.id} className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-slate-400">{v.name}:</span>
                            <span className="font-bold text-amber-400">₹{v.price}</span>
                            {v.compareAtPrice && (
                              <span className="line-through text-slate-500 text-[10px]">₹{v.compareAtPrice}</span>
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
                              className={`w-2 h-2 rounded-full ${
                                v.stock < 15 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'
                              }`}
                            ></span>
                            <span className="font-mono text-xs font-semibold">
                              {v.stock} units
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl p-6 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {modalMode === 'CREATE' ? 'Add New Formulation' : 'Edit Product Formulation'}
                </h3>
                <p className="text-xs text-slate-400">Specify product name, category, pricing, and initial inventory.</p>
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
                  <label className="block text-slate-300 font-medium mb-1">SVG Image Asset URL</label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="/images/care-hydrating-moisturizer.svg"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  />
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
