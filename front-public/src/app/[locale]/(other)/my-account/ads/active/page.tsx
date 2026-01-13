import { redirect } from 'next/navigation';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

/**
 * Legacy route: Redirects to unified My Ads view with active tab
 * Kept for backward compatibility
 */
export default function ActiveAdsPage() {
  redirect('/my-account/ads?tab=active');
}
