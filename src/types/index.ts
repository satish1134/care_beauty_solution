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

export type AdminRole = 'SUPER_ADMIN' | 'CATALOG_MANAGER' | 'ORDER_MANAGER';

export type AdminPermission =
  | 'PRODUCT_WRITE'
  | 'PRODUCT_DELETE'
  | 'ORDER_READ'
  | 'ORDER_STATUS_UPDATE'
  | 'ORDER_REFUND'
  | 'COUPON_WRITE'
  | 'SEO_CAMPAIGN'
  | 'MARKETPLACE_SYNC'
  | 'MONITORING_TOGGLE'
  | 'LIVE_VISITORS';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  permissions: AdminPermission[];
  createdAt: string;
}

export interface MonitoringToolConfig {
  id: string;
  name: string;
  category: 'Error Tracking' | 'Telemetry Metrics' | 'Privacy Analytics' | 'Uptime Check';
  provider: 'Sentry' | 'Prometheus' | 'Plausible' | 'Uptime Kuma';
  enabled: boolean;
  dsnUrl?: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'PAUSED';
  lastPing?: string;
}

export interface SeoCampaign {
  id: string;
  title: string;
  targetKeywords: string[];
  googleMerchantStatus: 'SYNCED' | 'PENDING' | 'ERROR';
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  schemaType: string;
  createdByName: string;
  createdAt: string;
}

export interface MarketplaceChannel {
  id: string;
  name: 'Amazon' | 'Flipkart' | 'Nykaa' | 'Myntra' | 'Meesho' | 'Blinkit' | 'Zepto';
  category: 'E-Commerce Marketplace' | 'Quick Commerce (10-Min Delivery)';
  connected: boolean;
  apiKeySet: boolean;
  autoSyncStock: boolean;
  activeOrdersToday: number;
  revenueToday: number;
  lastSyncedAt: string;
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

