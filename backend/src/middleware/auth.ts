import type { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../repositories/auth.js';

export type AuthedRequest = Request & { userId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = verifyToken(header.slice(7));
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  (req as AuthedRequest).userId = userId;
  next();
}
