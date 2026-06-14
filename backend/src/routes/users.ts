import { Router } from 'express';

import { type AuthedRequest, requireAuth } from '../middleware/auth.js';
import { getUserProfile } from '../repositories/users.js';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { userId } = req as AuthedRequest;
    const profile = await getUserProfile(userId);
    if (!profile) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});
