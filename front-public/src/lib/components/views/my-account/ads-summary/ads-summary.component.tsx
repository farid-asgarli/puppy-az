'use client';

import { useTranslations } from 'next-intl';
import { IconEye, IconClock, IconAlertCircle, IconLayoutGrid } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Text } from '@/lib/primitives/typography';

interface AdsSummaryStats {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  rejectedAds: number;
}

interface AdsSummaryProps {
  stats: AdsSummaryStats;
  loading?: boolean;
}

/**
 * AdsSummary - Dashboard stats card for My Ads management
 *
 * Features:
 * - Shows total ads, active, pending, rejected counts
 * - Responsive grid layout (2 cols mobile, 4 cols desktop)
 * - Color-coded stats with visual hierarchy
 * - Loading skeleton state
 * - Highlights pending/rejected when count > 0
 */
export function AdsSummary({ stats, loading = false }: AdsSummaryProps) {
  const t = useTranslations('myAccount.myAds.summary');

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl border-2 border-gray-200 bg-white">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      id: 'total',
      icon: IconLayoutGrid,
      value: stats.totalAds,
      label: t('totalAds'),
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      id: 'active',
      icon: IconEye,
      value: stats.activeAds,
      label: t('activeAds'),
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      id: 'pending',
      icon: IconClock,
      value: stats.pendingAds,
      label: t('pendingAds'),
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      highlight: stats.pendingAds > 0,
    },
    {
      id: 'rejected',
      icon: IconAlertCircle,
      value: stats.rejectedAds,
      label: t('rejectedAds'),
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      highlight: stats.rejectedAds > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const StatIcon = stat.icon;

        return (
          <div
            key={stat.id}
            className={cn(
              'p-5 sm:p-6 rounded-2xl border-2 bg-white transition-all duration-300',
              stat.highlight ? `${stat.borderColor.replace('200', '300')} shadow-lg shadow-${stat.color}-100 scale-[1.02]` : stat.borderColor
            )}
          >
            {/* Icon */}
            <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4', stat.bgColor)}>
              <StatIcon size={20} strokeWidth={2} className={stat.iconColor} />
            </div>

            {/* Value */}
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>

            {/* Label */}
            <Text variant="small" color="secondary" className="text-xs sm:text-sm">
              {stat.label}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
