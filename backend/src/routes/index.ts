import { Router } from 'express';

import { adminRouter } from './admin.js';
import { appConfigRouter } from './appConfig.js';
import { authRouter } from './auth.js';
import { healthRouter } from './health.js';
import { listingsRouter } from './listings.js';
import { usersRouter } from './users.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/config', appConfigRouter);
apiRouter.use('/listings', listingsRouter);
apiRouter.use('/user', usersRouter);
