import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UserOrdersModal } from './components/UserOrdersModal';
import { AdminPanel } from './components/AdminPanel';
import { GitPushGuideModal } from './components/GitPushGuideModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { Product, ProductVariant, Category, CartItem, Coupon, AuditLog, Order, Review, SkinConcern } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_AUDIT_LOGS, INITIAL_ORDERS } from './data/initialData';

export default function App() {
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkinConcern, setSelectedSkinConcern] = useState<SkinConcern | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('care_beauty_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // User & View State
  const [userPhone, setUserPhone] = useState<string | null>(() => {
    try {
      return localStorage.getItem('care_user_phone') || null;
    } catch {
      return null;
    }
  });

  // Modals Toggle State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isGitGuideOpen, setIsGitGuideOpen] = useState(false);

  // Sync Cart to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('care_beauty_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Sync Data from Backend API
  const fetchBackendData = async () => {
    try {
      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      if (pData.success && pData.data.length > 0) setProducts(pData.data);

      const cRes = await fetch('/api/categories');
      const cData = await cRes.json();
      if (cData.success && cData.data.length > 0) setCategories(cData.data);

      const cpRes = await fetch('/api/coupons');
      const cpData = await cpRes.json();
      if (cpData.success) setCoupons(cpData.data);

      const aRes = await fetch('/api/admin/audit-logs');
      const aData = await aRes.json();
      if (aData.success) setAuditLogs(aData.data);

      const oRes = await fetch('/api/orders?role=ADMIN');
      const oData = await oRes.json();
      if (oData.success) setOrders(oData.data);

      const rRes = await fetch('/api/reviews');
      const rData = await rRes.json();
      if (rData.success) setReviews(rData.data);
    } catch (err) {
      console.log('Using initial fallback datasets');
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Filter products logic
  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (selectedSkinConcern && !p.skinConcerns.includes(selectedSkinConcern)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.keyIngredients.some(ing => ing.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Cart Actions
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.variantId === variant.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: `ci-${Date.now()}`,
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantName: variant.name,
          productImage: product.images[0]?.url || '',
          price: variant.price,
          quantity,
          stock: variant.stock,
        },
      ];
    });
  };

  const handleUpdateQuantity = (variantId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.variantId === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
  };

  // Coupon Application
  const handleApplyCoupon = async (code: string) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data.code);
        setDiscountAmount(data.data.discountAmount);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err: any) {
      return { success: false, message: 'Coupon error' };
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Reviews submission
  const handleAddReview = async (reviewData: { productId: string; userName: string; rating: number; comment: string }) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data.success) {
        fetchBackendData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-300 selection:text-emerald-950">
      {/* Primary Sticky Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={catId => setSelectedCategory(catId)}
        selectedSkinConcern={selectedSkinConcern}
        onSelectSkinConcern={concern => setSelectedSkinConcern(concern)}
        searchQuery={searchQuery}
        onSearchChange={q => setSearchQuery(q)}
        cartCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onToggleAdmin={() => setIsAdminView(!isAdminView)}
        isAdmin={isAdminView}
        onOpenGitGuide={() => setIsGitGuideOpen(true)}
        userPhone={userPhone}
      />

      {/* Main Body View */}
      {isAdminView ? (
        <AdminPanel
          products={products}
          categories={categories}
          coupons={coupons}
          auditLogs={auditLogs}
          orders={orders}
          onRefreshData={fetchBackendData}
          onOpenGitGuide={() => setIsGitGuideOpen(true)}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Banner Header */}
          <Banner />

          {/* Product Grid Catalog Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {selectedCategory
                    ? categories.find(c => c.id === selectedCategory)?.name
                    : selectedSkinConcern
                    ? `Formulations for ${selectedSkinConcern}`
                    : 'Clinical Skincare Collection'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Showing {filteredProducts.length} dermatologist-formulated products
                </p>
              </div>

              {(selectedCategory || selectedSkinConcern || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSkinConcern(null);
                    setSearchQuery('');
                  }}
                  className="text-xs text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition"
                >
                  Reset Filters ✕
                </button>
              )}
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                <p className="text-slate-500 text-sm">No products matching your search criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSkinConcern(null);
                    setSearchQuery('');
                  }}
                  className="bg-emerald-950 text-white font-semibold text-xs px-4 py-2 rounded-xl"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onOpenQuickView={p => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* ================= MODALS & DRAWERS ================= */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Cart Slide-out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountAmount={discountAmount}
        appliedCoupon={appliedCoupon}
        onClearCart={() => {
          setCart([]);
          setAppliedCoupon(null);
          setDiscountAmount(0);
        }}
        onOrderPlaced={order => {
          fetchBackendData();
        }}
        userPhone={userPhone}
      />

      {/* User Orders Modal */}
      <UserOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders.filter(o => userPhone && (o.customerPhone === userPhone || o.customerPhone.includes(userPhone.slice(-6))))}
        phone={userPhone || ''}
      />

      {/* Mobile OTP Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(phone, name) => {
          setUserPhone(phone);
          localStorage.setItem('care_user_phone', phone);
          setIsOrdersOpen(true);
        }}
      />

      {/* Step-by-step Git Remote Connect Modal */}
      <GitPushGuideModal isOpen={isGitGuideOpen} onClose={() => setIsGitGuideOpen(false)} />
    </div>
  );
}
