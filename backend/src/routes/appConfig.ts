import { Router } from 'express';

import { CURRENT_LOCATION, FILTER_CHIPS } from '../config.js';

export const appConfigRouter = Router();

appConfigRouter.get('/', (_req, res) => {
  res.json({
    currentLocation: CURRENT_LOCATION,
    filterChips: FILTER_CHIPS,
  });
});
