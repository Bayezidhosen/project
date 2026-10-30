import { Router } from 'express';
import {
  getUserBookings,
  getHostBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  updateBookingStatus
} from '../controllers/booking.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// All booking operations require authenticated identity
router.get('/', requireAuth, getUserBookings);
router.get('/host', requireAuth, getHostBookings);
router.get('/:id', requireAuth, getBookingById);
router.post('/', requireAuth, createBooking);
router.patch('/:id/cancel', requireAuth, cancelBooking);
router.patch('/:id/status', requireAuth, updateBookingStatus);

export default router;
