'use client';

import { PetAdDetailsDto } from '@/lib/api/types/pet-ad.types';
import { getAdTypes } from '@/lib/utils/mappers';
import { cn } from '@/lib/external/utils';
import { IconCrown } from '@tabler/icons-react';
import NarrowContainer from '@/lib/components/narrow-container';
import { ActionButtonGroup } from '@/lib/components/views/pet-ad-details/action-button-group';
import { Badge } from '@/lib/components/views/pet-ad-details/badge';
import { useTranslations } from 'next-intl';

export interface StickyHeaderSectionProps {
  adDetails: PetAdDetailsDto;
  isVisible: boolean;
  isHydrated: boolean;
  isInModal?: boolean;
}

export function StickyHeaderSection({ adDetails, isVisible, isHydrated, isInModal = false }: StickyHeaderSectionProps) {
  const t = useTranslations('common');
  const adTypes = getAdTypes(t);
  const adType = adTypes[adDetails.adType];

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white border-b-2 border-gray-200',
        'transition-transform duration-300 ease-in-out',
        'hidden md:block', // Hide on mobile (<768px)
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <NarrowContainer className="py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Left: Pet Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Primary Image Thumbnail */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              {adDetails.images.length > 0 ? (
                <img
                  src={adDetails.images.find((img) => img.isPrimary)?.url || adDetails.images[0].url}
                  alt={adDetails.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <IconCrown size={20} className="sm:w-6 sm:h-6" />
                </div>
              )}
            </div>

            {/* Title & Breed */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{adDetails.title}</h2>
                {adDetails.isPremium && (
                  <div className="flex-shrink-0">
                    <IconCrown size={16} className="sm:w-[18px] sm:h-[18px] text-premium-600" />
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{adDetails.breed.title}</p>
            </div>

            {/* Ad Type Badge */}
            <Badge
              variant="ad-type"
              icon={adType.icon}
              size="sm"
              color={{
                text: adType.color.text,
                bg: adType.color.bg,
              }}
              className="flex-shrink-0"
            >
              <span className="hidden lg:inline">{adType.title}</span>
            </Badge>

            {/* Price */}
            {adDetails.price && (
              <div className="flex-shrink-0 text-right">
                <div className="text-lg sm:text-xl font-semibold text-gray-900">{adDetails.price} ₼</div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <ActionButtonGroup
            adId={adDetails.id}
            adTitle={adDetails.title}
            adDescription={adDetails.description}
            variant="sticky"
            isInModal={isInModal}
            isHydrated={isHydrated}
            className="flex-shrink-0"
          />
        </div>
      </NarrowContainer>
    </div>
  );
}
