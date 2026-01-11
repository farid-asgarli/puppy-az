import { useCallback, useRef, useEffect } from 'react';
import { useFilterUrl } from './use-filter-url';
import { FilterParams } from './types';

/**
 * Debounced version of useFilterUrl for continuous value updates (sliders, range inputs)
 *
 * Use this hook for filters that update frequently (e.g., price range sliders)
 * to avoid excessive URL updates and API calls.
 *
 * @example
 * ```tsx
 * const { updateFilterDebounced } = useFilterUrlDebounced(300);
 *
 * // Slider onChange - will only update URL after 300ms of no changes
 * <input
 *   type="range"
 *   onChange={(e) => updateFilterDebounced('price-min', e.target.value)}
 * />
 * ```
 */
export function useFilterUrlDebounced(delay: number = 300) {
  const filterUrl = useFilterUrl();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdatesRef = useRef<Partial<FilterParams>>({});

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateFilterDebounced = useCallback(
    (key: keyof FilterParams, value: any) => {
      // Store pending update
      pendingUpdatesRef.current[key] = value;

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        // Apply all pending updates at once
        filterUrl.updateFilters(pendingUpdatesRef.current, true);
        pendingUpdatesRef.current = {};
      }, delay);
    },
    [filterUrl, delay]
  );

  const updateFiltersDebounced = useCallback(
    (newFilters: Partial<FilterParams>) => {
      // Merge with pending updates
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...newFilters };

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        filterUrl.updateFilters(pendingUpdatesRef.current, true);
        pendingUpdatesRef.current = {};
      }, delay);
    },
    [filterUrl, delay]
  );

  // Flush immediately (useful for form submit or blur events)
  const flushDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (Object.keys(pendingUpdatesRef.current).length > 0) {
      filterUrl.updateFilters(pendingUpdatesRef.current, true);
      pendingUpdatesRef.current = {};
    }
  }, [filterUrl]);

  return {
    ...filterUrl,
    updateFilterDebounced,
    updateFiltersDebounced,
    flushDebounce,
  };
}
