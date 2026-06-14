import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { requestLogger } from './middleware/requestLogger.js';
import { apiRouter } from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(requestLogger);
  app.use(cors());
  app.use(express.json());
  app.use('/images', express.static(path.join(__dirname, '../public/images')));
  app.use('/api', apiRouter);

  return app;
}
