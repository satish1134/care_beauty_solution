import React from 'react';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const {
    currentView,
    goHome,
    openPlp,
    setIsCartDrawerOpen,
    cartItemCount,
    isLoggedIn,
    setIsAuthModalOpen,
    setIsAccountModalOpen,
    setAccountActiveTab,
  } = useStore();

  return (
    <div
      id="mobile-sticky-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5] px-2 py-1.5 flex items-center justify-around shadow-sm"
    >
      <button
        onClick={goHome}
        className={`flex flex-col items-center justify-center p-1.5 text-center min-w-[56px] ${
          currentView === 'HOME' ? 'text-[#E85D5D]' : 'text-[#6B6B6B]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Home</span>
      </button>

      <button
        onClick={() => openPlp({ category: 'All' })}
        className={`flex flex-col items-center justify-center p-1.5 text-center min-w-[56px] ${
          currentView === 'PLP' ? 'text-[#E85D5D]' : 'text-[#6B6B6B]'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Categories</span>
      </button>

      <button
        onClick={() => {
          openPlp();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center justify-center p-1.5 text-center min-w-[56px] text-[#6B6B6B]"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Search</span>
      </button>

      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className="relative flex flex-col items-center justify-center p-1.5 text-center min-w-[56px] text-[#6B6B6B]"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#E85D5D] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-0.5 text-[#1A1A1A]">Bag</span>
      </button>

      <button
        onClick={() => {
          if (isLoggedIn) {
            setAccountActiveTab('orders');
            setIsAccountModalOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        className="flex flex-col items-center justify-center p-1.5 text-center min-w-[56px] text-[#6B6B6B]"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">
          {isLoggedIn ? 'Account' : 'Sign In'}
        </span>
      </button>
    </div>
  );
};
