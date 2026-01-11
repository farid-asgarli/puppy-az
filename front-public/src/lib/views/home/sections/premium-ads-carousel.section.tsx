'use client';

import { IconCrown } from '@tabler/icons-react';
import { PetAdListItemDto } from '@/lib/api/types/pet-ad.types';
import { mapAdToCardItem } from '@/lib/components/cards/item-card/ad-card.utils';
import { AdListingCarousel } from '../components';
import { useTranslations } from 'next-intl';

export interface PremiumAdsCarouselSectionProps {
  premiumAds: PetAdListItemDto[];
}

export const PremiumAdsCarouselSection = ({ premiumAds }: PremiumAdsCarouselSectionProps) => {
  const t = useTranslations('home.premiumAds');
  const tDateTime = useTranslations('dateTime');

  if (!premiumAds || premiumAds.length === 0) {
    return null;
  }

  const mappedAds = premiumAds.map((ad) => mapAdToCardItem(ad, tDateTime));

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8 sm:space-y-10">
          {/* Section Header with Premium Badge */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-full">
              <IconCrown size={20} className="text-yellow-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-yellow-700">{t('badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('title')}</h2>
            <p className="text-base sm:text-lg text-gray-600">{t('subtitle')}</p>
          </div>

          {/* Carousel */}
          <AdListingCarousel title={t('carouselTitle')} items={mappedAds} showTitle={false} />
        </div>
      </div>
    </section>
  );
};

export default PremiumAdsCarouselSection;
