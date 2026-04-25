import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

/**
 * Verify JWT token from Authorization header.
 * Returns decoded payload if valid, null otherwise.
 */
export function verifyAuth(req: VercelRequest): { admin: boolean } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { admin: boolean };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Helper to require authentication. Sends 401 if not authenticated.
 * Returns true if authenticated, false if response was sent.
 */
export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  const auth = verifyAuth(req);
  if (!auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

/**
 * Set CORS headers for API responses.
 */
export function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Handle OPTIONS preflight request.
 * Returns true if it was a preflight (response sent), false otherwise.
 */
export function handleCors(req: VercelRequest, res: VercelResponse): boolean {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
