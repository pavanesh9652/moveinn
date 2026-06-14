import type { Listing } from '@/types/listing';
import type { ListingDetails } from '@/types/listingDetails';

import {
  AMENITY_OPTIONS,
  DEFAULT_SAMPLE_REVIEWS,
  DEFAULT_WEEKLY_MENU,
} from '@/constants/listingDefaults';

export type PropertyTab = 'overview' | 'food' | 'reviews';

export type QualityBreakdown = {
  label: string;
  score: number;
};

export type NearbyPlace = {
  name: string;
  travelMinutes: number;
  distanceKm: number;
};

export type Amenity = {
  icon: string;
  label: string;
};

export type WeekMenuDay = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type ReviewCategoryScore = {
  label: string;
  score: number;
};

export type PropertyReview = {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
  verified: boolean;
};

export type PropertyDetails = {
  deposit: number;
  maintenance: string;
  electricity: string;
  availability: string;
  qualityScore: number;
  qualityBreakdown: QualityBreakdown[];
  reviewCategoryScores: ReviewCategoryScore[];
  weeklyMenu: WeekMenuDay[];
  reviews: PropertyReview[];
  amenities: Amenity[];
  nearbyPlaces: NearbyPlace[];
  imageCount: number;
  responseMinutes: number;
};

const AMENITY_ICON_MAP: Record<string, string> = {
  'Wi-Fi': 'wifi',
  CCTV: 'videocam',
  Lift: 'business',
  Parking: 'car',
  Laundry: 'shirt',
  Gym: 'barbell',
  'Power Backup': 'flash',
  'Hot Water': 'water',
};

const NEARBY_BY_AREA: Record<string, NearbyPlace[]> = {
  Gachibowli: [
    { name: 'Microsoft Hyderabad', travelMinutes: 4, distanceKm: 0.9 },
    { name: 'Amazon Hyderabad', travelMinutes: 6, distanceKm: 1.4 },
  ],
  'Hitech City': [
    { name: 'Cyber Towers', travelMinutes: 5, distanceKm: 1.1 },
    { name: 'Mindspace', travelMinutes: 8, distanceKm: 1.8 },
  ],
};

function scoreOffset(base: number, delta: number) {
  return Math.min(5, Math.max(4, Math.round((base + delta) * 10) / 10));
}

function toAmenities(labels: string[]): Amenity[] {
  return labels.map((label) => ({
    label,
    icon: AMENITY_ICON_MAP[label] ?? 'checkmark-circle',
  }));
}

function detailsFromListing(listing: Listing): ListingDetails | null {
  return listing.details ?? null;
}

function fallbackDetails(listing: Listing): ListingDetails {
  return {
    deposit: listing.price * 2,
    maintenance: 'Included',
    electricity: 'On actuals',
    availability: listing.id === '1' || listing.id === '3' ? 'Few Left' : 'Available',
    responseMinutes: 10,
    amenities: [...AMENITY_OPTIONS],
    nearbyPlaces: NEARBY_BY_AREA[listing.area] ?? NEARBY_BY_AREA.Gachibowli,
    weeklyMenu: DEFAULT_WEEKLY_MENU,
    sampleReviews: DEFAULT_SAMPLE_REVIEWS,
  };
}

export function getPropertyDetails(listing: Listing): PropertyDetails {
  const stored = detailsFromListing(listing) ?? fallbackDetails(listing);
  const qualityScore = Math.round(listing.rating * 19.6);

  return {
    deposit: stored.deposit,
    maintenance: stored.maintenance,
    electricity: stored.electricity,
    availability: stored.availability,
    qualityScore,
    qualityBreakdown: [
      { label: 'Food', score: scoreOffset(listing.rating, 0) },
      { label: 'Clean', score: scoreOffset(listing.rating, -0.1) },
      { label: 'Safety', score: scoreOffset(listing.rating, 0.1) },
      { label: 'Wi-Fi', score: scoreOffset(listing.rating, -0.2) },
    ],
    reviewCategoryScores: [
      { label: 'Food', score: Math.round(scoreOffset(listing.rating, 0) * 20) },
      { label: 'Cleanliness', score: Math.round(scoreOffset(listing.rating, -0.1) * 20) },
      { label: 'Safety', score: Math.round(scoreOffset(listing.rating, 0.1) * 20) },
      { label: 'Wi-Fi', score: Math.round(scoreOffset(listing.rating, -0.2) * 20) },
    ],
    weeklyMenu: stored.weeklyMenu,
    reviews: stored.sampleReviews.map((review, index) => ({
      id: String(index + 1),
      ...review,
    })),
    amenities: toAmenities(stored.amenities),
    nearbyPlaces: stored.nearbyPlaces,
    imageCount: 4,
    responseMinutes: stored.responseMinutes,
  };
}

export function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}
