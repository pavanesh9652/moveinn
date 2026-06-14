import type { ListingDetails } from './listingDetails.js';

export type ListingType = 'Co-Living' | 'PG';

export interface Listing {
  id: string;
  name: string;
  type: ListingType;
  rating: number;
  reviewCount?: number;
  price: number;
  area: string;
  city: string;
  distanceKm: number;
  travelMinutes?: number;
  cuisine?: string;
  roomTypes: string[];
  gender?: 'Women' | 'Mixed';
  imageUrl: string;
  featuredTagline?: string;
  details?: ListingDetails;
}
