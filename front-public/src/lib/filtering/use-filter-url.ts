import { usePathname } from '@/i18n/routing';
import { useCallback, useMemo, useRef } from 'react';
import { FilterValidator } from '@/lib/filtering/filter-validator';
import { FilterParams, FilterParamsPrimary, FilterParamsSecondary } from '@/lib/filtering/types';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { DEFAULT_FILTER_VALUES } from '@/lib/filtering/filter-default-values';
import { useSearchParams } from 'next/navigation';

/**
 * Parse search params into a plain object
 * Extracted to avoid creating new object on every render
 */
function parseSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * URL-first filter hook - reads directly from URL params, no external store
 * This eliminates sync issues and follows Next.js 16 best practices
 * Uses React 19.2 View Transitions for smooth filter updates
 */
export function useFilterUrl() {
  const { navigateWithTransition, replaceWithTransition } = useViewTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevFiltersRef = useRef<FilterParams>({});
  const prevParamsJsonRef = useRef<string>('');

  // Parse filters directly from URL params (synchronously, no store)
  // Optimized to avoid re-computation when params haven't actually changed
  const filters = useMemo<FilterParams>(() => {
    const params = parseSearchParams(searchParams);
    const paramsJson = JSON.stringify(params);

    // Skip validation if params haven't changed (optimization for navigation events)
    if (paramsJson === prevParamsJsonRef.current) {
      return prevFiltersRef.current;
    }

    prevParamsJsonRef.current = paramsJson;

    // Validate filters (type-based validation only)
    const newFilters = FilterValidator.validateFilters(params);

    // Only update ref if filters actually changed (deep comparison)
    const newFiltersJson = JSON.stringify(newFilters);
    const prevFiltersJson = JSON.stringify(prevFiltersRef.current);

    if (newFiltersJson === prevFiltersJson) {
      return prevFiltersRef.current;
    }

    prevFiltersRef.current = newFilters;
    return newFilters;
  }, [searchParams]);

  // Stable updateFilters - doesn't depend on filters value
  const updateFilters = useCallback(
    (newFilters: Partial<FilterParams>, replace = false) => {
      // Read current filters from searchParams to avoid dependency
      const currentParams = parseSearchParams(searchParams);
      const currentFilters = FilterValidator.validateFilters(currentParams);

      const mergedFilters = { ...currentFilters, ...newFilters };

      // Remove empty values AND default price values (to allow ads without prices)
      Object.keys(mergedFilters).forEach((key) => {
        const value = mergedFilters[key as keyof FilterParams];

        // Remove undefined/null/empty values
        if (value === undefined || value === null || value === '') {
          delete mergedFilters[key as keyof FilterParams];
          return;
        }

        // Remove price-min if it equals default (0)
        if (key === 'price-min' && value === DEFAULT_FILTER_VALUES.MIN_AD_PRICE) {
          delete mergedFilters[key as keyof FilterParams];
          return;
        }

        // Remove price-max if it equals default (50000)
        if (key === 'price-max' && value === DEFAULT_FILTER_VALUES.MAX_AD_PRICE) {
          delete mergedFilters[key as keyof FilterParams];
          return;
        }
      });

      const url = FilterValidator.buildFilterUrl(mergedFilters, '/ads/s');
      if (replace) {
        replaceWithTransition(url, { scroll: false });
      } else {
        navigateWithTransition(url, { scroll: false });
      }
    },
    [navigateWithTransition, replaceWithTransition, searchParams]
  );

  const updateFilter = useCallback(
    (key: keyof FilterParams, value: FilterParams[keyof FilterParams]) => {
      updateFilters({ [key]: value });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    navigateWithTransition(pathname, { scroll: false });
  }, [pathname, navigateWithTransition]);

  const clearFilter = useCallback(
    (key: keyof FilterParams) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      updateFilters(newFilters, true);
    },
    [filters, updateFilters]
  );

  const hasFilters = Object.keys(filters).length > 0;

  function getFilterUrl(filterOverrides: Partial<FilterParams>) {
    return FilterValidator.buildFilterUrl({ ...filters, ...filterOverrides }, pathname);
  }

  function isFilterActive(key: keyof FilterParams) {
    return filters[key] !== undefined;
  }

  function getFilterCount(predicate?: (key: keyof FilterParams, val: FilterParams[keyof FilterParams]) => boolean) {
    let entries = Object.entries(filters);

    if (predicate) {
      entries = entries.filter(([key, val]) => predicate(key as keyof FilterParams, val));
    }

    return entries.length;
  }

  const getPrimaryFilters = useCallback((): FilterParamsPrimary => {
    const { 'ad-type': adType, category, breed } = filters;
    return { 'ad-type': adType, category, breed };
  }, [filters]);

  const getSecondaryFilters = useCallback((): FilterParamsSecondary => {
    const { city, gender, size, 'price-min': priceMin, 'price-max': priceMax } = filters;
    return { city, gender, size, 'price-min': priceMin, 'price-max': priceMax };
  }, [filters]);

  return {
    filters,
    updateFilters,
    updateFilter,
    clearFilters,
    clearFilter,
    // Additional utilities
    hasFilters,
    getFilterUrl,
    isFilterActive,
    getFilterCount,
    getPrimaryFilters,
    getSecondaryFilters,
  };
}
