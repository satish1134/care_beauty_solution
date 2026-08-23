import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;
const inMemoryStore = new Map<string, any>();

class MockRedis {
  async get<T = any>(key: string): Promise<T | null> {
    return (inMemoryStore.get(key) as T) ?? null;
  }
  async set(key: string, value: any, _opts?: any): Promise<'OK'> {
    inMemoryStore.set(key, value);
    return 'OK';
  }
  async del(...keys: string[]): Promise<number> {
    let deleted = 0;
    for (const k of keys) {
      if (inMemoryStore.delete(k)) deleted++;
    }
    return deleted;
  }
  async incr(key: string): Promise<number> {
    const val = (Number(inMemoryStore.get(key)) || 0) + 1;
    inMemoryStore.set(key, val);
    return val;
  }
  async eval<T = any>(_script: string, _keys: string[], _args: any[]): Promise<T> {
    return [1, Date.now() + 60000] as unknown as T;
  }
  async mget<T extends any[]>(...keys: string[]): Promise<T> {
    return keys.map((k) => inMemoryStore.get(k) ?? null) as unknown as T;
  }
  async sadd(key: string, ...members: any[]): Promise<number> {
    const set = inMemoryStore.get(key) || new Set();
    let added = 0;
    for (const m of members) {
      if (!set.has(m)) {
        set.add(m);
        added++;
      }
    }
    inMemoryStore.set(key, set);
    return added;
  }
}

/**
 * Lazy initialization of Upstash Redis REST Client with in-memory fallback.
 */
export function getRedisClient(): Redis {
  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token || url.includes('placeholder')) {
      return new MockRedis() as unknown as Redis;
    }

    try {
      redisInstance = new Redis({
        url,
        token,
      });
    } catch {
      return new MockRedis() as unknown as Redis;
    }
  }

  return redisInstance;
}
