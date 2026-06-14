import bcrypt from 'bcryptjs';

import { pool } from './pool.js';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000099';

const listings = [
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
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const demoPasswordHash = await bcrypt.hash('password123', 10);
    const adminPasswordHash = await bcrypt.hash('123456', 10);

    await client.query(
      `INSERT INTO users (id, name, email, mobile, password_hash, initial, verified_since, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           mobile = EXCLUDED.mobile,
           password_hash = EXCLUDED.password_hash,
           initial = EXCLUDED.initial,
           verified_since = EXCLUDED.verified_since,
           role = EXCLUDED.role`,
      [
        ADMIN_USER_ID,
        'RentRent Admin',
        'admin@rentrent.com',
        '9000000000',
        adminPasswordHash,
        'R',
        '2024',
        'admin',
      ],
    );

    await client.query(
      `INSERT INTO users (id, name, email, mobile, password_hash, initial, verified_since)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           mobile = EXCLUDED.mobile,
           password_hash = EXCLUDED.password_hash,
           initial = EXCLUDED.initial,
           verified_since = EXCLUDED.verified_since`,
      [
        DEMO_USER_ID,
        'Aarav Sharma',
        'aarav@example.com',
        '9876543210',
        demoPasswordHash,
        'A',
        '2024',
      ],
    );

    for (const listing of listings) {
      await client.query(
        `INSERT INTO listings (
          id, name, type, rating, review_count, price, area, city,
          distance_km, travel_minutes, cuisine, room_types, gender,
          image_filename, featured_tagline
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          rating = EXCLUDED.rating,
          review_count = EXCLUDED.review_count,
          price = EXCLUDED.price,
          area = EXCLUDED.area,
          city = EXCLUDED.city,
          distance_km = EXCLUDED.distance_km,
          travel_minutes = EXCLUDED.travel_minutes,
          cuisine = EXCLUDED.cuisine,
          room_types = EXCLUDED.room_types,
          gender = EXCLUDED.gender,
          image_filename = EXCLUDED.image_filename,
          featured_tagline = EXCLUDED.featured_tagline`,
        [
          listing.id,
          listing.name,
          listing.type,
          listing.rating,
          listing.reviewCount,
          listing.price,
          listing.area,
          listing.city,
          listing.distanceKm,
          listing.travelMinutes ?? null,
          listing.cuisine ?? null,
          listing.roomTypes,
          listing.gender ?? null,
          listing.imageFilename,
          listing.featuredTagline ?? null,
        ],
      );
    }

    await client.query('DELETE FROM saved_listings WHERE user_id = $1', [DEMO_USER_ID]);
    await client.query(
      `INSERT INTO saved_listings (user_id, listing_id)
       VALUES ($1, '1'), ($1, '2')`,
      [DEMO_USER_ID],
    );

    await client.query('DELETE FROM inquiries WHERE user_id = $1', [DEMO_USER_ID]);
    await client.query(
      `INSERT INTO inquiries (user_id, listing_id, message, status)
       VALUES
         ($1, '1', 'Is a single room available from next month?', 'pending'),
         ($1, '3', 'Do you offer a trial stay?', 'pending'),
         ($1, '4', 'What is included in the monthly rent?', 'replied')`,
      [DEMO_USER_ID],
    );

    await client.query('COMMIT');
    console.log('Database seeded successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
