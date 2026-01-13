import { redirect } from 'next/navigation';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

/**
 * Legacy route: Redirects to unified My Ads view with rejected tab
 * Kept for backward compatibility
 */
export default function RejectedAdsPage() {
  redirect('/my-account/ads?tab=rejected');
}
