import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
const ADMIN_TOKEN_KEY = 'rentrent_admin_token';

let memoryToken: string | null = null;

function getStoredToken(): string | null {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }
  return memoryToken;
}

function setStoredToken(token: string) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    return;
  }
  memoryToken = token;
}

function removeStoredToken() {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return;
  }
  memoryToken = null;
}

export function getAdminToken() {
  return Promise.resolve(getStoredToken());
}

export async function adminLogin(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Login failed');
  }

  if (data.user?.role !== 'admin') {
    throw new Error('This account is not an admin');
  }

  setStoredToken(data.token);
  return data;
}

export async function verifyAdminSession() {
  const token = getStoredToken();
  if (!token) return false;

  const response = await fetch(`${API_URL}/api/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.ok;
}

export async function adminLogout() {
  removeStoredToken();
}

export async function createListingAsAdmin(payload: unknown) {
  const token = getStoredToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/api/admin/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to create listing');
  }

  return data;
}
