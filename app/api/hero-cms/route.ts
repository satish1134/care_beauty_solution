import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const heroCms = await db.getHeroCms();
    return NextResponse.json({ success: true, heroCms });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve Hero CMS';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { heroCms, auditUser } = body;
    const updated = await db.updateHeroCms(heroCms, auditUser || 'admin@careabeautysolution.com');
    return NextResponse.json({ success: true, heroCms: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update Hero CMS';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
