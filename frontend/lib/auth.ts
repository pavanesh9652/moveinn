import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'rentrent_auth_token';

/** Default route — use for sign-out and auth failures */
export const LOGIN_ROUTE = '/' as const;

let memoryToken: string | null = null;

function getStoredToken(): string | null {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return memoryToken;
}

function setStoredToken(token: string) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  memoryToken = token;
}

function removeStoredToken() {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  memoryToken = null;
}

export function getToken() {
  return Promise.resolve(getStoredToken());
}

export function clearToken() {
  removeStoredToken();
  return Promise.resolve();
}

export type AuthUser = {
  name: string;
  email: string;
  mobile?: string;
  initial: string;
  verifiedSince: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

async function postAuth(path: string, body: Record<string, string>): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed');
  }

  setStoredToken(data.token);
  return data as AuthResponse;
}

export function login(email: string, password: string) {
  return postAuth('/api/auth/login', { email, password });
}

export function signup(email: string, mobile: string, password: string) {
  return postAuth('/api/auth/signup', { email, mobile, password });
}

export async function logout() {
  await clearToken();
}

export async function handleAuthFailure() {
  await clearToken();
}
