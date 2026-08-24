import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sun,
  Droplets,
} from 'lucide-react';
import { ProductCategory } from '../../types/marketplace';

export const NavbarMarketplace: React.FC = () => {
  const {
    openPlp,
    openHome,
    openPdp,
    openWishlist,
    openAccount,
    setIsAuthModalOpen,
    setIsCartDrawerOpen,
    cartItemCount,
    wishlist,
    currentUser,
    searchQuery,
    setSearchQuery,
    allProducts,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const safeSearch = (searchQuery || '').trim();

  // Filter products for live dropdown
  const filteredSuggestions = safeSearch
    ? (allProducts || [])
        .filter(
          (p) =>
            p.name.toLowerCase().includes(safeSearch.toLowerCase()) ||
            p.category.toLowerCase().includes(safeSearch.toLowerCase()) ||
            (p.skinConcerns &&
              p.skinConcerns.some((c) => c.toLowerCase().includes(safeSearch.toLowerCase())))
        )
        .slice(0, 5)
    : [];

  const POPULAR_SEARCHES = [
    'SPF 50 Sunscreen',
    'Gentle Cleanser pH 5.5',
    'Ceramide Moisturizer',
    '3-Step Daily Routine Kit',
    'Zero White Cast',
    'Oil Control Matte Gel',
  ];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = (searchQuery || '').trim();
    if (query) {
      openPlp(undefined, query);
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    openPlp(undefined, term);
    setIsSearchFocused(false);
  };

  return (
    <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* 1. Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1A1A] hover:text-[#E85D5D] focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Official Brand Logo */}
            <button
              onClick={openHome}
              className="flex items-center gap-2 focus:outline-none group text-left"
              aria-label="Care Beauty Solution Home"
            >
              <BrandLogo variant="header" heightClass="h-9 sm:h-11" />
            </button>
          </div>

          {/* 2. Global Predictive Search Bar */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for Sunscreens, Cleansers, Moisturizers, or Skin Concerns..."
                  className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#6B6B6B] rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:border-[#E85D5D] focus:bg-white focus:ring-1 focus:ring-[#E85D5D] transition shadow-xs"
                />
                <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Predictive Search Overlay */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {safeSearch ? (
                  <div className="p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] px-3 py-1">
                      Matching Formulations
                    </p>
                    {filteredSuggestions.length > 0 ? (
                      <div className="space-y-1 mt-1">
                        {filteredSuggestions.map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => {
                              openPdp(prod);
                              setIsSearchFocused(false);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF9F6] transition text-left"
                          >
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-10 h-10 object-contain rounded-lg border border-[#E5E5E5] bg-white p-1"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#1A1A1A] truncate">{prod.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-[#6B6B6B]">
                                <span className="text-[#2D5A3D] font-semibold">{prod.category}</span>
                                <span>•</span>
                                <span className="font-bold text-[#1A1A1A]">₹{prod.variants[0].price}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-300" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-[#6B6B6B]">
                        No direct match found for "{searchQuery}".
                        <button
                          onClick={() => handleSearchSubmit({ preventDefault: () => {} } as any)}
                          className="block mx-auto mt-2 text-[#E85D5D] font-bold hover:underline"
                        >
                          Search all products for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-[#E85D5D]" />
                        <span>Trending Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_SEARCHES.map((item) => (
                          <button
                            key={item}
                            onClick={() => handleSuggestionClick(item)}
                            className="text-xs bg-[#FAF9F6] hover:bg-[#E85D5D]/10 hover:text-[#E85D5D] border border-[#E5E5E5] px-3 py-1.5 rounded-full transition font-medium"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#2D5A3D]">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>3 Essential Daily Categories • Dermatologist Tested</span>
                      </div>
                      <button
                        onClick={() => {
                          openPlp('Daily Routine Kits');
                          setIsSearchFocused(false);
                        }}
                        className="text-[#E85D5D] font-bold hover:underline"
                      >
                        Explore 3-Step Kits
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Action Icons (Wishlist, Account, Cart Bag) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Account Profile / Login */}
            {currentUser ? (
              <button
                onClick={openAccount}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#FAF9F6] text-[#1A1A1A] transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#E85D5D] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[10px] text-[#6B6B6B] leading-none">Welcome back,</p>
                  <p className="text-xs font-bold text-[#1A1A1A] leading-tight truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF9F6] hover:text-[#E85D5D] transition"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={openWishlist}
              className="relative p-2.5 rounded-xl hover:bg-[#FAF9F6] text-[#1A1A1A] hover:text-[#E85D5D] transition focus:outline-none"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#E85D5D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#E85D5D] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition shadow-xs group focus:outline-none"
              id="header-cart-bag-btn"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold hidden sm:inline">Bag</span>
              <span className="bg-[#E85D5D] group-hover:bg-white group-hover:text-[#1A1A1A] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full transition">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Sunscreen, Cleanser, Moisturizer..."
              className="w-full bg-[#FAF9F6] border border-[#E5E5E5] text-xs text-[#1A1A1A] placeholder-[#6B6B6B] rounded-full py-2 pl-9 pr-8 focus:outline-none focus:border-[#E85D5D]"
            />
            <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Slide Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden">
          <div className="bg-white w-4/5 max-w-sm h-full flex flex-col p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <BrandLogo variant="header" heightClass="h-8" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B6B6B] px-2 mb-2">
                Core Formulations (3 Essentials)
              </p>
              <button
                onClick={() => {
                  openPlp();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF9F6]"
              >
                <span>All 3 Products</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>
              <button
                onClick={() => {
                  openPlp('Sunscreen');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF9F6]"
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Ray Barrier Sunscreen</span>
                </div>
                <span className="text-[10px] badge-forest-green font-bold px-1.5 py-0.5">SPF 50+</span>
              </button>
              <button
                onClick={() => {
                  openPlp('Moisturizer');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF9F6]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Hydrating Moisturizer</span>
                </div>
                <span className="text-[10px] badge-forest-green font-bold px-1.5 py-0.5">Ceramides</span>
              </button>
              <button
                onClick={() => {
                  openPlp('Cleanser');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF9F6]"
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>Refreshing Skin Cleanser</span>
                </div>
                <span className="text-[10px] badge-forest-green font-bold px-1.5 py-0.5">Gentle</span>
              </button>
            </div>

            <div className="mt-auto pt-4 border-t border-[#E5E5E5] space-y-3">
              {currentUser ? (
                <button
                  onClick={() => {
                    openAccount();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 bg-[#FAF9F6] rounded-xl text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-[#E85D5D] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">{currentUser.name}</p>
                    <p className="text-[11px] text-[#6B6B6B]">View Account &amp; Orders</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary-coral w-full py-2.5 text-xs font-bold text-center block"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
