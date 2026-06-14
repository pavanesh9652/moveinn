import { getToken } from '@/lib/auth';
import type { Listing } from '@/types/listing';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

async function fetchJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    throw new AuthError(data.error ?? 'Unauthorized');
  }

  if (!response.ok) {
    throw new Error(data.error ?? `API error: ${response.status}`);
  }

  return data as T;
}

export type AppConfig = {
  currentLocation: string;
  filterChips: readonly string[];
};

export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: string;
  count?: number;
};

export type UserData = {
  user: {
    name: string;
    email: string;
    mobile?: string;
    initial: string;
    verifiedSince: string;
  };
  profileMenu: ProfileMenuItem[];
  savedListingIds: string[];
};

export function fetchConfig() {
  return fetchJson<AppConfig>('/api/config');
}

export function fetchListings() {
  return fetchJson<Listing[]>('/api/listings');
}

export function fetchListingById(id: string) {
  return fetchJson<Listing>(`/api/listings/${id}`);
}

export function fetchUserData() {
  return fetchJson<UserData>('/api/user');
}
