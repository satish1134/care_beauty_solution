import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'care_beauty_solution_jwt_secret_key_2026_super_secure';

export interface TokenPayload {
  userId: string;
  email?: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  type: 'access' | 'refresh';
  tokenId?: string; // Unique identifier for refresh tokens
  exp: number; // Expiration timestamp in seconds
  iat: number; // Issued at timestamp in seconds
}

export interface RefreshTokenMetadata {
  tokenId: string;
  userId: string;
  isRevoked: boolean;
  createdAt: number;
  expiresAt: number;
  replacedByTokenId?: string;
}

export class AuthService {
  // In-Memory Refresh Token Store for Rotation & Revocation
  private refreshTokens: Map<string, RefreshTokenMetadata> = new Map();
  // Failed Login Attempt Rate Limiter (IP/Email -> timestamps)
  private failedAttempts: Map<string, number[]> = new Map();

  // Helper: Base64URL encode
  private base64UrlEncode(str: string | Buffer): string {
    return (typeof str === 'string' ? Buffer.from(str) : str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  // Helper: Base64URL decode
  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  // Issue Access Token (short lived, e.g. 15 minutes)
  generateAccessToken(userId: string, role: 'CUSTOMER' | 'ADMIN', email?: string, phone?: string): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: TokenPayload = {
      userId,
      email,
      phone,
      role,
      type: 'access',
      iat: now,
      exp: now + 15 * 60, // 15 minutes
    };

    return this.signJwt(payload);
  }

  // Issue Refresh Token (longer lived, e.g. 7 days) & Store in Revocation Ledger
  generateRefreshToken(userId: string, role: 'CUSTOMER' | 'ADMIN', email?: string, phone?: string): string {
    const now = Math.floor(Date.now() / 1000);
    const tokenId = `rt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const expiresAt = now + 7 * 24 * 3600; // 7 days

    const payload: TokenPayload = {
      userId,
      email,
      phone,
      role,
      type: 'refresh',
      tokenId,
      iat: now,
      exp: expiresAt,
    };

    const token = this.signJwt(payload);

    // Save token state in revocation ledger
    this.refreshTokens.set(tokenId, {
      tokenId,
      userId,
      isRevoked: false,
      createdAt: now * 1000,
      expiresAt: expiresAt * 1000,
    });

    return token;
  }

  // Sign JWT using HMAC-SHA256
  private signJwt(payload: TokenPayload): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = this.base64UrlEncode(JSON.stringify(header));
    const payloadB64 = this.base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  // Verify and Decode JWT Token
  verifyJwt(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [headerB64, payloadB64, signature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${headerB64}.${payloadB64}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        return null; // Invalid signature / tampered token
      }

      const payload: TokenPayload = JSON.parse(this.base64UrlDecode(payloadB64));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp < now) {
        return null; // Token expired
      }

      return payload;
    } catch (e) {
      return null;
    }
  }

  // Alias for verifyJwt
  verifyToken(token: string): TokenPayload | null {
    return this.verifyJwt(token);
  }

  // Token Rotation Flow for /api/auth/refresh
  rotateRefreshToken(refreshToken: string): { success: boolean; newAccessToken?: string; newRefreshToken?: string; message?: string } {
    const payload = this.verifyJwt(refreshToken);
    if (!payload || payload.type !== 'refresh' || !payload.tokenId) {
      return { success: false, message: 'Invalid or expired refresh token' };
    }

    const tokenMeta = this.refreshTokens.get(payload.tokenId);

    if (!tokenMeta) {
      return { success: false, message: 'Refresh token record not found' };
    }

    // Replay Attack Detection: If token is already marked revoked, revoke ALL tokens for this user!
    if (tokenMeta.isRevoked) {
      console.warn(`[SECURITY ALERT] Replay attack detected for user ${payload.userId}! Revoking all refresh tokens.`);
      this.revokeAllUserTokens(payload.userId);
      return { success: false, message: 'Refresh token reuse detected. Session invalidated for security.' };
    }

    // Mark current refresh token as revoked & replaced
    tokenMeta.isRevoked = true;

    // Issue new Access Token and new Refresh Token
    const newAccessToken = this.generateAccessToken(payload.userId, payload.role, payload.email, payload.phone);
    const newRefreshToken = this.generateRefreshToken(payload.userId, payload.role, payload.email, payload.phone);

    // Get new tokenId from generated payload
    const newPayload = this.verifyJwt(newRefreshToken);
    if (newPayload?.tokenId) {
      tokenMeta.replacedByTokenId = newPayload.tokenId;
    }

    return {
      success: true,
      newAccessToken,
      newRefreshToken,
    };
  }

  // Revoke Specific Refresh Token (Logout)
  revokeRefreshToken(refreshToken: string): boolean {
    const payload = this.verifyJwt(refreshToken);
    if (!payload || !payload.tokenId) return false;

    const tokenMeta = this.refreshTokens.get(payload.tokenId);
    if (tokenMeta) {
      tokenMeta.isRevoked = true;
      return true;
    }
    return false;
  }

  // Revoke All Refresh Tokens for a User
  revokeAllUserTokens(userId: string): void {
    for (const [tokenId, meta] of this.refreshTokens.entries()) {
      if (meta.userId === userId) {
        meta.isRevoked = true;
      }
    }
  }

  // Password Hashing (using pbkdf2)
  hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  verifyPassword(password: string, hash: string, salt: string): boolean {
    const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return computed === hash;
  }

  // Rate Limiter for Login Failures (Max 5 failed attempts per key per 15 mins)
  recordFailedAttempt(key: string): { blocked: boolean; remainingAttempts: number } {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const attempts = (this.failedAttempts.get(key) || []).filter(ts => now - ts < windowMs);

    attempts.push(now);
    this.failedAttempts.set(key, attempts);

    if (attempts.length >= 5) {
      return { blocked: true, remainingAttempts: 0 };
    }
    return { blocked: false, remainingAttempts: 5 - attempts.length };
  }

  isRateLimited(key: string): boolean {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const attempts = (this.failedAttempts.get(key) || []).filter(ts => now - ts < windowMs);
    return attempts.length >= 5;
  }

  resetFailedAttempts(key: string): void {
    this.failedAttempts.delete(key);
  }

  // Helper getters for testing
  getRefreshTokenMetadata(tokenId: string) {
    return this.refreshTokens.get(tokenId);
  }

  clearStores() {
    this.refreshTokens.clear();
    this.failedAttempts.clear();
  }
}

export const authService = new AuthService();
