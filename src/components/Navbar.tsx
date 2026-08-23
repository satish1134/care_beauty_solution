import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { CareBrandLogo } from './CareBrandLogo';

export interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectStage?: (stageIndex: number) => void;
  activeStageIndex?: number;
}

const PRODUCT_NAV_LINKS = [
  { index: 0, label: '01 CLEANSER', stageId: 'stage-01' },
  { index: 1, label: '02 MOISTURIZER', stageId: 'stage-02' },
  { index: 2, label: '03 SUNSCREEN', stageId: 'stage-03' },
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount = 0,
  onOpenCart,
  onSelectStage,
  activeStageIndex = 0,
}) => {
  const handleStageClick = (index: number) => {
    if (onSelectStage) {
      onSelectStage(index);
    }
    window.dispatchEvent(new CustomEvent('care_select_stage', { detail: { index } }));

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = (index / 2) * (totalHeight > 0 ? totalHeight : window.innerHeight * 2);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onSelectStage) onSelectStage(0);
  };

  return (
    <header
      id="global-navbar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-auto"
    >
      <nav
        aria-label="CARe Flagship Navigation"
        className="max-w-6xl mx-auto px-6 sm:px-12 py-5 flex items-center justify-between"
      >
        {/* Left: Luxury CARe Gold Emblem & Brand Wordmark */}
        <div className="flex items-center">
          <a
            href="/"
            onClick={handleLogoClick}
            className="group flex items-center no-underline cursor-pointer select-none"
            aria-label="CARe Home - A Beauty Solution"
          >
            <CareBrandLogo variant="navbar" />
          </a>
        </div>

        {/* Center: Clear links '01 SERUM', '02 MOISTURIZER', '03 CLEANSER' */}
        <div className="flex items-center gap-6 sm:gap-8 px-5 py-2 rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-md border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
          {PRODUCT_NAV_LINKS.map((item) => {
            const isActive = activeStageIndex === item.index;
            return (
              <button
                key={item.index}
                onClick={() => handleStageClick(item.index)}
                className={`font-syne text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer relative py-0.5 ${
                  isActive
                    ? 'text-[#0D261B] font-bold opacity-100'
                    : 'text-[#0D261B]/60 hover:text-[#0D261B] font-medium'
                }`}
                aria-label={`View ${item.label}`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C86D51] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Simple 'CART (0)' */}
        <div className="flex items-center">
          <button
            id="navbar-cart-trigger"
            onClick={onOpenCart}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-md border border-black/5 text-[#0D261B] font-syne font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            aria-label={`View Cart (${cartCount})`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#0D261B]" />
            <span className="uppercase">CART ({cartCount})</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
