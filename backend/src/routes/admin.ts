import { Router } from 'express';

import { type AuthedRequest, requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { getUserRole } from '../repositories/auth.js';
import { createListing } from '../repositories/listings.js';
import type { CreateListingInput } from '../types/listingDetails.js';

export const adminRouter = Router();

adminRouter.get('/me', requireAuth, async (req, res) => {
  const { userId } = req as AuthedRequest;
  const role = await getUserRole(userId);
  if (role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  res.json({ role: 'admin' });
});

adminRouter.post('/listings', requireAdmin, async (req, res) => {
  try {
    const body = req.body as Partial<CreateListingInput>;

    if (
      !body.name?.trim() ||
      !body.type ||
      body.price == null ||
      !body.area?.trim() ||
      !body.city?.trim() ||
      body.distanceKm == null ||
      !body.roomTypes?.length ||
      !body.imageFilename?.trim() ||
      !body.details
    ) {
      res.status(400).json({ error: 'Missing required listing fields' });
      return;
    }

    const listing = await createListing({
      name: body.name.trim(),
      type: body.type,
      rating: Number(body.rating) || 4.5,
      reviewCount: Number(body.reviewCount) || 0,
      price: Number(body.price),
      area: body.area.trim(),
      city: body.city.trim(),
      distanceKm: Number(body.distanceKm),
      travelMinutes: body.travelMinutes != null ? Number(body.travelMinutes) : undefined,
      cuisine: body.cuisine?.trim() || undefined,
      roomTypes: body.roomTypes,
      gender: body.gender,
      imageFilename: body.imageFilename.trim(),
      featuredTagline: body.featuredTagline?.trim() || undefined,
      details: body.details,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error('Failed to create listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});
