import React, { useState } from 'react';
import { ShoppingBag, Sparkles, ChevronRight, Droplets, Shield, Search } from 'lucide-react';
import { CareBrandLogo } from './CareBrandLogo';

export interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectStage?: (stageIndex: number) => void;
  activeStageIndex?: number;
  onShopFormulationsClick?: () => void;
  onBioLabClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 0,
  onOpenCart,
  onSelectStage,
  activeStageIndex = 0,
  onShopFormulationsClick,
  onBioLabClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onSelectStage) onSelectStage(0);
  };

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <header
      id="global-navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-auto bg-white/80 backdrop-blur-xl border-b border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
    >
      <nav
        aria-label="CARe Luxury Clinical Navigation"
        className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6"
      >
        {/* Left: Golden 3D Braided Circular Icon Logo + Brand Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={handleLogoClick}
            className="group flex items-center gap-3 no-underline cursor-pointer select-none transition-transform duration-200 hover:scale-[1.01]"
            aria-label="Care Beauty Solution - Clinical Skincare"
          >
            {/* 3D Braided Medallion Icon */}
            <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#8C6A12]/10 via-[#C9A227]/20 to-[#E8C76A]/30 p-0.5 shadow-[0_2px_10px_rgba(201,162,39,0.18)]">
              <CareBrandLogo variant="favicon-browsertab" size="sm" className="w-8 h-8" />
            </div>
            
            {/* Wordmark & Clinical Moniker */}
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.18em] text-[#111827] leading-none">
                CARE
              </span>
              <span className="font-sans text-[8.5px] uppercase font-semibold tracking-[0.28em] text-[#8C6A12] mt-0.5">
                BEAUTY SOLUTION
              </span>
            </div>
          </a>
        </div>

        {/* Center: Ultra-Thin Sans-Serif Navigation Bar */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-sans font-light tracking-[0.14em] uppercase text-gray-600">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="hover:text-gray-900 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Overview</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
          </button>
          
          <button
            onClick={() => scrollToSection('hero-formulations-grid')}
            className="hover:text-gray-900 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Formulations</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('interactive-biolab-hub')}
            className="hover:text-gray-900 transition-colors cursor-pointer py-1 relative group flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
            <span>Bio-Lab 3D</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('clinical-evidence-section')}
            className="hover:text-gray-900 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Barrier Science</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
          </button>
        </div>

        {/* Right: "Shop Formulations" CTA + Cart */}
        <div className="flex items-center gap-3.5">
          <button
            id="navbar-shop-formulations-cta"
            onClick={() => {
              if (onShopFormulationsClick) onShopFormulationsClick();
              scrollToSection('hero-formulations-grid');
            }}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(201,162,39,0.25)] hover:border-gold border border-transparent cursor-pointer group active:scale-95"
          >
            <span className="bg-gradient-to-r from-white via-[#FDF8EE] to-[#E8C76A] bg-clip-text text-transparent group-hover:text-white transition-colors">
              Shop Formulations
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#E8C76A] transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Cart Trigger */}
          <button
            id="navbar-cart-trigger"
            onClick={onOpenCart}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-900 font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            aria-label={`View Cart (${cartCount})`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-gray-700 group-hover:text-[#8C6A12] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#C9A227] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden xs:inline text-gray-700 group-hover:text-gray-900">
              Cart ({cartCount})
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};
