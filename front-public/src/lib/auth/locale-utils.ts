import { getLocale } from 'next-intl/server';

/**
 * Get current locale for Server Actions
 *
 * Uses next-intl's server-side locale detection to retrieve the current
 * locale from the request context. This should be called in Server Actions
 * before making API calls that need localization.
 *
 * @returns The current locale (e.g., 'az', 'en', 'ru')
 * @example
 * ```typescript
 * export async function getProfileAction(): Promise<ActionResult<UserProfileDto>> {
 *   const locale = await getCurrentLocale();
 *   return withAuth(async (token) => {
 *     const profile = await authService.getProfile(token, locale);
 *     return { success: true, data: profile };
 *   });
 * }
 * ```
 */
export async function getCurrentLocale(): Promise<string> {
  try {
    return await getLocale();
  } catch (error) {
    // Fallback to default locale if detection fails
    // This can happen in edge cases like middleware redirects or errors
    console.warn('Failed to detect locale, falling back to default:', error);
    return 'az';
  }
}
