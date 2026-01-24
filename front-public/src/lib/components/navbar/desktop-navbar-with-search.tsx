"use client";

import { PetBreedDto, PetCategoryDetailedDto } from "@/lib/api";
import { petAdService } from "@/lib/api/services/pet-ad.service";
import { useState, useCallback } from "react";
import { SearchBarDesktopAnimated } from "../searchbar";
import { useFilterUrl } from "@/lib/filtering/use-filter-url";
import { DisplayCache } from "@/lib/caching/display-cache";
import { SearchBarSyncProvider } from "../searchbar/searchbar-sync-context";
import { useMemo, useEffect } from "react";
import { usePathname } from "@/i18n/routing";
import { NavbarConstants } from "@/lib/components/navbar/constants";
import DesktopNavbar from "@/lib/components/navbar/desktop-navbar";
import { useLocale } from "@/lib/hooks/use-client-locale";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/external/utils";

interface DesktopNavbarProps {
  categories: PetCategoryDetailedDto[];
  initialBreeds: PetBreedDto[] | null;
  isSticky?: boolean;
}

export function DesktopNavbarWithSearchbar({
  categories,
  initialBreeds,
  isSticky = true,
}: DesktopNavbarProps) {
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);
  const locale = useLocale();
  const { filters, updateFilters } = useFilterUrl();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations("search");

  // Check if we're on the search route where filtering happens
  const isSearchRoute = pathname === "/ads/s";

  const handleSearchBarExpandedChange = useCallback((expanded: boolean) => {
    setIsSearchBarExpanded(expanded);
  }, []);

  // Set mounted flag after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine navbar state:
  // - Manual expansion only (no auto-expand based on scroll)
  // - Before mount: start collapsed to match expected behavior
  const shouldShowExpanded = !isMounted ? false : isSearchBarExpanded;

  // Prefetch breeds for current category if not in cache (with locale from URL)
  useEffect(() => {
    const categoryId = filters.category ? Number(filters.category) : null;
    if (categoryId && !DisplayCache.getBreeds(categoryId)) {
      petAdService
        .getPetBreeds(categoryId, locale)
        .then((breeds) => DisplayCache.setBreeds(categoryId, breeds))
        .catch(console.error);
    }
  }, [filters.category, locale]);

  // Build initial values from URL filters
  const initialValues = useMemo(() => {
    // Find category from filters.category (ID)
    const category = filters.category
      ? (categories.find((c) => c.id === Number(filters.category)) ?? null)
      : null;

    // Find breed from initial breeds or cache
    let breed = null;
    if (category && filters.breed) {
      const breedId = Number(filters.breed);

      // Try from server-provided breeds first
      if (initialBreeds) {
        breed = initialBreeds.find((b) => b.id === breedId) ?? null;
      }

      // Fallback to cache
      if (!breed) {
        const cachedBreeds = DisplayCache.getBreeds(category.id);
        breed = cachedBreeds?.find((b) => b.id === breedId) ?? null;
      }
    }

    return {
      adType: filters["ad-type"] ?? null,
      category,
      breed,
    };
  }, [filters, categories, initialBreeds]);

  return (
    <>
      {/* Backdrop overlay - shown when searchbar is expanded and not at top */}
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300"
        style={{
          zIndex: 40, // Below navbar (z-50) but above page content
          opacity: shouldShowExpanded ? 0.4 : 0,
          pointerEvents: shouldShowExpanded ? "auto" : "none",
        }}
        onClick={() => {
          // Clicking overlay collapses searchbar
          if (shouldShowExpanded) {
            setIsSearchBarExpanded(false);
          }
        }}
      />

      <DesktopNavbar isSticky={isSticky} shouldExpand={shouldShowExpanded}>
        {/* Helper Text - Shows above searchbar when expanded */}
        <div
          className={cn(
            "absolute top-10 left-1/2 -translate-x-1/2 text-center text-sm text-gray-500 mb-3 transition-all duration-300",
            shouldShowExpanded
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none",
          )}
          style={{
            transitionDelay: shouldShowExpanded ? "150ms" : "0ms",
          }}
        >
          {t("helperText.default")}
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-full"
          style={{
            top: "50%",
            transform: shouldShowExpanded
              ? "translateX(0%) translateY(0px)"
              : "translateX(0%) translateY(-50%)",
            transition: `transform ${NavbarConstants.TRANSITION_DURATION}ms ${NavbarConstants.TRANSITION_TIMING}`,
          }}
        >
          <SearchBarSyncProvider
            initialValues={initialValues}
            updateUrlFilters={updateFilters}
            currentUrlFilters={filters}
            isSearchRoute={isSearchRoute}
          >
            <SearchBarDesktopAnimated
              key={`${filters["ad-type"] ?? ""}-${filters.category ?? ""}-${filters.breed ?? ""}`}
              onExpandedChange={handleSearchBarExpandedChange}
            />
          </SearchBarSyncProvider>
        </div>
      </DesktopNavbar>
    </>
  );
}
