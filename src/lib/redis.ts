import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

/**
 * Lazy initialization of Upstash Redis REST Client.
 * Uses HTTP/REST protocol rather than TCP, ensuring compatibility with Edge Runtime
 * and zero connection state overhead.
 */
export function getRedisClient(): Redis {
  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      console.warn('[REDIS WARN] Upstash Redis credentials missing. Falling back to in-memory cache.');
      // Return a light mock implementation if credentials are not yet configured in local dev
      return new Redis({
        url: url || 'https://placeholder.upstash.io',
        token: token || 'placeholder_token',
      });
    }

    redisInstance = new Redis({
      url,
      token,
    });
  }

  return redisInstance;
}
