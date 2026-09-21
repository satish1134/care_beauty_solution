import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 1. Host: dev.careabeautysolution.com / dev.carebeautysolution.com
  if (host.startsWith('dev.')) {
    // When visiting dev domain, serve routes directly:
    // - / -> Developing Storefront for clients & team to preview progress
    // - /admin -> Dev Admin Portal (with login prompt & dev schema default credentials)
    // - /dev/sql-studio -> Developer SQL Studio
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

  // 3. Main Production Storefront (carebeautysolution.com, www.carebeautysolution.com, etc.)
  // Route /admin on production storefront to the dedicated production admin portal domain!
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const adminHost = host.includes('careabeautysolution.com')
      ? 'admin.careabeautysolution.com'
      : 'admin.carebeautysolution.com';
    return NextResponse.redirect(new URL(`https://${adminHost}/`));
  }

  // Strictly isolate developer tools: block /dev routes so SQL Studio NEVER exists in production!
  if (pathname.startsWith('/dev')) {
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
