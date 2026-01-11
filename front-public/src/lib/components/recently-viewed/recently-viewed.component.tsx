'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AdListingCarousel } from '@/lib/views/home/components/ad-listing-carousel';
import { getRecentlyViewedAdsAction } from '@/lib/auth/actions';
import { PetAdCardType } from '@/lib/types/ad-card';
import { mapAdToCardItem } from '@/lib/components/cards/item-card/ad-card.utils';
import { PetAdListItemDto } from '@/lib/api';

const RECENTLY_VIEWED_LIMIT = 10;

interface RecentlyViewedProps {
  className?: string;
  showTitle?: boolean;
}

/**
 * Recently viewed ads component
 * Displays user's recently viewed pet ads using the AdListingCarousel
 * Fetches data from backend via server action
 */
export function RecentlyViewed({ className, showTitle = true }: RecentlyViewedProps) {
  const t = useTranslations('adsSearch');
  const [recentlyViewedAds, setRecentlyViewedAds] = useState<PetAdCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recently viewed ads from backend
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        setIsLoading(true);
        const result = await getRecentlyViewedAdsAction({
          pagination: {
            number: 1,
            size: RECENTLY_VIEWED_LIMIT,
          },
        });

        if (result.success && result.data) {
          const mappedAds = result.data.items.map((ad: PetAdListItemDto) => mapAdToCardItem(ad, (key: string) => t(key)));
          setRecentlyViewedAds(mappedAds);
        }
      } catch (error) {
        console.error('Failed to fetch recently viewed ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [t]);

  // Don't show anything while loading or if no ads
  if (isLoading || recentlyViewedAds.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <AdListingCarousel
        title={t('recentlyViewed.title')}
        items={recentlyViewedAds}
        showTitle={showTitle}
        svgIcon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`}
        iconColor="text-purple-700"
        backgroundColor="bg-purple-100"
      />
    </div>
  );
}

export default RecentlyViewed;
