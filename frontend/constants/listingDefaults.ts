import type { ListingDetails, SampleReview, WeekMenuDay } from '@/types/listingDetails';

export const AMENITY_OPTIONS = [
  'Wi-Fi',
  'CCTV',
  'Lift',
  'Parking',
  'Laundry',
  'Gym',
  'Power Backup',
  'Hot Water',
] as const;

export const DEFAULT_WEEKLY_MENU: WeekMenuDay[] = [
  { day: 'Mon', breakfast: 'Idli, Sambar, Chutney', lunch: 'Andhra Meals, Rasam, Curd', dinner: 'Roti, Paneer Curry, Dal' },
  { day: 'Tue', breakfast: 'Poha, Boiled Egg', lunch: 'Veg Biryani, Raita', dinner: 'Pulao, Chicken Curry' },
  { day: 'Wed', breakfast: 'Upma, Coconut Chutney', lunch: 'Curd Rice, Pickle, Sabzi', dinner: 'Roti, Egg Bhurji, Dal' },
  { day: 'Thu', breakfast: 'Dosa, Sambar', lunch: 'Andhra Thali, Pappu', dinner: 'Fried Rice, Manchurian' },
  { day: 'Fri', breakfast: 'Paratha, Curd', lunch: 'Hyderabadi Biryani', dinner: 'Roti, Mixed Veg, Dal' },
  { day: 'Sat', breakfast: 'Pongal, Vada', lunch: 'Special Thali', dinner: 'Noodles, Chilli Chicken' },
  { day: 'Sun', breakfast: 'Aloo Paratha, Curd', lunch: 'Mutton Biryani, Salan', dinner: 'Roti, Paneer Tikka, Dal' },
];

export const DEFAULT_SAMPLE_REVIEWS: SampleReview[] = [
  {
    author: 'Ananya M.',
    rating: 5,
    timeAgo: '2 weeks ago',
    comment: 'Food is consistently good — Andhra meals every day. The rooftop vibe is great.',
    verified: true,
  },
  {
    author: 'Rohit S.',
    rating: 4,
    timeAgo: '1 month ago',
    comment: 'Solid Wi-Fi for WFH. Single rooms are spacious and common areas stay clean.',
    verified: true,
  },
];

export function createDefaultListingDetails(price = 12500): ListingDetails {
  return {
    deposit: price * 2,
    maintenance: 'Included',
    electricity: 'On actuals',
    availability: 'Available',
    responseMinutes: 10,
    amenities: [...AMENITY_OPTIONS],
    nearbyPlaces: [
      { name: 'Microsoft Hyderabad', travelMinutes: 4, distanceKm: 0.9 },
      { name: 'Amazon Hyderabad', travelMinutes: 6, distanceKm: 1.4 },
    ],
    weeklyMenu: DEFAULT_WEEKLY_MENU.map((day) => ({ ...day })),
    sampleReviews: DEFAULT_SAMPLE_REVIEWS.map((review) => ({ ...review })),
  };
}
