'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export interface PaginatedAdsResult<T = any> {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface UsePaginatedAdsOptions<T = any> {
  /**
   * Function to fetch ads for a given page
   * Should return items, totalCount, and hasNextPage
   */
  fetchAds: (page: number, pageSize: number) => Promise<PaginatedAdsResult<T>>;

  /**
   * Number of ads per page
   */
  pageSize?: number;

  /**
   * Key to trigger refetch (e.g., stringified filters)
   */
  refetchKey?: string;

  /**
   * Whether to fetch on mount
   */
  fetchOnMount?: boolean;
}

export interface UsePaginatedAdsReturn<T = any> {
  /**
   * Current list of ads
   */
  ads: T[];

  /**
   * Whether initial load or filter change is loading
   */
  isLoading: boolean;

  /**
   * Whether loading more pages (infinite scroll)
   */
  isLoadingMore: boolean;

  /**
   * Current page number
   */
  currentPage: number;

  /**
   * Total count of ads matching criteria
   */
  totalCount: number;

  /**
   * Whether there are more pages to load
   */
  hasMore: boolean;

  /**
   * Error message if fetch failed
   */
  error: string | null;

  /**
   * Load the next page (for infinite scroll)
   */
  loadMore: () => Promise<void>;

  /**
   * Manually trigger a refetch
   */
  refetch: () => Promise<void>;

  /**
   * Manually set ads (for optimistic updates)
   */
  setAds: React.Dispatch<React.SetStateAction<T[]>>;
}
/**
 * Reusable hook for managing paginated ad lists with infinite scroll
 *
 * Handles:
 * - Initial data fetching
 * - Pagination state management
 * - Loading states (initial + load more)
 * - Automatic refetch when key changes
 * - Error handling
 *
 * @example
 * ```tsx
 * const { ads, isLoading, hasMore, loadMore } = usePaginatedAds({
 *   fetchAds: async (page, pageSize) => {
 *     const result = await searchPetAds({
 *       filter: buildSearchFilter(filters),
 *       pagination: { number: page, size: pageSize }
 *     });
 *     return {
 *       items: result.items,
 *       totalCount: result.totalCount,
 *       hasNextPage: result.items.length === pageSize
 *     };
 *   },
 *   pageSize: 24,
 *   refetchKey: JSON.stringify(filters)
 * });
 * ```
 */
export function usePaginatedAds<T = any>({
  fetchAds,
  pageSize = 24,
  refetchKey,
  fetchOnMount = true,
}: UsePaginatedAdsOptions<T>): UsePaginatedAdsReturn<T> {
  const [ads, setAds] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(fetchOnMount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('errors');

  // Fetch function that can be called for initial load or refetch
  const fetch = useCallback(
    async (page: number, append: boolean = false) => {
      const isInitialLoad = page === 1 && !append;

      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setError(null);

      try {
        const result = await fetchAds(page, pageSize);

        if (append) {
          setAds((prev) => [...prev, ...result.items]);
        } else {
          setAds(result.items);
        }

        setTotalCount(result.totalCount);
        setHasMore(result.hasNextPage);
        setCurrentPage(page);
      } catch (err) {
        console.error('Failed to fetch ads:', err);
        setError(err instanceof Error ? err.message : t('fetchAdsFailed'));

        if (!append) {
          setAds([]);
          setTotalCount(0);
          setHasMore(false);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchAds, pageSize, t]
  );

  // Load more for infinite scroll
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    await fetch(currentPage + 1, true);
  }, [isLoadingMore, hasMore, currentPage, fetch]);

  // Refetch from page 1
  const refetch = useCallback(async () => {
    setCurrentPage(1);
    await fetch(1, false);
  }, [fetch]);

  // Initial fetch and refetch when key changes
  useEffect(() => {
    if (!fetchOnMount) return;

    setCurrentPage(1);
    setAds([]);
    fetch(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey, fetchOnMount]);

  return {
    ads,
    isLoading,
    isLoadingMore,
    currentPage,
    totalCount,
    hasMore,
    error,
    loadMore,
    refetch,
    setAds,
  };
}
