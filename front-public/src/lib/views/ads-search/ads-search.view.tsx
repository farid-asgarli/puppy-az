"use client";

import { useState, useEffect } from "react";
import { PetCategoryDetailedDto, CityDto, PetBreedDto } from "@/lib/api";
import { ActiveFiltersBar } from "./sections/active-filters-bar.section";
import { ResultsHeader } from "./sections/results-header.section";
import { ResultsGridSection } from "./sections/results-grid.section";
import { useFilterUrl } from "@/lib/filtering/use-filter-url";
import { RecentSearches } from "@/lib/components/recent-searches";
import { useRecentSearches } from "@/lib/hooks/use-recent-searches";
import { cn } from "@/lib/external/utils";
import {
  SlugRouteProvider,
  type SlugRouteInfo,
} from "@/lib/filtering/slug-route-context";

export interface AdsSearchViewProps {
  categories: PetCategoryDetailedDto[];
  cities: CityDto[];
  breeds?: PetBreedDto[] | null;
  /** Category ID when navigating via slug route (e.g., /az/itler) */
  initialCategory?: number;
  /** Category slug from URL path */
  initialCategorySlug?: string;
  /** Breed ID when navigating via slug route (e.g., /az/itler/labrador-retriever) */
  initialBreed?: number;
  /** Breed slug from URL path */
  initialBreedSlug?: string;
}

export const AdsSearchView = ({
  categories,
  cities,
  breeds = null,
  initialCategory,
  initialCategorySlug,
  initialBreed,
  initialBreedSlug,
}: AdsSearchViewProps) => {
  // Build slug route info if we have path-derived category
  const slugRouteInfo: SlugRouteInfo | null = (() => {
    if (!initialCategory || !initialCategorySlug) return null;

    const info: SlugRouteInfo = {
      categoryId: initialCategory,
      categorySlug: initialCategorySlug,
      categories,
    };

    if (initialBreed && initialBreedSlug) {
      info.breedId = initialBreed;
      info.breedSlug = initialBreedSlug;
    }

    return info;
  })();

  // Wrap content in SlugRouteProvider if on a slug route
  if (slugRouteInfo) {
    return (
      <SlugRouteProvider value={slugRouteInfo}>
        <AdsSearchViewInner
          categories={categories}
          cities={cities}
          breeds={breeds}
          initialCategory={initialCategory}
          initialBreed={initialBreed}
        />
      </SlugRouteProvider>
    );
  }

  return (
    <AdsSearchViewInner
      categories={categories}
      cities={cities}
      breeds={breeds}
    />
  );
};

const AdsSearchViewInner = ({
  categories,
  cities,
  breeds = null,
  initialCategory,
  initialBreed: _initialBreed,
}: Omit<AdsSearchViewProps, "initialCategorySlug" | "initialBreedSlug">) => {
  const { filters, hasFilters, hasAnyUrlParams } = useFilterUrl();
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

  // Recent searches hook
  const { recentSearches, addRecentSearch, clearAll, isLoaded } =
    useRecentSearches({ categories, breeds });

  // Get category title for header — use initialCategory or URL-based category
  const effectiveCategoryId = initialCategory ?? filters.category;
  const categoryTitle = effectiveCategoryId
    ? categories.find((c) => c.id === Number(effectiveCategoryId))?.title ||
      null
    : null;

  // Save search when filters are applied
  useEffect(() => {
    if (hasFilters) {
      addRecentSearch(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFilters, addRecentSearch]);

  const handleTotalCountChange = (count: number) => {
    setTotalCount(count);
    setIsLoadingResults(false);
  };

  // Show recent searches when loaded and has searches
  const showRecentSearches = isLoaded && recentSearches.length > 0;

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Results Header - Count + Sort */}
      <ResultsHeader
        totalCount={totalCount}
        isLoading={isLoadingResults}
        categoryTitle={categoryTitle}
      />

      {/* Active Filters Bar - Only shows when filters are active */}
      <ActiveFiltersBar
        categories={categories}
        cities={cities}
        breeds={breeds ?? undefined}
      />

      {/* Recent Searches - Full when no URL params, collapsed when sort/filters active */}
      {showRecentSearches && (
        <div
          className={cn(
            "max-w-7xl mx-auto px-4 sm:px-6",
            hasAnyUrlParams ? "py-3" : "py-6 sm:py-8",
          )}
        >
          <RecentSearches
            searches={recentSearches}
            onClearAll={clearAll}
            collapsed={hasAnyUrlParams}
          />
        </div>
      )}

      {/* Results Grid - Main content with infinite scroll */}
      <ResultsGridSection onTotalCountChange={handleTotalCountChange} />
    </div>
  );
};

export default AdsSearchView;
