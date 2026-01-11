'use client';

import { PetAdDetailsDto } from '@/lib/api/types/pet-ad.types';
import { IconMapPin, IconEye, IconClock, IconCrown } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date-utils';
import { ActionButtonGroup } from '@/lib/components/views/pet-ad-details/action-button-group';
import { Badge } from '@/lib/components/views/pet-ad-details/badge';
import { useTranslations } from 'next-intl';

export interface AdDetailsHeroSectionProps {
  adDetails: PetAdDetailsDto;
  isHydrated: boolean;
}

export function AdDetailsHeroSection({ adDetails, isHydrated }: AdDetailsHeroSectionProps) {
  const t = useTranslations('petAdDetails.hero');
  const tDate = useTranslations('dateTime');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button + Actions Row */}
      <ActionButtonGroup
        adId={adDetails.id}
        adType={adDetails.adType}
        adTitle={adDetails.title}
        adDescription={adDetails.description}
        variant="hero"
        isHydrated={isHydrated}
      />

      {/* Title and Premium Badge */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <h1 className="flex-1 text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900 leading-tight">{adDetails.title}</h1>
          {adDetails.isPremium && (
            <Badge variant="premium" icon={IconCrown} className="flex-shrink-0">
              {t('premium')}
            </Badge>
          )}
        </div>

        {/* Price */}
        <div>
          {adDetails.price !== null ? (
            <div className="text-3xl sm:text-4xl font-semibold text-gray-900">{adDetails.price.toLocaleString()} ₼</div>
          ) : (
            <div className="text-xl sm:text-2xl font-medium text-gray-600">{t('priceNotApplicable')}</div>
          )}
        </div>
      </div>

      {/* Ad Type Badge and Meta Info */}
      <div className="space-y-3 sm:space-y-4">
        {/* Meta Info Tags */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge variant="meta" icon={IconMapPin}>
            {adDetails.cityName}
          </Badge>
          <Badge variant="meta" icon={IconEye}>
            {t('views', { count: adDetails.viewCount.toLocaleString() })}
          </Badge>
          <Badge variant="meta" icon={IconClock}>
            {formatDate(adDetails.publishedAt, tDate)}
          </Badge>
        </div>
      </div>

      {/* Premium Banner (if premium) */}
      {adDetails.isPremium && (
        <div className="p-4 sm:p-6 bg-gradient-to-r from-premium-50 to-accent-50 border-2 border-premium-200 rounded-xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-premium-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <IconCrown size={20} className="sm:w-6 sm:h-6 text-premium-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-premium-900 mb-1">{t('premiumBanner.title')}</h3>
              <p className="text-xs sm:text-sm text-premium-700">{t('premiumBanner.description')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
