'use client';

import { PetCategoryWithAdsDto } from '@/lib/api/types/pet-ad.types';
import { mapAdToCardItem } from '@/lib/components/cards/item-card/ad-card.utils';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { useTranslations } from 'next-intl';
import { AdListingCarousel } from '../components';

export interface CategoryCarouselsSectionProps {
  categoriesWithAds: PetCategoryWithAdsDto[];
}

export const CategoryCarouselsSection = ({ categoriesWithAds }: CategoryCarouselsSectionProps) => {
  const { navigateWithTransition } = useViewTransition();
  const tDateTime = useTranslations('dateTime');

  // Filter out categories with no ads
  const categoriesWithContent = categoriesWithAds.filter((category) => category.petAds && category.petAds.length > 0);

  if (!categoriesWithContent || categoriesWithContent.length === 0) {
    return null;
  }

  const handleViewAll = (categoryId: number) => {
    navigateWithTransition(`/ads/s?category=${categoryId}`);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-12 lg:space-y-16">
          {categoriesWithContent.map((category) => (
            <AdListingCarousel
              key={category.id}
              title={category.title}
              items={category.petAds.map((ad) => mapAdToCardItem(ad, tDateTime))}
              onViewAll={() => handleViewAll(category.id)}
              backgroundColor={category.backgroundColor}
              svgIcon={category.svgIcon}
              iconColor={category.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarouselsSection;
