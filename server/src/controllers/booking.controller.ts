import { Response } from 'express';
import { db } from '../config/mongodb.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { Booking } from '../types/index.js';

export async function getUserBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const bookings = await db.getBookingsByUser(req.user.email);
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err: any) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve your bookings.' });
  }
}

export async function getHostBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const bookings = await db.getBookingsByHost(req.user.email);
    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err: any) {
    console.error('Error fetching host bookings:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings for your spaces.' });
  }
}

export async function getBookingById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const booking = await db.getBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    const userEmailLower = req.user.email.toLowerCase();
    if (booking.userEmail.toLowerCase() !== userEmailLower && booking.hostEmail.toLowerCase() !== userEmailLower) {
      res.status(403).json({ success: false, message: 'Forbidden: Access denied to this booking.' });
      return;
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to make a booking.' });
      return;
    }

    const { studioId, bookingDate, startTime, endTime } = req.body;

    if (!studioId || !bookingDate || !startTime || !endTime) {
      res.status(400).json({
        success: false,
        message: 'Studio ID, booking date, start time, and end time are required.'
      });
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(bookingDate)) {
      res.status(400).json({ success: false, message: 'Invalid booking date format. Use YYYY-MM-DD.' });
      return;
    }

    // Validate times (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      res.status(400).json({ success: false, message: 'Invalid time format. Use HH:mm (24-hour).' });
      return;
    }

    if (startTime >= endTime) {
      res.status(400).json({ success: false, message: 'End time must be later than start time.' });
      return;
    }

    const studio = await db.getStudioById(studioId);
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio does not exist.' });
      return;
    }

    // Prevent creator from booking their own studio
    if (studio.hostEmail.toLowerCase() === req.user.email.toLowerCase()) {
      res.status(400).json({ success: false, message: 'You cannot book your own studio listing.' });
      return;
    }

    // CHALLENGE 2: Double-Booking Prevention
    const conflicts = await db.findConflictingBookings(studioId, bookingDate, startTime, endTime);
    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      res.status(409).json({
        success: false,
        message: `Schedule Conflict: This studio is already reserved on ${bookingDate} between ${conflict.startTime} and ${conflict.endTime}. Please pick an alternate time slot.`,
        conflictDetails: {
          existingStart: conflict.startTime,
          existingEnd: conflict.endTime,
          status: conflict.status
        }
      });
      return;
    }

    // Calculate hours and total amount
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // 1 decimal place

    const hourlyPrice = studio.hourlyRate;
    const securityDeposit = studio.securityDeposit || 0;
    const totalAmount = Math.round((totalHours * hourlyPrice + securityDeposit) * 100) / 100;

    const newBooking: Booking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studioId: studio.id,
      studioTitle: studio.title,
      studioImage: studio.imageUrl,
      userName: req.user.name,
      userEmail: req.user.email,
      bookingDate,
      startTime,
      endTime,
      totalHours,
      hourlyPrice,
      securityDeposit,
      totalAmount,
      status: 'pending', // Default status
      hostEmail: studio.hostEmail,
      createdAt: new Date().toISOString()
    };

    const saved = await db.createBooking(newBooking);

    res.status(201).json({
      success: true,
      message: 'Booking request placed successfully! Awaiting host confirmation.',
      booking: saved
    });
  } catch (err: any) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, message: 'Failed to create studio booking.' });
  }
}

export async function cancelBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const booking = await db.getBookingById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    const userEmailLower = req.user.email.toLowerCase();
    const isClient = booking.userEmail.toLowerCase() === userEmailLower;
    const isHost = booking.hostEmail.toLowerCase() === userEmailLower;

    if (!isClient && !isHost) {
      res.status(403).json({ success: false, message: 'Forbidden: You are not authorized to cancel this reservation.' });
      return;
    }

    if (booking.status === 'completed') {
      res.status(400).json({ success: false, message: 'Cannot cancel a completed session.' });
      return;
    }

    if (booking.status === 'cancelled') {
      res.status(400).json({ success: false, message: 'This booking has already been cancelled.' });
      return;
    }

    const updated = await db.updateBookingStatus(id, 'cancelled');

    res.json({
      success: true,
      message: 'Booking reservation successfully cancelled.',
      booking: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
}

export async function updateBookingStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid booking status.' });
      return;
    }

    const booking = await db.getBookingById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }

    // Only host of the studio can approve/confirm/complete
    if (booking.hostEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      res.status(403).json({ success: false, message: 'Forbidden: Only the studio host can manage booking status.' });
      return;
    }

    const updated = await db.updateBookingStatus(id, status);

    res.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
}
