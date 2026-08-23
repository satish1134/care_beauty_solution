import React from 'react';
import { ShoppingBag, Search, User, MapPin, SlidersHorizontal, LogOut, Sparkles, ShieldCheck } from 'lucide-react';
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
  onOpenAddresses: () => void;
  userPhone: string | null;
  userEmail: string | null;
  userName: string | null;
  onLogout: () => void;
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

const SEARCH_SUGGESTIONS = ['Ceramides', 'Niacinamide', 'SPF 50 Gel', 'Salicylic Cleanser', 'Hyaluronic Acid'];

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
  onOpenAddresses,
  userPhone,
  userEmail,
  userName,
  onLogout,
}) => {
  const isLoggedIn = Boolean(userPhone || userEmail);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl text-slate-800 border-b border-emerald-100 shadow-[0_4px_30px_rgba(16,185,129,0.06)]">
      {/* High-Impact Clinical Biotech Announcement Ticker */}
      <div className="overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-900 text-emerald-50 text-xs py-2 shadow-sm border-b border-emerald-700/40">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-12 text-[11px] font-semibold tracking-wider">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
            <strong className="text-cyan-300 tracking-widest uppercase font-extrabold">CARe A BEAUTY SOLUTION — ZERO-G CLINICAL DERMATOLOGY</strong>
          </span>
          <span className="text-white/40">•</span>
          <span>🔬 100% Soap-Free, pH Balanced at 5.5 &amp; Active Barrier Defense</span>
          <span className="text-white/40">•</span>
          <span className="bg-emerald-500/30 backdrop-blur px-2.5 py-0.5 rounded-full text-cyan-200 font-bold border border-cyan-400/30">
            ✨ Code <span className="underline text-white font-extrabold">CARE200</span> for ₹200 OFF
          </span>
          <span className="text-white/40">•</span>
          <span>🚚 Free Express Shipping across India on Orders &gt; ₹499</span>
          <span className="text-white/40">•</span>
          <span>🌿 Dermatologically Tested &amp; Fragrance-Free</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <strong className="text-cyan-300 tracking-widest uppercase">CARe CLINICAL SCIENCE</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* CARe Brand Logo Emblem with Deep Golden Styling */}
        <div
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}
        >
          {/* Radiant Deep Golden Ring Emblem */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-400 p-[2.5px] shadow-[0_4px_18px_rgba(217,119,6,0.3)] group-hover:scale-105 transition-transform duration-300 relative">
            <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-amber-100/30 to-yellow-400/20" />
              <span className="font-serif font-black bg-gradient-to-br from-amber-950 via-amber-700 to-yellow-700 bg-clip-text text-transparent text-2xl -mt-0.5">
                c
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-serif font-black tracking-tight bg-gradient-to-r from-amber-950 via-amber-800 to-yellow-700 bg-clip-text text-transparent">
              CARe
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.22em] text-amber-800 font-sans font-black -mt-1 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-amber-700 shrink-0" /> A BEAUTY SOLUTION
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="hidden md:flex flex-1 max-w-lg flex-col gap-1 relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search active ingredients (Niacinamide, Panthenol, Ceramides)..."
              className="w-full bg-slate-50/90 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all shadow-xs"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-amber-700" />
          </div>
          
          {/* Quick Search Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] text-slate-500 px-1">
            <span className="text-amber-800 font-bold shrink-0">Trending:</span>
            {SEARCH_SUGGESTIONS.map(term => (
              <button
                key={term}
                onClick={() => onSearchChange(term)}
                className="hover:text-amber-800 hover:bg-amber-50 px-2 py-0.5 rounded-full font-medium transition shrink-0 border border-transparent hover:border-amber-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isLoggedIn ? (
            <>
              {/* Address Book */}
              <button
                onClick={onOpenAddresses}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-amber-50 hover:text-amber-900 transition shadow-xs"
                title="Manage Delivery Addresses"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Addresses</span>
              </button>

              {/* Customer Orders Account */}
              <button
                onClick={onOpenOrders}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 hover:border-amber-400 transition shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>{userName || (userPhone ? `My Orders (${userPhone.slice(-4)})` : 'My Account')}</span>
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 rounded-2xl text-slate-400 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white hover:opacity-95 transition shadow-[0_3px_12px_rgba(180,83,9,0.3)] active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-200" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-2xl bg-slate-50 hover:bg-amber-50 text-slate-800 border border-slate-200 transition shadow-xs active:scale-95 cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 text-amber-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-700 to-amber-500 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Categories Sub-Bar with Radiant Pills & Semantic Nav */}
      <nav aria-label="Product Categories Navigation" className="bg-slate-50/95 border-t border-slate-200 px-4 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-2.5 text-xs font-semibold whitespace-nowrap">
          <button
            onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              selectedCategory === null && selectedSkinConcern === null
                ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white font-extrabold shadow-sm'
                : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            ✨ All Formulations
          </button>

          <span className="text-slate-300">|</span>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onSelectSkinConcern(null); }}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

