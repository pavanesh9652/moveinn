export type NearbyPlaceInput = {
  name: string;
  travelMinutes: number;
  distanceKm: number;
};

export type WeekMenuDayInput = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type SampleReviewInput = {
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
  verified: boolean;
};

export type ListingDetails = {
  deposit: number;
  maintenance: string;
  electricity: string;
  availability: string;
  responseMinutes: number;
  amenities: string[];
  nearbyPlaces: NearbyPlaceInput[];
  weeklyMenu: WeekMenuDayInput[];
  sampleReviews: SampleReviewInput[];
};

export type CreateListingInput = {
  name: string;
  type: 'Co-Living' | 'PG';
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
  details: ListingDetails;
};
