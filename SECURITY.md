# Security Architecture & Launch Hardening Documentation
**Care Beauty Solution — Enterprise Clinical Skincare E-Commerce Platform**
*Version: 1.0.0 | Security Baseline Compliance: ISO 27001 / OWASP Top 10 / SOC 2 Type II Certified*

---

## 1. Executive Summary & Security Philosophy
Care Beauty Solution employs a defense-in-depth architecture to safeguard customer PII, payment transactions, administrative operations, and digital infrastructure. All sensitive transactions (checkout, authentication, admin controls) operate over encrypted channels with strict zero-trust role-based access control (RBAC), multi-factor authentication (2FA), and real-time security auditing.

---

## 2. Authentication & Session Security Flow

### 2.1 Customer Authentication
* **OTP-Based Phone Auth & Passwordless Login**: Users can authenticate via 6-digit cryptographically secure SMS OTPs managed with a 300-second expiration and 3-attempt lockouts.
* **JWT Access Tokens**: Stateless JSON Web Tokens (HS256) signed with a minimum 256-bit server secret (`JWT_SECRET`). Tokens expire in 24 hours (`24h`).
* **Guest Session Tracking**: Guest shopping carts use cryptographically generated UUIDv4 session identifiers (`guestSessionId`). Carts are seamlessly merged upon authenticated login without data loss or price tampering.

### 2.2 Admin Authentication & 2FA TOTP
* **Strict Admin Portal Authentication**: Admin access requires email credentials verified against salted and hashed passwords (using PBKDF2 / Bcrypt with 12 salt rounds).
* **Mandatory Two-Factor Authentication (2FA)**: All administrative roles require Time-based One-Time Password (TOTP) verification using standard RFC 6238 TOTP algorithms.
* **Role Session Isolation**: Admin tokens explicitly contain role identifiers and granted permission lists.

---

## 3. Role-Based Access Control (RBAC) Matrix

Care Beauty Solution enforces granular permission gates across all API routes and UI actions. Permissions are non-transferable and strictly enforced by server-side middleware (`requireAdminPermission`).

| Role | Description | Key Granted Permissions | Denied Operations |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | Full Platform Owner | `CATALOG_READ`, `CATALOG_WRITE`, `ORDER_READ`, `ORDER_REFUND`, `COUPON_MANAGE`, `CUSTOMER_VIEW`, `ANALYTICS_VIEW`, `SYSTEM_SETTINGS`, `SEO_CAMPAIGN` | None |
| **CATALOG_MANAGER** | Product & Inventory Lead | `CATALOG_READ`, `CATALOG_WRITE`, `COUPON_MANAGE` | `ORDER_REFUND`, `SYSTEM_SETTINGS` (Attempts return HTTP 403 Forbidden) |
| **ORDER_MANAGER** | Fulfillment & Refunds Lead | `ORDER_READ`, `ORDER_REFUND`, `CUSTOMER_VIEW` | `CATALOG_WRITE`, `SYSTEM_SETTINGS`, `SEO_CAMPAIGN` |
| **CUSTOMER_SUPPORT** | Support Operations | `ORDER_READ`, `CUSTOMER_VIEW` | `ORDER_REFUND`, `CATALOG_WRITE`, `COUPON_MANAGE` |

---

## 4. Secrets Management & Environment Isolation

All sensitive keys are injected exclusively via environment variables and stored safely in secure cloud key vaults (Google Cloud Secret Manager / AWS Secrets Manager). Secret variables are **never** committed to version control.

| Environment Variable | Scope | Description |
| :--- | :--- | :--- |
| `JWT_SECRET` | Server-Side Only | HMAC SHA256 key for signing customer & admin JWT tokens |
| `RAZORPAY_KEY_ID` / `RAZORPAY_SECRET` | Server-Side Only | Production Razorpay API credentials for payment capture & refunds |
| `RAZORPAY_WEBHOOK_SECRET` | Server-Side Only | SHA256 secret for validating Razorpay webhook HMAC signatures |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | Server-Side Only | Cloudflare R2 / AWS S3 presigned asset upload credentials |
| `GEMINI_API_KEY` | Server-Side Only | Google Gemini 2.5/3 Flash API key for AI skin analysis |
| `REDIS_URL` | Server-Side Only | BullMQ queue & rate-limiting store backend |

---

## 5. Security Headers & Defense-in-Depth Middleware

Care Beauty Solution applies standard enterprise security headers on every HTTP response:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://checkout.razorpay.com https://api.razorpay.com https://lh3.googleusercontent.com https://images.unsplash.com; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-src 'self' https://api.razorpay.com;
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 6. Rate Limiting Policies

To defend against Denial-of-Service (DoS), credential stuffing, and brute-force attacks, multi-tier rate limiting is enforced:

* **Global API Rate Limit**: 100 requests per 60-second window per client IP (`X-RateLimit-Limit: 100`).
* **Strict Auth & Payment Rate Limit**: 10 requests per 60-second window per client IP (`X-RateLimit-Limit: 10`) applied to `/api/auth/*`, `/api/admin/auth/*`, and `/api/checkout/*`.
* **Rate Limit Exceeded Behavior**: Exceeding limits results in HTTP `429 Too Many Requests` with `Retry-After: 60` response header.

---

## 7. Payment Security & Webhook Tamper Resistance

1. **Razorpay HMAC SHA256 Signature Verification**: Payment payloads and order completions are verified using HMAC SHA256 signature matching before marking orders as `PAID`.
2. **Server-Calculated Cart Totals**: Product prices, GST (18%), discount coupons, and shipping fees are calculated strictly on the backend. Client-submitted prices are discarded to prevent price tampering.
3. **Idempotency**: Webhook processing uses order status checks to prevent double-charging or duplicate order fulfillment.

---

## 8. Security Checklist & Compliance Audit

| Requirement | Implementation Status | Verification Details |
| :--- | :--- | :--- |
| **Bcrypt/PBKDF2 Password Hashing** | ✅ PASSED | Admin & customer passwords hashed with unique salt |
| **Mandatory Admin 2FA TOTP** | ✅ PASSED | RFC 6238 TOTP enforced on admin portal login |
| **Strict RBAC Enforcement** | ✅ PASSED | Catalog Manager blocked from issuing order refunds (403 Forbidden) |
| **Server-Side Price Calculation** | ✅ PASSED | All order sub-totals computed on server |
| **HMAC SHA256 Signature Checks** | ✅ PASSED | Verified on Razorpay payment callbacks & webhooks |
| **S3/R2 Presigned Upload URLs** | ✅ PASSED | Direct client uploads restricted to presigned key URLs |
| **Rate Limiting (Global & Auth)** | ✅ PASSED | 100 req/min global, 10 req/min auth rate limiter active |
| **Security Headers (CSP, HSTS)** | ✅ PASSED | HSTS, CSP, X-Frame-Options, X-Content-Type-Options active |
| **Load Testing Benchmark** | ✅ PASSED | Automated k6/Artillery load testing script verified |

---
*Maintained by Care Beauty Solution Security & Infrastructure Team.*
