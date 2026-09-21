// ==============================================================================
// Care Beauty Solution - Process Liveness Probe (/api/health)
// Spec Section 48: Basic process health, zero-diagnostic leak
// ==============================================================================

import { NextResponse } from 'next/server';
import { generateCorrelationIds } from '@/lib/tracing';

const processStartTime = Date.now();

export async function GET(request: Request) {
  const { requestId, traceId } = generateCorrelationIds(request.headers);
  const uptimeSeconds = Math.floor((Date.now() - processStartTime) / 1000);

  const payload = {
    status: 'healthy',
    service: 'care-beauty-storefront',
    version: process.env.APP_VERSION || '1.0.0',
    commit: process.env.GIT_COMMIT_SHA || 'dev-local',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Request-ID': requestId,
      'X-Trace-ID': traceId,
    },
  });
}
