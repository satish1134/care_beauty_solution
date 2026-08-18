import React, { useState, useEffect } from 'react';
import {
  Layers,
  Save,
  RotateCcw,
  Search,
  Filter,
  CheckSquare,
  Square,
  TrendingDown,
  TrendingUp,
  PackageCheck,
  AlertTriangle,
  Sparkles,
  DollarSign,
  Package,
  CheckCircle2,
  X,
  HelpCircle,
} from 'lucide-react';
import { Product, Category, ProductVariant } from '../../types';
import { safeFetchApi } from '../../utils/apiHelper';

interface BulkProductEditorProps {
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
  onClose?: () => void;
}

interface EditableVariantRow {
  productId: string;
  productName: string;
  categoryName: string;
  imageUrl: string;
  variantId: string;
  variantName: string;
  sku: string;
  originalPrice: number;
  originalComparePrice: number | undefined;
  originalStock: number;
  price: number;
  comparePrice: number | undefined;
  stock: number;
  isModified: boolean;
  isSelected: boolean;
}

export const BulkProductEditor: React.FC<BulkProductEditorProps> = ({
  products,
  categories,
  onRefreshData,
  onClose,
}) => {
  const [rows, setRows] = useState<EditableVariantRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Batch Operation Tool State
  const [batchPriceMode, setBatchPriceMode] = useState<'SET' | 'PERCENT_DISCOUNT' | 'PERCENT_MARKUP'>('SET');
  const [batchPriceValue, setBatchPriceValue] = useState<string>('');
  
  const [batchStockMode, setBatchStockMode] = useState<'SET' | 'ADD' | 'SUBTRACT'>('SET');
  const [batchStockValue, setBatchStockValue] = useState<string>('');

  // Initialize flat variant rows from products
  useEffect(() => {
    const flattened: EditableVariantRow[] = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        flattened.push({
          productId: p.id,
          productName: p.name,
          categoryName: p.categoryName || 'Skincare',
          imageUrl: p.images[0]?.url || '/images/care-hydrating-moisturizer.svg',
          variantId: v.id,
          variantName: v.name,
          sku: v.sku || `CBS-${p.slug.toUpperCase()}`,
          originalPrice: v.price,
          originalComparePrice: v.compareAtPrice,
          originalStock: v.stock,
          price: v.price,
          comparePrice: v.compareAtPrice,
          stock: v.stock,
          isModified: false,
          isSelected: false,
        });
      });
    });
    setRows(flattened);
  }, [products]);

  // Filtered rows
  const filteredRows = rows.filter(r => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.variantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' ||
      products.find(p => p.id === r.productId)?.categoryId === selectedCategory;
    const matchesStock =
      stockFilter === 'ALL'
        ? true
        : stockFilter === 'LOW_STOCK'
        ? r.stock > 0 && r.stock <= 15
        : r.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const selectedCount = rows.filter(r => r.isSelected).length;
  const modifiedCount = rows.filter(r => r.isModified).length;

  // Toggle Single Row Selection
  const handleToggleSelectRow = (variantId: string) => {
    setRows(prev =>
      prev.map(r => (r.variantId === variantId ? { ...r, isSelected: !r.isSelected } : r))
    );
  };

  // Select / Deselect All Filtered Rows
  const handleToggleSelectAll = () => {
    const allFilteredSelected = filteredRows.length > 0 && filteredRows.every(r => r.isSelected);
    const filteredIds = new Set(filteredRows.map(r => r.variantId));
    setRows(prev =>
      prev.map(r => (filteredIds.has(r.variantId) ? { ...r, isSelected: !allFilteredSelected } : r))
    );
  };

  // Direct Cell Editing
  const handleCellChange = (
    variantId: string,
    field: 'price' | 'comparePrice' | 'stock',
    value: number | undefined
  ) => {
    setRows(prev =>
      prev.map(r => {
        if (r.variantId !== variantId) return r;
        
        const updated = { ...r };
        if (field === 'price') {
          updated.price = Math.max(0, value ?? 0);
        } else if (field === 'comparePrice') {
          updated.comparePrice = value !== undefined && value >= 0 ? value : undefined;
        } else if (field === 'stock') {
          updated.stock = Math.max(0, Math.floor(value ?? 0));
        }

        updated.isModified =
          updated.price !== updated.originalPrice ||
          updated.comparePrice !== updated.originalComparePrice ||
          updated.stock !== updated.originalStock;

        return updated;
      })
    );
  };

  // Apply Batch Price Changes to Selected Rows
  const handleApplyBatchPrice = () => {
    const val = parseFloat(batchPriceValue);
    if (isNaN(val) || val <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid positive numeric price value.' });
      return;
    }

    setRows(prev =>
      prev.map(r => {
        if (!r.isSelected) return r;
        let newPrice = r.price;
        if (batchPriceMode === 'SET') {
          newPrice = val;
        } else if (batchPriceMode === 'PERCENT_DISCOUNT') {
          newPrice = Math.round(r.price * (1 - val / 100));
        } else if (batchPriceMode === 'PERCENT_MARKUP') {
          newPrice = Math.round(r.price * (1 + val / 100));
        }

        const isModified =
          newPrice !== r.originalPrice ||
          r.comparePrice !== r.originalComparePrice ||
          r.stock !== r.originalStock;

        return { ...r, price: newPrice, isModified };
      })
    );

    setFeedback({
      type: 'success',
      message: `Updated prices for ${selectedCount} selected variants.`,
    });
    setBatchPriceValue('');
  };

  // Apply Batch Stock Changes to Selected Rows
  const handleApplyBatchStock = () => {
    const val = parseInt(batchStockValue, 10);
    if (isNaN(val)) {
      setFeedback({ type: 'error', message: 'Please enter a valid integer stock count.' });
      return;
    }

    setRows(prev =>
      prev.map(r => {
        if (!r.isSelected) return r;
        let newStock = r.stock;
        if (batchStockMode === 'SET') {
          newStock = Math.max(0, val);
        } else if (batchStockMode === 'ADD') {
          newStock = Math.max(0, r.stock + val);
        } else if (batchStockMode === 'SUBTRACT') {
          newStock = Math.max(0, r.stock - val);
        }

        const isModified =
          r.price !== r.originalPrice ||
          r.comparePrice !== r.originalComparePrice ||
          newStock !== r.originalStock;

        return { ...r, stock: newStock, isModified };
      })
    );

    setFeedback({
      type: 'success',
      message: `Updated stock levels for ${selectedCount} selected variants.`,
    });
    setBatchStockValue('');
  };

  // Reset all pending edits
  const handleResetEdits = () => {
    setRows(prev =>
      prev.map(r => ({
        ...r,
        price: r.originalPrice,
        comparePrice: r.originalComparePrice,
        stock: r.originalStock,
        isModified: false,
      }))
    );
    setFeedback({ type: 'success', message: 'Reverted all unsaved bulk edits.' });
  };

  // Quick Preset: Restock All Selected to 50
  const handlePresetRestock = () => {
    setRows(prev =>
      prev.map(r => {
        if (!r.isSelected) return r;
        return {
          ...r,
          stock: 50,
          isModified:
            r.price !== r.originalPrice ||
            r.comparePrice !== r.originalComparePrice ||
            50 !== r.originalStock,
        };
      })
    );
    setFeedback({ type: 'success', message: `Restocked ${selectedCount} items to 50 units.` });
  };

  // Commit all bulk edits to backend
  const handleSaveBulkEdits = async () => {
    const modifiedRows = rows.filter(r => r.isModified);
    if (modifiedRows.length === 0) {
      setFeedback({ type: 'error', message: 'No changes detected to submit.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      updates: modifiedRows.map(r => ({
        productId: r.productId,
        variantId: r.variantId,
        price: r.price,
        compareAtPrice: r.comparePrice,
        stock: r.stock,
      })),
    };

    const res = await safeFetchApi('/api/products/bulk-update', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (res.ok) {
      setFeedback({
        type: 'success',
        message: `Successfully saved updates for ${modifiedRows.length} variant(s)!`,
      });
      // Update original baselines
      setRows(prev =>
        prev.map(r => {
          if (!r.isModified) return r;
          return {
            ...r,
            originalPrice: r.price,
            originalComparePrice: r.comparePrice,
            originalStock: r.stock,
            isModified: false,
          };
        })
      );
      onRefreshData();
    } else {
      setFeedback({
        type: 'error',
        message: res.error || 'Failed to apply bulk updates. Please check backend connection.',
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">Batch Price & Inventory Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simultaneously modify prices, compare-at rates, and stock levels across multiple formulations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {modifiedCount > 0 && (
            <button
              onClick={handleResetEdits}
              disabled={isSubmitting}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Revert ({modifiedCount})
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleSaveBulkEdits}
            disabled={modifiedCount === 0 || isSubmitting}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 shadow-lg ${
              modifiedCount > 0 && !isSubmitting
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? 'Saving Changes...'
              : `Save Bulk Changes (${modifiedCount})`}
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search SKU or formulation name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Product Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setStockFilter('ALL')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition ${
              stockFilter === 'ALL'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All SKUs
          </button>
          <button
            onClick={() => setStockFilter('LOW_STOCK')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition ${
              stockFilter === 'LOW_STOCK'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Low Stock (&le; 15)
          </button>
          <button
            onClick={() => setStockFilter('OUT_OF_STOCK')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition ${
              stockFilter === 'OUT_OF_STOCK'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Batch Operations Bar (Triggers when items are selected) */}
      <div
        className={`bg-slate-950 border transition-all duration-200 rounded-2xl p-4 space-y-4 ${
          selectedCount > 0
            ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
            : 'border-slate-800/80 opacity-70'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Batch Multi-Row Calculator</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px]">
              {selectedCount} Selected
            </span>
          </div>

          {selectedCount > 0 && (
            <button
              onClick={handlePresetRestock}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              Preset: Restock Selected to 50
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batch Price Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Batch Price Modifier
            </span>
            <div className="flex items-center gap-2">
              <select
                value={batchPriceMode}
                onChange={e => setBatchPriceMode(e.target.value as any)}
                disabled={selectedCount === 0}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50"
              >
                <option value="SET">Set Fixed Price (₹)</option>
                <option value="PERCENT_DISCOUNT">Discount (% Off)</option>
                <option value="PERCENT_MARKUP">Markup (% Increase)</option>
              </select>
              <input
                type="number"
                placeholder={batchPriceMode === 'SET' ? 'e.g. 499' : 'e.g. 10'}
                value={batchPriceValue}
                onChange={e => setBatchPriceValue(e.target.value)}
                disabled={selectedCount === 0}
                className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50 font-mono"
              />
              <button
                onClick={handleApplyBatchPrice}
                disabled={selectedCount === 0 || !batchPriceValue}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition disabled:opacity-50"
              >
                Apply Price
              </button>
            </div>
          </div>

          {/* Batch Stock Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              Batch Stock Modifier
            </span>
            <div className="flex items-center gap-2">
              <select
                value={batchStockMode}
                onChange={e => setBatchStockMode(e.target.value as any)}
                disabled={selectedCount === 0}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50"
              >
                <option value="SET">Set Fixed Stock</option>
                <option value="ADD">Add Units (+)</option>
                <option value="SUBTRACT">Subtract Units (-)</option>
              </select>
              <input
                type="number"
                placeholder="e.g. 50"
                value={batchStockValue}
                onChange={e => setBatchStockValue(e.target.value)}
                disabled={selectedCount === 0}
                className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50 font-mono"
              />
              <button
                onClick={handleApplyBatchStock}
                disabled={selectedCount === 0 || !batchStockValue}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition disabled:opacity-50"
              >
                Apply Stock
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spreadsheet Grid Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <th className="py-3 px-4 w-10">
                <button
                  onClick={handleToggleSelectAll}
                  className="text-slate-400 hover:text-amber-400 transition"
                  title="Select / Deselect All Filtered Rows"
                >
                  {filteredRows.length > 0 && filteredRows.every(r => r.isSelected) ? (
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-4">Formulation & SKU</th>
              <th className="py-3 px-4">Variant Spec</th>
              <th className="py-3 px-4">Price (₹)</th>
              <th className="py-3 px-4">MRP / Compare (₹)</th>
              <th className="py-3 px-4">Inventory Stock</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50 text-xs">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                  No product SKUs match the current search or category filters.
                </td>
              </tr>
            ) : (
              filteredRows.map(r => {
                const isRowModified = r.isModified;
                return (
                  <tr
                    key={r.variantId}
                    className={`transition ${
                      r.isSelected
                        ? 'bg-amber-500/5'
                        : isRowModified
                        ? 'bg-amber-500/10'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleSelectRow(r.variantId)}
                        className="text-slate-400 hover:text-amber-400 transition"
                      >
                        {r.isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Formulation & SKU */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.imageUrl}
                          alt={r.productName}
                          className="w-9 h-9 object-cover rounded-lg border border-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-slate-200">{r.productName}</p>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {r.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Variant Spec */}
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">{r.variantName}</span>
                      <p className="text-[10px] text-slate-500">{r.categoryName}</p>
                    </td>

                    {/* Price (₹) Input */}
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-slate-500 text-xs">₹</span>
                        <input
                          type="number"
                          value={r.price}
                          onChange={e =>
                            handleCellChange(
                              r.variantId,
                              'price',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className={`w-24 bg-slate-950 border rounded-lg pl-6 pr-2 py-1.5 text-xs font-mono transition text-slate-100 ${
                            r.price !== r.originalPrice
                              ? 'border-amber-400 ring-1 ring-amber-400/30'
                              : 'border-slate-800 focus:border-amber-500'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Compare-at Price (₹) Input */}
                    <td className="py-3 px-4">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-slate-500 text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="None"
                          value={r.comparePrice ?? ''}
                          onChange={e =>
                            handleCellChange(
                              r.variantId,
                              'comparePrice',
                              e.target.value !== '' ? parseFloat(e.target.value) : undefined
                            )
                          }
                          className={`w-24 bg-slate-950 border rounded-lg pl-6 pr-2 py-1.5 text-xs font-mono transition text-slate-300 ${
                            r.comparePrice !== r.originalComparePrice
                              ? 'border-amber-400 ring-1 ring-amber-400/30'
                              : 'border-slate-800 focus:border-amber-500'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Stock Level Input */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={r.stock}
                        onChange={e =>
                          handleCellChange(
                            r.variantId,
                            'stock',
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        className={`w-20 bg-slate-950 border rounded-lg px-2.5 py-1.5 text-xs font-mono transition text-slate-100 ${
                          r.stock !== r.originalStock
                            ? 'border-amber-400 ring-1 ring-amber-400/30'
                            : 'border-slate-800 focus:border-amber-500'
                        }`}
                      />
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4 text-right">
                      {isRowModified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Modified
                        </span>
                      ) : r.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Out of Stock
                        </span>
                      ) : r.stock <= 15 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
