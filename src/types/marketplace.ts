export type ProductCategory = 'Sunscreen' | 'Cleanser' | 'Moisturizer';

export type SkinConcern =
  | 'Barrier Repair'
  | 'Sun Damage & Tanning'
  | 'Dryness & Dehydration'
  | 'Oil & Pore Control'
  | 'Dark Spots & Pigmentation'
  | 'Sensitive & Redness';

export type SkinType = 'All Skin Types' | 'Dry' | 'Combination' | 'Sensitive' | 'Oily';

export type Formulation = 'Sunscreen Fluid' | 'Barrier Cream' | 'Cleanser / Wash';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "50g", "100g", "200ml", "Shade 02 Almond"
  sku: string;
  price: number;
  mrp: number;
  stock: number;
}

export interface ReviewItem {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerified: boolean;
  helpfulCount: number;
}

export interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subCategory: string;
  price: number;
  mrp: number;
  discount: number; // percentage, e.g. 25
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  description: string;
  keyBenefits: string[];
  ingredients: string;
  howToUse: string;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  skinConcerns: SkinConcern[];
  skinTypes: SkinType[];
  formulation: Formulation;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  isBestseller?: boolean;
  isTrending?: boolean;
  isDealOfTheDay?: boolean;
  frequentlyBoughtTogetherIds?: string[];
  reviews?: ReviewItem[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: MarketplaceProduct;
  variant: ProductVariant;
  quantity: number;
}

export interface SavedForLaterItem {
  id: string;
  product: MarketplaceProduct;
  variant: ProductVariant;
  addedAt: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  flatHouse: string;
  areaColony: string;
  landmark?: string;
  city: string;
  state: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
}

export type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  date: string;
  completed: boolean;
  current: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: {
    productId: string;
    productName: string;
    brand: string;
    variantName: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: SavedAddress;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD';
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery: string;
  trackingHistory: TrackingStep[];
}

export interface CouponCode {
  code: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrder: number;
}
