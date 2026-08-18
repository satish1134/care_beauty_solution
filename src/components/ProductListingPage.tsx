import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, ProductVariant, Category, SkinConcern, SkinType } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListingPageProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  selectedSkinConcern: SkinConcern | null;
  onSelectSkinConcern: (concern: SkinConcern | null) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow?: (product: Product, variant: ProductVariant, quantity: number) => void;
  onOpenQuickView: (product: Product) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSkinConcern,
  onSelectSkinConcern,
  onAddToCart,
  onBuyNow,
  onOpenQuickView,
  onOpenProductDetail,
}) => {
  // Filter States
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filter Logic
  const filteredProducts = products.filter(p => {
    // Category
    if (selectedCategory && p.categoryId !== selectedCategory && p.categoryName !== selectedCategory && p.slug !== selectedCategory) {
      return false;
    }
    // Skin Concern
    if (selectedSkinConcern && !p.skinConcerns.includes(selectedSkinConcern)) {
      return false;
    }
    // Skin Type
    if (selectedSkinType && !p.skinTypes.includes(selectedSkinType)) {
      return false;
    }
    // Price Range (checks if any variant falls in range)
    if (p.variants.length > 0) {
      const minPrice = Math.min(...p.variants.map(v => v.price));
      if (minPrice < priceRange[0] || minPrice > priceRange[1]) {
        return false;
      }
    }
    // Bestseller
    if (onlyBestsellers && !p.isBestSeller) {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTagline = p.tagline.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchIng = p.keyIngredients.some(ing => ing.toLowerCase().includes(q));
      const matchFeat = p.features && p.features.some(f => f.toLowerCase().includes(q));
      if (!matchName && !matchTagline && !matchDesc && !matchIng && !matchFeat) {
        return false;
      }
    }
    return true;
  });

  // Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price_asc') {
      const minA = Math.min(...a.variants.map(v => v.price));
      const minB = Math.min(...b.variants.map(v => v.price));
      return minA - minB;
    }
    if (sortOption === 'price_desc') {
      const minA = Math.min(...a.variants.map(v => v.price));
      const minB = Math.min(...b.variants.map(v => v.price));
      return minB - minA;
    }
    if (sortOption === 'rating') {
      return b.rating - a.rating;
    }
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortOption === 'bestseller') {
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    }
    return 0; // recommended / default
  });

  // Pagination Math
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSkinConcern, selectedSkinType, priceRange, onlyBestsellers, searchQuery, sortOption]);

  const clearAllFilters = () => {
    onSelectCategory(null);
    onSelectSkinConcern(null);
    setSelectedSkinType(null);
    setPriceRange([0, 2000]);
    setOnlyBestsellers(false);
    setSearchQuery('');
    setSortOption('recommended');
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedSkinConcern ? 1 : 0) +
    (selectedSkinType ? 1 : 0) +
    (onlyBestsellers ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (priceRange[1] < 2000 || priceRange[0] > 0 ? 1 : 0);

  const skinConcernsList: SkinConcern[] = ['Dryness', 'Sun Protection', 'Acne & Blemishes', 'Sensitive Skin', 'Aging', 'Dullness', 'Oil Control'];
  const skinTypesList: SkinType[] = ['All Skin Types', 'Dry', 'Oily', 'Sensitive', 'Combination'];

  return (
    <div id="product-listing-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-emerald-800/80">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-amber-400 text-emerald-950 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full inline-block shadow-md border border-amber-200">
            Dermatological Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-emerald-50">
            Clinical Active Skincare Formulations
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-light">
            High-potency clinical actives, 100% fragrance-free, non-comedogenic, and engineered specifically for Indian skin barrier resilience.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid Layout: Desktop Sidebar + Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <h2 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-800" />
              Filter Catalog
            </h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Search Actives</label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Ceramides, SPF..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-emerald-800"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => onSelectCategory(null)}
                className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center justify-between ${
                  selectedCategory === null ? 'bg-emerald-950 text-amber-300 font-bold shadow-md' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>All Categories</span>
                <span>({products.length})</span>
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center justify-between ${
                      selectedCategory === cat.id ? 'bg-emerald-950 text-amber-300 font-bold shadow-md' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skin Concern Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Skin Concern</label>
            <div className="flex flex-wrap gap-1.5">
              {skinConcernsList.map(concern => (
                <button
                  key={concern}
                  onClick={() => onSelectSkinConcern(selectedSkinConcern === concern ? null : concern)}
                  className={`text-[11px] px-3 py-1 rounded-xl border transition ${
                    selectedSkinConcern === concern
                      ? 'bg-emerald-950 text-amber-300 border-emerald-950 font-bold shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-700'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Skin Type</label>
            <div className="flex flex-wrap gap-1.5">
              {skinTypesList.map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedSkinType(selectedSkinType === st ? null : st)}
                  className={`text-[11px] px-3 py-1 rounded-xl border transition ${
                    selectedSkinType === st
                      ? 'bg-teal-900 text-white border-teal-900 font-bold shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex justify-between items-center text-xs font-bold text-stone-700">
              <span className="uppercase tracking-widest text-[10px] text-stone-500">Max Price</span>
              <span className="text-emerald-950 font-extrabold text-sm">₹{priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="300"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-emerald-950 cursor-pointer"
            />
          </div>

          {/* Best Sellers Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={onlyBestsellers}
              onChange={e => setOnlyBestsellers(e.target.checked)}
              className="w-4 h-4 accent-emerald-950 rounded"
            />
            <span>Best Sellers Only</span>
          </label>
        </aside>

        {/* Product Grid & Sorting Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden bg-emerald-950 text-amber-300 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-md"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-300" />
                Filter Options {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <p className="text-xs font-semibold text-stone-700">
                Showing <span className="text-emerald-950 font-bold text-sm">{sortedProducts.length}</span> clinical formulations
              </p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-emerald-800 hidden sm:block" />
              <label className="text-xs font-semibold text-stone-500 hidden sm:block">Sort by:</label>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 font-semibold text-stone-800 focus:outline-none focus:border-emerald-800 shadow-sm"
              >
                <option value="recommended">Featured / Recommended</option>
                <option value="bestseller">Best Sellers First</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500 font-semibold">Active Filters:</span>
              {selectedCategory && (
                <span className="bg-emerald-950 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  Category: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => onSelectCategory(null)} />
                </span>
              )}
              {selectedSkinConcern && (
                <span className="bg-teal-900 text-teal-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  Target: {selectedSkinConcern}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => onSelectSkinConcern(null)} />
                </span>
              )}
              {selectedSkinType && (
                <span className="bg-stone-200 text-stone-900 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-stone-300">
                  Type: {selectedSkinType}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-stone-950" onClick={() => setSelectedSkinType(null)} />
                </span>
              )}
              {onlyBestsellers && (
                <span className="bg-amber-400 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  Best Sellers Only
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-stone-950" onClick={() => setOnlyBestsellers(false)} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-emerald-100 text-emerald-950 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                  Search: "{searchQuery}"
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-950" onClick={() => setSearchQuery('')} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber-700 hover:text-emerald-900 underline font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-lg space-y-4">
              <div className="w-16 h-16 bg-stone-100 text-emerald-900 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900">No Formulations Match Your Filters</h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto font-light">
                Try adjusting your active category, price limit, or skin concern options to discover available CARE products.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold text-xs px-6 py-3 rounded-2xl shadow-lg transition active:scale-95"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onOpenQuickView={p => onOpenProductDetail(p)}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2.5 text-xs font-bold rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      currentPage === i + 1 ? 'bg-emerald-950 text-amber-300 shadow-md' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2.5 text-xs font-bold rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-800" /> Filter Options
              </h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-full text-stone-500 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => { onSelectCategory(null); setIsMobileFilterOpen(false); }}
                  className={`w-full text-left text-xs p-2.5 rounded-xl font-semibold ${selectedCategory === null ? 'bg-emerald-950 text-amber-300 font-bold' : 'text-stone-700 bg-stone-50'}`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onSelectCategory(cat.id); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left text-xs p-2.5 rounded-xl font-semibold ${selectedCategory === cat.id ? 'bg-emerald-950 text-amber-300 font-bold' : 'text-stone-700 bg-stone-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-emerald-950 text-amber-300 py-3 rounded-2xl text-xs font-bold shadow-lg"
            >
              Apply Filters ({sortedProducts.length} Formulations)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

