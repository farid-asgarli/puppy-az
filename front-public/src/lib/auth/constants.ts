/**
 * Authentication route patterns and configuration
 */

/**
 * Protected routes that require authentication
 * Note: /ads/favorites is intentionally not protected - it works for both auth and non-auth users
 */
export const PROTECTED_ROUTES = ['/my-account', '/ads/ad-placement'] as const;

/**
 * Public routes that should redirect to home if authenticated
 */
export const AUTH_ROUTES = ['/auth', '/register'] as const;

/**
 * Redirect URL for authenticated users trying to access auth pages
 */
export const AUTH_REDIRECT_URL = '/my-account';

/**
 * Redirect URL for unauthenticated users trying to access protected pages
 */
export const LOGIN_REDIRECT_URL = '/auth';

/**
 * Session expiry buffer in seconds
 * Tokens expiring within this timeframe are considered expired
 * to prevent edge cases during requests
 */
export const TOKEN_EXPIRY_BUFFER_SECONDS = 30;
