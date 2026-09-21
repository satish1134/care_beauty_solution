import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resource = searchParams.get('resource') || 'dashboard';

    if (resource === 'hero-cms') {
      const heroCms = await db.getHeroCms();
      return NextResponse.json({ success: true, heroCms });
    }

    if (resource === 'storefront-cms') {
      const storefrontCms = await db.getStorefrontCms();
      return NextResponse.json({ success: true, storefrontCms });
    }

    if (resource === 'products') {
      const products = await db.getProducts();
      return NextResponse.json({ success: true, products });
    }

    if (resource === 'orders') {
      const orders = await db.getOrders();
      return NextResponse.json({ success: true, orders });
    }

    if (resource === 'coupons') {
      const coupons = await db.getCoupons();
      return NextResponse.json({ success: true, coupons });
    }

    if (resource === 'customers') {
      const customers = await db.getCustomers();
      return NextResponse.json({ success: true, customers });
    }

    if (resource === 'audit-logs') {
      const auditLogs = await db.getAuditLogs();
      return NextResponse.json({ success: true, auditLogs });
    }

    if (resource === 'media-library') {
      const mediaAssets = await db.getMediaAssets();
      return NextResponse.json({ success: true, mediaAssets });
    }

    // Default: Dashboard Analytics
    const analytics = await db.getDashboardAnalytics();
    const orders = await db.getOrders();
    const products = await db.getProducts();
    const coupons = await db.getCoupons();
    const auditLogs = await db.getAuditLogs();
    const heroCms = await db.getHeroCms();
    const mediaAssets = await db.getMediaAssets();

    return NextResponse.json({
      success: true,
      analytics,
      heroCms,
      mediaAssets,
      recentOrders: orders.slice(0, 5),
      lowStockProducts: products.filter((p) => p.stock <= p.lowStockThreshold),
      coupons,
      recentAuditLogs: auditLogs.slice(0, 5)
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query database';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    // 1. Update Order Status & Courier Tracking
    if (action === 'UPDATE_ORDER_STATUS') {
      const { orderId, status, trackingId, courierPartner, auditUser } = payload;
      await db.updateOrderStatus(orderId, status, trackingId, courierPartner, auditUser);
      const orders = await db.getOrders();
      return NextResponse.json({ success: true, orders });
    }

    // 2. Adjust Product Inventory / Stock
    if (action === 'ADJUST_STOCK') {
      const { productId, newStock, auditUser } = payload;
      await db.adjustStock(productId, newStock, auditUser);
      const products = await db.getProducts();
      return NextResponse.json({ success: true, products });
    }

    // 3. Edit Product Pricing, Content or Metadata
    if (action === 'UPDATE_PRODUCT') {
      const { product, auditUser } = payload;
      await db.updateProduct(product, auditUser);
      const products = await db.getProducts();
      return NextResponse.json({ success: true, products });
    }

    // 3b. Hero Section CMS Updates
    if (action === 'UPDATE_HERO_CMS') {
      const { heroCms, auditUser } = payload;
      const updatedHero = await db.updateHeroCms(heroCms, auditUser);
      return NextResponse.json({ success: true, heroCms: updatedHero });
    }

    // 3b-2. Storefront All-Sections CMS (Doctor Testimonials, Stories, Reviews, Sections)
    if (action === 'UPDATE_STOREFRONT_CMS') {
      const { storefrontCms, auditUser } = payload;
      const updated = await db.updateStorefrontCms(storefrontCms, auditUser);
      return NextResponse.json({ success: true, storefrontCms: updated });
    }

    // 3c. Product Image Gallery Operations (Supports up to 10+ images per product)
    if (action === 'ADD_PRODUCT_IMAGE') {
      const { productId, image, auditUser } = payload;
      const updatedProduct = await db.addProductImage(productId, image, auditUser);
      const products = await db.getProducts();
      return NextResponse.json({ success: true, product: updatedProduct, products });
    }

    if (action === 'UPDATE_PRODUCT_IMAGE') {
      const { productId, imageId, updates, auditUser } = payload;
      const updatedProduct = await db.updateProductImage(productId, imageId, updates, auditUser);
      const products = await db.getProducts();
      return NextResponse.json({ success: true, product: updatedProduct, products });
    }

    if (action === 'DELETE_PRODUCT_IMAGE') {
      const { productId, imageId, auditUser } = payload;
      const updatedProduct = await db.deleteProductImage(productId, imageId, auditUser);
      const products = await db.getProducts();
      return NextResponse.json({ success: true, product: updatedProduct, products });
    }

    if (action === 'REORDER_PRODUCT_IMAGES') {
      const { productId, imageIds, auditUser } = payload;
      const updatedProduct = await db.reorderProductImages(productId, imageIds, auditUser);
      const products = await db.getProducts();
      return NextResponse.json({ success: true, product: updatedProduct, products });
    }

    // 3d. Media Assets Operations
    if (action === 'ADD_MEDIA_ASSET') {
      const { asset, auditUser } = payload;
      const createdAsset = await db.addMediaAsset(asset, auditUser);
      const mediaAssets = await db.getMediaAssets();
      return NextResponse.json({ success: true, asset: createdAsset, mediaAssets });
    }

    if (action === 'DELETE_MEDIA_ASSET') {
      const { assetId, auditUser } = payload;
      await db.deleteMediaAsset(assetId, auditUser);
      const mediaAssets = await db.getMediaAssets();
      return NextResponse.json({ success: true, mediaAssets });
    }

    // 4. Create or Toggle Coupon
    if (action === 'TOGGLE_COUPON') {
      const { couponId } = payload;
      await db.toggleCoupon(couponId);
      const coupons = await db.getCoupons();
      return NextResponse.json({ success: true, coupons });
    }

    if (action === 'CREATE_COUPON') {
      const { coupon, auditUser } = payload;
      await db.createCoupon(
        {
          code: coupon.code,
          discountPercent: coupon.discountPercent ? Number(coupon.discountPercent) : undefined,
          discountFixed: coupon.discountFixed ? Number(coupon.discountFixed) : undefined,
          minSpend: Number(coupon.minSpend || 0),
          usageLimit: Number(coupon.usageLimit || 100),
          expiresAt: coupon.expiresAt || new Date(Date.now() + 86400000 * 30).toISOString()
        },
        auditUser
      );
      const coupons = await db.getCoupons();
      return NextResponse.json({ success: true, coupons });
    }

    // 5. Place New Order from Storefront Checkout
    if (action === 'PLACE_ORDER') {
      const { order } = payload;
      const createdOrder = await db.createOrder(order);
      return NextResponse.json({ success: true, order: createdOrder });
    }

    // 6. Reset Database to Seed Dataset
    if (action === 'RESEED_DATABASE') {
      const freshDb = await db.reseed();
      return NextResponse.json({ success: true, message: 'Database refreshed with enterprise seed data', database: freshDb });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server database operation error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
