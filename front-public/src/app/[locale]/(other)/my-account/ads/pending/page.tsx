import { redirect } from 'next/navigation';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

/**
 * Legacy route: Redirects to unified My Ads view with pending tab
 * Kept for backward compatibility
 */
export default function PendingAdsPage() {
  redirect('/my-account/ads?tab=pending');
}
