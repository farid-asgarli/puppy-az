import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JwtUtils } from './lib/auth/jwt-utils';
import { PROTECTED_ROUTES, AUTH_ROUTES, AUTH_REDIRECT_URL, LOGIN_REDIRECT_URL, TOKEN_EXPIRY_BUFFER_SECONDS } from './lib/auth/constants';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing);

/**
 * Proxy to handle authentication with token validation and i18n routing
 *
 * Security layers:
 * 1. Proxy: Validates token expiry (fast, client-side)
 * 2. Backend: Validates token signature on API calls (secure)
 * 3. Auto-refresh: Handles token expiration gracefully
 *
 * i18n:
 * - Handles locale detection and routing
 * - Supports az, en, ru languages
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname (e.g., /az/my-ads -> az)
  const pathnameWithoutLocale = pathname.replace(/^\/(az|en|ru)(\/|$)/, '/');

  // Get access token from cookie
  const accessToken = request.cookies.get('auth_access_token')?.value;

  // Check if route is protected (check pathname without locale)
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Check if route is auth page (check pathname without locale)
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Determine authentication status
  let isAuthenticated = false;

  if (accessToken) {
    // Token exists - validate it's not expired
    const expired = JwtUtils.isExpired(accessToken, TOKEN_EXPIRY_BUFFER_SECONDS);

    if (expired) {
      // Token expired - clear cookies and redirect if on protected route
      if (isProtectedRoute) {
        const url = new URL(pathname.match(/^\/(az|en|ru)/) ? pathname.match(/^\/(az|en|ru)/)![0] + '/auth' : '/auth', request.url);
        url.searchParams.set('redirect', pathname);
        url.searchParams.set('session_expired', 'true');
        const response = NextResponse.redirect(url);
        response.cookies.delete('auth_access_token');
        response.cookies.delete('auth_user_id');
        return response;
      } else {
        const response = intlMiddleware(request);
        response.cookies.delete('auth_access_token');
        response.cookies.delete('auth_user_id');
        return response;
      }
    }

    // Token exists and not expired
    isAuthenticated = true;
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const locale = pathname.match(/^\/(az|en|ru)/)?.[1] || 'az';
    const url = new URL(`/${locale}${LOGIN_REDIRECT_URL}`, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    const locale = pathname.match(/^\/(az|en|ru)/)?.[1] || 'az';
    return NextResponse.redirect(new URL(`/${locale}${AUTH_REDIRECT_URL}`, request.url));
  }

  // Handle i18n routing
  return intlMiddleware(request);
}

/**
 * Configure which routes proxy should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
