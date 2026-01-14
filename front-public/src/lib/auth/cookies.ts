import { cookies } from 'next/headers';
import type { AuthenticationResponse } from '../api/types/auth.types';

/**
 * Cookie names for token storage
 *
 * IMPORTANT: Backend stores refreshToken in httpOnly cookie automatically.
 * We only need to store accessToken on Next.js side.
 */
export const TOKEN_COOKIES = {
  ACCESS_TOKEN: 'auth_access_token',
  USER_ID: 'auth_user_id',
} as const;

/**
 * Cookie configuration for Next.js managed cookies
 *
 * NOTE: Secure flag is disabled to support HTTP deployments.
 * Enable it when using HTTPS in production.
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Set to true when using HTTPS
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * Set authentication tokens in cookies
 *
 * NOTE: Backend already sets 'refreshToken' cookie with proper httpOnly settings.
 * We only store accessToken and userId for quick access.
 */
export async function setAuthCookies(authResponse: AuthenticationResponse): Promise<void> {
  const cookieStore = await cookies();

  // Parse expiration time from response
  const expiresAt = new Date(authResponse.expiresAt);

  // Store access token (will be sent in Authorization header)
  cookieStore.set(TOKEN_COOKIES.ACCESS_TOKEN, authResponse.accessToken, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  });

  // Store user ID for quick access (not sensitive)
  // Use same expiry as access token since we'll refresh both together
  cookieStore.set(TOKEN_COOKIES.USER_ID, authResponse.userId, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  });
}

/**
 * Get access token from cookies
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIES.ACCESS_TOKEN)?.value;
}

/**
 * Get refresh token from backend's httpOnly cookie
 *
 * NOTE: This reads the 'refreshToken' cookie set by the backend.
 * It's httpOnly so it's not accessible from client-side JavaScript.
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('refreshToken')?.value; // Backend cookie name
}

/**
 * Get user ID from cookies
 */
export async function getUserId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIES.USER_ID)?.value;
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return !!accessToken;
}

/**
 * Clear all authentication cookies (logout)
 *
 * NOTE: Backend's POST /api/auth/logout endpoint will clear the refreshToken cookie.
 * We only need to clear our Next.js managed cookies here.
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(TOKEN_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(TOKEN_COOKIES.USER_ID);
}

/**
 * Get all auth data from cookies
 */
export async function getAuthData(): Promise<{
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
}> {
  const [accessToken, refreshToken, userId] = await Promise.all([getAccessToken(), getRefreshToken(), getUserId()]);

  return { accessToken, refreshToken, userId };
}
