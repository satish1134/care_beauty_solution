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
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-xl text-emerald-50 border-b border-emerald-800/60 shadow-xl">
      {/* Marquee Ticker Announcement Bar */}
      <div className="overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 text-emerald-100 border-b border-emerald-800/40 text-xs py-2">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-12 text-[11px] font-medium tracking-wide">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <strong className="text-amber-300">CLINICAL SKINCARE FORMULATED FOR INDIAN SKIN</strong>
          </span>
          <span>•</span>
          <span>🔬 100% Dermatologically Tested & Non-Comedogenic</span>
          <span>•</span>
          <span className="text-amber-200">
            ✨ Use Code <strong className="font-bold underline">GLOW200</strong> for ₹200 OFF on Orders Above ₹699
          </span>
          <span>•</span>
          <span>🚚 Free Express Shipping across India on Orders over ₹499</span>
          <span>•</span>
          <span>🌿 Cruelty-Free & Paraben-Free Clean Science</span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <strong className="text-amber-300">CLINICAL SKINCARE FORMULATED FOR INDIAN SKIN</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-emerald-400 flex items-center justify-center text-emerald-950 shadow-md font-serif font-extrabold text-2xl group-hover:scale-105 transition duration-300 border border-amber-200">
            C
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight bg-gradient-to-r from-amber-200 via-emerald-100 to-teal-200 bg-clip-text text-transparent">
              Care Beauty
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-sans -mt-1 font-bold flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-amber-400" /> Clinical Skincare Lab
            </span>
          </div>
        </div>

        {/* Search Input with Quick Suggestion Pills */}
        <div className="hidden md:flex flex-1 max-w-lg flex-col gap-1 relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search by active ingredient (e.g., Ceramides, Niacinamide, SPF 50)..."
              className="w-full bg-emerald-900/60 border border-emerald-700/70 text-emerald-50 placeholder-emerald-400/70 text-xs rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
          </div>
          
          {/* Quick Search Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] text-emerald-300/80 px-1">
            <span className="text-emerald-400/60 font-medium shrink-0">Popular:</span>
            {SEARCH_SUGGESTIONS.map(term => (
              <button
                key={term}
                onClick={() => onSearchChange(term)}
                className="hover:text-amber-300 underline decoration-dotted transition shrink-0"
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
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-2xl bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 hover:bg-emerald-800 transition shadow-sm"
                title="Manage Delivery Addresses"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Addresses</span>
              </button>

              {/* Customer Orders Account */}
              <button
                onClick={onOpenOrders}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-2xl bg-emerald-900/90 border border-emerald-700/80 text-emerald-100 hover:bg-emerald-800 transition shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span>{userName || (userPhone ? `My Orders (${userPhone.slice(-4)})` : 'My Account')}</span>
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 rounded-2xl text-emerald-300 hover:text-red-300 hover:bg-emerald-900/80 border border-emerald-800 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl bg-amber-400 text-emerald-950 hover:bg-amber-300 transition shadow-lg active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-2xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/70 transition shadow-md active:scale-95 cursor-pointer"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-emerald-950 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse border border-emerald-950">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories & Skin Concern Sub-Bar */}
      <div className="bg-emerald-900/95 border-t border-emerald-800/50 px-4 py-2.5 overflow-x-auto scrollbar-none shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center space-x-2.5 text-xs font-semibold whitespace-nowrap">
          <button
            onClick={() => { onSelectCategory(null); onSelectSkinConcern(null); }}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              selectedCategory === null && selectedSkinConcern === null
                ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/80'
            }`}
          >
            All Formulations
          </button>

          <span className="text-emerald-700/80">|</span>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onSelectSkinConcern(null); }}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                  : 'text-emerald-200 hover:bg-emerald-800/80'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <span className="text-emerald-700/80">|</span>
          <span className="text-amber-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 pl-1">
            <SlidersHorizontal className="w-3 h-3 text-amber-300" /> Skin Target:
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
                  ? 'bg-teal-400 text-emerald-950 font-bold border-teal-300 shadow-sm'
                  : 'border-emerald-700/60 text-emerald-200 hover:border-emerald-500 hover:bg-emerald-800/40'
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

