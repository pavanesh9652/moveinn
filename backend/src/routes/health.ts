import { Router } from 'express';

import { checkDbConnection } from '../db/mongo.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const dbConnected = await checkDbConnection();
  res.json({ status: 'ok', database: dbConnected ? 'connected' : 'disconnected' });
});
