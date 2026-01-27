import { redirect } from '@/i18n';
import { getLocale } from 'next-intl/server';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

/**
 * Legacy route: Redirects to unified My Ads view with active tab
 * Kept for backward compatibility
 */
export default async function ActiveAdsPage() {
  const locale = await getLocale();
  redirect({ href: '/my-account/ads?tab=active', locale });
}
