import 'dotenv/config';

import pg from 'pg';

const { Pool } = pg;

function createPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }

  return new Pool({
    host: process.env.PGHOST ?? '/var/run/postgresql',
    database: process.env.PGDATABASE ?? 'rentrent',
    user: process.env.PGUSER ?? process.env.USER,
  });
}

export const pool = createPool();

export async function checkDbConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
