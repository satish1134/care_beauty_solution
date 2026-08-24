import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { MARKETPLACE_PRODUCTS } from '../../data/marketplaceData';
import { ProductCardMarketplace } from '../product/ProductCardMarketplace';
import {
  ProductCategory,
  SkinConcern,
  SkinType,
  Formulation,
} from '../../types/marketplace';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Star,
  X,
  Sun,
  Droplets,
  Sparkles,
  Zap,
} from 'lucide-react';

const ALL_CATEGORIES: ProductCategory[] = [
  'Sunscreen',
  'Cleanser',
  'Moisturizer',
];

const ALL_BRANDS = ['Care Beauty Solution'];

const ALL_SKIN_TYPES: SkinType[] = [
  'All Skin Types',
  'Dry',
  'Combination',
  'Sensitive',
  'Oily',
];

const ALL_CONCERNS: SkinConcern[] = [
  'Barrier Repair',
  'Sun Damage & Tanning',
  'Dryness & Dehydration',
  'Oil & Pore Control',
  'Dark Spots & Pigmentation',
  'Sensitive & Redness',
];

const ALL_FORMULATIONS: Formulation[] = [
  'Sunscreen Fluid',
  'Barrier Cream',
  'Cleanser / Wash',
];

export const ProductListingPageMarketplace: React.FC = () => {
  const { filters, setFilters, resetFilters, goHome } = useStore();

  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter Accordions open/close state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    discount: true,
    rating: true,
    skinType: true,
    concern: true,
    formulation: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return MARKETPLACE_PRODUCTS.filter((product) => {
      // 1. Category
      if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }
      // 2. SubCategory
      if (filters.subCategory && product.subCategory !== filters.subCategory) {
        return false;
      }
      // 3. Brands
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }
      // 4. Price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      // 5. Min Discount
      if (filters.minDiscount > 0 && product.discount < filters.minDiscount) {
        return false;
      }
      // 6. Min Rating
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }
      // 7. Skin Types
      if (
        filters.skinTypes.length > 0 &&
        !filters.skinTypes.some((st) => product.skinTypes.includes(st))
      ) {
        return false;
      }
      // 8. Skin Concerns
      if (
        filters.skinConcerns.length > 0 &&
        !filters.skinConcerns.some((sc) => product.skinConcerns.includes(sc))
      ) {
        return false;
      }
      // 9. Formulation
      if (
        filters.formulations.length > 0 &&
        !filters.formulations.includes(product.formulation)
      ) {
        return false;
      }
      // 10. Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return b.discount - a.discount;
        case 'newest':
          return b.reviewCount - a.reviewCount;
        case 'popularity':
        default:
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });
  }, [filters]);

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleSkinTypeToggle = (type: SkinType) => {
    setFilters((prev) => ({
      ...prev,
      skinTypes: prev.skinTypes.includes(type)
        ? prev.skinTypes.filter((t) => t !== type)
        : [...prev.skinTypes, type],
    }));
  };

  const handleConcernToggle = (concern: SkinConcern) => {
    setFilters((prev) => ({
      ...prev,
      skinConcerns: prev.skinConcerns.includes(concern)
        ? prev.skinConcerns.filter((c) => c !== concern)
        : [...prev.skinConcerns, concern],
    }));
  };

  const handleFormulationToggle = (formulation: Formulation) => {
    setFilters((prev) => ({
      ...prev,
      formulations: prev.formulations.includes(formulation)
        ? prev.formulations.filter((f) => f !== formulation)
        : [...prev.formulations, formulation],
    }));
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 300);
  };

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Count active filter pills
  const activeFilterCount =
    (filters.category && filters.category !== 'All' ? 1 : 0) +
    (filters.subCategory ? 1 : 0) +
    filters.brands.length +
    (filters.minDiscount > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.skinTypes.length +
    filters.skinConcerns.length +
    filters.formulations.length;

  return (
    <div id="product-listing-page-root" className="min-h-screen bg-[#FAF9F6] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-4">
          <button onClick={goHome} className="hover:text-[#1A1A1A]">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            onClick={() => setFilters((prev) => ({ ...prev, category: 'All', subCategory: undefined }))}
            className="hover:text-[#1A1A1A]"
          >
            {filters.category && filters.category !== 'All' ? filters.category : 'All Formulations'}
          </button>
          {filters.subCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-[#1A1A1A]">{filters.subCategory}</span>
            </>
          )}
        </nav>

        {/* 2. Top Header & Control Bar */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              {filters.searchQuery
                ? `Results for "${filters.searchQuery}"`
                : filters.category && filters.category !== 'All'
                ? filters.category
                : 'All Clinical Formulations (Sunscreen, Cleanser, Moisturizer)'}
            </h1>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} verified products
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-[#FAF9F6] border border-[#E5E5E5] px-3 py-2 rounded-lg text-xs font-bold text-[#1A1A1A]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFilterCount})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B6B6B] hidden md:inline">Sort By:</span>
              <select
                id="plp-sort-by-select"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="bg-[#FAF9F6] border border-[#E5E5E5] text-xs font-semibold text-[#1A1A1A] rounded-lg px-3 py-2 focus:outline-none focus:border-[#E85D5D]"
              >
                <option value="popularity">Popularity &amp; Reviews</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Discount Percentage</option>
                <option value="newest">Top Selling</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center border border-[#E5E5E5] rounded-lg overflow-hidden bg-[#FAF9F6]">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 transition ${
                  layoutMode === 'grid' ? 'bg-white text-[#E85D5D] shadow-xs' : 'text-[#6B6B6B]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-2 transition ${
                  layoutMode === 'list' ? 'bg-white text-[#E85D5D] shadow-xs' : 'text-[#6B6B6B]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Content: Left Filters Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Left Filter Sidebar */}
          <aside
            id="desktop-plp-filters-sidebar"
            className="hidden lg:block bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-5 sticky top-20 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#1A1A1A]">
                <SlidersHorizontal className="w-4 h-4 text-[#E85D5D]" />
                <span>Filter Formulations</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#E85D5D] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#E85D5D] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Accordion 1: Categories */}
            <div>
              <button
                onClick={() => toggleSection('category')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] py-1"
              >
                <span>Category</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openSections.category ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSections.category && (
                <div className="mt-2 space-y-1.5">
                  <button
                    onClick={() => setFilters((p) => ({ ...p, category: 'All', subCategory: undefined }))}
                    className={`text-xs w-full text-left py-1.5 px-2 rounded-lg transition ${
                      filters.category === 'All'
                        ? 'bg-[#E85D5D]/10 text-[#E85D5D] font-bold'
                        : 'text-[#1A1A1A] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    All Essentials ({MARKETPLACE_PRODUCTS.length})
                  </button>
                  {ALL_CATEGORIES.map((cat) => {
                    const count = MARKETPLACE_PRODUCTS.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFilters((p) => ({ ...p, category: cat, subCategory: undefined }))}
                        className={`text-xs w-full text-left py-1.5 px-2 rounded-lg flex justify-between transition ${
                          filters.category === cat
                            ? 'bg-[#E85D5D]/10 text-[#E85D5D] font-bold'
                            : 'text-[#1A1A1A] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-neutral-400">({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 2: Skin Concerns */}
            <div className="border-t border-[#E5E5E5] pt-3">
              <button
                onClick={() => toggleSection('concern')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] py-1"
              >
                <span>Skin Concern</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openSections.concern ? 'rotate-180' : ''}`}
                />
              </button>
              {openSections.concern && (
                <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                  {ALL_CONCERNS.map((c) => (
                    <label key={c} className="flex items-center gap-2 text-xs text-[#1A1A1A] cursor-pointer hover:text-[#E85D5D]">
                      <input
                        type="checkbox"
                        checked={filters.skinConcerns.includes(c)}
                        onChange={() => handleConcernToggle(c)}
                        className="rounded border-[#E5E5E5] text-[#E85D5D] focus:ring-[#E85D5D]"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 3: Formulation */}
            <div className="border-t border-[#E5E5E5] pt-3">
              <button
                onClick={() => toggleSection('formulation')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] py-1"
              >
                <span>Formulation Type</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openSections.formulation ? 'rotate-180' : ''}`}
                />
              </button>
              {openSections.formulation && (
                <div className="mt-2 space-y-1.5">
                  {ALL_FORMULATIONS.map((f) => (
                    <label key={f} className="flex items-center gap-2 text-xs text-[#1A1A1A] cursor-pointer hover:text-[#E85D5D]">
                      <input
                        type="checkbox"
                        checked={filters.formulations.includes(f)}
                        onChange={() => handleFormulationToggle(f)}
                        className="rounded border-[#E5E5E5] text-[#E85D5D] focus:ring-[#E85D5D]"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 4: Skin Types */}
            <div className="border-t border-[#E5E5E5] pt-3">
              <button
                onClick={() => toggleSection('skinType')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] py-1"
              >
                <span>Skin Type</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openSections.skinType ? 'rotate-180' : ''}`}
                />
              </button>
              {openSections.skinType && (
                <div className="mt-2 space-y-1.5">
                  {ALL_SKIN_TYPES.map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs text-[#1A1A1A] cursor-pointer hover:text-[#E85D5D]">
                      <input
                        type="checkbox"
                        checked={filters.skinTypes.includes(st)}
                        onChange={() => handleSkinTypeToggle(st)}
                        className="rounded border-[#E5E5E5] text-[#E85D5D] focus:ring-[#E85D5D]"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 5: Price Range Slider */}
            <div className="border-t border-[#E5E5E5] pt-3">
              <button
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] py-1"
              >
                <span>Price (₹)</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openSections.price ? 'rotate-180' : ''}`}
                />
              </button>
              {openSections.price && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1A1A1A]">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="2500"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], Number(e.target.value)],
                      }))
                    }
                    className="w-full accent-[#E85D5D]"
                  />
                  <div className="flex gap-2">
                    {[500, 1000, 1500].map((p) => (
                      <button
                        key={p}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, priceRange: [0, p] }))
                        }
                        className="text-[10px] bg-[#FAF9F6] border border-[#E5E5E5] px-2 py-1 rounded text-neutral-600 hover:border-[#1A1A1A]"
                      >
                        Under ₹{p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 6: Discount */}
            <div className="border-t border-[#E5E5E5] pt-3">
              <button
                onClick={() => toggleSection('discount')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A] py-1"
              >
                <span>Discount</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${openSections.discount ? 'rotate-180' : ''}`}
                />
              </button>
              {openSections.discount && (
                <div className="mt-2 space-y-1.5">
                  {[20, 30, 40].map((disc) => (
                    <label
                      key={disc}
                      className="flex items-center gap-2 text-xs text-[#1A1A1A] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="minDiscount"
                        checked={filters.minDiscount === disc}
                        onChange={() => setFilters((p) => ({ ...p, minDiscount: disc }))}
                        className="text-[#E85D5D] focus:ring-[#E85D5D]"
                      />
                      <span>{disc}% and above</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3">
            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 bg-white border border-[#E5E5E5] p-3 rounded-xl">
                <span className="text-xs font-bold text-[#6B6B6B]">Active Filters:</span>
                {filters.category && filters.category !== 'All' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#FAF9F6] border border-[#E5E5E5] px-2.5 py-1 rounded-full text-[#1A1A1A]">
                    Category: {filters.category}
                    <button
                      onClick={() => setFilters((p) => ({ ...p, category: 'All' }))}
                      className="hover:text-[#E85D5D]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.skinConcerns.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 text-xs bg-[#FAF9F6] border border-[#E5E5E5] px-2.5 py-1 rounded-full text-[#1A1A1A]"
                  >
                    {c}
                    <button onClick={() => handleConcernToggle(c)} className="hover:text-[#E85D5D]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.formulations.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 text-xs bg-[#FAF9F6] border border-[#E5E5E5] px-2.5 py-1 rounded-full text-[#1A1A1A]"
                  >
                    {f}
                    <button onClick={() => handleFormulationToggle(f)} className="hover:text-[#E85D5D]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#E85D5D] hover:underline font-bold ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Listing */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  layoutMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'
                    : 'space-y-4'
                }
              >
                {visibleProducts.map((product) => (
                  <ProductCardMarketplace key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E5E5E5] flex items-center justify-center mx-auto text-[#E85D5D]">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A]">No Formulations Found</h3>
                <p className="text-xs text-[#6B6B6B] max-w-md mx-auto">
                  We couldn't find any products matching your active filters. Try clearing some filters or searching for Sunscreen, Cleanser, or Moisturizer.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary-coral text-xs font-bold px-6 py-2.5"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-white border border-[#E5E5E5] hover:border-[#E85D5D] text-[#1A1A1A] hover:text-[#E85D5D] text-xs font-bold px-8 py-3 rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {isLoadingMore ? 'Loading Formulations...' : `Load More Formulations (${filteredProducts.length - visibleCount} remaining)`}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="bg-white w-full max-w-sm h-full ml-auto p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#1A1A1A]">
                  <SlidersHorizontal className="w-4 h-4 text-[#E85D5D]" />
                  <span>Filter Products</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#1A1A1A] mb-2">Category</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setFilters((p) => ({ ...p, category: 'All' }))}
                      className={`text-xs w-full text-left py-1.5 px-2 rounded ${
                        filters.category === 'All' ? 'bg-[#E85D5D]/10 text-[#E85D5D] font-bold' : ''
                      }`}
                    >
                      All Essentials
                    </button>
                    {ALL_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilters((p) => ({ ...p, category: cat }))}
                        className={`text-xs w-full text-left py-1.5 px-2 rounded ${
                          filters.category === cat ? 'bg-[#E85D5D]/10 text-[#E85D5D] font-bold' : ''
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E5E5E5] pt-3">
                  <h4 className="text-xs font-bold uppercase text-[#1A1A1A] mb-2">Skin Concern</h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {ALL_CONCERNS.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                        <input
                          type="checkbox"
                          checked={filters.skinConcerns.includes(c)}
                          onChange={() => handleConcernToggle(c)}
                          className="rounded border-[#E5E5E5] text-[#E85D5D]"
                        />
                        <span>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex gap-3">
              <button
                onClick={resetFilters}
                className="w-1/2 bg-neutral-100 text-[#1A1A1A] text-xs font-bold py-2.5 rounded-lg"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 btn-primary-coral text-xs font-bold py-2.5"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
