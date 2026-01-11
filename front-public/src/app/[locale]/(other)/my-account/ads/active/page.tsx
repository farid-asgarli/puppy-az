import { redirect } from 'next/navigation';

/**
 * Legacy route: Redirects to unified My Ads view with active tab
 * Kept for backward compatibility
 */
export default function ActiveAdsPage() {
  redirect('/my-account/ads?tab=active');
}
