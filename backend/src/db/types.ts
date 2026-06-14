import type { ListingDetails } from '../types/listingDetails.js';
import type { ListingType } from '../types/listing.js';

export type UserDoc = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  passwordHash?: string;
  initial: string;
  verifiedSince: string;
  role: string;
  createdAt: Date;
};

export type ListingDoc = {
  _id: string;
  name: string;
  type: ListingType;
  rating: number;
  reviewCount: number;
  price: number;
  area: string;
  city: string;
  distanceKm: number;
  travelMinutes?: number;
  cuisine?: string;
  roomTypes: string[];
  gender?: 'Women' | 'Mixed';
  imageFilename: string;
  featuredTagline?: string;
  details?: ListingDetails;
  createdAt: Date;
};

export type SavedListingDoc = {
  userId: string;
  listingId: string;
  savedAt: Date;
};

export type InquiryDoc = {
  userId: string;
  listingId: string;
  message?: string;
  status: string;
  createdAt: Date;
};
