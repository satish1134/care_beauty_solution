import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const headerList = headers();
  const host = headerList.get('host') || '';
  const isDevHost = host.includes('dev.careabeautysolution.com') ||
                    host.includes('localhost') ||
                    host.includes('127.0.0.1') ||
                    host.includes('ais-dev') ||
                    process.env.SENTRY_ENVIRONMENT === 'development' ||
                    process.env.NODE_ENV !== 'production';

  // Explicitly check if it's production domain
  const isProdHost = host.includes('careabeautysolution.com') && !host.includes('dev.');

  const isDev = isDevHost && !isProdHost;

  return NextResponse.json({
    host,
    isDev,
    environment: isProdHost ? 'production' : (process.env.SENTRY_ENVIRONMENT || 'development')
  });
}
