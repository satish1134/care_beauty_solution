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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xl text-stone-800 border-b border-stone-200/80 shadow-sm">
      {/* Announcement Bar */}
      <div className="overflow-hidden bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-amber-100 border-b border-amber-900/40 text-xs py-2">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-12 text-[11px] font-medium tracking-wider">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <strong className="text-amber-300 tracking-widest uppercase">CARe A BEAUTY SOLUTION — CLINICAL DERMATOLOGIST FORMULA</strong>
          </span>
          <span>•</span>
          <span>🔬 100% Soap-Free, pH Balanced &amp; Barrier-Friendly</span>
          <span>•</span>
          <span className="text-amber-200">
            ✨ Use Code <strong className="font-bold underline">CARE200</strong> for ₹200 OFF on Orders Above ₹699
          </span>
          <span>•</span>
          <span>🚚 Free Express Shipping on Orders over ₹499</span>
          <span>•</span>
          <span>🌿 Fragrance-Free &amp; Non-Comedogenic</span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <strong className="text-amber-300 tracking-widest uppercase">CARe A BEAUTY SOLUTION</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* CARe Bottle Emblem Brand Logo */}
        <div
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}
        >
          {/* Gold Filigree Ring Badge from Product Bottle */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 via-amber-50 to-stone-100 flex items-center justify-center border-2 border-amber-400/60 shadow-sm group-hover:scale-105 transition-transform duration-300 relative">
            <div className="absolute inset-0.5 rounded-full border border-amber-500/40 border-dashed animate-spin-slow"></div>
            <span className="font-serif font-bold text-amber-700 text-2xl -mt-0.5">C</span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 bg-clip-text text-transparent">
              CARe
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-amber-900/80 font-sans font-bold -mt-1 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-amber-600" /> A BEAUTY SOLUTION
            </span>
          </div>
        </div>

        {/* Search Input with Light Aesthetics */}
        <div className="hidden md:flex flex-1 max-w-lg flex-col gap-1 relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search active ingredients (Niacinamide, Panthenol, Ceramides)..."
              className="w-full bg-white border border-stone-200 text-stone-900 placeholder-stone-400 text-xs rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/60 transition-all shadow-sm"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-amber-700/60" />
          </div>
          
          {/* Quick Search Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] text-stone-500 px-1">
            <span className="text-amber-800/60 font-semibold shrink-0">Popular:</span>
            {SEARCH_SUGGESTIONS.map(term => (
              <button
                key={term}
                onClick={() => onSearchChange(term)}
                className="hover:text-amber-700 font-medium underline decoration-dotted transition shrink-0"
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
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-2xl bg-stone-100 border border-stone-200 text-stone-700 hover:bg-stone-200 transition shadow-sm"
                title="Manage Delivery Addresses"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Addresses</span>
              </button>

              {/* Customer Orders Account */}
              <button
                onClick={onOpenOrders}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>{userName || (userPhone ? `My Orders (${userPhone.slice(-4)})` : 'My Account')}</span>
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 rounded-2xl text-stone-500 hover:text-red-600 hover:bg-stone-100 border border-stone-200 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl bg-amber-800 text-amber-50 hover:bg-amber-900 transition shadow-md active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-stone-800 border border-amber-200/80 transition shadow-sm active:scale-95 cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 text-amber-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-800 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories & Skin Concern Sub-Bar */}
      <div className="bg-stone-100/90 border-t border-stone-200 px-4 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-2.5 text-xs font-semibold whitespace-nowrap">
          <button
            onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              selectedCategory === null && selectedSkinConcern === null
                ? 'bg-amber-800 text-white font-bold shadow-sm'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Formulations
          </button>

          <span className="text-stone-300">|</span>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onSelectSkinConcern(null); }}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-800 text-white font-bold shadow-sm'
                  : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <span className="text-stone-300">|</span>
          <span className="text-amber-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pl-1">
            <SlidersHorizontal className="w-3 h-3 text-amber-700" /> Skin Target:
          </span>

          {SKIN_CONCERNS.map(concern => (
            <button
              key={concern}
              onClick={() => {
                onSelectSkinConcern(selectedSkinConcern === concern ? null : concern);
                onSelectCategory(null);
              }}
              className={`px-3 py-1 text-[11px] rounded-xl border transition ${
                selectedSkinConcern === concern
                  ? 'bg-teal-700 text-white font-bold border-teal-800 shadow-sm'
                  : 'border-stone-300 text-stone-700 hover:border-amber-600 hover:bg-amber-50'
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

