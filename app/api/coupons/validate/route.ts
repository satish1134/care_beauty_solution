import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Please provide a coupon code.' }, { status: 400 });
    }

    const coupons = await db.getCoupons();
    const formatted = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === formatted && c.isActive);

    if (!coupon) {
      return NextResponse.json({ valid: false, message: `Promo code "${formatted}" is not valid or has expired.` }, { status: 404 });
    }

    if (coupon.minSpend && Number(subtotal || 0) < coupon.minSpend) {
      return NextResponse.json({
        valid: false,
        message: `Code ${formatted} requires a minimum order value of ₹${coupon.minSpend}.`
      });
    }

    let discountAmount = 0;
    if (coupon.discountPercent) {
      discountAmount = Math.round((Number(subtotal || 0) * coupon.discountPercent) / 100);
    } else if (coupon.discountFixed) {
      discountAmount = coupon.discountFixed;
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountAmount,
      discountPercent: coupon.discountPercent,
      discountFixed: coupon.discountFixed,
      message: coupon.discountPercent
        ? `${coupon.discountPercent}% discount applied!`
        : `₹${coupon.discountFixed} discount applied!`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Coupon validation error';
    return NextResponse.json({ valid: false, message }, { status: 500 });
  }
}
