"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = verifyAuth;
exports.requireAuth = requireAuth;
exports.setCorsHeaders = setCorsHeaders;
exports.handleCors = handleCors;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
/**
 * Verify JWT token from Authorization header.
 * Returns decoded payload if valid, null otherwise.
 */
function verifyAuth(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
        return null;
    const token = authHeader.substring(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch {
        return null;
    }
}
/**
 * Helper to require authentication. Sends 401 if not authenticated.
 * Returns true if authenticated, false if response was sent.
 */
function requireAuth(req, res) {
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
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
/**
 * Handle OPTIONS preflight request.
 * Returns true if it was a preflight (response sent), false otherwise.
 */
function handleCors(req, res) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}
