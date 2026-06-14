import { LOGIN_ROUTE } from '@/lib/auth';

export const SIGNUP_ROUTE = '/signup' as const;
export const HOME_ROUTE = '/(tabs)' as const;
export const ADMIN_LOGIN_ROUTE = '/admin' as const;
export const ADMIN_ONBOARD_ROUTE = '/admin/onboard' as const;

export function isAdminLoginPath(pathname: string) {
  return pathname === ADMIN_LOGIN_ROUTE || pathname === `${ADMIN_LOGIN_ROUTE}/`;
}

export function isAdminOnboardPath(pathname: string) {
  return pathname === ADMIN_ONBOARD_ROUTE || pathname.startsWith(`${ADMIN_ONBOARD_ROUTE}/`);
}

/** Route segment names that do not require authentication */
const PUBLIC_SEGMENTS = new Set(['index', 'login', 'signup']);

/** Route segment names that require authentication */
const PROTECTED_SEGMENTS = new Set(['(tabs)', 'property', 'modal']);

export function isPublicRoute(segments: string[]): boolean {
  if (segments.length === 0) return true;
  return PUBLIC_SEGMENTS.has(segments[0]);
}

export function isProtectedRoute(segments: string[]): boolean {
  if (segments.length === 0) return false;
  return PROTECTED_SEGMENTS.has(segments[0]);
}

/** Login / sign-up screens — authenticated users are sent to home */
export function isAuthScreen(segments: string[]): boolean {
  if (segments.length === 0) return true;
  const first = segments[0];
  return first === 'index' || first === 'login' || first === 'signup';
}

export { LOGIN_ROUTE };
