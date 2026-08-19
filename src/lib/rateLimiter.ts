import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClient } from './redis';

// Sliding window rate limiter: 10 requests per 10 seconds per IP or identifier
export const apiRateLimiter = new Ratelimit({
  redis: getRedisClient(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit/ecommerce',
});

// Stricter rate limiter for sensitive endpoints (e.g., Auth / Checkout): 5 requests per 1 minute
export const checkoutRateLimiter = new Ratelimit({
  redis: getRedisClient(),
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/checkout',
});
