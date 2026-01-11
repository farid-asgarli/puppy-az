import { redirect } from 'next/navigation';
import {
  getUserActiveAdsAction,
  getUserPendingAdsAction,
  getUserRejectedAdsAction,
  getAllUserAdsAction,
  getDashboardStatsAction,
} from '@/lib/auth/actions';
import { MyAdsView } from '@/lib/views/my-account/my-ads';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.myAds');
}

interface MyAdsPageProps {
  searchParams: Promise<{ page?: string; tab?: string }>;
}

export default async function MyAdsPage({ searchParams }: MyAdsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const tab = (params.tab as 'active' | 'pending' | 'rejected' | 'all') || 'active';
  const pageSize = 12;

  // Determine which action to use based on tab
  const getAdsFetchAction = () => {
    switch (tab) {
      case 'active':
        return getUserActiveAdsAction;
      case 'pending':
        return getUserPendingAdsAction;
      case 'rejected':
        return getUserRejectedAdsAction;
      case 'all':
        return getAllUserAdsAction;
      default:
        return getUserActiveAdsAction;
    }
  };

  // Fetch dashboard stats and ads for the selected tab server-side
  const [statsResult, adsResult] = await Promise.all([
    getDashboardStatsAction(),
    getAdsFetchAction()({
      pagination: {
        number: page,
        size: pageSize,
      },
    }),
  ]);

  // Redirect to login if not authenticated
  if (!statsResult.success || !adsResult.success) {
    redirect('/auth?redirect=/my-account/ads');
  }

  // Prepare stats for the view
  const stats = {
    totalAds: statsResult.data.totalAdCount,
    activeAds: statsResult.data.activeAdCount,
    pendingAds: statsResult.data.pendingAdCount,
    rejectedAds: statsResult.data.rejectedAdCount,
  };

  return <MyAdsView initialData={adsResult.data} initialStats={stats} initialPage={page} initialTab={tab} />;
}
