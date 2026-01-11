'use client';

import { PetAdDetailsDto } from '@/lib/api/types/pet-ad.types';
import { IconEye, IconCalendar, IconClock, IconAlertCircle, IconCrown } from '@tabler/icons-react';
import { formatDate } from '@/lib/utils/date-utils';
import { useAuth } from '@/lib/hooks/use-auth';
import { InfoCard, SectionHeader } from '@/lib/components/views/common';
import { useTranslations } from 'next-intl';

export interface AdDetailsStatsSectionProps {
  adDetails: PetAdDetailsDto;
}

export function AdDetailsStatsSection({ adDetails }: AdDetailsStatsSectionProps) {
  const t = useTranslations('petAdDetails.stats');
  const tDate = useTranslations('dateTime');
  const { user } = useAuth();

  // Check if current user is the owner (for showing premium expiry)
  const isOwner = user?.id === adDetails.owner.id;

  // Build stats array

  console.log('adDetails', adDetails);

  const stats = [
    {
      icon: IconEye,
      label: t('viewCount'),
      value: adDetails.viewCount.toLocaleString(),
      color: 'text-info-600',
      bgColor: 'bg-info-100',
    },
    {
      icon: IconCalendar,
      label: t('publishedDate'),
      value: formatDate(adDetails.publishedAt, tDate),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    ...(adDetails.updatedAt
      ? [
          {
            icon: IconClock,
            label: t('updatedDate'),
            value: formatDate(adDetails.updatedAt, tDate),
            color: 'text-premium-600',
            bgColor: 'bg-premium-100',
          },
        ]
      : []),
    ...(adDetails.expiresAt
      ? [
          {
            icon: IconAlertCircle,
            label: t('expiresAt'),
            value: formatDate(adDetails.expiresAt, tDate),
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader title={t('title')} />

      <div className="space-y-3 sm:space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <InfoCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              variant="stat"
              color={{
                text: stat.color,
                bg: stat.bgColor,
              }}
            />
          ))}
        </div>

        {/* Premium Expiry (Owner Only) */}
        {isOwner && adDetails.isPremium && adDetails.premiumExpiresAt && (
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-premium-50 to-accent-50 border-2 border-premium-200">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-premium-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <IconCrown size={20} className="sm:w-[22px] sm:h-[22px] text-premium-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-semibold text-premium-900 mb-1">{t('premiumExpiry.title')}</div>
                <div className="text-sm sm:text-base text-premium-700">{formatDate(adDetails.premiumExpiresAt, tDate)}</div>
                <p className="text-xs sm:text-sm text-premium-600 mt-2">{t('premiumExpiry.ownerNote')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ad ID (for reference) */}
        <div className="p-3 sm:p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs sm:text-sm text-gray-600">{t('adNumber')}</span>
            <span className="text-xs sm:text-sm font-mono font-semibold text-gray-900">#{adDetails.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
