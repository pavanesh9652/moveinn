import 'dotenv/config';

import { MongoClient, type Db } from 'mongodb';

const DEFAULT_URI = 'mongodb://localhost:27017/rentrent';

let client: MongoClient | null = null;
let db: Db | null = null;

function getMongoUri(): string {
  return process.env.MONGODB_URI ?? DEFAULT_URI;
}

export async function connectDb(): Promise<Db> {
  if (db) {
    return db;
  }

  client = new MongoClient(getMongoUri());
  await client.connect();
  db = client.db();
  return db;
}

export async function getDb(): Promise<Db> {
  return connectDb();
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    const database = await connectDb();
    await database.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
