import bcrypt from 'bcryptjs';

import { closeDb, getDb } from './mongo.js';
import type { InquiryDoc, ListingDoc, SavedListingDoc, UserDoc } from './types.js';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000099';

type SeedListing = Omit<ListingDoc, '_id' | 'createdAt'> & { id: string };

const listings: SeedListing[] = [
  {
    id: '1',
    name: 'Skyline Residency',
    type: 'Co-Living',
    rating: 4.8,
    reviewCount: 214,
    price: 12500,
    area: 'Gachibowli',
    city: 'Hyderabad',
    distanceKm: 1.2,
    travelMinutes: 6,
    roomTypes: ['Single', 'Double', 'Triple'],
    gender: 'Mixed',
    imageFilename: 'listing-1.jpg',
    featuredTagline: 'Walk to Microsoft · Rooftop lounge · Chef-curated menu',
  },
  {
    id: '2',
    name: 'Sunrise PG for Women',
    type: 'PG',
    rating: 4.6,
    reviewCount: 178,
    price: 8500,
    area: 'Hitech City',
    city: 'Hyderabad',
    distanceKm: 2.4,
    travelMinutes: 11,
    cuisine: 'Andhra',
    roomTypes: ['Double', 'Triple'],
    gender: 'Women',
    imageFilename: 'listing-2.jpg',
  },
  {
    id: '3',
    name: 'Urbanest Co-Living',
    type: 'Co-Living',
    rating: 4.9,
    reviewCount: 302,
    price: 14500,
    area: 'Madhapur',
    city: 'Hyderabad',
    distanceKm: 3.1,
    travelMinutes: 13,
    cuisine: 'North Indian',
    roomTypes: ['Single', 'Double'],
    gender: 'Mixed',
    imageFilename: 'listing-3.jpg',
  },
  {
    id: '4',
    name: 'Nest Elite Coliving',
    type: 'Co-Living',
    rating: 4.7,
    reviewCount: 156,
    price: 13500,
    area: 'Financial District',
    city: 'Hyderabad',
    distanceKm: 2,
    travelMinutes: 8,
    roomTypes: ['Single', 'Double'],
    gender: 'Mixed',
    imageFilename: 'listing-4.jpg',
  },
  {
    id: '5',
    name: 'Greenfield PG',
    type: 'PG',
    rating: 4.5,
    reviewCount: 92,
    price: 9500,
    area: 'Gachibowli',
    city: 'Hyderabad',
    distanceKm: 1.8,
    travelMinutes: 7,
    roomTypes: ['Double', 'Triple'],
    gender: 'Mixed',
    imageFilename: 'listing-5.jpg',
  },
  {
    id: '6',
    name: 'Comfort Stay Kondapur',
    type: 'PG',
    rating: 4.4,
    reviewCount: 67,
    price: 7500,
    area: 'Kondapur',
    city: 'Hyderabad',
    distanceKm: 4.6,
    travelMinutes: 18,
    roomTypes: ['Double', 'Triple'],
    gender: 'Mixed',
    imageFilename: 'listing-6.jpg',
  },
];

async function seed() {
  const db = await getDb();
  const now = new Date();

  const demoPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('123456', 10);

  await db.collection<UserDoc>('users').updateOne(
    { _id: ADMIN_USER_ID },
    {
      $set: {
        name: 'RentRent Admin',
        email: 'admin@rentrent.com',
        mobile: '9000000000',
        passwordHash: adminPasswordHash,
        initial: 'R',
        verifiedSince: '2024',
        role: 'admin',
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  await db.collection<UserDoc>('users').updateOne(
    { _id: DEMO_USER_ID },
    {
      $set: {
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        mobile: '9876543210',
        passwordHash: demoPasswordHash,
        initial: 'A',
        verifiedSince: '2024',
        role: 'user',
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  for (const listing of listings) {
    const { id, ...fields } = listing;
    await db.collection<ListingDoc>('listings').updateOne(
      { _id: id },
      { $set: fields, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );
  }

  await db.collection<SavedListingDoc>('saved_listings').deleteMany({ userId: DEMO_USER_ID });
  await db.collection<SavedListingDoc>('saved_listings').insertMany([
    { userId: DEMO_USER_ID, listingId: '1', savedAt: now },
    { userId: DEMO_USER_ID, listingId: '2', savedAt: now },
  ]);

  await db.collection<InquiryDoc>('inquiries').deleteMany({ userId: DEMO_USER_ID });
  await db.collection<InquiryDoc>('inquiries').insertMany([
    {
      userId: DEMO_USER_ID,
      listingId: '1',
      message: 'Is a single room available from next month?',
      status: 'pending',
      createdAt: now,
    },
    {
      userId: DEMO_USER_ID,
      listingId: '3',
      message: 'Do you offer a trial stay?',
      status: 'pending',
      createdAt: now,
    },
    {
      userId: DEMO_USER_ID,
      listingId: '4',
      message: 'What is included in the monthly rent?',
      status: 'replied',
      createdAt: now,
    },
  ]);

  console.log('Database seeded successfully.');
  await closeDb();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
