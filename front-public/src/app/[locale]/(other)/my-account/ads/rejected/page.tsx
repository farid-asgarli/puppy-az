import { redirect } from 'next/navigation';

/**
 * Legacy route: Redirects to unified My Ads view with rejected tab
 * Kept for backward compatibility
 */
export default function RejectedAdsPage() {
  redirect('/my-account/ads?tab=rejected');
}
