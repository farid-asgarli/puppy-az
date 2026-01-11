'use client';

import { useState, useCallback } from 'react';
import { PaginatedResult, QuerySpecification } from '@/lib/api/types/common.types';
import { ActionResult } from '@/lib/auth/utils';

interface UsePaginatedDataOptions<T> {
  initialData: PaginatedResult<T>;
  initialPage: number;
  pageSize?: number;
  fetchAction: (spec: QuerySpecification) => Promise<ActionResult<PaginatedResult<T>>>;
}

interface UsePaginatedDataReturn<T> {
  items: T[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => Promise<void>;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

/**
 * Hook for managing paginated data with infinite scroll
 *
 * @example
 * const { items, hasMore, isLoading, loadMore } = usePaginatedData({
 *   initialData,
 *   initialPage: 1,
 *   pageSize: 12,
 *   fetchAction: getUserActiveAdsAction,
 * });
 */
export function usePaginatedData<T>({ initialData, initialPage, pageSize = 12, fetchAction }: UsePaginatedDataOptions<T>): UsePaginatedDataReturn<T> {
  const [items, setItems] = useState<T[]>(initialData.items);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialData.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const result = await fetchAction({
        pagination: { number: nextPage, size: pageSize },
      });

      if (result.success) {
        setItems((prev) => [...prev, ...result.data.items]);
        setCurrentPage(nextPage);
        setHasMore(result.data.hasNextPage);
      }
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, currentPage, pageSize, fetchAction]);

  return {
    items,
    currentPage,
    hasMore,
    isLoading,
    loadMore,
    setItems,
  };
}
