import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const storefrontCms = await db.getStorefrontCms();
    return NextResponse.json({ success: true, storefrontCms });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve Storefront CMS';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storefrontCms, auditUser } = body;
    if (!storefrontCms) {
      return NextResponse.json({ success: false, error: 'storefrontCms data payload required' }, { status: 400 });
    }
    const updated = await db.updateStorefrontCms(storefrontCms, auditUser || 'admin@careabeautysolution.com');
    return NextResponse.json({ success: true, storefrontCms: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update Storefront CMS';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
