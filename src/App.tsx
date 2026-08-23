import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
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
import { Footer } from './components/Footer';

import { Product, ProductVariant, Category, CartItem, Coupon, AuditLog, Order, Review, SkinConcern } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_AUDIT_LOGS, INITIAL_ORDERS } from './data/initialData';
import { Shield, Lock, ArrowRight, Sparkles, Award } from 'lucide-react';
import { safeFetchApi } from './utils/apiHelper';

export default function App() {
  // Navigation Route Check
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDirectAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');

  // Check if current route is a PDP path (e.g. /product/hydrating-moisturizer)
  const isPdpRoute = currentPath.startsWith('/product/') || currentPath.startsWith('/products/');
  const pdpSlug = isPdpRoute ? currentPath.split('/')[2] : null;

  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const userOrdersStr = localStorage.getItem('care_user_orders');
      const beautyOrdersStr = localStorage.getItem('care_beauty_orders');
      const userOrders: Order[] = userOrdersStr ? JSON.parse(userOrdersStr) : [];
      const beautyOrders: Order[] = beautyOrdersStr ? JSON.parse(beautyOrdersStr) : [];
      const map = new Map<string, Order>();
      [...userOrders, ...beautyOrders, ...INITIAL_ORDERS].forEach(o => map.set(o.id, o));
      return Array.from(map.values());
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [reviews, setReviews] = useState<Review[]>([]);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkinConcern, setSelectedSkinConcern] = useState<SkinConcern | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected PDP Product
  const activePdpProduct = isPdpRoute && pdpSlug
    ? products.find(p => p.slug === pdpSlug || p.id === pdpSlug) || products[0]
    : null;

  // Guest Cart Session ID for persistent Redis/backend cart storage
  const [guestSessionId] = useState<string>(() => {
    let id = localStorage.getItem('care_guest_session_id');
    if (!id) {
      id = `gs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem('care_guest_session_id', id);
    }
    return id;
  });

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

  // User Auth State
  const [user, setUser] = useState<{
    id?: string;
    phone?: string;
    email?: string;
    fullName?: string;
    accessToken?: string;
  } | null>(() => {
    try {
      const phone = localStorage.getItem('care_user_phone');
      const email = localStorage.getItem('care_user_email');
      const fullName = localStorage.getItem('care_user_name');
      const accessToken = localStorage.getItem('care_access_token');
      if (phone || email || accessToken) {
        return { phone: phone || undefined, email: email || undefined, fullName: fullName || 'Care Customer', accessToken: accessToken || undefined };
      }
      return null;
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
  const [isAddressesOpen, setIsAddressesOpen] = useState(false);

  // Sync Cart to Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('care_beauty_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Send Heartbeat to Live Visitor Counter Backend
  useEffect(() => {
    const sendHeartbeat = () => {
      fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: guestSessionId,
          path: currentPath,
        }),
      }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [guestSessionId, currentPath]);


  // Sync Data from Backend API
  const fetchBackendData = async () => {
    try {
      const pRes = await safeFetchApi('/api/products');
      if (pRes.data && pRes.data.success && pRes.data.data.length > 0) setProducts(pRes.data.data);

      const cRes = await safeFetchApi('/api/categories');
      if (cRes.data && cRes.data.success && cRes.data.data.length > 0) setCategories(cRes.data.data);

      const cpRes = await safeFetchApi('/api/coupons');
      if (cpRes.data && cpRes.data.success) setCoupons(cpRes.data.data);

      const aRes = await safeFetchApi('/api/admin/audit-logs');
      if (aRes.data && aRes.data.success) setAuditLogs(aRes.data.data);

      const oRes = await safeFetchApi('/api/orders?role=ADMIN');
      if (oRes.data && oRes.data.success && Array.isArray(oRes.data.data)) {
        setOrders(prev => {
          const map = new Map<string, Order>();
          [...oRes.data.data, ...prev].forEach((o: Order) => map.set(o.id, o));
          return Array.from(map.values());
        });
      }

      const rRes = await safeFetchApi('/api/reviews');
      if (rRes.data && rRes.data.success) setReviews(rRes.data.data);
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

  // Buy Now Action: adds item to cart and immediately triggers express checkout modal
  const handleBuyNow = (product: Product, variant: ProductVariant, quantity: number) => {
    handleAddToCart(product, variant, quantity);
    setIsCheckoutOpen(true);
  };

  // Cart Actions (Synced with Backend Persistent Cart Store)
  const handleAddToCart = async (product: Product, variant: ProductVariant, quantity: number) => {
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

    try {
      const headers: Record<string, string> = {
        'x-cart-session-id': guestSessionId,
      };
      if (user?.accessToken) headers['Authorization'] = `Bearer ${user.accessToken}`;

      await safeFetchApi('/api/cart/items', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: product.id,
          variantId: variant.id,
          quantity,
          sessionId: guestSessionId,
        }),
      });
    } catch (e) {
      console.error('Cart sync note:', e);
    }
  };

  const handleUpdateQuantity = async (variantId: string, delta: number) => {
    let targetQty = 0;
    setCart(prev =>
      prev
        .map(item => {
          if (item.variantId === variantId) {
            const newQty = item.quantity + delta;
            targetQty = newQty;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );

    try {
      const headers: Record<string, string> = {
        'x-cart-session-id': guestSessionId,
      };
      if (user?.accessToken) headers['Authorization'] = `Bearer ${user.accessToken}`;

      await safeFetchApi(`/api/cart/items/${variantId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ quantity: targetQty, sessionId: guestSessionId }),
      });
    } catch (e) {
      console.error('Cart update sync note:', e);
    }
  };

  const handleRemoveCartItem = async (variantId: string) => {
    setCart(prev => prev.filter(item => item.variantId !== variantId));
    try {
      const headers: Record<string, string> = {
        'x-cart-session-id': guestSessionId,
      };
      if (user?.accessToken) headers['Authorization'] = `Bearer ${user.accessToken}`;

      await safeFetchApi(`/api/cart/items/${variantId}?sessionId=${guestSessionId}`, {
        method: 'DELETE',
        headers,
      });
    } catch (e) {
      console.error('Cart item removal sync note:', e);
    }
  };

  // Coupon Application
  const handleApplyCoupon = async (code: string) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cleanCode = code.trim().toUpperCase();

    const apiRes = await safeFetchApi('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: cleanCode, orderAmount: subtotal }),
    });

    if (apiRes.data && apiRes.data.success) {
      setAppliedCoupon(apiRes.data.data.code);
      setDiscountAmount(apiRes.data.data.discountAmount);
      return { success: true };
    }

    // Client-side fallback coupon validation for static Vercel deployment
    if (cleanCode === 'GLOW200') {
      const discount = Math.min(200, subtotal);
      setAppliedCoupon('GLOW200');
      setDiscountAmount(discount);
      return { success: true };
    } else if (cleanCode === 'WELCOME100') {
      const discount = Math.min(100, subtotal);
      setAppliedCoupon('WELCOME100');
      setDiscountAmount(discount);
      return { success: true };
    } else if (cleanCode === 'CARE10') {
      const discount = Math.round(subtotal * 0.1 * 100) / 100;
      setAppliedCoupon('CARE10');
      setDiscountAmount(discount);
      return { success: true };
    } else if (cleanCode === 'SERUM150') {
      const discount = Math.min(150, subtotal);
      setAppliedCoupon('SERUM150');
      setDiscountAmount(discount);
      return { success: true };
    }

    return { success: false, message: 'Invalid coupon code or minimum order condition not met' };
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('care_user_phone');
    localStorage.removeItem('care_user_email');
    localStorage.removeItem('care_user_name');
    localStorage.removeItem('care_access_token');
    localStorage.removeItem('care_refresh_token');
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // SEPARATE STANDALONE ADMIN PORTAL ROUTE (/admin)
  if (isDirectAdminRoute) {
    return (
      <ProtectedAdminRoute onRedirectToStore={() => navigateTo('/')}>
        <AdminPortal
          products={products}
          categories={categories}
          coupons={coupons}
          auditLogs={auditLogs}
          orders={orders}
          onRefreshData={fetchBackendData}
          onExitToStore={() => navigateTo('/')}
        />
      </ProtectedAdminRoute>
    );
  }

  // CUSTOMER STOREFRONT VIEW (Clean, No Admin controls shown)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-300 selection:text-emerald-950">
      {/* Customer Header Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={catId => {
          setSelectedCategory(catId);
          if (currentPath !== '/') navigateTo('/');
        }}
        selectedSkinConcern={selectedSkinConcern}
        onSelectSkinConcern={concern => {
          setSelectedSkinConcern(concern);
          if (currentPath !== '/') navigateTo('/');
        }}
        searchQuery={searchQuery}
        onSearchChange={q => setSearchQuery(q)}
        cartCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAddresses={() => setIsAddressesOpen(true)}
        userPhone={user?.phone || null}
        userEmail={user?.email || null}
        userName={user?.fullName || null}
        onLogout={handleLogout}
      />

      <main className="flex-1">
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
          /* Home View: Hero Banner + Interactive Customer Engagement Hub + Full PLP Catalog Grid */
          <div>
            <Banner
              products={products}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onSelectProduct={p => navigateTo(`/product/${p.slug}`)}
            />

            {/* Interactive Clinical Customer Engagement Hub */}
            <CustomerEngagementHub
              products={products}
              onAddToCart={handleAddToCart}
              onSelectProduct={p => navigateTo(`/product/${p.slug}`)}
            />

            {/* Core Featured Formulations Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-emerald-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Clinical Skincare Line
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
                    {selectedCategory
                      ? categories.find(c => c.id === selectedCategory)?.name
                      : selectedSkinConcern
                      ? `Formulations for ${selectedSkinConcern}`
                      : 'Featured Formulations'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Dermatologically tested, 100% fragrance-free, non-comedogenic formulations for Indian skin
                  </p>
                </div>

                <div className="flex items-center gap-3">
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

                  <button
                    onClick={() => navigateTo('/catalog')}
                    className="bg-emerald-950 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-emerald-900 transition"
                  >
                    View All Catalog <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                  <p className="text-slate-500 text-sm">No formulations matching your search criteria.</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onOpenQuickView={p => navigateTo(`/product/${p.slug}`)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* ================= MODALS & DRAWERS ================= */}
      {/* Product Quick View Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Cart Drawer */}
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
          setOrders(prev => {
            const updated = [order, ...prev.filter(o => o.id !== order.id)];
            try {
              localStorage.setItem('care_user_orders', JSON.stringify(updated));
              localStorage.setItem('care_beauty_orders', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
          fetchBackendData();
        }}
        userPhone={user?.phone || localStorage.getItem('care_user_phone') || null}
        userEmail={user?.email || localStorage.getItem('care_user_email') || null}
        userName={user?.fullName || localStorage.getItem('care_user_name') || null}
      />

      {/* User Orders & Profile Modal */}
      <UserOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders.filter(o => {
          const effectivePhone = user?.phone || localStorage.getItem('care_user_phone');
          return effectivePhone ? o.customerPhone.includes(effectivePhone.slice(-6)) : true;
        })}
        phone={user?.phone || localStorage.getItem('care_user_phone') || ''}
        email={user?.email || localStorage.getItem('care_user_email') || ''}
        fullName={user?.fullName || localStorage.getItem('care_user_name') || ''}
        onUpdateProfile={data => {
          setUser(prev => ({
            ...prev,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
          }));
        }}
        onOpenAddresses={() => setIsAddressesOpen(true)}
      />

      {/* Customer Address Book Modal */}
      <AddressBookModal
        isOpen={isAddressesOpen}
        onClose={() => setIsAddressesOpen(false)}
        accessToken={user?.accessToken || null}
      />

      {/* Auth Modal (OTP + Email/Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={userData => {
          setUser(userData);
          if (userData.phone) localStorage.setItem('care_user_phone', userData.phone);
          if (userData.email) localStorage.setItem('care_user_email', userData.email);
          if (userData.fullName) localStorage.setItem('care_user_name', userData.fullName);
        }}
      />
    </div>
  );
}

