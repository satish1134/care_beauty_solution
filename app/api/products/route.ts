import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.getProducts();
    return NextResponse.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database query failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
