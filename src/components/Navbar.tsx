import React from 'react';
import { ShoppingBag, Search, User, ShieldCheck, GitBranch, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Category, SkinConcern } from '../types';

interface NavbarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  selectedSkinConcern: SkinConcern | null;
  onSelectSkinConcern: (concern: SkinConcern | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onToggleAdmin: () => void;
  isAdmin: boolean;
  onOpenGitGuide: () => void;
  userPhone: string | null;
}

const SKIN_CONCERNS: SkinConcern[] = [
  'Dryness',
  'Acne & Blemishes',
  'Sun Protection',
  'Aging',
  'Dullness',
  'Oil Control',
  'Sensitive Skin',
];

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSkinConcern,
  onSelectSkinConcern,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenOrders,
  onToggleAdmin,
  isAdmin,
  onOpenGitGuide,
  userPhone,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md text-emerald-50 border-b border-emerald-800/50 shadow-lg">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-between">
        <div className="hidden sm:flex items-center space-x-4 text-[11px] text-emerald-300">
          <span>🌿 100% Vegan & Cruelty-Free</span>
          <span>•</span>
          <span>🔬 Dermatologically Tested</span>
        </div>
        <div className="mx-auto sm:mx-0 font-semibold text-amber-200">
          ✨ Special Offer: Free Express Shipping in India on Orders Above ₹499 | Use Code <span className="underline decoration-dashed font-bold">WELCOME10</span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[11px]">
          <button
            onClick={onOpenGitGuide}
            className="flex items-center gap-1.5 text-teal-200 hover:text-white bg-teal-800/60 px-2 py-0.5 rounded transition"
          >
            <GitBranch className="w-3 h-3 text-amber-300" />
            Git Push Guide
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 shadow-inner font-bold text-xl">
            C
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight bg-gradient-to-r from-amber-200 via-emerald-100 to-teal-200 bg-clip-text text-transparent">
              Care Beauty
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-emerald-300 font-sans -mt-1 font-semibold">
              Clinical Skincare Solutions
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search by ingredient (e.g. Hyaluronic, Niacinamide, SPF 50)..."
            className="w-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-50 placeholder-emerald-400/70 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-emerald-400" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Git Guide Mobile */}
          <button
            onClick={onOpenGitGuide}
            className="md:hidden flex items-center gap-1 text-xs bg-teal-800/80 px-2.5 py-1.5 rounded-full text-amber-200 font-medium"
            title="Git Setup Instructions"
          >
            <GitBranch className="w-3.5 h-3.5" />
            Git
          </button>

          {/* Customer Orders */}
          <button
            onClick={userPhone ? onOpenOrders : onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-100 hover:bg-emerald-800 transition"
          >
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>{userPhone ? `My Orders (${userPhone.slice(-4)})` : 'Sign In'}</span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition border ${
              isAdmin
                ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md'
                : 'bg-emerald-900/80 text-emerald-200 border-emerald-700 hover:text-white hover:bg-emerald-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Exit Admin' : 'Admin Console'}</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 transition shadow-inner"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-950 font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Navigation Categories & Skin Concern Filter */}
      <div className="bg-emerald-900/90 border-t border-emerald-800/40 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs font-medium whitespace-nowrap">
          <button
            onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}
            className={`px-3 py-1 rounded-full transition ${
              selectedCategory === null && selectedSkinConcern === null
                ? 'bg-amber-400 text-emerald-950 font-bold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            All Products
          </button>

          <span className="text-emerald-700">|</span>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onSelectSkinConcern(null); }}
              className={`px-3 py-1 rounded-full transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-emerald-950 font-bold'
                  : 'text-emerald-200 hover:bg-emerald-800/60'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <span className="text-emerald-700">|</span>
          <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1 pl-1">
            <SlidersHorizontal className="w-3 h-3" /> Skin Concern:
          </span>

          {SKIN_CONCERNS.map(concern => (
            <button
              key={concern}
              onClick={() => {
                onSelectSkinConcern(selectedSkinConcern === concern ? null : concern);
                onSelectCategory(null);
              }}
              className={`px-2.5 py-0.5 text-[11px] rounded-full border transition ${
                selectedSkinConcern === concern
                  ? 'bg-teal-400 text-emerald-950 font-bold border-teal-300'
                  : 'border-emerald-700/60 text-emerald-300 hover:border-emerald-500'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
