/**
 * Utilities for handling authentication redirects safely
 */

/**
 * Validates a redirect URL to prevent open redirect attacks
 *
 * Security rules:
 * - Must be a relative path (starts with /)
 * - Must not start with // (protocol-relative URL)
 * - Must not contain backslashes
 * - Must not contain control characters
 *
 * @param redirectUrl - The URL to validate
 * @returns True if the URL is safe to redirect to
 */
export function isValidRedirectUrl(redirectUrl: string | null | undefined): boolean {
  if (!redirectUrl) {
    return false;
  }

  // Must start with / but not //
  if (!redirectUrl.startsWith('/') || redirectUrl.startsWith('//')) {
    return false;
  }

  // Must not contain backslashes (Windows path traversal)
  if (redirectUrl.includes('\\')) {
    return false;
  }

  // Must not contain control characters or encoded newlines
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f\x7f]|%0[ad]/i.test(redirectUrl)) {
    return false;
  }

  return true;
}

/**
 * Gets a safe redirect URL from a query parameter
 *
 * @param redirectParam - The redirect parameter from the URL query
 * @param defaultUrl - The default URL to use if redirect is invalid (default: '/')
 * @returns A safe redirect URL
 */
export function getSafeRedirectUrl(redirectParam: string | null | undefined, defaultUrl: string = '/'): string {
  if (isValidRedirectUrl(redirectParam)) {
    return redirectParam!;
  }
  return defaultUrl;
}
