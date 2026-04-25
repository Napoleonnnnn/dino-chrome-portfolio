import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt = require('jsonwebtoken');
import bcrypt = require('bcryptjs');
import { handleCors } from '../_lib/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check username
  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password against bcrypt hash
  if (!ADMIN_PASSWORD_HASH) {
    return res.status(500).json({ error: 'Admin password not configured. Set ADMIN_PASSWORD_HASH env var.' });
  }

  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT (expires in 7 days)
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' });

  return res.status(200).json({ token });
}
