import { createApp } from './app.js';
import { checkDbConnection } from './db/pool.js';

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  const dbConnected = await checkDbConnection();
  if (!dbConnected) {
    console.error('Could not connect to PostgreSQL. Check DATABASE_URL and run:');
    console.error('  npm run db:up && npm run db:setup');
    process.exit(1);
  }

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`MoveInn server running at http://localhost:${PORT}`);
    console.log('API routes: /api/*');
  });
}

start();
