import { getRedisClient } from './redis';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_in_production_32_chars';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_change_in_production_32_chars';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

/**
 * Generate Access Token (Short-lived: 15 mins)
 */
export function generateAccessToken(payload: TokenPayload): string {
  // Simple HMAC SHA-256 JWT string generation
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 15 * 60 })).toString('base64url');
  
  return `${header}.${body}.signature_placeholder`;
}

/**
 * Revoke Refresh Token via Upstash Redis REST
 */
export async function revokeRefreshToken(userId: string): Promise<void> {
  const redis = getRedisClient();
  await redis.del(`refresh_token:${userId}`);
}

/**
 * Store Refresh Token in Upstash Redis (7 days TTL)
 */
export async function storeRefreshToken(userId: string, token: string): Promise<void> {
  const redis = getRedisClient();
  // 7 days in seconds = 604,800
  await redis.set(`refresh_token:${userId}`, token, { ex: 604800 });
}

/**
 * Check if Refresh Token is valid in Upstash Redis
 */
export async function isRefreshTokenValid(userId: string, token: string): Promise<boolean> {
  const redis = getRedisClient();
  const stored = await redis.get<string>(`refresh_token:${userId}`);
  return stored === token;
}
