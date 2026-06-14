import { Router } from 'express';

import { getAllListings, getListingById } from '../repositories/listings.js';

export const listingsRouter = Router();

listingsRouter.get('/', async (_req, res) => {
  try {
    const listings = await getAllListings();
    res.json(listings);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

listingsRouter.get('/:id', async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }
    res.json(listing);
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});
