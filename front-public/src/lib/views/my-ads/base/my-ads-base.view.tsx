'use client';

import React, { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import type { MyAdListItemDto, PetAdListItemDto } from '@/lib/api/types/pet-ad.types';
import { MyAdCard, mapAdToMyAdCard } from '@/lib/components/cards/my-ad-card';
import { MyAdDetails } from '@/lib/components/drawers/my-ad-drawer';
import NarrowContainer from '@/lib/components/narrow-container';
import ConfirmationDialog from '@/lib/components/confirmation-dialog/confirmation-dialog.component';
import Button from '@/lib/primitives/button/button.component';
import TransitionLink from '@/lib/components/transition-link';
import { closeAdAction } from '@/lib/auth/actions';
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { usePaginatedData } from '@/lib/hooks/use-paginated-data';
import { EmptyState } from '@/lib/primitives/empty-state';
import { PaginatedResult, QuerySpecification } from '@/lib/api';
import { RejectionReasonCard } from '@/lib/components/views/my-ads';
import { useTranslations } from 'next-intl';
import { LoadMoreIndicator, SearchInput, InfoBanner, PageHeader, type InfoBannerProps } from '@/lib/components/views/common';

type InfoBannerConfig = Pick<InfoBannerProps, 'icon' | 'title' | 'description' | 'variant'>;

interface EmptyStateConfig {
  icon: React.ForwardRefExoticComponent<any>;
  title: string;
  description: string;
}

interface MyAdsBaseViewProps {
  initialData: PaginatedResult<PetAdListItemDto>;
  initialPage: number;
  pageTitle: string;
  pageSubtitle: string;
  loadMoreAction: (spec: QuerySpecification) => Promise<any>;
  infoBanner?: InfoBannerConfig;
  emptyState: EmptyStateConfig;
  showRejectionReason?: boolean;
  confirmDialog: {
    title: string;
    message: string;
    confirmText: string;
  };
}

export default function MyAdsBaseView({
  initialData,
  initialPage,
  pageTitle,
  pageSubtitle,
  loadMoreAction,
  infoBanner,
  emptyState,
  showRejectionReason = false,
  confirmDialog,
}: MyAdsBaseViewProps) {
  const t = useTranslations('myAds.common');
  const { navigateWithTransition } = useViewTransition();
  const [isClosing, setIsClosing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
  const [drawerAdId, setDrawerAdId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Paginated data with infinite scroll
  const {
    items: ads,
    hasMore,
    isLoading: isLoadingMore,
    loadMore,
    setItems: setAds,
  } = usePaginatedData({
    initialData,
    initialPage,
    pageSize: 12,
    fetchAction: loadMoreAction,
  });

  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
    threshold: 300,
  });

  const handleEdit = (id: number) => {
    navigateWithTransition(`/ads/ad-placement/edit/${id}`);
  };

  const handleCardClick = (id: number) => {
    setDrawerAdId(id);
    setDrawerOpen(true);
  };

  const handleCloseRequest = (id: number) => {
    setSelectedAdId(id);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirm = async () => {
    if (selectedAdId === null) return;

    setIsClosing(true);
    try {
      const result = await closeAdAction(selectedAdId);
      if (result.success) {
        setConfirmDialogOpen(false);
        // Remove the closed ad from the list
        setAds((prev) => prev.filter((ad) => ad.id !== selectedAdId));
      } else {
        alert(result.error || t('closeError'));
      }
    } catch (error) {
      console.error('Close ad error:', error);
      alert(t('generalError'));
    } finally {
      setIsClosing(false);
    }
  };

  const handleCloseCancel = () => {
    if (!isClosing) {
      setConfirmDialogOpen(false);
      setSelectedAdId(null);
    }
  };

  // Filter ads based on search query
  const filteredAds = React.useMemo(() => {
    if (!searchQuery.trim()) return ads;

    const query = searchQuery.toLowerCase();
    return ads.filter((ad) => {
      return ad.title.toLowerCase().includes(query) || ad.categoryTitle.toLowerCase().includes(query) || ad.cityName.toLowerCase().includes(query);
    });
  }, [ads, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        actions={
          <TransitionLink href="/ads/ad-placement">
            <Button variant="solid" size="md" leftSection={<IconPlus size={18} />} aria-label={t('newAdButton')}>
              {t('newAd')}
            </Button>
          </TransitionLink>
        }
        maxWidth="md"
      />

      {/* Main Content */}
      <NarrowContainer className="py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Info Banner (optional) */}
          {infoBanner && (
            <InfoBanner icon={infoBanner.icon} title={infoBanner.title} description={infoBanner.description} variant={infoBanner.variant} />
          )}

          {/* Filters & View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
            {/* Search */}
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={t('searchPlaceholder')} maxWidth="max-w-md" className="flex-1" />
          </div>

          {/* Empty State */}
          {initialData.totalCount === 0 && (
            <EmptyState
              icon={<emptyState.icon />}
              title={emptyState.title}
              description={emptyState.description}
              action={
                <TransitionLink href="/ads/ad-placement">
                  <Button variant="solid" leftSection={<IconPlus size={18} />}>
                    {t('newAdButton')}
                  </Button>
                </TransitionLink>
              }
            />
          )}

          {/* Ads Grid/List */}
          {ads.length > 0 && (
            <>
              {/* No search results */}
              {filteredAds.length === 0 && searchQuery.trim() && (
                <EmptyState
                  icon={<emptyState.icon />}
                  title={t('noSearchResults')}
                  description={t('noSearchResultsDescription')}
                  action={
                    <Button variant="secondary" onClick={() => setSearchQuery('')}>
                      {t('clearSearch')}
                    </Button>
                  }
                />
              )}

              {/* Ads Grid */}
              {filteredAds.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {filteredAds.map((ad) => (
                    <div key={ad.id} className="relative">
                      <MyAdCard {...mapAdToMyAdCard(ad as MyAdListItemDto)} onClick={handleCardClick} />

                      {/* Rejection Reason (only for rejected ads) */}
                      {showRejectionReason && ad.rejectionReason && <RejectionReasonCard reason={ad.rejectionReason} />}
                    </div>
                  ))}
                </div>
              )}

              {/* Infinite Scroll Trigger & Loading Indicator - Only show when not searching */}
              {!searchQuery.trim() && (
                <div ref={loadMoreRef}>
                  <LoadMoreIndicator
                    isLoading={isLoadingMore}
                    hasMore={hasMore}
                    loadedCount={ads.length}
                    loadingText={t('loading')}
                    completedText={t('allAdsLoaded')}
                  />
                </div>
              )}

              {/* Search results count */}
              {searchQuery.trim() && filteredAds.length > 0 && (
                <div className="text-center text-sm text-gray-600">{t('searchResultsCount', { count: filteredAds.length, total: ads.length })}</div>
              )}
            </>
          )}
        </div>
      </NarrowContainer>

      {/* Ad Details - Modal on Desktop, Drawer on Mobile */}
      <MyAdDetails adId={drawerAdId} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} onEdit={handleEdit} onCloseAd={handleCloseRequest} />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={handleCloseCancel}
        onConfirm={handleCloseConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={t('cancelButton')}
        variant="danger"
        isLoading={isClosing}
      />
    </div>
  );
}
