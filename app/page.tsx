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

  // Dynamic CMS State
  const [heroConfig, setHeroConfig] = useState<HeroCmsConfig | null>(null);
  const [productsList, setProductsList] = useState<Product[]>(CORE_PRODUCTS);
  const [storefrontCms, setStorefrontCms] = useState<StorefrontCmsData>(INITIAL_STOREFRONT_CMS);

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
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#3e3a44] border-b border-[#5c5765] px-3 sm:px-4 py-1.5 sm:py-2 text-center text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-[#E5B85C] uppercase flex items-center justify-center gap-1.5 sm:gap-2 select-none">
        <Sparkles size={11} className="text-[#E5B85C] shrink-0" />
        <span className="truncate sm:whitespace-normal">Complimentary Express Dispatch on The 3-Step Sacred Ritual • 100% Zero White Cast Guaranteed</span>
      </div>

      {/* 2. EDITORIAL NAVIGATION BAR WITH SEAMLESS MATCHED BACKGROUND */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#4f4b55] border-b border-[#3c3942] transition-all shadow-lg">
        {/* ROW 1: MOBILE MENU BUTTON + LOGO + DESKTOP SEARCH + QUICK ACTIONS */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Hamburger Toggle (Like Zalando & Dot & Key) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 sm:p-2 -ml-1 text-[#DDD7CB] hover:text-[#F3CA74] hover:bg-white/10 rounded-full transition lg:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo */}
            <a href="#top" className="flex items-center group py-0.5 shrink-0" title="CARE-A Beauty Solution">
              <div className="relative h-8 sm:h-11 md:h-13 w-32 sm:w-44 md:w-56">
                <Image
                  src="/images/header.png"
                  alt="CARE-A Beauty Solution"
                  fill
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
                className="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2 sm:py-2.5 rounded-full bg-[#2c2833] border border-[#777180] text-white placeholder-[#DDD7CB] text-xs sm:text-sm font-medium focus:outline-none focus:border-[#F3CA74] focus:ring-2 focus:ring-[#F3CA74]/40 transition shadow-inner"
              />
              <Search size={15} className="absolute left-3 text-[#F3CA74] pointer-events-none" />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ searchQuery: '' })}
                  className="absolute right-2.5 text-[#DDD7CB] hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
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
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full text-white hover:text-[#F3CA74] hover:bg-[#3c3842] border border-transparent hover:border-[#635e6b]/60 transition cursor-pointer"
              title="Track Order & Express Delivery"
              aria-label="Track Order"
            >
              <Truck size={17} className="text-[#F3CA74]" />
              <span className="hidden xl:inline text-xs font-semibold tracking-wide text-white">Track</span>
            </button>

            {/* Shopping Bag with Live Badge */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full bg-[#2c2833] hover:bg-[#221e28] border border-[#777180] hover:border-[#F3CA74] text-white transition shadow-sm cursor-pointer"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={16} className="text-[#F3CA74]" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-[#F3CA74]">
                Bag
              </span>
              {totalItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F3CA74] text-[#1C1917] text-[10px] font-mono flex items-center justify-center font-black shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Account */}
            <button
              type="button"
              onClick={openProfile}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full border border-[#F3CA74]/70 bg-[#2c2833] hover:bg-[#221e28] text-xs font-bold tracking-wider text-[#F3CA74] transition shadow-xs cursor-pointer"
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
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#2c2833] border border-[#777180] text-white placeholder-[#DDD7CB] text-xs font-medium focus:outline-none focus:border-[#F3CA74] transition shadow-inner"
            />
            <Search size={14} className="absolute left-3 text-[#F3CA74] pointer-events-none" />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => handleFilterChange({ searchQuery: '' })}
                className="absolute right-2.5 text-[#DDD7CB] hover:text-white p-1 rounded-full cursor-pointer"
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

      {/* 9. EDITORIAL FOOTER WITH OFFICIAL HEADER LOGO */}
      <footer className="border-t border-[#3c3842] bg-[#47434d] px-5 md:px-12 py-12 text-xs text-[#F5EFE6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="relative h-14 md:h-16 w-60 md:w-80 mb-4">
              <Image
                src="/images/header.png"
                alt="CARE-A Beauty Solution"
                fill
                className="object-contain object-left"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-[#F5EFE6] leading-relaxed">
              {storefrontCms?.sectionContent?.footerDescription ||
                'Bio-compatible dermatological skincare designed to restore, replenish, and protect the cellular barrier.'}
            </p>
          </div>

          <div>
            <h5 className="font-mono font-black text-[#F3CA74] uppercase tracking-wider text-xs mb-3">
              The Core Trio
            </h5>
            <ul className="space-y-2.5 font-medium">
              <li>
                <a href="#products" className="text-[#F5EFE6] hover:text-[#F3CA74] transition">
                  Refreshing Skin Cleanser (120ml)
                </a>
              </li>
              <li>
                <a href="#products" className="text-[#F5EFE6] hover:text-[#F3CA74] transition">
                  Hydrating Moisturizer (50g)
                </a>
              </li>
              <li>
                <a href="#products" className="text-[#F5EFE6] hover:text-[#F3CA74] transition">
                  Ray Barrier Sunscreen (100ml)
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#F3CA74] transition text-[#F3CA74] font-bold">
                  The 3-Step Protocol Bundle (Save 15%)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono font-black text-[#F3CA74] uppercase tracking-wider text-xs mb-3">
              Official Marketplace Stores
            </h5>
            <div className="flex flex-col gap-2">
              <a
                href="https://amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white hover:bg-[#F3EDE2] border border-[#D5CCB8] flex items-center justify-between px-3.5 transition shadow-xs group cursor-pointer"
                title="CARE-A on Amazon"
              >
                <div className="flex items-center gap-2">
                  <AmazonLogo className="h-4 w-auto" variant="color" />
                  <span className="text-[11px] font-bold text-[#111827]">Amazon Storefront</span>
                </div>
                <ExternalLink size={11} className="text-[#78716C] group-hover:text-[#111827]" />
              </a>

              <a
                href="https://nykaa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white hover:bg-[#FFF1F5] border border-[#D5CCB8] flex items-center justify-between px-3.5 transition shadow-xs group cursor-pointer"
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
                className="p-2 rounded-xl bg-white hover:bg-[#EFF6FF] border border-[#D5CCB8] flex items-center justify-between px-3.5 transition shadow-xs group cursor-pointer"
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
            <h5 className="font-mono font-black text-[#F3CA74] uppercase tracking-wider text-xs mb-3">
              Dermatological Care
            </h5>
            <p className="text-xs text-[#F5EFE6] leading-relaxed mb-3">
              Have questions regarding your skin type or protocol formulation?
            </p>
            <a
              href="mailto:care@careabeautysolution.com"
              className="font-mono text-[#F3CA74] font-bold hover:underline block mb-2"
            >
              care@careabeautysolution.com
            </a>
            <button
              onClick={openProfile}
              className="text-[11px] font-mono text-[#F3CA74] hover:text-white transition font-bold underline cursor-pointer"
            >
              Client Portal & Past Orders →
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-[#635e6b]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#F5EFE6]">
          <p>© {new Date().getFullYear()} CARE-A Beauty Solution Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition">Terms of Service</a>
            <a
              href="/admin"
              className="text-[#F3CA74] hover:underline font-mono text-xs flex items-center gap-1 font-bold"
            >
              <span>Admin Portal</span>
              <ExternalLink size={11} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#F3CA74] hover:text-white transition" aria-label="Follow us on Instagram">
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
