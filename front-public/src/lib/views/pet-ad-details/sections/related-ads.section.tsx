'use client';
import { PetAdListItemDto } from '@/lib/api/types/pet-ad.types';
import { mapAdToCardItem } from '@/lib/components/cards/item-card/ad-card.utils';
import { useTranslations } from 'next-intl';
import { useFilterUrl } from '@/lib/filtering/use-filter-url';
import AdCardCarousel from '@/lib/views/pet-ad-details/sections/ad-card-carousel';

// ============================================================================
// MAIN SECTION COMPONENT
// ============================================================================

export interface AdDetailsSimilarAdsSectionProps {
  relatedAds: Array<PetAdListItemDto>;
  categoryId: number;
}

export function AdDetailsSimilarAdsSection({ relatedAds, categoryId }: AdDetailsSimilarAdsSectionProps) {
  const t = useTranslations('petAdDetails.relatedAds');
  const tDateTime = useTranslations('dateTime');
  const mappedItems = relatedAds.map((ad) => mapAdToCardItem(ad, tDateTime));

  const { updateFilter } = useFilterUrl();

  const handleViewAll = () => {
    console.log('View all similar ads');
    updateFilter('category', categoryId);
  };

  return (
    <section id="similar-ads">
      <div className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 rounded-xl bg-gray-50">
        {/* Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold font-heading text-gray-900 mb-2 sm:mb-3">{t('title')}</h2>
          <p className="text-base sm:text-lg text-gray-600">{t('description')}</p>
        </div>

        {/* Carousel - with View All card inside */}
        <AdCardCarousel items={mappedItems} onViewAll={handleViewAll} />
      </div>
    </section>
  );
}
