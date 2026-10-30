import { Response } from 'express';
import { db } from '../config/mongodb.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { Review } from '../types/index.js';

export async function getWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const studioIds = await db.getWishlist(req.user.email);
    res.json({ success: true, wishlist: studioIds });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch saved wishlist.' });
  }
}

export async function toggleWishlist(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { studioId } = req.body;
    if (!studioId) {
      res.status(400).json({ success: false, message: 'studioId is required.' });
      return;
    }

    const result = await db.toggleWishlist(req.user.email, studioId);
    res.json({ success: true, saved: result.saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle wishlist.' });
  }
}

export async function addReview(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { studioId, rating, comment } = req.body;
    if (!studioId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Studio ID, rating (1-5), and comment are required.' });
      return;
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
      return;
    }

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      studioId,
      userName: req.user.name,
      userEmail: req.user.email,
      userAvatar: req.user.photoUrl,
      rating: numRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const saved = await db.addReview(newReview);
    res.status(201).json({ success: true, review: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
}
