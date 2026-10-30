import { Router } from 'express';
import { getWishlist, toggleWishlist, addReview } from '../controllers/extra.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/wishlist', requireAuth, getWishlist);
router.post('/wishlist/toggle', requireAuth, toggleWishlist);
router.post('/reviews', requireAuth, addReview);

export default router;
