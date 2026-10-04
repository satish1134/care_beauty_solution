import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 1. Development & Preview environments (localhost, Cloud Run ais-dev preview, dev subdomain)
  // Always allow direct access to /admin and all routes without redirecting externally!
  const isDevOrPreview =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('run.app') ||
    host.includes('ais-') ||
    host.startsWith('dev.');

  if (isDevOrPreview) {
    const response = NextResponse.next();
    response.headers.set('X-Care-Environment', 'Development-Staging');
    return response;
  }

  // 2. Production Admin Subdomain: admin.careabeautysolution.com / admin.carebeautysolution.com
  if (host.startsWith('admin.')) {
    // If accessing root of admin subdomain, redirect cleanly to /admin using public host
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin', `https://${host}`));
    }
    // Block /dev routes on admin domain
    if (pathname.startsWith('/dev')) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return NextResponse.next();
  }

  // 3. Main Custom Production Storefront (carebeautysolution.com, www.carebeautysolution.com)
  const isCustomProduction =
    host === 'carebeautysolution.com' ||
    host === 'www.carebeautysolution.com' ||
    host === 'careabeautysolution.com' ||
    host === 'www.careabeautysolution.com';

  if (isCustomProduction && (pathname === '/admin' || pathname.startsWith('/admin/'))) {
    const adminHost = host.includes('careabeautysolution.com')
      ? 'admin.careabeautysolution.com'
      : 'admin.carebeautysolution.com';
    return NextResponse.redirect(new URL(`https://${adminHost}/`));
  }

  // Strictly isolate developer tools: block /dev routes in custom production
  if (isCustomProduction && pathname.startsWith('/dev')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
