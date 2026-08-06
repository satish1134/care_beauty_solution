# CARe Beauty Solution — Full-Stack E-Commerce Platform

CARe Beauty Solution is an enterprise-grade, secure, scalable D2C e-commerce platform custom-engineered for clinical skincare in India.

---

## Technical Stack Architecture

| Layer | Primary Technology | Description / Role |
| :--- | :--- | :--- |
| **Frontend Storefront** | React 18, TypeScript, Tailwind CSS, Lucide Icons | Responsive single-page application with high-contrast UI, custom product filters, and real-time state |
| **Admin Panel** | React 18, RBAC UI Components, Recharts | Back-office management for products, orders, refunds, coupons, live visitor telemetry, and marketplace channels |
| **Backend API Server** | Node.js, Express.js | Full-stack REST API with DTO validation, rate limiting, and security header middleware |
| **Database & Cache Layer**| PostgreSQL (Drizzle ORM), Redis (BullMQ Queue) | Permanent relational storage and ultra-fast session/job caching |
| **Payments** | Razorpay Gateway | UPI, cards, netbanking, HMAC SHA256 signature verification, and automated refund API |
| **Image & Asset Storage** | AWS S3 / Cloudflare R2 | Presigned URL generation for secure direct image uploads |
| **Email & Marketing** | Email Service Abstraction | Transactional order confirmations, newsletter campaigns, and abandoned cart recovery |
| **Monitoring & Telemetry**| GA4, Sentry, Prometheus, Uptime Kuma | Full-stack telemetry monitoring and live online visitor tracker |

---

## Quick Start & Local Execution

### 1. Install Dependencies & Build
```bash
npm install
npm run build
```

### 2. Start Development Server
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

### 3. Run Automated Integration Tests
You can run automated E2E test suites for each implementation phase via simple HTTP endpoints or Node scripts:

```bash
# Phase 3: Checkout & Payments E2E Test
curl -s http://localhost:3000/api/tests/phase3

# Phase 4: Admin Panel, RBAC & S3/R2 Upload Test
curl -s http://localhost:3000/api/tests/phase4

# Phase 5: Marketing, SEO & Abandoned Cart Test
curl -s http://localhost:3000/api/tests/phase5

# Phase 6: Hardening, Security Headers & Rate Limit Test
curl -s http://localhost:3000/api/tests/phase6

# High-Concurrency Checkout Load Test
node load-test-checkout.js
```

---

## Phase-by-Phase Technical Implementation Summary

### Phase 1 & 2: Core Storefront & Catalog Management
* **Features Built**: Product catalog, multi-criteria filtering (Skin Type, Skin Concern, Ingredients), product search with auto-suggest, cart drawer with persistent guest-to-user session merge, and dynamic AI Routine Builder powered by Google Gemini.
* **Testing**: Verified via UI cart interactions, item quantity updates, and cart persistence.

### Phase 3: Checkout & Payments Engine
* **Features Built**: Complete checkout pipeline with address validation, GST (18%) computation, coupon discount application, Razorpay order creation, HMAC SHA256 signature validation, and email dispatch.
* **Testing**: `curl -s http://localhost:3000/api/tests/phase3`

### Phase 4: Admin Panel, RBAC & Telemetry
* **Features Built**: Multi-role admin portal (Super Admin, Catalog Manager, Order Manager) with TOTP 2FA, strict RBAC enforcement (blocking unauthorized refunds), AWS S3/R2 presigned upload URLs, live visitor counter, and marketplace sync connectors.
* **Testing**: `curl -s http://localhost:3000/api/tests/phase4`

### Phase 5: Marketing, SEO & Notifications
* **Features Built**: Newsletter subscription with welcome discount vouchers, broadcast email campaign engine, BullMQ/Redis abandoned cart job queue, dynamic `sitemap.xml`, `robots.txt`, and Google Analytics 4 tags.
* **Testing**: `curl -s http://localhost:3000/api/tests/phase5`

### Phase 6: Hardening & Launch Readiness
* **Features Built**: Global & route-specific rate limiting (100 req/min global, 10 req/min auth), security headers middleware (HSTS, CSP, X-Frame-Options, X-Content-Type-Options), load-testing suite, and `SECURITY.md`.
* **Testing**: `curl -s http://localhost:3000/api/tests/phase6` and `node load-test-checkout.js`

---

## Environment Variables (`.env.example`)

See `.env.example` for all configurable environment variables including `GEMINI_API_KEY`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `GA4_MEASUREMENT_ID`.
