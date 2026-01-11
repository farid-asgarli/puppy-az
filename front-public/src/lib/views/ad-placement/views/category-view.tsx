'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PetCategoryDetailedDto } from '@/lib/api/types/pet-ad.types';
import { useAdPlacement } from '@/lib/contexts/ad-placement-context';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import { OptionCard } from '@/lib/components/views/ad-placement';
import { ViewFooter, ViewLayout } from '../components';

interface CategoryViewProps {
  categories: PetCategoryDetailedDto[];
}

/**
 * Category Selection View
 * Step 1b: Choose pet category
 */
export default function CategoryView({ categories }: CategoryViewProps) {
  const t = useTranslations('adPlacementDetails.categoryView');
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(formData.categoryId);

  const handleSelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    updateFormData({ categoryId });
  };

  const handleNext = () => {
    if (selectedCategoryId !== null) {
      navigateWithTransition('/ads/ad-placement/breed');
    }
  };

  const handleBack = () => {
    navigateWithTransition('/ads/ad-placement/ad-type');
  };

  const canProceed = selectedCategoryId !== null;

  return (
    <>
      <ViewLayout>
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="page-title">{t('heading')}</Heading>
            <Text variant="body-lg">{t('subheading')}</Text>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category) => (
              <OptionCard
                key={category.id}
                selected={selectedCategoryId === category.id}
                onClick={() => handleSelect(category.id)}
                icon={
                  <div
                    className={cn(
                      'w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center',
                      category.backgroundColor,
                      category.iconColor
                    )}
                    dangerouslySetInnerHTML={{ __html: category.svgIcon }}
                  />
                }
                title={category.title}
                description={category.subtitle}
                metadata={category.petAdsCount > 0 ? t('activeListings', { count: category.petAdsCount.toLocaleString() }) : undefined}
                size="md"
                layout="vertical"
              />
            ))}
          </div>
        </div>
      </ViewLayout>

      <ViewFooter onBack={handleBack} onNext={handleNext} canProceed={canProceed} />
    </>
  );
}
