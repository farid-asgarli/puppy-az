'use client';

import { IconPlus } from '@tabler/icons-react';
import type { PetAdListItemDto } from '@/lib/api/types/pet-ad.types';
import MyAdsBaseView from '@/lib/views/my-ads/base/my-ads-base.view';
import { getUserActiveAdsAction } from '@/lib/auth/actions';
import { PaginatedResult } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface ActiveAdsViewProps {
  initialData: PaginatedResult<PetAdListItemDto>;
  initialPage: number;
}

export default function ActiveAdsView({ initialData, initialPage }: ActiveAdsViewProps) {
  const t = useTranslations('myAds.active');

  const subtitle = initialData.totalCount > 0 ? t('subtitle.withCount', { count: initialData.totalCount }) : t('subtitle.empty');

  return (
    <MyAdsBaseView
      initialData={initialData}
      initialPage={initialPage}
      pageTitle={t('pageTitle')}
      pageSubtitle={subtitle}
      loadMoreAction={getUserActiveAdsAction}
      emptyState={{
        icon: IconPlus,
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
