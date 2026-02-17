"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { PetCategoryDto } from "@/lib/api";

/**
 * SlugRouteContext - Provides slug route information to the filtering system
 *
 * When the user navigates to a slug-based URL like /az/itler/labrador-retriever,
 * the category and breed are encoded in the URL path (not search params).
 * This context tells useFilterUrl about the path-derived category/breed so:
 *
 * 1. filters.category and filters.breed include these values
 * 2. URL building uses slug paths instead of ?category=X&breed=Y
 * 3. Navigation uses /{categorySlug}/{breedSlug}?other-filters format
 *
 * When NOT on a slug route (e.g., /ads/s?category=1), this context is not provided
 * and the system falls back to query-param-only behavior.
 */

export interface SlugRouteInfo {
  /** Category ID resolved from the slug in the URL path */
  categoryId: number;
  /** Category slug from the URL path */
  categorySlug: string;
  /** Breed ID resolved from the slug in the URL path (if on breed page) */
  breedId?: number;
  /** Breed slug from the URL path (if on breed page) */
  breedSlug?: string;
  /** All categories (needed for slug lookup when changing category) */
  categories: PetCategoryDto[];
}

const SlugRouteContext = createContext<SlugRouteInfo | null>(null);

export function SlugRouteProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: SlugRouteInfo;
}) {
  const memoizedValue = useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value.categoryId, value.categorySlug, value.breedId, value.breedSlug],
  );

  return (
    <SlugRouteContext.Provider value={memoizedValue}>
      {children}
    </SlugRouteContext.Provider>
  );
}

/**
 * Returns slug route info if on a slug-based route, null otherwise.
 * Used by useFilterUrl to merge path-based category/breed with URL params.
 */
export function useSlugRoute(): SlugRouteInfo | null {
  return useContext(SlugRouteContext);
}
