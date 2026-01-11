'use client';

import { useTranslations } from 'next-intl';
import { PetAdDetailsDto } from '@/lib/api/types/pet-ad.types';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import { getAdTypes } from '@/lib/utils/mappers';
import { IconEye, IconCalendar, IconAlertCircle, IconCircleCheck, IconClock } from '@tabler/icons-react';

interface AdOverviewSectionProps {
  ad: PetAdDetailsDto;
}

/**
 * Ad Overview Section
 * Displays read-only information about the ad: status, stats, ad type
 */
export const AdOverviewSection = ({ ad }: AdOverviewSectionProps) => {
  const t = useTranslations('adEdit.overview');
  const tCommon = useTranslations('common');

  const adTypeInfo = getAdTypes(tCommon)[ad.adType];

  // Determine ad status
  const getAdStatus = () => {
    if (ad.expiresAt && new Date(ad.expiresAt) < new Date()) {
      return { label: t('statusExpired'), icon: IconClock, color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
    if (ad.publishedAt) {
      return { label: t('statusActive'), icon: IconCircleCheck, color: 'bg-green-100 text-green-700 border-green-200' };
    }
    return { label: t('statusPending'), icon: IconClock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  };

  const status = getAdStatus();
  const StatusIcon = status.icon;

  // Format date consistently for SSR/CSR
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = t.raw('months') as string[];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <Heading variant="section" as="h2">
          {t('heading')}
        </Heading>
        <Text variant="body" color="secondary">
          {t('subheading')}
        </Text>
      </div>

      {/* Status & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ad Status */}
        <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', status.color)}>
              <StatusIcon size={20} />
            </div>
            <div>
              <Text variant="small" color="secondary" className="mb-0.5">
                {t('status')}
              </Text>
              <p className="font-semibold text-gray-900">{status.label}</p>
            </div>
          </div>
        </div>

        {/* View Count */}
        <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-info-100 flex items-center justify-center">
              <IconEye size={20} className="text-info-600" />
            </div>
            <div>
              <Text variant="small" color="secondary" className="mb-0.5">
                {t('viewCount')}
              </Text>
              <p className="font-semibold text-gray-900">{ad.viewCount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Published Date */}
        <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <IconCalendar size={20} className="text-primary-600" />
            </div>
            <div>
              <Text variant="small" color="secondary" className="mb-0.5">
                {t('publishedDate')}
              </Text>
              <p className="font-semibold text-gray-900 text-sm">{formatDate(ad.publishedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Type Badge */}
      <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50">
        <div className="flex items-start gap-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', adTypeInfo.color.bg)}>{adTypeInfo.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Heading variant="card" as="h3">
                {t('adType')}
              </Heading>
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold border-2',
                  adTypeInfo.color.bg,
                  adTypeInfo.color.text,
                  adTypeInfo.color.border
                )}
              >
                {adTypeInfo.title}
              </span>
            </div>
            <Text variant="small" color="secondary">
              {adTypeInfo.description}
            </Text>
          </div>
        </div>
      </div>

      {/* Info Banner - Can't change category/ad type */}
      <div className="p-4 rounded-xl bg-info-50 border-2 border-info-100">
        <div className="flex gap-3">
          <IconAlertCircle size={20} className="text-info-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-info-900 mb-1">{t('noteTitle')}</p>
            <p className="text-sm text-info-700">{t('noteDescription')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdOverviewSection;
