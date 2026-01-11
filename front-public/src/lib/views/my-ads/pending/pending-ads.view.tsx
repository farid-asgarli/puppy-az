'use client';

import { IconClock } from '@tabler/icons-react';
import type { PetAdListItemDto } from '@/lib/api/types/pet-ad.types';
import MyAdsBaseView from '@/lib/views/my-ads/base/my-ads-base.view';
import { getUserPendingAdsAction } from '@/lib/auth/actions';
import { PaginatedResult } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface PendingAdsViewProps {
  initialData: PaginatedResult<PetAdListItemDto>;
  initialPage: number;
}

export default function PendingAdsView({ initialData, initialPage }: PendingAdsViewProps) {
  const t = useTranslations('myAds.pending');

  const subtitle = initialData.totalCount > 0 ? t('subtitle.withCount', { count: initialData.totalCount }) : t('subtitle.empty');

  return (
    <MyAdsBaseView
      initialData={initialData}
      initialPage={initialPage}
      pageTitle={t('pageTitle')}
      pageSubtitle={subtitle}
      loadMoreAction={getUserPendingAdsAction}
      infoBanner={{
        icon: IconClock,
        title: t('infoBanner.title'),
        description: t('infoBanner.description'),
        variant: 'info',
      }}
      emptyState={{
        icon: IconClock,
        title: t('emptyState.title'),
        description: t('emptyState.description'),
      }}
      confirmDialog={{
        title: t('confirmDialog.title'),
        message: t('confirmDialog.message'),
        confirmText: t('confirmDialog.confirmButton'),
      }}
    />
  );
}
