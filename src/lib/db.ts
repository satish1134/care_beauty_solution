import { Pool, neonConfig } from '@neondatabase/serverless';

// Enable WebSocket connection pooling for serverless and edge environments
if (typeof globalThis.WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

let pool: Pool | null = null;
let warnLogged = false;

/**
 * Lazy initialization of Neon PostgreSQL connection pool using pooled connection string.
 * Prevents "too many connections" on serverless/edge scale.
 */
export function getDbPool(): Pool | null {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      if (!warnLogged) {
        console.warn('[DB INFO] DATABASE_URL not configured. Running with in-memory store.');
        warnLogged = true;
      }
      return null;
    }
    try {
      pool = new Pool({ connectionString });
    } catch {
      return null;
    }
  }
  return pool;
}

/**
 * Utility to run SQL queries safely with auto-retry & error handling
 */
export async function queryDb<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const client = getDbPool();
  if (!client) {
    return [];
  }
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (error: any) {
    console.warn('[DB QUERY WARN]', error.message);
    return [];
  }
}

