// ==============================================================================
// Care Beauty Solution - Security & Audit Event Taxonomy
// Spec Section 82 & 83
// ==============================================================================

import { logger } from './logger';

export type SecurityEventType =
  | 'LOGIN_FAILED'
  | 'LOGIN_SUCCESS'
  | 'PASSWORD_RESET'
  | 'MFA_FAILED'
  | 'MFA_SUCCESS'
  | 'ADMIN_LOGIN'
  | 'ADMIN_PERMISSION_CHANGED'
  | 'API_RATE_LIMIT'
  | 'SUSPICIOUS_REQUEST'
  | 'COUPON_ABUSE'
  | 'PAYMENT_ANOMALY';

export type AuditEventType =
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRICE_CHANGED'
  | 'INVENTORY_UPDATED'
  | 'ORDER_UPDATED'
  | 'REFUND_CREATED'
  | 'COUPON_CREATED'
  | 'COUPON_UPDATED'
  | 'ADMIN_CREATED'
  | 'PERMISSION_CHANGED';

export function recordSecurityEvent(
  eventType: SecurityEventType,
  details: {
    actor?: string;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  },
  correlation?: { requestId?: string; traceId?: string }
) {
  logger.warn(`[SECURITY EVENT: ${eventType}]`, {
    context: {
      eventType,
      ...details,
    },
    requestId: correlation?.requestId,
    traceId: correlation?.traceId,
  });
}

export function recordAuditEvent(
  eventType: AuditEventType,
  details: {
    adminId: string;
    targetEntity: string;
    targetId: string;
    changes: Record<string, unknown>;
  },
  correlation?: { requestId?: string; traceId?: string }
) {
  logger.info(`[AUDIT EVENT: ${eventType}]`, {
    context: {
      eventType,
      ...details,
    },
    userId: details.adminId,
    requestId: correlation?.requestId,
    traceId: correlation?.traceId,
  });
}
