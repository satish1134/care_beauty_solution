'use client';

import React from 'react';
import { Droplets, Shield, Sun, ChevronRight, Check } from 'lucide-react';

interface CategoryStoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ITEMS = [
  {
    id: 'cleanser',
    label: 'Cleanser',
    fullName: 'Refreshing Cleanser',
    tabletTag: 'Gentle Refreshing Wash',
    desktopDesc: 'Gentle amino foam • Clears pores without dryness',
    tag: 'pH 5.5 Balanced',
    icon: Droplets,
    accentColor: '#38BDF8',
    bgGradient: 'from-[#1e3a5f]/40 to-[#2c2833]',
  },
  {
    id: 'moisturizer',
    label: 'Moisturizer',
    fullName: 'Hydrating Moisturizer',
    tabletTag: '72h Barrier Hydration',
    desktopDesc: '5 Ceramides • Deep moisture with a weightless finish',
    tag: 'Non-Greasy',
    icon: Shield,
    accentColor: '#4ADE80',
    bgGradient: 'from-[#14422b]/40 to-[#2c2833]',
  },
  {
    id: 'sunscreen',
    label: 'Sunscreen',
    fullName: 'Ray Barrier Sunscreen',
    tabletTag: 'Invisible SPF 50+ PA++++',
    desktopDesc: 'High UVA/UVB defense • 100% zero white cast on skin',
    tag: 'Matte Finish',
    icon: Sun,
    accentColor: '#FBBF24',
    bgGradient: 'from-[#5a3a14]/40 to-[#2c2833]',
  },
];

export default function CategoryStoryBar({
  selectedCategory,
  onSelectCategory,
}: CategoryStoryBarProps) {
  const handleClick = (catId: string) => {
    // Toggle: if already selected, clicking it again views all
    const nextCat = selectedCategory === catId ? 'all' : catId;
    onSelectCategory(nextCat);
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      id="category-stories"
      className="w-full bg-[#34303a] border-b border-[#4d4755] py-2 sm:py-3 px-3 sm:px-6 select-none shadow-xs"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. MOBILE VIEW (< sm): Clean, centered circles WITHOUT numbers */}
      {/* ------------------------------------------------------------- */}
      <div className="flex sm:hidden items-center justify-center gap-8 py-1">
        {CATEGORY_ITEMS.map((item) => {
          const isActive = selectedCategory === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className="flex flex-col items-center shrink-0 group cursor-pointer transition-transform active:scale-95 py-0.5"
            >
              {/* Circular Avatar Ring Container (NO 1, 2, 3 numbers) */}
              <div
                className={`relative w-13 h-13 rounded-full p-0.5 flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'ring-2 ring-[#F3CA74] ring-offset-2 ring-offset-[#34303a] bg-[#F3CA74]'
                    : 'border border-[#5a5463] hover:border-[#F3CA74]/70 bg-[#2b2732]'
                }`}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-colors ${
                    isActive ? 'bg-[#221f27]' : 'bg-gradient-to-b ' + item.bgGradient
                  }`}
                >
                  <Icon
                    size={22}
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-[#F3CA74]' : 'text-[#DDD7CB] group-hover:text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Clean Product Name Label */}
              <span
                className={`text-[12px] font-semibold tracking-tight mt-1.5 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#F3CA74] font-bold'
                    : 'text-[#D5CCB8] group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2. TABLET VIEW (sm to lg): 3 balanced cards utilizing horizontal space */}
      {/* ----------------------------------------------------------------- */}
      <div className="hidden sm:grid lg:hidden grid-cols-3 gap-3 max-w-4xl mx-auto py-1">
        {CATEGORY_ITEMS.map((item) => {
          const isActive = selectedCategory === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item.id)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#27232d] border-[#F3CA74] shadow-sm ring-1 ring-[#F3CA74]/40'
                  : 'bg-[#2a2631] border-[#4b4554] hover:border-[#F3CA74]/60 hover:bg-[#302c38]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#F3CA74] text-[#1C1917]'
                    : 'bg-[#3b3644] text-[#DDD7CB]'
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-[#F3CA74]' : 'text-[#FAF8F5]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && <Check size={12} className="text-[#F3CA74] shrink-0" />}
                </div>
                <p className="text-[10px] text-[#A8A29E] truncate mt-0.5 font-medium">
                  {item.tabletTag}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. LAPTOP / DESKTOP VIEW (lg+): Full-width spacious luxury showcase */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:block max-w-7xl mx-auto py-1">
        <div className="grid grid-cols-3 gap-4">
          {CATEGORY_ITEMS.map((item) => {
            const isActive = selectedCategory === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 text-left cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-[#27232d] border-[#F3CA74] shadow-md ring-1 ring-[#F3CA74]/50 translate-y-[-1px]'
                    : 'bg-[#2a2631]/90 border-[#4d4755] hover:border-[#F3CA74]/60 hover:bg-[#2f2b37]'
                }`}
              >
                {/* Left: Product Icon in circular gradient */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300 ${
                      isActive
                        ? 'bg-[#F3CA74] text-[#1C1917] shadow-sm'
                        : 'bg-[#3c3645] text-[#DDD7CB] group-hover:text-white'
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Center: Title & Descriptive Tagline */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold tracking-tight truncate ${
                          isActive ? 'text-[#F3CA74]' : 'text-white'
                        }`}
                      >
                        {item.fullName}
                      </h4>
                      <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-300 shrink-0">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#A8A29E] truncate mt-0.5">
                      {item.desktopDesc}
                    </p>
                  </div>
                </div>

                {/* Right: Active status or explore chevron */}
                <div className="shrink-0 ml-3 pl-2">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#F3CA74] bg-[#F3CA74]/15 px-2.5 py-1 rounded-full border border-[#F3CA74]/30">
                      <Check size={12} />
                      Active
                    </span>
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-stone-400 group-hover:text-white group-hover:bg-white/10 group-hover:translate-x-0.5 transition-all">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
