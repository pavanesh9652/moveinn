import { getDb } from '../db/mongo.js';
import type { ListingDoc } from '../db/types.js';
import type { CreateListingInput } from '../types/listingDetails.js';
import type { Listing } from '../types/listing.js';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3001';

function toListing(doc: ListingDoc): Listing {
  return {
    id: doc._id,
    name: doc.name,
    type: doc.type,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    price: doc.price,
    area: doc.area,
    city: doc.city,
    distanceKm: doc.distanceKm,
    travelMinutes: doc.travelMinutes,
    cuisine: doc.cuisine,
    roomTypes: doc.roomTypes,
    gender: doc.gender,
    imageUrl: `${API_BASE}/images/${doc.imageFilename}`,
    featuredTagline: doc.featuredTagline,
    details: doc.details,
  };
}

export async function getAllListings(): Promise<Listing[]> {
  const db = await getDb();
  const docs = await db
    .collection<ListingDoc>('listings')
    .find()
    .sort({ rating: -1, name: 1 })
    .toArray();

  return docs.map(toListing);
}

export async function getListingById(id: string): Promise<Listing | null> {
  const db = await getDb();
  const doc = await db.collection<ListingDoc>('listings').findOne({ _id: id });
  return doc ? toListing(doc) : null;
}

async function nextListingId(): Promise<string> {
  const db = await getDb();
  const result = await db
    .collection('listings')
    .aggregate<{ maxId: number | null }>([
      { $match: { _id: { $regex: /^[0-9]+$/ } } },
      { $addFields: { numericId: { $toInt: '$_id' } } },
      { $group: { _id: null, maxId: { $max: '$numericId' } } },
    ])
    .toArray();

  const maxId = result[0]?.maxId;
  return maxId ? String(maxId + 1) : '1';
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  const db = await getDb();
  const id = await nextListingId();

  const doc: ListingDoc = {
    _id: id,
    name: input.name,
    type: input.type,
    rating: input.rating,
    reviewCount: input.reviewCount,
    price: input.price,
    area: input.area,
    city: input.city,
    distanceKm: input.distanceKm,
    travelMinutes: input.travelMinutes,
    cuisine: input.cuisine,
    roomTypes: input.roomTypes,
    gender: input.gender,
    imageFilename: input.imageFilename,
    featuredTagline: input.featuredTagline,
    details: input.details,
    createdAt: new Date(),
  };

  await db.collection<ListingDoc>('listings').insertOne(doc);

  return toListing(doc);
}
