<<<<<<< HEAD
import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopStrip } from './components/layout/TopStrip';
import { NavbarMarketplace } from './components/layout/NavbarMarketplace';
import { MegaMenu } from './components/layout/MegaMenu';
import { FooterMarketplace } from './components/layout/FooterMarketplace';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ToastContainer } from './components/common/ToastContainer';
=======
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LuxuryBeautyLanding } from './components/LuxuryBeautyLanding';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ProductSlider } from './components/ProductSlider';
import { CustomerEngagementHub } from './components/CustomerEngagementHub';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UserOrdersModal } from './components/UserOrdersModal';
import { AdminPortal } from './admin/AdminPortal';
import { ProtectedAdminRoute } from './components/ProtectedRoute';
import { AuthModal } from './components/AuthModal';
import { AddressBookModal } from './components/AddressBookModal';
import { CookieConsent } from './components/CookieConsent';
import { Footer } from './components/Footer';
>>>>>>> 7209da6 (TEST)

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

<<<<<<< HEAD
      {/* 2. Dynamic View Router */}
      <main id="main-content-view" className="flex-1 pb-16 lg:pb-0">
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
=======
      <main id="main-content" className="flex-1">
        {/* Primary Screen Reader & SEO Title */}
        <h1 id="storefront-primary-heading" className="sr-only">
          CARe Beauty Solution — Flagship 3D Skincare Formulations
        </h1>

        {/* Render PDP route if on /product/:slug */}
        {activePdpProduct ? (
          <ProductDetailPage
            product={activePdpProduct}
            allProducts={products}
            onBackToCatalog={() => navigateTo('/')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={p => navigateTo(`/product/${p.slug}`)}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        ) : currentPath === '/catalog' || currentPath === '/products' || currentPath === '/store' ? (
          /* Dedicated PLP View */
          <ProductListingPage
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={catId => setSelectedCategory(catId)}
            selectedSkinConcern={selectedSkinConcern}
            onSelectSkinConcern={concern => setSelectedSkinConcern(concern)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOpenQuickView={p => setQuickViewProduct(p)}
            onOpenProductDetail={p => navigateTo(`/product/${p.slug}`)}
          />
        ) : (
          <LuxuryBeautyLanding />
>>>>>>> 7209da6 (TEST)
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
