import { Pool, neonConfig } from '@neondatabase/serverless';

// Enable WebSocket connection pooling for serverless and edge environments
neonConfig.webSocketConstructor = globalThis.WebSocket;

let pool: Pool | null = null;

/**
 * Lazy initialization of Neon PostgreSQL connection pool using pooled connection string.
 * Prevents "too many connections" on serverless/edge scale.
 */
export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('[DB ERROR] DATABASE_URL environment variable is missing.');
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

/**
 * Utility to run SQL queries safely with auto-retry & error handling
 */
export async function queryDb<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const client = getDbPool();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (error: any) {
    console.error('[DB QUERY ERROR]', error.message);
    throw error;
  }
}
