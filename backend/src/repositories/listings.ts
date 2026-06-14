import { pool } from '../db/pool.js';
import type { CreateListingInput, ListingDetails } from '../types/listingDetails.js';
import type { Listing, ListingType } from '../types/listing.js';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3001';

type ListingRow = {
  id: string;
  name: string;
  type: ListingType;
  rating: string;
  review_count: number;
  price: number;
  area: string;
  city: string;
  distance_km: string;
  travel_minutes: number | null;
  cuisine: string | null;
  room_types: string[];
  gender: 'Women' | 'Mixed' | null;
  image_filename: string;
  featured_tagline: string | null;
  details: ListingDetails | null;
};

function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    price: row.price,
    area: row.area,
    city: row.city,
    distanceKm: Number(row.distance_km),
    travelMinutes: row.travel_minutes ?? undefined,
    cuisine: row.cuisine ?? undefined,
    roomTypes: row.room_types,
    gender: row.gender ?? undefined,
    imageUrl: `${API_BASE}/images/${row.image_filename}`,
    featuredTagline: row.featured_tagline ?? undefined,
    details: row.details ?? undefined,
  };
}

const LISTING_COLUMNS = `id, name, type, rating, review_count, price, area, city,
  distance_km, travel_minutes, cuisine, room_types, gender,
  image_filename, featured_tagline, details`;

export async function getAllListings(): Promise<Listing[]> {
  const result = await pool.query<ListingRow>(
    `SELECT ${LISTING_COLUMNS}
     FROM listings
     ORDER BY rating DESC, name ASC`,
  );

  return result.rows.map(toListing);
}

export async function getListingById(id: string): Promise<Listing | null> {
  const result = await pool.query<ListingRow>(
    `SELECT ${LISTING_COLUMNS}
     FROM listings
     WHERE id = $1`,
    [id],
  );

  const row = result.rows[0];
  return row ? toListing(row) : null;
}

async function nextListingId(): Promise<string> {
  const result = await pool.query<{ max_id: string | null }>(
    `SELECT MAX(CAST(id AS INTEGER))::text AS max_id FROM listings WHERE id ~ '^[0-9]+$'`,
  );
  const maxId = result.rows[0]?.max_id;
  return maxId ? String(Number(maxId) + 1) : '1';
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  const id = await nextListingId();

  const result = await pool.query<ListingRow>(
    `INSERT INTO listings (
      id, name, type, rating, review_count, price, area, city,
      distance_km, travel_minutes, cuisine, room_types, gender,
      image_filename, featured_tagline, details
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING ${LISTING_COLUMNS}`,
    [
      id,
      input.name,
      input.type,
      input.rating,
      input.reviewCount,
      input.price,
      input.area,
      input.city,
      input.distanceKm,
      input.travelMinutes ?? null,
      input.cuisine ?? null,
      input.roomTypes,
      input.gender ?? null,
      input.imageFilename,
      input.featuredTagline ?? null,
      input.details,
    ],
  );

  return toListing(result.rows[0]);
}
