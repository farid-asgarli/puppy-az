import { redirect } from 'next/navigation';

/**
 * Root ad-placement page redirects to intro
 */
export default function AdPlacementPage() {
  redirect('/ads/ad-placement/intro');
}
