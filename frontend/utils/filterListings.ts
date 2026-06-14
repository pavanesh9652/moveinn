import { Listing } from '@/types/listing';

export interface SearchFilters {
  type: string | null;
  food: string | null;
  sharing: string | null;
  budget: string | null;
  sortBy: string;
  query: string;
}

export const DEFAULT_FILTERS: SearchFilters = {
  type: null,
  food: null,
  sharing: null,
  budget: null,
  sortBy: 'Rating',
  query: '',
};

function matchesBudget(price: number, budget: string | null): boolean {
  if (!budget) return true;
  if (budget === '< 8k') return price < 8000;
  if (budget === '8k–12k') return price >= 8000 && price <= 12000;
  if (budget === '12k–18k') return price > 12000 && price <= 18000;
  if (budget === '18k+') return price > 18000;
  return true;
}

export function filterListings(listings: Listing[], filters: SearchFilters): Listing[] {
  let result = listings.filter((listing) => {
    if (filters.type && listing.type !== filters.type) return false;
    if (filters.food) {
      const food = listing.cuisine ?? listing.gender ?? '';
      if (food !== filters.food) return false;
    }
    if (filters.sharing && !listing.roomTypes.includes(filters.sharing)) return false;
    if (!matchesBudget(listing.price, filters.budget)) return false;
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      const haystack = `${listing.name} ${listing.area} ${listing.city}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    switch (filters.sortBy) {
      case 'Distance':
        return a.distanceKm - b.distanceKm;
      case 'Price':
        return a.price - b.price;
      case 'Popularity':
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      case 'Rating':
      default:
        return b.rating - a.rating;
    }
  });

  return result;
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return Boolean(filters.type || filters.food || filters.sharing || filters.budget || filters.query);
}

function paramValue(value: string | string[] | undefined): string | null {
  if (typeof value !== 'string' || !value) return null;
  return value;
}

export function filtersFromParams(
  params: Record<string, string | string[] | undefined>,
): SearchFilters {
  return {
    type: paramValue(params.type),
    food: paramValue(params.food),
    sharing: paramValue(params.sharing),
    budget: paramValue(params.budget),
    sortBy: paramValue(params.sortBy) ?? DEFAULT_FILTERS.sortBy,
    query: paramValue(params.query) ?? '',
  };
}

export function filtersToParams(filters: Partial<SearchFilters>): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.type) params.type = filters.type;
  if (filters.food) params.food = filters.food;
  if (filters.sharing) params.sharing = filters.sharing;
  if (filters.budget) params.budget = filters.budget;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.query) params.query = filters.query;

  return params;
}
