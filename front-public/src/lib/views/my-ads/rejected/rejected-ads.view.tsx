'use client';

import { IconAlertCircle } from '@tabler/icons-react';
import type { PetAdListItemDto } from '@/lib/api/types/pet-ad.types';
import MyAdsBaseView from '@/lib/views/my-ads/base/my-ads-base.view';
import { getUserRejectedAdsAction } from '@/lib/auth/actions';
import { PaginatedResult } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface RejectedAdsViewProps {
  initialData: PaginatedResult<PetAdListItemDto>;
  initialPage: number;
}

export default function RejectedAdsView({ initialData, initialPage }: RejectedAdsViewProps) {
  const t = useTranslations('myAds.rejected');

  const subtitle = initialData.totalCount > 0 ? t('subtitle.withCount', { count: initialData.totalCount }) : t('subtitle.empty');

  return (
    <MyAdsBaseView
      initialData={initialData}
      initialPage={initialPage}
      pageTitle={t('pageTitle')}
      pageSubtitle={subtitle}
      loadMoreAction={getUserRejectedAdsAction}
      infoBanner={{
        icon: IconAlertCircle,
        title: t('infoBanner.title'),
        description: t('infoBanner.description'),
        variant: 'error',
      }}
      emptyState={{
        icon: IconAlertCircle,
        title: t('emptyState.title'),
        description: t('emptyState.description'),
      }}
      confirmDialog={{
        title: t('confirmDialog.title'),
        message: t('confirmDialog.message'),
        confirmText: t('confirmDialog.confirmButton'),
      }}
      showRejectionReason={true}
    />
  );
}
