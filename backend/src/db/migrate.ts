import { closeDb, getDb } from './mongo.js';

async function migrate() {
  const db = await getDb();

  await db.collection('users').createIndexes([
    { key: { email: 1 }, unique: true },
    { key: { mobile: 1 }, unique: true, sparse: true },
  ]);

  await db.collection('listings').createIndexes([
    { key: { type: 1 } },
    { key: { city: 1 } },
    { key: { price: 1 } },
  ]);

  await db.collection('saved_listings').createIndexes([
    { key: { userId: 1, listingId: 1 }, unique: true },
    { key: { userId: 1 } },
  ]);

  await db.collection('inquiries').createIndex({ userId: 1 });

  await db.collection('reviews').createIndexes([
    { key: { userId: 1, listingId: 1 }, unique: true },
    { key: { listingId: 1 } },
  ]);

  console.log('Database indexes applied.');
  await closeDb();
}

migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
