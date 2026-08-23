import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'care_beauty_solution_jwt_secret_key_2026_super_secure';

function base64UrlEncode(str: string | Buffer): string {
  return (typeof str === 'string' ? Buffer.from(str) : str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwt(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { email, password, fullName, phone } = body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'Email, password, and full name are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : undefined;
    const isAdmin = cleanEmail.includes('admin');
    const role = isAdmin ? 'ADMIN' : 'CUSTOMER';
    const userId = `usr-${Date.now().toString().slice(-6)}`;

    const now = Math.floor(Date.now() / 1000);
    const accessToken = signJwt({
      userId,
      email: cleanEmail,
      phone: cleanPhone,
      role,
      type: 'access',
      iat: now,
      exp: now + 7 * 24 * 3600,
    });

    const refreshToken = signJwt({
      userId,
      email: cleanEmail,
      phone: cleanPhone,
      role,
      type: 'refresh',
      iat: now,
      exp: now + 30 * 24 * 3600,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: cleanEmail,
        phone: cleanPhone,
        fullName: String(fullName).trim(),
        role,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Registration failed',
    });
  }
}
