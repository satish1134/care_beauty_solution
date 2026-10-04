'use client';

import React, { useState, useMemo, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Mail,
  Instagram,
  ShoppingBag,
  ExternalLink,
  Droplets,
  Sun,
  Shield,
  Heart,
  User,
  FlaskConical,
  Award,
  Search,
  Truck,
  X,
  Menu
} from 'lucide-react';
import CinematicHero from '@/components/storefront/CinematicHero';
import ProductCard from '@/components/storefront/ProductCard';
import RoutineModal from '@/components/storefront/RoutineModal';
import CartDrawer from '@/components/storefront/CartDrawer';
import CheckoutModal from '@/components/storefront/CheckoutModal';
import UserProfileModal from '@/components/storefront/UserProfileModal';
import ClinicalReviewsHub from '@/components/storefront/ClinicalReviewsHub';
import { AmazonLogo, NykaaLogo, FlipkartLogo } from '@/components/storefront/MarketplaceButtons';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import MobileMenuDrawer from '@/components/storefront/MobileMenuDrawer';
import CategoryStoryBar from '@/components/storefront/CategoryStoryBar';
import { CartProvider, useCart } from '@/lib/cart-context';
import { CORE_PRODUCTS, CORE_TRIO_BUNDLE, Product } from '@/lib/products-data';
import { HeroCmsConfig, StorefrontCmsData, INITIAL_STOREFRONT_CMS } from '@/lib/admin-store';
import { mergeStorefrontProducts } from '@/lib/product-mapper';
import type { FilterState } from '@/components/storefront/CatalogFilterBar';

function Storefront() {
  const [isRoutineOpen, setIsRoutineOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('top');
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bundleNotice, setBundleNotice] = useState(false);

  // Option 2: Pure Luxury Monolith (Permanent All-Black Luxury Theme)
  const isDarkHeader = true;
  const isDarkFooter = true;

  // Dynamic CMS State
  const [heroConfig, setHeroConfig] = useState<HeroCmsConfig | null>(null);
  const [productsList, setProductsList] = useState<Product[]>(CORE_PRODUCTS);
  const [storefrontCms, setStorefrontCms] = useState<StorefrontCmsData>(INITIAL_STOREFRONT_CMS);

  // Logo sources and dimensions from CMS (Admin uploads & customizations)
  const cmsSection = storefrontCms?.sectionContent;
  const customHeaderLogo = cmsSection?.headerLogoUrl;
  const customFooterLogo = cmsSection?.footerLogoUrl;
  const headerLogoHeight = cmsSection?.headerLogoHeight || 54;
  const footerLogoHeight = cmsSection?.footerLogoHeight || 64;

  // Solid black luxury branding for Option 2
  const headerLogoSrc = customHeaderLogo || '/images/logos/logo_sample1_black.png';
  const footerLogoSrc = customFooterLogo || '/images/logos/logo_sample1_black.png';

  // Fetch CMS data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCmsData() {
      try {
        const [heroRes, productsRes, storefrontRes] = await Promise.all([
          fetch('/api/hero-cms'),
          fetch('/api/products'),
          fetch('/api/storefront-cms')
        ]);
        if (heroRes.ok) {
          const heroData = await heroRes.json();
          if (heroData?.heroCms && isMounted) {
            setHeroConfig(heroData.heroCms);
          }
        }
        if (productsRes.ok) {
          const prodData = await productsRes.json();
          if (prodData?.products && Array.isArray(prodData.products) && isMounted) {
            const merged = mergeStorefrontProducts(prodData.products);
            setProductsList(merged);
          }
        }
        if (storefrontRes.ok) {
          const sfData = await storefrontRes.json();
          if (sfData?.storefrontCms && isMounted) {
            setStorefrontCms(sfData.storefrontCms);
          }
        }
      } catch (err) {
        console.warn('CMS storefront fetch failed, using fallback seeds:', err);
      }
    }
    loadCmsData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Active section scroll detection for header navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['top', 'products', 'clinical-evidence', 'standards', 'notify'];
      const scrollPosition = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 4.2 Step 2: Advanced Catalog Filtering State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    concern: 'All Skin Concerns',
    skinType: 'All Skin Types',
    sortBy: 'recommended',
    searchQuery: ''
  });

  const { openCart, openProfile, totalItemCount, user, addItem } = useCart();

  // Scroll to catalog section and filter directly to selected category (or toggle to all)
  const handleNavCategoryClick = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? 'all' : category,
    }));
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      concern: 'All Skin Concerns',
      skinType: 'All Skin Types',
      sortBy: 'recommended',
      searchQuery: ''
    });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category match
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Concern match
      if (
        filters.concern !== 'All Skin Concerns' &&
        !product.concerns?.some((c) => c.toLowerCase().includes(filters.concern.toLowerCase()))
      ) {
        return false;
      }
      // Skin type match
      if (
        filters.skinType !== 'All Skin Types' &&
        !product.skinTypes?.some((s) => s.toLowerCase().includes(filters.skinType.toLowerCase()))
      ) {
        return false;
      }
      // Search query match
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesActives = product.heroActives?.some((a) =>
          a.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesSubtitle && !matchesDesc && !matchesActives) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      return 0; // recommended
    });
  }, [filters, productsList]);

  const joinList = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to join the list.');
      setJoined(true);
      setEmail('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to join the list.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBundle = () => {
    // Add all 3 protocol products to the cart
    productsList.slice(0, 3).forEach((p) => addItem(p, 1));
    setBundleNotice(true);
    setTimeout(() => setBundleNotice(false), 2400);
  };

  return (
    <main className="min-h-screen bg-[#FBF9F5] text-[#1C1917] selection:bg-[#EAE2D2] selection:text-[#1C1917] pb-16 md:pb-0">
      {/* 1. TOP ANNOUNCEMENT BAR (PURE LUXURY MONOLITH) */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-center text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest uppercase flex items-center justify-center gap-1.5 sm:gap-2 select-none border-b bg-[#110F0E] text-[#E5B85C] border-[#2C2724]">
        <Sparkles size={11} className="text-[#E5B85C] shrink-0" />
        <span className="truncate sm:whitespace-normal">Complimentary Express Dispatch on The 3-Step Sacred Ritual • 100% Zero White Cast Guaranteed</span>
      </div>

      {/* 2. EDITORIAL NAVIGATION BAR WITH SEAMLESS MATCHED BACKGROUND */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b bg-black/95 border-[#27272A] text-white shadow-xl">
        {/* ROW 1: MOBILE MENU BUTTON + LOGO + DESKTOP SEARCH + QUICK ACTIONS */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Hamburger Toggle (Like Zalando & Dot & Key) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-1.5 sm:p-2 -ml-1 rounded-full transition lg:hidden cursor-pointer ${
                isDarkHeader
                  ? 'text-[#DDD7CB] hover:text-[#F3CA74] hover:bg-white/10'
                  : 'text-[#1C1917] hover:text-[#C49B45] hover:bg-stone-100'
              }`}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo */}
            <a href="#top" className="flex items-center group py-0.5 shrink-0" title="CARE-A Beauty Solution">
              <div
                className="relative transition-all duration-200 max-h-[46px] sm:max-h-none"
                style={{
                  height: `${headerLogoHeight}px`,
                  width: `${Math.round(headerLogoHeight * 3.1)}px`,
                  maxWidth: 'min(300px, 60vw)'
                }}
              >
                <Image
                  src={headerLogoSrc}
                  alt="CARE-A Beauty Solution"
                  fill
                  sizes="(max-width: 640px) 190px, 300px"
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
            </a>
          </div>

          {/* Desktop & Tablet Centered Search Bar (Hidden on Mobile) */}
          <div className="hidden sm:flex flex-1 max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="relative flex items-center w-full"
            >
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                placeholder="Search cleanser, moisturizer, sunscreen, ceramides..."
                className={`w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium focus:outline-none transition shadow-inner ${
                  isDarkHeader
                    ? 'bg-[#1C1917] border border-[#3F3A35] text-white placeholder-stone-400 focus:border-[#E5B85C] focus:ring-2 focus:ring-[#E5B85C]/30'
                    : 'bg-[#F7F5F0] border border-[#DDD7CD] text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#C49B45] focus:ring-2 focus:ring-[#C49B45]/20'
                }`}
              />
              <Search
                size={15}
                className={`absolute left-3 pointer-events-none ${
                  isDarkHeader ? 'text-[#E5B85C]' : 'text-[#C49B45]'
                }`}
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ searchQuery: '' })}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-200 cursor-pointer"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons (Responsive sizing & touch targets) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Express Delivery / Order Tracking */}
            <button
              type="button"
              onClick={openProfile}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full border border-transparent transition cursor-pointer ${
                isDarkHeader
                  ? 'text-stone-300 hover:text-[#E5B85C] hover:bg-stone-900'
                  : 'text-stone-700 hover:text-[#C49B45] hover:bg-stone-100'
              }`}
              title="Track Order & Express Delivery"
              aria-label="Track Order"
            >
              <Truck size={17} className={isDarkHeader ? 'text-[#E5B85C]' : 'text-[#C49B45]'} />
              <span className={`hidden xl:inline text-xs font-semibold tracking-wide ${isDarkHeader ? 'text-white' : 'text-stone-800'}`}>
                Track
              </span>
            </button>

            {/* Shopping Bag with Live Badge */}
            <button
              type="button"
              onClick={openCart}
              className={`relative flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full transition shadow-xs cursor-pointer ${
                isDarkHeader
                  ? 'bg-[#1C1917] hover:bg-black border border-stone-700 hover:border-[#E5B85C] text-[#E5B85C]'
                  : 'bg-stone-100 hover:bg-stone-200 border border-stone-200 hover:border-[#C49B45] text-stone-900'
              }`}
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={16} className={isDarkHeader ? 'text-[#E5B85C]' : 'text-[#C49B45]'} />
              <span className={`hidden sm:inline text-xs font-bold uppercase tracking-wider ${isDarkHeader ? 'text-[#E5B85C]' : 'text-stone-900'}`}>
                Bag
              </span>
              {totalItemCount > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center font-black shadow-xs ${
                    isDarkHeader ? 'bg-[#E5B85C] text-[#1C1917]' : 'bg-[#1C1917] text-[#E5B85C]'
                  }`}
                >
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Account */}
            <button
              type="button"
              onClick={openProfile}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full text-xs font-bold tracking-wider transition shadow-xs cursor-pointer ${
                isDarkHeader
                  ? 'border border-[#E5B85C]/70 bg-[#1C1917] hover:bg-black text-[#E5B85C]'
                  : 'border border-[#C49B45]/50 bg-stone-100 hover:bg-stone-200 text-stone-900'
              }`}
              title={user ? `Signed in as ${user.name}` : 'Login / Account'}
              aria-label="User Profile"
            >
              <User size={15} />
              <span className="hidden sm:inline font-bold">
                {user ? user.name.split(' ')[0] : 'Login'}
              </span>
            </button>
          </div>
        </div>

        {/* ROW 1.5: MOBILE SEARCH BAR (Visible ONLY on mobile < sm, like Zalando & Dot & Key) */}
        <div className="sm:hidden px-3.5 pb-2.5 pt-0.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="relative flex items-center w-full"
          >
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
              placeholder="Search cleanser, moisturizer, sunscreen..."
              className={`w-full pl-9 pr-8 py-2 rounded-full text-xs font-medium focus:outline-none transition shadow-inner ${
                isDarkHeader
                  ? 'bg-[#1C1917] border border-[#3F3A35] text-white placeholder-stone-400 focus:border-[#E5B85C]'
                  : 'bg-[#F7F5F0] border border-[#DDD7CD] text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#C49B45]'
              }`}
            />
            <Search
              size={14}
              className={`absolute left-3 pointer-events-none ${
                isDarkHeader ? 'text-[#E5B85C]' : 'text-[#C49B45]'
              }`}
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => handleFilterChange({ searchQuery: '' })}
                className="absolute right-2.5 text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </form>
        </div>
      </header>

      {/* 2.5 QUICK CATEGORY 1-2-3 BAR */}
      <CategoryStoryBar
        selectedCategory={filters.category}
        onSelectCategory={(cat) => handleNavCategoryClick(cat)}
      />

      {/* 3. CINEMATIC VIDEO CAMPAIGN HERO (THE BARRIER RITUAL) */}
      <CinematicHero
        onOpenRoutineModal={() => setIsRoutineOpen(true)}
        onScrollToProducts={() => {
          const el = document.getElementById('products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        heroConfig={heroConfig}
      />

      {/* 4. MARQUEE BANNER */}
      <div className="border-y border-[#D5CCB8] bg-[#F3EDE2] py-3.5 overflow-hidden">
        <div className="marquee flex gap-8 text-[11px] font-mono font-black uppercase tracking-[0.25em] text-[#1C1917]">
          {storefrontCms?.sectionContent?.marqueeAnnouncements?.length ? (
            storefrontCms.sectionContent.marqueeAnnouncements.map((item, idx) => (
              <span key={idx}>{item}</span>
            ))
          ) : (
            <>
              <span className="text-[#064E3B] font-black">• 72H DEEP DEWY MOISTURE</span>
              <span className="text-[#1C1917] font-black">• 5 SKIN-IDENTICAL CERAMIDES</span>
              <span className="text-[#B45309] font-black">• 100% INVISIBLE MINERAL SUNSCREEN</span>
              <span className="text-[#1C1917] font-black">• GENTLE SILK FOAM CLEANSER</span>
              <span className="text-[#064E3B] font-black">• DERMATOLOGIST TESTED ON INDIAN SKIN</span>
              <span className="text-[#1C1917] font-black">• ZERO WHITE CAST • ZERO TOXINS</span>
              <span className="text-[#064E3B] font-black">• 72H DEEP DEWY MOISTURE</span>
              <span className="text-[#B45309] font-black">• 5 BARRIER CERAMIDES</span>
            </>
          )}
        </div>
      </div>

      {/* 5. CORE PRODUCTS SHOWCASE */}
      <section id="products" className="py-16 md:py-24 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F3EDE2] border border-[#D5CCB8] text-xs font-mono font-bold uppercase tracking-wider text-[#785412] mb-3">
            Everyday Skincare
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-[#1C1917] leading-tight">
            Our Formulations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#57534E] leading-relaxed">
            Simple, gentle, and effective daily skincare crafted for Indian skin and weather.
          </p>
        </div>

        {/* Active Filter Reset Pill */}
        {filters.category !== 'all' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#785412] bg-[#F3EDE2] border border-[#D5CCB8] px-3.5 py-1.5 rounded-full capitalize">
              Showing: {filters.category}
            </span>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, category: 'all' }))}
              className="text-xs font-mono font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#043327] bg-white border border-[#E8E2D5] px-3 py-1.5 rounded-full shadow-2xs transition cursor-pointer"
            >
              Show All 3
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        {/* 6. COMPLETE 3-STEP COMBO OFFER */}
        <div className="mt-14 sm:mt-16 rounded-3xl bg-[#F5EFE6] border border-[#E5DEC9] p-7 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DD] border border-[#D5CCB8] text-[#785412] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Sparkles size={12} />
                <span>Complete Daily Kit • Save 15%</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917]">
                The 3-Step Daily Skincare Kit
              </h3>
              <p className="mt-2 text-[#57534E] text-sm leading-relaxed">
                Everything your skin needs every day: Refreshing Cleanser, Hydrating Moisturizer, and Ray Barrier Sunscreen (SPF 50+).
              </p>
              <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2 text-xs font-mono text-[#064E3B]">
                <span className="bg-white border border-[#E8E2D5] px-3 py-1 rounded-full">✓ Free Express Delivery</span>
                <span className="bg-white border border-[#E8E2D5] px-3 py-1 rounded-full">✓ Non-Greasy & Lightweight</span>
                <span className="bg-white border border-[#E8E2D5] px-3 py-1 rounded-full">✓ Suitable for All Skin Types</span>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-3.5 shrink-0">
              <div className="text-center lg:text-right">
                <span className="text-xs text-[#A8A29E] line-through mr-2 font-mono">₹{CORE_TRIO_BUNDLE.compareAtPrice}</span>
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#1C1917]">₹{CORE_TRIO_BUNDLE.price}</span>
                <span className="block text-xs text-[#064E3B] font-mono mt-0.5">Save ₹348 automatically</span>
              </div>

              <button
                type="button"
                onClick={handleAddBundle}
                className={`px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  bundleNotice
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-[#1C1917] hover:bg-[#064E3B] text-white hover:scale-105 active:scale-95'
                }`}
              >
                {bundleNotice ? (
                  <>
                    <Check size={16} />
                    <span>Kit Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    <span>Get All 3 Items • ₹{CORE_TRIO_BUNDLE.price}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 4.2 Step 3: Clinical Trials, Transformation Stories & Verified Reviews Hub */}
      <ClinicalReviewsHub
        doctorTestimonials={storefrontCms?.doctorTestimonials}
        realSkinStories={storefrontCms?.realSkinStories}
        memberReviews={storefrontCms?.memberReviews}
        sectionBadge={storefrontCms?.sectionContent?.clinicalBadge}
        sectionHeading={storefrontCms?.sectionContent?.clinicalHeading}
        sectionHeadingHighlight={storefrontCms?.sectionContent?.clinicalHeadingHighlight}
        sectionDescription={storefrontCms?.sectionContent?.clinicalDescription}
      />

      {/* 7. FORMULATION QUALITY STANDARDS */}
      <section id="standards" className="py-20 bg-[#F5EFE6] border-t border-[#E8E2D5] px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#785412]">
              {storefrontCms?.sectionContent?.standardsBadge || 'The Holy Grail Promise'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#1C1917] mt-2">
              {storefrontCms?.sectionContent?.standardsHeading || 'Gentle Ingredients. Real Glowing Skin.'}
            </h2>
            <p className="mt-3 text-sm text-[#292524] font-medium max-w-2xl mx-auto">
              {storefrontCms?.sectionContent?.standardsDescription ||
                'Every daily formula is crafted to care for your skin barrier—comfortingly rich, non-sticky, and made specifically for Indian weather.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(storefrontCms?.sectionContent?.standardsPillars || []).map((pillar, idx) => {
              const iconMap: Record<string, React.ReactNode> = {
                ceramides: <Droplets className="text-[#064E3B] mb-4" size={26} />,
                sunscreen: <Sun className="text-[#B45309] mb-4" size={26} />,
                cleansing: <Shield className="text-[#0284C7] mb-4" size={26} />,
                toxin_free: <Heart className="text-[#BE185D] mb-4" size={26} />
              };
              return (
                <div key={pillar.id || idx} className="p-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-sm">
                  {iconMap[pillar.icon] || <Droplets className="text-[#064E3B] mb-4" size={26} />}
                  <h4 className="text-lg font-editorial font-bold text-[#1C1917] mb-2">{pillar.title}</h4>
                  <p className="text-xs text-[#292524] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. VIP ALLOCATION & WAITLIST */}
      <section id="notify" className="py-20 md:py-24 px-5 md:px-12 bg-[#FBF9F5] border-t border-[#E8E2D5]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#064E3B]/10 border border-[#064E3B]/20 text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#064E3B]">
            {storefrontCms?.sectionContent?.vipBadge || 'Sacred Inner Circle'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[#1C1917] mt-3 leading-tight">
            {storefrontCms?.sectionContent?.vipHeading || 'Reserve Priority Allocation for New Batches'}
          </h2>
          <p className="mt-4 text-sm text-[#292524] font-medium max-w-xl mx-auto">
            {storefrontCms?.sectionContent?.vipDescription ||
              'Join our private circle to receive limited small-batch reserve access, complimentary travel miniatures, and invitations to clinical trials.'}
          </p>

          <div className="mt-8 max-w-md mx-auto">
            {joined ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center gap-3 text-sm font-semibold text-[#064E3B]"
              >
                <Check size={20} className="text-[#064E3B]" />
                <span>You have secured priority allocation! Check your inbox shortly.</span>
              </motion.div>
            ) : (
              <form onSubmit={joinList} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 rounded-full border border-[#BDB4A1] bg-white px-5 py-3.5 focus-within:border-[#1C1917] transition shadow-sm">
                  <Mail size={16} className="text-[#1C1917]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-[#78716C] text-[#1C1917] font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3.5 rounded-full bg-[#1C1917] hover:bg-[#064E3B] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Reserving...' : 'Join Waitlist'}
                </button>
              </form>
            )}
            {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
          </div>
        </div>
      </section>

      {/* 9. EDITORIAL FOOTER WITH SEAMLESS LOGO MATCH */}
      <footer
        className={`border-t px-5 md:px-12 py-12 text-xs transition-colors duration-300 ${
          isDarkFooter
            ? 'border-stone-800 bg-black text-[#D6D3D1]'
            : 'border-[#EAE5DB] bg-white text-stone-600'
        }`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div
              className="relative mb-4 transition-all duration-200"
              style={{
                height: `${footerLogoHeight}px`,
                width: `${footerLogoHeight * 3.6}px`,
                maxWidth: '320px'
              }}
            >
              <Image
                src={footerLogoSrc}
                alt="CARE-A Beauty Solution"
                fill
                className="object-contain object-left"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className={`text-xs leading-relaxed ${isDarkFooter ? 'text-[#D6D3D1]' : 'text-stone-600'}`}>
              {storefrontCms?.sectionContent?.footerDescription ||
                'Bio-compatible dermatological skincare designed to restore, replenish, and protect the cellular barrier.'}
            </p>
          </div>

          <div>
            <h5
              className={`font-mono font-black uppercase tracking-wider text-xs mb-3 ${
                isDarkFooter ? 'text-[#E5B85C]' : 'text-[#854D0E]'
              }`}
            >
              The Core Trio
            </h5>
            <ul className="space-y-2.5 font-medium">
              <li>
                <a
                  href="#products"
                  className={`transition ${isDarkFooter ? 'text-[#D6D3D1] hover:text-[#E5B85C]' : 'text-stone-600 hover:text-[#854D0E]'}`}
                >
                  Refreshing Skin Cleanser (120ml)
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className={`transition ${isDarkFooter ? 'text-[#D6D3D1] hover:text-[#E5B85C]' : 'text-stone-600 hover:text-[#854D0E]'}`}
                >
                  Hydrating Moisturizer (50g)
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className={`transition ${isDarkFooter ? 'text-[#D6D3D1] hover:text-[#E5B85C]' : 'text-stone-600 hover:text-[#854D0E]'}`}
                >
                  Ray Barrier Sunscreen (100ml)
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className={`transition font-bold ${isDarkFooter ? 'text-[#E5B85C] hover:underline' : 'text-[#854D0E] hover:underline'}`}
                >
                  The 3-Step Protocol Bundle (Save 15%)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5
              className={`font-mono font-black uppercase tracking-wider text-xs mb-3 ${
                isDarkFooter ? 'text-[#E5B85C]' : 'text-[#854D0E]'
              }`}
            >
              Official Marketplace Stores
            </h5>
            <div className="flex flex-col gap-2">
              <a
                href="https://amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl border flex items-center justify-between px-3.5 transition shadow-xs group cursor-pointer ${
                  isDarkFooter
                    ? 'bg-[#110F0E] hover:bg-[#1C1917] border-stone-800'
                    : 'bg-[#FBF9F5] hover:bg-[#F3EDE2] border-[#D5CCB8]'
                }`}
                title="CARE-A on Amazon"
              >
                <div className="flex items-center gap-2">
                  <AmazonLogo className="h-4 w-auto" variant={isDarkFooter ? 'white' : 'color'} />
                  <span className={`text-[11px] font-bold ${isDarkFooter ? 'text-white' : 'text-[#111827]'}`}>
                    Amazon Storefront
                  </span>
                </div>
                <ExternalLink
                  size={11}
                  className={isDarkFooter ? 'text-stone-400 group-hover:text-white' : 'text-[#78716C] group-hover:text-[#111827]'}
                />
              </a>

              <a
                href="https://nykaa.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl border flex items-center justify-between px-3.5 transition shadow-xs group cursor-pointer ${
                  isDarkFooter
                    ? 'bg-[#110F0E] hover:bg-[#1C1917] border-stone-800'
                    : 'bg-white hover:bg-[#FFF1F5] border-[#D5CCB8]'
                }`}
                title="CARE-A on Nykaa"
              >
                <div className="flex items-center gap-2">
                  <NykaaLogo className="h-4 w-auto" variant="color" />
                  <span className="text-[11px] font-bold text-[#FC2779]">Nykaa Beauty</span>
                </div>
                <ExternalLink size={11} className="text-[#78716C] group-hover:text-[#FC2779]" />
              </a>

              <a
                href="https://flipkart.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-xl border flex items-center justify-between px-3.5 transition shadow-xs group cursor-pointer ${
                  isDarkFooter
                    ? 'bg-[#110F0E] hover:bg-[#1C1917] border-stone-800'
                    : 'bg-white hover:bg-[#EFF6FF] border-[#D5CCB8]'
                }`}
                title="CARE-A on Flipkart"
              >
                <div className="flex items-center gap-2">
                  <FlipkartLogo className="h-4 w-auto" variant="color" />
                  <span className="text-[11px] font-bold text-[#2874F0]">Flipkart Flagship</span>
                </div>
                <ExternalLink size={11} className="text-[#78716C] group-hover:text-[#2874F0]" />
              </a>
            </div>
          </div>

          <div>
            <h5
              className={`font-mono font-black uppercase tracking-wider text-xs mb-3 ${
                isDarkFooter ? 'text-[#E5B85C]' : 'text-[#854D0E]'
              }`}
            >
              Dermatological Care
            </h5>
            <p className={`text-xs leading-relaxed mb-3 ${isDarkFooter ? 'text-[#D6D3D1]' : 'text-stone-600'}`}>
              Have questions regarding your skin type or protocol formulation?
            </p>
            <a
              href="mailto:care@careabeautysolution.com"
              className={`font-mono font-bold hover:underline block mb-2 ${
                isDarkFooter ? 'text-[#E5B85C]' : 'text-[#854D0E]'
              }`}
            >
              care@careabeautysolution.com
            </a>
            <button
              onClick={openProfile}
              className={`text-[11px] font-mono hover:underline transition font-bold cursor-pointer ${
                isDarkFooter ? 'text-[#E5B85C]' : 'text-[#854D0E]'
              }`}
            >
              Client Portal &amp; Past Orders →
            </button>
          </div>
        </div>

        <div
          className={`max-w-7xl mx-auto pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDarkFooter ? 'border-stone-800 text-stone-400' : 'border-[#EAE5DB] text-stone-500'
          }`}
        >
          <p>© {new Date().getFullYear()} CARE-A Beauty Solution Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <a href="#privacy" className="hover:text-stone-900 dark:hover:text-white transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-stone-900 dark:hover:text-white transition">Terms of Service</a>
            <a
              href="/admin"
              className={`hover:underline font-mono text-xs flex items-center gap-1 font-bold ${
                isDarkFooter ? 'text-[#E5B85C]' : 'text-[#854D0E]'
              }`}
            >
              <span>Admin Portal</span>
              <ExternalLink size={11} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition ${isDarkFooter ? 'text-[#E5B85C] hover:text-white' : 'text-stone-600 hover:text-stone-900'}`}
              aria-label="Follow us on Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </footer>

      {/* 10. ROUTINE FINDER MODAL */}
      <RoutineModal
        isOpen={isRoutineOpen}
        onClose={() => setIsRoutineOpen(false)}
      />

      {/* 11. INTERACTIVE SHOPPING BAG DRAWER */}
      <CartDrawer />

      {/* 12. SECURE CHECKOUT FLOW (UPI, CARD, COD) */}
      <CheckoutModal />

      {/* 13. CLIENT PROFILE & ORDER HISTORY MODAL */}
      <UserProfileModal />

      {/* 14. MOBILE NAVIGATION DRAWER (ZALANDO & DOT & KEY STYLE) */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onSelectCategory={(cat) => handleNavCategoryClick(cat)}
        onOpenRoutineModal={() => setIsRoutineOpen(true)}
        onOpenProfile={openProfile}
        onOpenCart={openCart}
        user={user}
      />

      {/* 15. MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        onOpenCart={openCart}
        onOpenProfile={openProfile}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onScrollToProducts={() => {
          const el = document.getElementById('products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={filters.category}
      />
    </main>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <Storefront />
    </CartProvider>
  );
}
