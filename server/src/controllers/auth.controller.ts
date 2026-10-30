import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { db } from '../config/mongodb.js';
import { JWT_SECRET, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { User, AuthTokenPayload } from '../types/index.js';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_studiospace_salt').digest('hex');
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must include at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must include at least one lowercase letter.' };
  }
  return { valid: true };
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, photoUrl } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      res.status(400).json({ success: false, message: passwordCheck.error });
      return;
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      photoUrl: photoUrl?.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date().toISOString()
    };

    await db.createUser(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully. Please proceed to login.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        photoUrl: newUser.photoUrl
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const hashedInput = hashPassword(password);
    if (user.passwordHash !== hashedInput) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const payload: AuthTokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: payload
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
}

export async function googleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, name, photoUrl } = req.body;
    if (!email || !name) {
      res.status(400).json({ success: false, message: 'Google authentication details missing.' });
      return;
    }

    let user = await db.findUserByEmail(email);
    if (!user) {
      user = {
        id: `usr_g_${Date.now()}`,
        name,
        email: email.toLowerCase().trim(),
        passwordHash: 'google_oauth_managed',
        photoUrl: photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date().toISOString()
      };
      await db.createUser(user);
    }

    const payload: AuthTokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Google login successful.',
      token,
      user: payload
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process Google sign-in.' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }
  res.json({ success: true, user: req.user });
}

export async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
}
