import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  MarketplaceProduct,
  CartItem,
  SavedAddress,
  OrderRecord,
  ProductCategory,
  SkinConcern,
  SkinType,
  Formulation,
  SavedForLaterItem,
} from '../types/marketplace';
import {
  MARKETPLACE_PRODUCTS,
  MOCK_COUPONS,
  MOCK_SAVED_ADDRESSES,
  MOCK_ORDERS,
} from '../data/marketplaceData';

export type AppView = 'HOME' | 'PLP' | 'PDP' | 'ACCOUNT';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

export interface PlpFilters {
  category?: ProductCategory | 'All';
  subCategory?: string;
  brands: string[];
  priceRange: [number, number]; // [min, max]
  minDiscount: number;
  minRating: number;
  skinTypes: SkinType[];
  skinConcerns: SkinConcern[];
  formulations: Formulation[];
  searchQuery: string;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest';
}

export interface StoreContextType {
  // Navigation & Routing
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProduct: MarketplaceProduct | null;
  openPdp: (product: MarketplaceProduct) => void;
  openPlp: (
    categoryOrFilters?: string | Partial<PlpFilters>,
    searchQuery?: string,
    concern?: SkinConcern | string
  ) => void;
  goHome: () => void;
  openHome: () => void;
  openWishlist: () => void;
  openAccount: (tab?: 'orders' | 'addresses' | 'wishlist' | 'profile' | 'rewards') => void;

  // Search & Filters
  filters: PlpFilters;
  setFilters: React.Dispatch<React.SetStateAction<PlpFilters>>;
  resetFilters: () => void;
  globalSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: ProductCategory | 'All' | undefined;
  allProducts: MarketplaceProduct[];

  // Delivery location
  selectedCity: string;
  selectedPincode: string;
  setDeliveryLocation: (city: string, pincode: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: MarketplaceProduct, variantId?: string, qty?: number) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotalDiscount: number;
  deliveryCharge: number;
  cartShippingFee: number;
  cartGrandTotal: number;
  cartFinalTotal: number;

  // Saved For Later
  savedForLater: SavedForLaterItem[];
  saveForLater: (cartItemId: string) => void;
  moveToCartFromSaved: (savedItemId: string) => void;
  removeSavedForLater: (savedItemId: string) => void;

  // Coupons
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean | { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: MarketplaceProduct[];
  wishlistIds: string[];
  toggleWishlist: (product: MarketplaceProduct) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: MarketplaceProduct | null;
  setQuickViewProduct: (product: MarketplaceProduct | null) => void;

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  accountActiveTab: 'orders' | 'addresses' | 'wishlist' | 'profile' | 'rewards';
  setAccountActiveTab: (tab: 'orders' | 'addresses' | 'wishlist' | 'profile' | 'rewards') => void;
  activeTrackingOrder: OrderRecord | null;
  setActiveTrackingOrder: (order: OrderRecord | null) => void;

  // User Auth & Profiles
  isLoggedIn: boolean;
  currentUser: { name: string; phone: string; email: string; skinType?: string } | null;
  loginUser: (name: string, phone: string, email?: string) => void;
  login: (userData: { name: string; phone: string; email?: string; skinType?: string }) => void;
  updateUserProfile: (profile: { name: string; phone: string; email: string; skinType?: string }) => void;
  logoutUser: () => void;
  logout: () => void;

  // Addresses & Orders
  addresses: SavedAddress[];
  savedAddresses: SavedAddress[];
  addAddress: (address: any) => void;
  addSavedAddress: (address: any) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  removeSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  orders: OrderRecord[];
  placeOrder: (
    addressOrData: any,
    maybePaymentMethod?: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD' | string
  ) => OrderRecord;

  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const defaultFilters: PlpFilters = {
  category: 'All',
  brands: [],
  priceRange: [0, 3500],
  minDiscount: 0,
  minRating: 0,
  skinTypes: [],
  skinConcerns: [],
  formulations: [],
  searchQuery: '',
  sortBy: 'popularity',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [filters, setFilters] = useState<PlpFilters>(defaultFilters);

  // Delivery Location
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [selectedPincode, setSelectedPincode] = useState<string>('560038');

  // Cart State (Initialized with 1 flagship item for immediate demonstration)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const initialProduct = MARKETPLACE_PRODUCTS[0];
    return [
      {
        id: 'cart-item-demo-1',
        productId: initialProduct.id,
        variantId: initialProduct.variants[0].id,
        product: initialProduct,
        variant: initialProduct.variants[0],
        quantity: 1,
      },
    ];
  });

  // Saved For Later
  const [savedForLater, setSavedForLater] = useState<SavedForLaterItem[]>([]);

  // Wishlist product IDs
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'cbs-sunscreen-01',
    'cbs-moisturizer-01',
  ]);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('CARE15');

  // Modals & UI States
  const [quickViewProduct, setQuickViewProduct] = useState<MarketplaceProduct | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountActiveTab, setAccountActiveTab] = useState<
    'orders' | 'addresses' | 'wishlist' | 'profile' | 'rewards'
  >('orders');
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderRecord | null>(null);

  // User State - Dynamic and loaded from localStorage / session
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    phone: string;
    email: string;
    skinType?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('cbs_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('cbs_auth_user');
    } catch {
      return false;
    }
  });

  // Addresses & Orders - Dynamic persistence
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem('cbs_saved_addresses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cbs_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Routing Helpers
  const openPdp = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setCurrentView('PDP');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPlp = (
    categoryOrFilters?: string | Partial<PlpFilters>,
    searchQ?: string,
    concern?: SkinConcern | string
  ) => {
    setFilters((prev) => {
      let next: PlpFilters = { ...defaultFilters };
      if (typeof categoryOrFilters === 'string') {
        if (categoryOrFilters !== 'All') {
          next.category = categoryOrFilters as ProductCategory;
        }
      } else if (categoryOrFilters && typeof categoryOrFilters === 'object') {
        next = { ...next, ...categoryOrFilters };
      }
      if (searchQ && typeof searchQ === 'string') {
        next.searchQuery = searchQ;
      }
      if (concern && typeof concern === 'string') {
        next.skinConcerns = [concern as SkinConcern];
      }
      return next;
    });
    setCurrentView('PLP');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentView('HOME');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHome = () => goHome();

  const openWishlist = () => {
    setAccountActiveTab('wishlist');
    setIsAccountModalOpen(true);
  };

  const openAccount = (tab?: 'orders' | 'addresses' | 'wishlist' | 'profile' | 'rewards') => {
    if (tab) setAccountActiveTab(tab);
    setIsAccountModalOpen(true);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const globalSearch = (query: string) => {
    openPlp(undefined, (query || '').trim());
  };

  const searchQuery = filters.searchQuery || '';
  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setDeliveryLocation = (city: string, pincode: string) => {
    setSelectedCity(city);
    setSelectedPincode(pincode);
    showToast(`Delivery location set to ${city} (${pincode})`, 'info');
  };

  // Cart Operations
  const addToCart = (product: MarketplaceProduct, variantId?: string, qty = 1) => {
    const selectedVariant = variantId
      ? product.variants.find((v) => v.id === variantId) || product.variants[0]
      : product.variants[0];

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === selectedVariant.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + qty;
        if (newQty > selectedVariant.stock) {
          showToast(`Only ${selectedVariant.stock} units available in stock`, 'error');
          return prev;
        }
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        showToast(`Updated "${product.name}" quantity in bag`, 'success');
        return updated;
      }

      showToast(`Added "${product.name}" to bag`, 'success');
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: product.id,
          variantId: selectedVariant.id,
          product,
          variant: selectedVariant,
          quantity: qty,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          if (newQty > item.variant.stock) {
            showToast(`Max ${item.variant.stock} units available`, 'error');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    showToast('Removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Saved For Later
  const saveForLater = (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    if (!item) return;
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    setSavedForLater((prev) => [
      ...prev,
      {
        id: `sfl-${Date.now()}`,
        product: item.product,
        variant: item.variant,
        addedAt: new Date().toISOString(),
      },
    ]);
    showToast('Saved for later', 'info');
  };

  const moveToCartFromSaved = (savedItemId: string) => {
    const item = savedForLater.find((i) => i.id === savedItemId);
    if (!item) return;
    setSavedForLater((prev) => prev.filter((i) => i.id !== savedItemId));
    addToCart(item.product, item.variant.id, 1);
  };

  const removeSavedForLater = (savedItemId: string) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== savedItemId));
  };

  // Totals Calculations
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);

  // Coupons
  const applyCoupon = (code: string) => {
    const normalized = (code || '').trim().toUpperCase();
    const found = MOCK_COUPONS.find((c) => c.code === normalized);
    if (!found) {
      showToast('Invalid coupon code. Try CARE15 or GLOW50', 'error');
      return { success: false, message: 'Invalid coupon code. Try CARE15 or GLOW50' };
    }
    if (cartSubtotal < found.minOrder) {
      const msg = `Min order value of ₹${found.minOrder} required for ${found.code}`;
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
    setAppliedCoupon(found.code);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  let cartDiscount = 0;
  if (appliedCoupon) {
    const activeCoupon = MOCK_COUPONS.find((c) => c.code === appliedCoupon);
    if (activeCoupon) {
      if (activeCoupon.discountType === 'PERCENT') {
        cartDiscount = Math.round((cartSubtotal * activeCoupon.discountValue) / 100);
      } else {
        cartDiscount = activeCoupon.discountValue;
      }
    }
  }

  // Free shipping above ₹499
  const deliveryCharge = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 49;
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);

  // Wishlist
  const toggleWishlist = (product: MarketplaceProduct) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from Wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added to Wishlist ❤️`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map((id) => MARKETPLACE_PRODUCTS.find((p) => p.id === id))
      .filter(Boolean) as MarketplaceProduct[];
  }, [wishlistIds]);

  // User Auth & Profiles
  const loginUser = (name: string, phone: string, email?: string, skinType?: string) => {
    const userObj = {
      name: name || 'Customer',
      phone: phone || '',
      email: email || (phone ? `${phone}@carebeauty.in` : 'customer@carebeauty.in'),
      skinType: skinType || 'Combination',
    };
    setIsLoggedIn(true);
    setCurrentUser(userObj);
    try {
      localStorage.setItem('cbs_auth_user', JSON.stringify(userObj));
    } catch (e) {}
    setIsAuthModalOpen(false);
    showToast(`Welcome, ${userObj.name}!`, 'success');
  };

  const login = (userData: { name: string; phone: string; email?: string; skinType?: string }) => {
    loginUser(userData.name, userData.phone, userData.email, userData.skinType);
  };

  const updateUserProfile = (profile: { name: string; phone: string; email: string; skinType?: string }) => {
    const updated = {
      ...(currentUser || {}),
      ...profile,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('cbs_auth_user', JSON.stringify(updated));
    } catch (e) {}
    showToast('Profile updated successfully', 'success');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('cbs_auth_user');
      localStorage.removeItem('cbs_auth_token');
    } catch (e) {}
    setIsAccountModalOpen(false);
    showToast('Signed out successfully', 'info');
  };

  const logout = () => logoutUser();

  const addAddress = (address: any) => {
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      type: (address.type || 'HOME').toUpperCase() as any,
      fullName: address.fullName || address.recipientName || currentUser?.name || 'Customer',
      phone: address.phone || currentUser?.phone || '',
      flatHouse: address.flatHouse || address.addressLine1 || '',
      areaColony: address.areaColony || address.addressLine2 || '',
      landmark: address.landmark || '',
      city: address.city || selectedCity,
      state: address.state || 'Karnataka',
      pincode: address.pincode || selectedPincode,
      isDefault: address.isDefault !== undefined ? address.isDefault : addresses.length === 0,
    };
    setAddresses((prev) => {
      const next = [...prev, newAddr];
      try {
        localStorage.setItem('cbs_saved_addresses', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    showToast('Address saved successfully', 'success');
  };

  const updateAddress = (id: string, partial: Partial<SavedAddress>) => {
    setAddresses((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...partial } : a));
      try {
        localStorage.setItem('cbs_saved_addresses', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    showToast('Address updated', 'info');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('cbs_saved_addresses', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    showToast('Address deleted', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => {
      const next = prev.map((a) => ({ ...a, isDefault: a.id === id }));
      try {
        localStorage.setItem('cbs_saved_addresses', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    showToast('Default address set', 'info');
  };

  // Place Order
  const placeOrder = (
    addressOrData: any,
    maybePaymentMethod?: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD' | string
  ): OrderRecord => {
    let shippingAddress: SavedAddress;
    let paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD' = 'UPI';

    if (addressOrData && (addressOrData.flatHouse || addressOrData.addressLine1 || addressOrData.city)) {
      shippingAddress = {
        id: `addr-${Date.now()}`,
        type: (addressOrData.type || 'HOME').toUpperCase() as any,
        fullName:
          addressOrData.fullName || addressOrData.recipientName || currentUser?.name || 'Care Customer',
        phone: addressOrData.phone || currentUser?.phone || '9876543210',
        flatHouse: addressOrData.flatHouse || addressOrData.addressLine1 || 'Flat 402, Green Glen Layout',
        areaColony: addressOrData.areaColony || addressOrData.addressLine2 || 'Bellandur',
        landmark: addressOrData.landmark || '',
        city: addressOrData.city || selectedCity || 'Bengaluru',
        state: addressOrData.state || 'Karnataka',
        pincode: addressOrData.pincode || selectedPincode || '560038',
        isDefault: true,
      };
      if (addressOrData.paymentMethod) {
        paymentMethod = String(addressOrData.paymentMethod).toUpperCase() as any;
      }
    } else if (addresses.length > 0) {
      shippingAddress = addresses[0];
    } else {
      shippingAddress = MOCK_SAVED_ADDRESSES[0];
    }

    if (maybePaymentMethod) {
      paymentMethod = String(maybePaymentMethod).toUpperCase() as any;
    }

    const orderNumber = `CBS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        brand: item.product.brand,
        variantName: item.variant.name,
        image: item.product.images[0],
        price: item.variant.price,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon || undefined,
      deliveryCharge,
      total: cartGrandTotal,
      status: 'PLACED',
      trackingNumber: `DELHIVERY-${Math.floor(100000000 + Math.random() * 900000000)}`,
      courierPartner: 'Delhivery Express Air',
      estimatedDelivery: 'Tomorrow, by 8:00 PM',
      trackingHistory: [
        {
          status: 'PLACED',
          label: 'Order Placed & Payment Verified',
          date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          completed: true,
          current: true,
        },
        {
          status: 'PACKED',
          label: 'Formulated & Dispatched from CBS Fulfillment Hub',
          date: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'SHIPPED',
          label: 'In Transit to Local Delivery Center',
          date: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'OUT_FOR_DELIVERY',
          label: 'Out for Delivery',
          date: 'Pending',
          completed: false,
          current: false,
        },
        {
          status: 'DELIVERED',
          label: 'Delivered',
          date: 'Pending',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      try {
        localStorage.setItem('cbs_orders', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    clearCart();
    showToast(`Order #${orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProduct,
        openPdp,
        openPlp,
        goHome,
        openHome,
        openWishlist,
        openAccount,
        filters,
        setFilters,
        resetFilters,
        globalSearch,
        searchQuery,
        setSearchQuery,
        filterCategory: filters.category,
        allProducts: MARKETPLACE_PRODUCTS,
        selectedCity,
        selectedPincode,
        setDeliveryLocation,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartSubtotal,
        cartDiscount,
        cartTotalDiscount: cartDiscount,
        deliveryCharge,
        cartShippingFee: deliveryCharge,
        cartGrandTotal,
        cartFinalTotal: cartGrandTotal,
        savedForLater,
        saveForLater,
        moveToCartFromSaved,
        removeSavedForLater,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist: wishlistProducts,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        accountActiveTab,
        setAccountActiveTab,
        activeTrackingOrder,
        setActiveTrackingOrder,
        isLoggedIn,
        currentUser,
        loginUser,
        login,
        updateUserProfile,
        logoutUser,
        logout,
        addresses,
        savedAddresses: addresses,
        addAddress,
        addSavedAddress: addAddress,
        updateAddress,
        deleteAddress,
        removeSavedAddress: deleteAddress,
        setDefaultAddress,
        orders,
        placeOrder,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
