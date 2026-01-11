'use client';
import { PetAdListItemDto } from '@/lib/api/types/pet-ad.types';
import { mapAdToCardItem } from '@/lib/components/cards/item-card/ad-card.utils';
import { useTranslations } from 'next-intl';
import AdCardCarousel from '@/lib/views/pet-ad-details/sections/ad-card-carousel';
import { getRecentlyViewedAdsAction } from '@/lib/auth/actions';
import { PetAdCardType } from '@/lib/types/ad-card';
import { useState, useEffect } from 'react';

const RECENTLY_VIEWED_LIMIT = 10;

export function AdDetailsRecentlyViewedAdsSection() {
  const t = useTranslations('adsSearch');
  const [recentlyViewedAds, setRecentlyViewedAds] = useState<PetAdCardType[]>([]);

  // Fetch recently viewed ads from backend
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
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
      }
    };

    fetchRecentlyViewed();
  }, [t]);
  if (!recentlyViewedAds || recentlyViewedAds.length === 0) return <></>;

  return (
    <section id="similar-ads">
      <div className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 rounded-xl bg-gray-50">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold font-heading text-gray-900 mb-2 sm:mb-3">{t('recentlyViewed.title')}</h2>
          <p className="text-base sm:text-lg text-gray-600">{t('recentlyViewed.description')}</p>
        </div>

        {/* Carousel - with View All card inside */}
        <AdCardCarousel items={recentlyViewedAds} />
      </div>
    </section>
  );
}
