import crypto from 'crypto';

export interface CashfreeOrderOptions {
  orderId: string;
  orderAmount: number; // In INR (e.g. 500.00)
  orderCurrency?: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  returnUrl?: string;
}

/**
 * Get Cashfree API Base URL depending on environment
 */
function getCashfreeBaseUrl(): string {
  const env = process.env.CASHFREE_ENV || 'SANDBOX';
  return env === 'PRODUCTION'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
}

/**
 * Create Cashfree Order server-side using Cashfree PG REST API (2023-08-01 API version).
 * Secret key stays strictly inside server environment.
 */
export async function createCashfreeOrderServer(options: CashfreeOrderOptions) {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    // Return mock order session for local development fallback
    return {
      order_id: options.orderId,
      payment_session_id: `session_mock_${Date.now()}`,
      order_status: 'ACTIVE',
      order_amount: options.orderAmount,
      order_currency: options.orderCurrency || 'INR',
    };
  }

  const response = await fetch(`${getCashfreeBaseUrl()}/orders`, {
    method: 'POST',
    headers: {
      'x-client-id': appId,
      'x-client-secret': secretKey,
      'x-api-version': '2023-08-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: options.orderId,
      order_amount: options.orderAmount,
      order_currency: options.orderCurrency || 'INR',
      customer_details: {
        customer_id: options.customerDetails.customerId,
        customer_name: options.customerDetails.customerName,
        customer_email: options.customerDetails.customerEmail,
        customer_phone: options.customerDetails.customerPhone,
      },
      order_meta: {
        return_url: options.returnUrl || `${process.env.APP_URL || 'http://localhost:3000'}/order-confirmation?order_id={order_id}`,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[CASHFREE ERROR] Order Creation Failed: ${errorText}`);
  }

  return await response.json();
}

/**
 * Verify Cashfree Webhook Signature using HMAC SHA-256.
 * Ensures payment webhooks are authentic and tamper-proof.
 */
export function verifyCashfreeWebhookSignature(
  ts: string,
  rawBody: string,
  signature: string,
  secretKey: string = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY || ''
): boolean {
  if (!secretKey || !signature || !ts) return false;

  const dataToSign = ts + rawBody;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64');

  return expectedSignature === signature;
}
