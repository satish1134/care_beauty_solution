'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CORE_PRODUCTS } from './products-data';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  type?: 'HOME' | 'WORK';
  landmark?: string;
  alternatePhone?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  volume: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Confirmed' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  paymentMethod: 'UPI' | 'Card' | 'COD';
  deliveryAddress: Address;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender?: 'Male' | 'Female' | 'Other';
  addresses: Address[];
  skinType?: string;
  skinConcern?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  total: number;
  totalItemCount: number;
  // User & Orders
  user: UserProfile | null;
  loginUser: (userData: Partial<UserProfile>) => void;
  logoutUser: () => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  orders: Order[];
  placeOrder: (orderData: { paymentMethod: 'UPI' | 'Card' | 'COD'; address: Address }) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Sandy Verma',
    email: 'sandyverma3@gmail.com',
    phone: '+91 98765 43210',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Sandy Verma',
        phone: '+91 98765 43210',
        street: '402, Lotus Greens Boulevard, Sector 12',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
        isDefault: true
      }
    ],
    skinType: 'Combination',
    skinConcern: 'Barrier Repair & SPF Protection'
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('care_cart_items');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedOrders = localStorage.getItem('care_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      const savedUser = localStorage.getItem('care_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('care_cart_items', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Save orders to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('care_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

  // Promo code calculation
  let discount = 0;
  if (appliedPromo === 'CARE10') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedPromo === 'BARRIER15') {
    discount = Math.round(subtotal * 0.15);
  }

  const total = Math.max(0, subtotal - discount + shippingFee);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromo = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'CARE10') {
      setAppliedPromo('CARE10');
      return { success: true, message: '10% Launch Discount applied!' };
    }
    if (formatted === 'BARRIER15') {
      setAppliedPromo('BARRIER15');
      return { success: true, message: '15% Barrier Restorative Discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try CARE10 or BARRIER15.' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const loginUser = (userData: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = {
        name: userData.name || prev?.name || 'Skincare Guest',
        email: userData.email || prev?.email || '',
        phone: userData.phone || prev?.phone || '',
        addresses: userData.addresses || prev?.addresses || [],
        skinType: userData.skinType || prev?.skinType,
        skinConcern: userData.skinConcern || prev?.skinConcern
      };
      localStorage.setItem('care_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('care_user');
  };

  const updateAddress = (newAddress: Address) => {
    setUser((prev) => {
      if (!prev) return null;
      const existing = prev.addresses.findIndex((a) => a.id === newAddress.id);
      let updatedAddresses: Address[];
      if (existing >= 0) {
        updatedAddresses = prev.addresses.map((a) =>
          a.id === newAddress.id ? newAddress : a
        );
      } else {
        updatedAddresses = [...prev.addresses, newAddress];
      }
      const updated = { ...prev, addresses: updatedAddresses };
      localStorage.setItem('care_user', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAddress = (addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedAddresses = prev.addresses.filter((a) => a.id !== addressId);
      const updated = { ...prev, addresses: updatedAddresses };
      localStorage.setItem('care_user', JSON.stringify(updated));
      return updated;
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedAddresses = prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId
      }));
      const updated = { ...prev, addresses: updatedAddresses };
      localStorage.setItem('care_user', JSON.stringify(updated));
      return updated;
    });
  };

  const placeOrder = (orderData: { paymentMethod: 'UPI' | 'Card' | 'COD'; address: Address }): Order => {
    const newOrder: Order = {
      id: `CARE-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        volume: i.product.volume
      })),
      subtotal,
      discount,
      shipping: shippingFee,
      total,
      status: 'Confirmed',
      paymentMethod: orderData.paymentMethod,
      deliveryAddress: orderData.address
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Asynchronously synchronize with server database
    try {
      fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PLACE_ORDER',
          payload: {
            order: {
              customerName: orderData.address.fullName,
              customerEmail: user?.email || 'guest@careabeautysolution.com',
              customerPhone: orderData.address.phone,
              items: newOrder.items,
              subtotal: newOrder.subtotal,
              discount: newOrder.discount,
              shipping: newOrder.shipping,
              total: newOrder.total,
              status: 'PENDING',
              paymentMethod: newOrder.paymentMethod,
              paymentProvider: newOrder.paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
              shippingAddress: {
                fullName: orderData.address.fullName,
                phone: orderData.address.phone,
                street: orderData.address.street,
                city: orderData.address.city,
                state: orderData.address.state,
                pincode: orderData.address.pincode,
                landmark: orderData.address.landmark
              }
            }
          }
        })
      }).catch((e) => console.warn('Could not sync order to central DB:', e));
    } catch {
      // Local order placed safely
    }

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isCheckoutOpen,
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        isProfileOpen,
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
        subtotal,
        discount,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        appliedPromo,
        applyPromo,
        removePromo,
        total,
        totalItemCount,
        user,
        loginUser,
        logoutUser,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
