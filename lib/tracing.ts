// ==============================================================================
// Care Beauty Solution - Request Correlation & Distributed Tracing
// Spec Section 81: requestId & traceId propagation
// ==============================================================================

export function generateCorrelationIds(requestHeaders?: Headers) {
  const existingRequestId = requestHeaders?.get('x-request-id');
  const existingTraceId = requestHeaders?.get('x-trace-id') || requestHeaders?.get('traceparent');

  const requestId = existingRequestId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const traceId = existingTraceId || `trace_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  return { requestId, traceId };
}
