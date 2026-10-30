import { Request, Response } from 'express';
import { db } from '../config/mongodb.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { Studio, StudioCategory } from '../types/index.js';

const VALID_CATEGORIES: StudioCategory[] = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop'
];

export async function getStudios(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, location, minPrice, maxPrice, sortBy, limit } = req.query;

    const studios = await db.getStudios({
      category: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
      location: typeof location === 'string' ? location : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: typeof sortBy === 'string' ? sortBy : undefined,
      limit: limit ? Number(limit) : undefined
    });

    res.json({
      success: true,
      count: studios.length,
      studios
    });
  } catch (err: any) {
    console.error('Error fetching studios:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch studio listings.' });
  }
}

export async function getStudioById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const studio = await db.getStudioById(id);

    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio not found.' });
      return;
    }

    const reviews = await db.getReviewsByStudio(id);

    res.json({
      success: true,
      studio,
      reviews
    });
  } catch (err: any) {
    console.error('Error fetching studio by ID:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch studio details.' });
  }
}

export async function getMyStudios(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const studios = await db.getStudiosByHost(req.user.email);
    res.json({
      success: true,
      count: studios.length,
      studios
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve your studio listings.' });
  }
}

export async function createStudio(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required to create a studio listing.' });
      return;
    }

    const {
      title,
      category,
      hourlyRate,
      securityDeposit,
      maxCapacity,
      location,
      address,
      imageUrl,
      additionalImages,
      amenities,
      description
    } = req.body;

    if (!title || !category || !hourlyRate || !location || !address || !imageUrl || !description) {
      res.status(400).json({
        success: false,
        message: 'Missing required studio parameters (title, category, hourlyRate, location, address, imageUrl, description).'
      });
      return;
    }

    if (!VALID_CATEGORIES.includes(category)) {
      res.status(400).json({
        success: false,
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`
      });
      return;
    }

    const rateNum = Number(hourlyRate);
    const depositNum = Number(securityDeposit || 0);
    const capacityNum = Number(maxCapacity || 10);

    if (isNaN(rateNum) || rateNum <= 0) {
      res.status(400).json({ success: false, message: 'Hourly rate must be a positive number.' });
      return;
    }

    const newStudio: Studio = {
      id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      category,
      hourlyRate: rateNum,
      securityDeposit: depositNum,
      maxCapacity: capacityNum,
      location: location.trim(),
      address: address.trim(),
      imageUrl: imageUrl.trim(),
      additionalImages: Array.isArray(additionalImages) ? additionalImages : [imageUrl.trim()],
      amenities: Array.isArray(amenities)
        ? amenities.filter(a => typeof a === 'string' && a.trim().length > 0)
        : ['High-Speed WiFi', 'Restroom Access'],
      description: description.trim(),
      // Host identity derived strictly from verified token (Challenge 1 & Requirement 8)
      hostName: req.user.name,
      hostEmail: req.user.email,
      hostAvatar: req.user.photoUrl,
      rating: 5.0,
      reviewsCount: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await db.createStudio(newStudio);

    res.status(201).json({
      success: true,
      message: 'Studio listing published successfully!',
      studio: saved
    });
  } catch (err: any) {
    console.error('Error creating studio:', err);
    res.status(500).json({ success: false, message: 'Failed to create studio listing.' });
  }
}

export async function updateStudio(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const existing = await db.getStudioById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Studio not found.' });
      return;
    }

    // Ownership check (Challenge 1)
    if (existing.hostEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this studio.'
      });
      return;
    }

    const {
      title,
      category,
      hourlyRate,
      securityDeposit,
      maxCapacity,
      location,
      address,
      imageUrl,
      additionalImages,
      amenities,
      description
    } = req.body;

    const updates: Partial<Studio> = {};
    if (title) updates.title = title.trim();
    if (category && VALID_CATEGORIES.includes(category)) updates.category = category;
    if (hourlyRate) updates.hourlyRate = Number(hourlyRate);
    if (securityDeposit !== undefined) updates.securityDeposit = Number(securityDeposit);
    if (maxCapacity) updates.maxCapacity = Number(maxCapacity);
    if (location) updates.location = location.trim();
    if (address) updates.address = address.trim();
    if (imageUrl) updates.imageUrl = imageUrl.trim();
    if (Array.isArray(additionalImages)) updates.additionalImages = additionalImages;
    if (Array.isArray(amenities)) updates.amenities = amenities;
    if (description) updates.description = description.trim();

    const updated = await db.updateStudio(id, updates);

    res.json({
      success: true,
      message: 'Studio listing updated successfully.',
      studio: updated
    });
  } catch (err: any) {
    console.error('Error updating studio:', err);
    res.status(500).json({ success: false, message: 'Failed to update studio.' });
  }
}

export async function deleteStudio(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const existing = await db.getStudioById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Studio not found.' });
      return;
    }

    // Ownership check (Challenge 1)
    if (existing.hostEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this studio listing.'
      });
      return;
    }

    await db.deleteStudio(id);

    res.json({
      success: true,
      message: 'Studio listing has been permanently removed.'
    });
  } catch (err: any) {
    console.error('Error deleting studio:', err);
    res.status(500).json({ success: false, message: 'Failed to delete studio.' });
  }
}
