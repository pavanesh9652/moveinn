export type NearbyPlace = {
  name: string;
  travelMinutes: number;
  distanceKm: number;
};

export type WeekMenuDay = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type SampleReview = {
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
  nearbyPlaces: NearbyPlace[];
  weeklyMenu: WeekMenuDay[];
  sampleReviews: SampleReview[];
};
