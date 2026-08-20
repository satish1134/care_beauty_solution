# CARe Beauty Solution — Full-Stack E-Commerce Platform

CARe Beauty Solution is an enterprise-grade D2C clinical skincare e-commerce platform engineered for Indian skin formulations.

---

## Production Deployment Stack

| Component | Target Platform | Free Tier | Infrastructure Role |
| :--- | :--- | :--- | :--- |
| **Full-Stack Application** | **Vercel** | Yes (Hobby Tier) | Frontend Edge CDN & Serverless Express API backend |
| **Database** | **Neon** | Yes | Managed serverless PostgreSQL database |
| **Redis & Queue** | **Upstash** | Yes | Serverless Redis store for BullMQ job queue |
| **Payments** | **Razorpay** | Pay-per-use | India payment gateway (UPI, Netbanking, Cards) |

---

## Step-by-Step Deployment Guide

### 1. Database Setup (Neon PostgreSQL)
1. Sign up at [Neon.tech](https://neon.tech).
2. Create a new PostgreSQL database project named `care-beauty-db`.
3. Copy the Connection String URI and set it as `DATABASE_URL` in your environment variables.

### 2. Redis & Job Queue Setup (Upstash Redis)
1. Sign up at [Upstash.com](https://upstash.com).
2. Create a Redis database instance.
3. Copy the Redis Connection URL (`redis://...`) and set it as `REDIS_URL`.

### 3. Deploy Full-Stack App (Vercel)
1. Push your repository to GitHub.
2. Connect your repository to **Vercel** (Add New Project).
3. Vercel automatically detects `vercel.json` and builds both frontend and `/api` serverless backend functions.
4. Configure environment variables in the Vercel dashboard:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` (From Neon)
   - `REDIS_URL` (From Upstash)
   - `JWT_SECRET`
   - `RAZORPAY_KEY_ID` & `RAZORPAY_SECRET`
   - `GEMINI_API_KEY`
5. Click **Deploy**. Your frontend and backend will both run under your custom Vercel domain!

---

## Local Development & Testing

```bash
# Install dependencies
npm install

# Run build
npm run build

# Start dev server
npm run dev
```

### Automated Integration Tests & Load Testing
```bash
# Execute Phase 3-6 E2E Integration Test Suite
curl -s http://localhost:3000/api/tests/phase3
curl -s http://localhost:3000/api/tests/phase4
curl -s http://localhost:3000/api/tests/phase5
curl -s http://localhost:3000/api/tests/phase6

# Run Load Test Script (50 concurrent checkouts)
node load-test-checkout.js
```

---

## Environment Variables Reference (`.env.example`)

See `.env.example` for all required production variables:
- `JWT_SECRET`
- `RAZORPAY_KEY_ID` / `RAZORPAY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `S3_BUCKET_NAME`
- `DATABASE_URL` (Neon PostgreSQL)
- `REDIS_URL` (Upstash Redis)
- `GA4_MEASUREMENT_ID`
