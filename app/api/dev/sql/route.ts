import { NextRequest, NextResponse } from 'next/server';
import {
  executeSqlQuery,
  getDatabaseCapacityMetrics,
  getDatabaseSchema,
  verifyDeveloperToken,
} from '@/lib/sql-studio-service';

function isDevAllowed(req: NextRequest): boolean {
  const host = req.headers.get('host') || '';
  // Allowed on localhost or on dev.* subdomains only
  return (
    host.startsWith('dev.') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    process.env.NODE_ENV === 'development'
  );
}

export async function GET(req: NextRequest) {
  if (!isDevAllowed(req)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const token = req.headers.get('x-dev-token') || req.nextUrl.searchParams.get('token');

  if (!verifyDeveloperToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Developer access passkey is invalid or missing.' },
      { status: 401 }
    );
  }

  try {
    const [schema, metrics] = await Promise.all([
      getDatabaseSchema(),
      getDatabaseCapacityMetrics(),
    ]);

    return NextResponse.json({
      success: true,
      schema,
      metrics,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isDevAllowed(req)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const token = req.headers.get('x-dev-token');

  if (!verifyDeveloperToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Developer access passkey is invalid or missing.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { query, safeMode } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'SQL query string is required' },
        { status: 400 }
      );
    }

    const result = await executeSqlQuery(query, safeMode !== false);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
