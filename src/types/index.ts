export type SkinConcern = 'Dryness' | 'Acne & Blemishes' | 'Sun Protection' | 'Aging' | 'Dullness' | 'Oil Control' | 'Sensitive Skin';

export type SkinType = 'All Skin Types' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive';

export interface ProductVariant {
  id: string;
  productId: string;
  name: string; // e.g. "50 ml", "100 ml"
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  keyIngredients: string[];
  fullIngredients: string;
  howToUse: string;
  categoryId: string;
  categoryName: string;
  skinConcerns: SkinConcern[];
  skinTypes: SkinType[];
  features?: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  productImage: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  fullName?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
  addresses: Address[];
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'RAZORPAY' | 'COD' | 'UPI';

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number; // GST 18%
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}
