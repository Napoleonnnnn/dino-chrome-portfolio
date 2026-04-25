"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_js_1 = require("../_lib/auth.js");
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
async function handler(req, res) {
    if ((0, auth_js_1.handleCors)(req, res))
        return;
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
    const isValid = await bcryptjs_1.default.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate JWT (expires in 7 days)
    const token = jsonwebtoken_1.default.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
}
