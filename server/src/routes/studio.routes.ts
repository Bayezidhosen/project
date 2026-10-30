import { Router } from 'express';
import {
  getStudios,
  getStudioById,
  getMyStudios,
  createStudio,
  updateStudio,
  deleteStudio
} from '../controllers/studio.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getStudios);
router.get('/host/me', requireAuth, getMyStudios);
router.get('/:id', getStudioById);

// Protected routes (Challenge 1)
router.post('/', requireAuth, createStudio);
router.patch('/:id', requireAuth, updateStudio);
router.delete('/:id', requireAuth, deleteStudio);

export default router;
