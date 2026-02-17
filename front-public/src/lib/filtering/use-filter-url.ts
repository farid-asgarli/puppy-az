import { usePathname, useSearchParams } from "@/i18n";
import { useCallback, useMemo, useRef } from "react";
import { FilterValidator } from "@/lib/filtering/filter-validator";
import {
  FilterParams,
  FilterParamsPrimary,
  FilterParamsSecondary,
} from "@/lib/filtering/types";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { DEFAULT_FILTER_VALUES } from "@/lib/filtering/filter-default-values";
import { useSlugRoute } from "@/lib/filtering/slug-route-context";

/**
 * Parse search params into a plain object
 * Extracted to avoid creating new object on every render
 */
function parseSearchParams(
  searchParams: URLSearchParams,
): Record<string, string> {
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
 *
 * When on a slug route (e.g., /az/itler/labrador-retriever), the category and breed
 * are derived from the URL path via SlugRouteContext, not search params.
 * Navigation builds slug-based URLs instead of /ads/s?category=X.
 */
export function useFilterUrl() {
  const { navigateWithTransition, replaceWithTransition } = useViewTransition();
  const _pathname = usePathname();
  const searchParams = useSearchParams();
  const slugRoute = useSlugRoute();
  const prevFiltersRef = useRef<FilterParams>({});
  const prevParamsJsonRef = useRef<string>("");

  // Parse filters directly from URL params + slug route context
  // Optimized to avoid re-computation when params haven't actually changed
  const filters = useMemo<FilterParams>(() => {
    const params = parseSearchParams(searchParams);
    // Include slug route info in cache key for proper memoization
    const slugKey = slugRoute
      ? `|slug:${slugRoute.categoryId}:${slugRoute.breedId ?? ""}`
      : "";
    const paramsJson = JSON.stringify(params) + slugKey;

    // Skip validation if params haven't changed (optimization for navigation events)
    if (paramsJson === prevParamsJsonRef.current) {
      return prevFiltersRef.current;
    }

    prevParamsJsonRef.current = paramsJson;

    // Validate filters (type-based validation only)
    const newFilters = FilterValidator.validateFilters(params);

    // Merge slug-route-derived category/breed (path takes precedence over query params)
    if (slugRoute) {
      newFilters.category = slugRoute.categoryId;
      if (slugRoute.breedId) {
        newFilters.breed = slugRoute.breedId;
      }
    }

    // Only update ref if filters actually changed (deep comparison)
    const newFiltersJson = JSON.stringify(newFilters);
    const prevFiltersJson = JSON.stringify(prevFiltersRef.current);

    if (newFiltersJson === prevFiltersJson) {
      return prevFiltersRef.current;
    }

    prevFiltersRef.current = newFilters;
    return newFilters;
  }, [searchParams, slugRoute]);

  // Stable updateFilters - doesn't depend on filters value
  const updateFilters = useCallback(
    (newFilters: Partial<FilterParams>, replace = false) => {
      // Read current filters from searchParams to avoid dependency
      const currentParams = parseSearchParams(searchParams);
      const currentFilters = FilterValidator.validateFilters(currentParams);

      // Merge slug route category/breed into current filters
      if (slugRoute) {
        currentFilters.category = slugRoute.categoryId;
        if (slugRoute.breedId) {
          currentFilters.breed = slugRoute.breedId;
        }
      }

      const mergedFilters = { ...currentFilters, ...newFilters };

      // Remove empty values AND default price values (to allow ads without prices)
      Object.keys(mergedFilters).forEach((key) => {
        const value = mergedFilters[key as keyof FilterParams];

        // Remove undefined/null/empty values
        if (value === undefined || value === null || value === "") {
          delete mergedFilters[key as keyof FilterParams];
          return;
        }

        // Remove price-min if it equals default (0)
        if (
          key === "price-min" &&
          value === DEFAULT_FILTER_VALUES.MIN_AD_PRICE
        ) {
          delete mergedFilters[key as keyof FilterParams];
          return;
        }

        // Remove price-max if it equals default (50000)
        if (
          key === "price-max" &&
          value === DEFAULT_FILTER_VALUES.MAX_AD_PRICE
        ) {
          delete mergedFilters[key as keyof FilterParams];
          return;
        }
      });

      // Build URL - use slug-based path if we have category slug info
      const categories = slugRoute?.categories;
      const url = FilterValidator.buildSlugFilterUrl(mergedFilters, categories);

      if (replace) {
        replaceWithTransition(url, { scroll: false });
      } else {
        navigateWithTransition(url, { scroll: false });
      }
    },
    [navigateWithTransition, replaceWithTransition, searchParams, slugRoute],
  );

  const updateFilter = useCallback(
    (key: keyof FilterParams, value: FilterParams[keyof FilterParams]) => {
      updateFilters({ [key]: value });
    },
    [updateFilters],
  );

  const clearFilters = useCallback(() => {
    // On slug routes, clearing filters should go to /ads/s (no category/breed)
    // On /ads/s, just strip query params
    navigateWithTransition("/ads/s", { scroll: false });
  }, [navigateWithTransition]);

  const clearFilter = useCallback(
    (key: keyof FilterParams) => {
      const newFilters = { ...filters };
      delete newFilters[key];

      // If clearing category, also clear breed and navigate to /ads/s
      if (key === "category") {
        delete newFilters.breed;
      }
      // If clearing breed on a slug route, navigate to category-only slug
      // (handled by buildSlugFilterUrl)

      const categories = slugRoute?.categories;
      const url = FilterValidator.buildSlugFilterUrl(newFilters, categories);
      replaceWithTransition(url, { scroll: false });
    },
    [filters, slugRoute, replaceWithTransition],
  );

  // hasFilters excludes 'sort' since it's not a search filter, just ordering
  // On slug routes, category and breed are path-derived, not "active filters"
  const hasFilters = useMemo(() => {
    const filterKeys = Object.keys(filters).filter((key) => {
      if (key === "sort") return false;
      // On slug routes, category/breed are implicit in the path
      if (slugRoute) {
        if (key === "category" && filters.category === slugRoute.categoryId)
          return false;
        if (key === "breed" && filters.breed === slugRoute.breedId)
          return false;
      }
      return true;
    });
    return filterKeys.length > 0;
  }, [filters, slugRoute]);

  // hasAnyUrlParams includes sort - useful for UI collapse states
  const hasAnyUrlParams = Object.keys(filters).length > 0;

  function getFilterUrl(filterOverrides: Partial<FilterParams>) {
    const categories = slugRoute?.categories;
    return FilterValidator.buildSlugFilterUrl(
      { ...filters, ...filterOverrides },
      categories,
    );
  }

  function isFilterActive(key: keyof FilterParams) {
    return filters[key] !== undefined;
  }

  function getFilterCount(
    predicate?: (
      key: keyof FilterParams,
      val: FilterParams[keyof FilterParams],
    ) => boolean,
  ) {
    let entries = Object.entries(filters);

    if (predicate) {
      entries = entries.filter(([key, val]) =>
        predicate(key as keyof FilterParams, val),
      );
    }

    return entries.length;
  }

  const getPrimaryFilters = useCallback((): FilterParamsPrimary => {
    const { "ad-type": adType, category, breed } = filters;
    return { "ad-type": adType, category, breed };
  }, [filters]);

  const getSecondaryFilters = useCallback((): FilterParamsSecondary => {
    const {
      city,
      district,
      gender,
      size,
      "price-min": priceMin,
      "price-max": priceMax,
    } = filters;
    return {
      city,
      district,
      gender,
      size,
      "price-min": priceMin,
      "price-max": priceMax,
    };
  }, [filters]);

  return {
    filters,
    updateFilters,
    updateFilter,
    clearFilters,
    clearFilter,
    // Additional utilities
    hasFilters,
    hasAnyUrlParams,
    getFilterUrl,
    isFilterActive,
    getFilterCount,
    getPrimaryFilters,
    getSecondaryFilters,
  };
}
