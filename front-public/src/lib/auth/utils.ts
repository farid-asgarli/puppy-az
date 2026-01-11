import { formatApiError, logApiError } from '../api/utils/error-handler';
import { getAccessToken } from './cookies';

/**
 * Result type for server actions
 */
export type ActionResult<T> = { success: true; data: T } | { success: false; error: string; details?: string[] };

/**
 * Centralized error handler for auth actions
 * Uses the new error handler utility for consistent error formatting
 */
export function handleActionError(error: unknown, defaultMessage?: string): { success: false; error: string; details?: string[] } {
  const formatted = formatApiError(error);

  // Log error for debugging (server-side only)
  if (typeof window === 'undefined') {
    logApiError(error, 'Server Action');
  }

  return {
    success: false,
    error: formatted.message || defaultMessage || 'Xəta baş verdi',
    details: formatted.details,
  };
}

/**
 * Wrapper for authenticated actions
 * Automatically handles token retrieval and validation
 *
 * Usage:
 * ```typescript
 * export async function someAction(data: SomeData) {
 *   return withAuth(async (token) => {
 *     const result = await someService.doSomething(data, token);
 *     return { success: true, data: result };
 *   });
 * }
 * ```
 */
export async function withAuth<T>(action: (token: string) => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    return await action(token);
  } catch (error) {
    return handleActionError(error, 'Operation failed');
  }
}

// JWT utilities have been moved to jwt-utils.ts to avoid mixing server and client code
// Re-export for backward compatibility
export { JwtUtils } from './jwt-utils';
