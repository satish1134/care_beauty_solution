import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopStrip } from './components/layout/TopStrip';
import { NavbarMarketplace } from './components/layout/NavbarMarketplace';
import { MegaMenu } from './components/layout/MegaMenu';
import { FooterMarketplace } from './components/layout/FooterMarketplace';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';

// Homepage Components
import { HeroCarousel } from './components/home/HeroCarousel';
import { DealOfTheDayBanner } from './components/home/DealOfTheDayBanner';
import { CategoryCirclesStrip } from './components/home/CategoryCirclesStrip';
import { FlashSaleSection } from './components/home/FlashSaleSection';
import { BestsellersSection } from './components/home/BestsellersSection';
import { ShopByConcern } from './components/home/ShopByConcern';
import { BrandMarquee } from './components/home/BrandMarquee';
import { BrandStoreGrid } from './components/home/BrandStoreGrid';
import { TrendingNowSection } from './components/home/TrendingNowSection';
import { TestimonialsStrip } from './components/home/TestimonialsStrip';

// Pages & Modals
import { ProductListingPageMarketplace } from './components/plp/ProductListingPageMarketplace';
import { ProductDetailPageMarketplace } from './components/pdp/ProductDetailPageMarketplace';
import { CartDrawerMarketplace } from './components/cart/CartDrawerMarketplace';
import { CheckoutModalMarketplace } from './components/checkout/CheckoutModalMarketplace';
import { AuthModalMarketplace } from './components/auth/AuthModalMarketplace';
import { UserAccountModalMarketplace } from './components/account/UserAccountModalMarketplace';
import { ProductQuickViewModal } from './components/product/ProductQuickViewModal';

const MarketplaceAppContent: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col selection:bg-[#E85D5D] selection:text-white">
      {/* 1. Header Infrastructure */}
      <TopStrip />
      <NavbarMarketplace />
      <MegaMenu />

      {/* 2. Dynamic View Router */}
      <main id="main-content-view" className="flex-1">
        {currentView === 'HOME' && (
          <>
            <HeroCarousel />
            <DealOfTheDayBanner />
            <CategoryCirclesStrip />
            <BestsellersSection />
            <BrandStoreGrid />
            <ShopByConcern />
            <BrandMarquee />
            <TestimonialsStrip />
          </>
        )}

        {currentView === 'PLP' && <ProductListingPageMarketplace />}

        {currentView === 'PDP' && <ProductDetailPageMarketplace />}
      </main>

      {/* 3. Global Footer */}
      <FooterMarketplace />

      {/* 4. Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />

      {/* 5. Modals, Drawers & Overlays */}
      <CartDrawerMarketplace />
      <CheckoutModalMarketplace />
      <AuthModalMarketplace />
      <UserAccountModalMarketplace />
      <ProductQuickViewModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MarketplaceAppContent />
    </StoreProvider>
  );
}
