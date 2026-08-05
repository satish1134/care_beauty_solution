// Persistent Cart Service (Redis / In-Memory Session Store with DB Merge Support)
import { CartItem } from '../types';

export interface CartState {
  items: CartItem[];
  appliedCoupon: string | null;
  discountAmount: number;
  updatedAt: string;
}

export class CartService {
  // Store guest carts by session ID and user carts by user ID
  private guestCarts: Map<string, CartState> = new Map();
  private userCarts: Map<string, CartState> = new Map();

  private getStore(sessionId?: string, userId?: string): { map: Map<string, CartState>; key: string } {
    if (userId) {
      return { map: this.userCarts, key: userId };
    }
    const key = sessionId || 'guest-default-session';
    return { map: this.guestCarts, key };
  }

  getCart(sessionId?: string, userId?: string): CartState {
    const { map, key } = this.getStore(sessionId, userId);
    let cart = map.get(key);
    if (!cart) {
      cart = {
        items: [],
        appliedCoupon: null,
        discountAmount: 0,
        updatedAt: new Date().toISOString(),
      };
      map.set(key, cart);
    }
    return cart;
  }

  addItem(
    item: CartItem,
    sessionId?: string,
    userId?: string
  ): CartState {
    const cart = this.getCart(sessionId, userId);
    const existingIndex = cart.items.findIndex(i => i.variantId === item.variantId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push({ ...item });
    }

    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  updateQuantity(
    variantId: string,
    quantity: number,
    sessionId?: string,
    userId?: string
  ): CartState {
    const cart = this.getCart(sessionId, userId);
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.variantId !== variantId);
    } else {
      const item = cart.items.find(i => i.variantId === variantId);
      if (item) {
        item.quantity = quantity;
      }
    }
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  removeItem(variantId: string, sessionId?: string, userId?: string): CartState {
    const cart = this.getCart(sessionId, userId);
    cart.items = cart.items.filter(i => i.variantId !== variantId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  applyCoupon(couponCode: string | null, discountAmount: number, sessionId?: string, userId?: string): CartState {
    const cart = this.getCart(sessionId, userId);
    cart.appliedCoupon = couponCode;
    cart.discountAmount = discountAmount;
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  mergeCart(guestSessionId: string, userId: string): CartState {
    const guestCart = this.guestCarts.get(guestSessionId);
    const userCart = this.getCart(undefined, userId);

    if (guestCart && guestCart.items.length > 0) {
      for (const guestItem of guestCart.items) {
        const userItem = userCart.items.find(i => i.variantId === guestItem.variantId);
        if (userItem) {
          userItem.quantity += guestItem.quantity;
        } else {
          userCart.items.push({ ...guestItem });
        }
      }

      if (guestCart.appliedCoupon && !userCart.appliedCoupon) {
        userCart.appliedCoupon = guestCart.appliedCoupon;
        userCart.discountAmount = guestCart.discountAmount;
      }

      userCart.updatedAt = new Date().toISOString();
      // Clear guest session cart after merging
      this.guestCarts.delete(guestSessionId);
    }

    return userCart;
  }

  clearCart(sessionId?: string, userId?: string): CartState {
    const { map, key } = this.getStore(sessionId, userId);
    const emptyState: CartState = {
      items: [],
      appliedCoupon: null,
      discountAmount: 0,
      updatedAt: new Date().toISOString(),
    };
    map.set(key, emptyState);
    return emptyState;
  }
}

export const cartService = new CartService();
