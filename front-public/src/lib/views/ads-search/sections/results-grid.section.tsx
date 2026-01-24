'use client';

import { useState, useCallback } from 'react';
import { IconSearch, IconFilterOff } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { AdGrid } from '@/lib/components/views/ads';
import ResponsiveAdCard from '@/lib/components/cards/item-card/responsive-ad-card';
import { EmptyState } from '@/lib/primitives';
import { Spinner } from '@/lib/primitives';
import { usePaginatedAds } from '@/lib/hooks/use-paginated-ads';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import { useFilterUrl } from '@/lib/filtering/use-filter-url';
import { buildSearchFilter, buildSorting } from '@/lib/api/utils/search-filter-builder';
import { mapAdToCardItem } from '@/lib/components/cards/item-card/ad-card.utils';
import { PetAdCardType } from '@/lib/types/ad-card';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/lib/hooks/use-client-locale';

const PAGE_SIZE = 24;

interface ResultsGridSectionProps {
  onTotalCountChange?: (count: number) => void;
}

export const ResultsGridSection = ({ onTotalCountChange }: ResultsGridSectionProps) => {
  const t = useTranslations('adsSearch.resultsGrid');
  const tDateTime = useTranslations('dateTime');
  const locale = useLocale();
  const { filters } = useFilterUrl();
  const [hasClickedLoadMore, setHasClickedLoadMore] = useState(false);

  // Build search filter and sorting from URL params
  const searchFilter = buildSearchFilter(filters);
  const sorting = buildSorting(filters);

  // Fetch ads function with locale from URL
  const fetchAds = useCallback(
    async (page: number, pageSize: number) => {
      const response = await petAdService.searchPetAds(
        {
          filter: searchFilter,
          pagination: { number: page, size: pageSize },
          sorting: sorting,
        },
        locale
      );

      // Notify parent of total count
      if (onTotalCountChange) {
        onTotalCountChange(response.totalCount);
      }

      return {
        items: response.items,
        totalCount: response.totalCount,
        hasNextPage: response.hasNextPage,
      };
    },
    [searchFilter, sorting, onTotalCountChange, locale]
  );

  // Use paginated ads hook
  const { ads, isLoading, isLoadingMore, hasMore, loadMore, error } = usePaginatedAds<PetAdCardType>({
    fetchAds: async (page, pageSize) => {
      const result = await fetchAds(page, pageSize);
      return {
        ...result,
        items: result.items.map((ad) => mapAdToCardItem(ad, tDateTime)),
      };
    },
    pageSize: PAGE_SIZE,
    refetchKey: JSON.stringify(filters), // Refetch when filters change
    fetchOnMount: true,
  });

  const handleLoadMore = async () => {
    setHasClickedLoadMore(true);
    await loadMore();
  };

  // Loading state - initial load
  if (isLoading) {
    return (
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdGrid variant="standard">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full bg-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </AdGrid>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <EmptyState icon={<IconSearch size={48} />} iconColor="red" title={t('error')} description={error} spacing="lg" />
        </div>
      </section>
    );
  }

  // Empty state - no results
  if (ads.length === 0) {
    const hasActiveFilters = Object.keys(filters).some((key) => key !== 'page' && key !== 'sort');

    return (
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <EmptyState
            icon={<IconFilterOff size={48} />}
            iconColor="blue"
            title={t('noResults')}
            description={hasActiveFilters ? t('noResultsWithFilters') : t('noResultsNoFilters')}
            action={
              hasActiveFilters ? (
                <button
                  onClick={() => (window.location.href = '/ads/s')}
                  className={cn(
                    'px-6 py-3 rounded-lg',
                    'bg-gray-900 text-white font-semibold',
                    'hover:bg-gray-800',
                    'transition-colors duration-200'
                  )}
                >
                  {t('showAllAds')}
                </button>
              ) : undefined
            }
            spacing="lg"
          />
        </div>
      </section>
    );
  }

  // Results grid
  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          {/* Ad Grid */}
          <AdGrid variant="large">
            {ads.map((ad) => (
              <ResponsiveAdCard key={ad.id} {...ad} />
            ))}
          </AdGrid>

          {/* Load More / Loading Indicator */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              {!hasClickedLoadMore ? (
                // Show button first
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={cn(
                    'px-8 py-3 rounded-lg',
                    'border-2 border-gray-200',
                    'text-sm font-semibold text-gray-700',
                    'hover:border-gray-400 hover:bg-gray-50',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
                    isLoadingMore && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isLoadingMore ? t('loading') : t('loadMore')}
                </button>
              ) : isLoadingMore ? (
                // Show spinner when auto-loading
                <div className="flex items-center gap-2 text-gray-600">
                  <Spinner size="md" />
                  <span className="text-sm font-medium">{t('loading')}</span>
                </div>
              ) : null}
            </div>
          )}

          {/* No more results */}
          {!hasMore && ads.length > 0 && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">{t('allShown')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultsGridSection;
