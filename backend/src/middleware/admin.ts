import type { NextFunction, Request, Response } from 'express';

import { getUserRole, verifyToken } from '../repositories/auth.js';
import type { AuthedRequest } from './auth.js';

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
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

  const role = await getUserRole(userId);
  if (role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  (req as AuthedRequest).userId = userId;
  next();
}
