'use client';

import React from 'react';
import { Sparkles, SlidersHorizontal, RotateCcw, Search, ShieldCheck, Check } from 'lucide-react';

export interface FilterState {
  category: string;
  concern: string;
  skinType: string;
  sortBy: string;
  searchQuery: string;
}

interface CatalogFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export const SKIN_CONCERNS = [
  'All Skin Concerns',
  'Damaged Barrier & Stinging',
  'Extreme Dryness & Tightness',
  'Sensitized & Redness',
  'Sun & HEV Blue Light Damage',
  'Daily Pollution & SPF Removal'
];

export const CATEGORIES = [
  { id: 'all', label: 'All 3 Steps' },
  { id: 'cleanser', label: 'Cleansers' },
  { id: 'moisturizer', label: 'Moisturizers' },
  { id: 'sunscreen', label: 'Sunscreens' }
];

export const SKIN_TYPES = [
  'All Skin Types',
  'Sensitive & Reactive',
  'Dry / Peeling',
  'Combination / Oily',
  'Melanin-Rich (Fitzpatrick IV-VI)'
];

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Dermatologist Recommended' },
  { id: 'rating', label: 'Highest Rated (4.9+)' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' }
];

export default function CatalogFilterBar({
  filters,
  onFilterChange,
  onReset,
  totalResults
}: CatalogFilterBarProps) {
  const isFiltered =
    filters.category !== 'all' ||
    filters.concern !== 'All Skin Concerns' ||
    filters.skinType !== 'All Skin Types' ||
    filters.searchQuery.trim() !== '' ||
    filters.sortBy !== 'recommended';

  return (
    <div className="w-full bg-[#FAF8F5] rounded-3xl border border-[#E8E2D5] p-5 sm:p-7 shadow-sm space-y-5 mb-10">
      {/* Top Row: Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.id })}
                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-all shadow-2xs ${
                  isActive
                    ? 'bg-[#03290A] text-[#E5B85C] shadow-sm'
                    : 'bg-white hover:bg-[#F2ECE1] border border-[#E8E2D5] text-[#57534E]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full lg:w-72">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
          />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search actives (Ceramides, Zinc, Tea...)"
            className="w-full pl-9 pr-4 py-2 rounded-full text-xs bg-white border border-[#D5CCB8] focus:border-[#03290A] outline-none text-[#1C1917] placeholder:text-[#A8A29E] transition shadow-2xs"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#78716C] hover:text-[#1C1917]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Skin Concern Quick Selectors */}
      <div className="space-y-2 pt-2 border-t border-[#EFE9DD]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#785412] uppercase tracking-wider font-semibold">
            <Sparkles size={12} className="text-[#E5B85C]" />
            <span>Target Skin Concern:</span>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#064E3B] hover:text-[#03290A] font-bold hover:underline transition"
            >
              <RotateCcw size={11} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SKIN_CONCERNS.map((concern) => {
            const isSelected = filters.concern === concern;
            return (
              <button
                key={concern}
                onClick={() => onFilterChange({ concern })}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-[#064E3B] text-white border-[#064E3B] font-semibold shadow-xs'
                    : 'bg-white hover:bg-[#F2ECE1] border-[#E8E2D5] text-[#44403C]'
                }`}
              >
                {concern}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Control Row: Skin Type, Sorting & Match Count */}
      <div className="pt-2 border-t border-[#EFE9DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Skin Type Selector */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#78716C] text-[11px] uppercase">Skin Profile:</span>
            <select
              value={filters.skinType}
              onChange={(e) => onFilterChange({ skinType: e.target.value })}
              className="py-1.5 px-3 rounded-xl bg-white border border-[#D5CCB8] text-xs font-medium text-[#1C1917] outline-none cursor-pointer hover:border-[#03290A] transition"
            >
              {SKIN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#78716C] text-[11px] uppercase">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="py-1.5 px-3 rounded-xl bg-white border border-[#D5CCB8] text-xs font-medium text-[#1C1917] outline-none cursor-pointer hover:border-[#03290A] transition"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Match Counter */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#064E3B] font-semibold">
          <ShieldCheck size={14} />
          <span>
            {totalResults} {totalResults === 1 ? 'Formulation' : 'Formulations'} Calibrated
          </span>
        </div>
      </div>
    </div>
  );
}
