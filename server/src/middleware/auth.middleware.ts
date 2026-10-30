import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types/index.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'studiospace_jwt_super_secret_key_2026_production';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function extractToken(req: Request): string | null {
  // 1. Check HTTPOnly cookie
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  // 2. Check Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to proceed.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.user = decoded;
  } catch {
    // Ignore invalid token in optional auth
  }
  next();
}
