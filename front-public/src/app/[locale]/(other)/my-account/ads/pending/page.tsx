import { redirect } from 'next/navigation';

/**
 * Legacy route: Redirects to unified My Ads view with pending tab
 * Kept for backward compatibility
 */
export default function PendingAdsPage() {
  redirect('/my-account/ads?tab=pending');
}
