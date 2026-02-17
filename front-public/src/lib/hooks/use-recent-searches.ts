import { useState, useEffect, useCallback } from "react";
import { FilterParams } from "@/lib/filtering/types";
import {
  PetCategoryDetailedDto,
  PetBreedDto,
  CityDto,
  PetColorDto,
  DistrictDto,
} from "@/lib/api";
import {
  RecentSearch,
  getStoredRecentSearches,
  saveRecentSearch,
  enrichRecentSearches,
  isValidSearch,
  clearRecentSearches,
} from "@/lib/utils/recent-searches";
import { citiesService } from "@/lib/api/services/cities.service";
import { petAdService } from "@/lib/api/services/pet-ad.service";
import { useTranslations, useLocale } from "next-intl";

interface UseRecentSearchesOptions {
  categories: PetCategoryDetailedDto[];
  breeds: PetBreedDto[] | null;
}

/**
 * Hook for managing recent searches
 */
export function useRecentSearches({
  categories,
  breeds,
}: UseRecentSearchesOptions) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cities, setCities] = useState<CityDto[]>([]);
  const [colors, setColors] = useState<PetColorDto[]>([]);
  const [districts, setDistricts] = useState<DistrictDto[]>([]);

  // Load cities, colors and enrich recent searches on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch cities and colors from API
        const [citiesData, colorsData] = await Promise.all([
          citiesService.getCities(),
          petAdService.getPetColors(locale),
        ]);
        setCities(citiesData);
        setColors(colorsData);

        // Load stored searches (IDs only)
        const storedSearches = getStoredRecentSearches();

        // Load districts for all unique city IDs in stored searches
        const cityIds = [
          ...new Set(
            storedSearches
              .filter((s) => s.filters.city)
              .map((s) => Number(s.filters.city)),
          ),
        ];
        let allDistricts: DistrictDto[] = [];
        if (cityIds.length > 0) {
          const districtResults = await Promise.all(
            cityIds.map((id) => citiesService.getDistrictsByCity(id, locale)),
          );
          allDistricts = districtResults.flat();
        }
        setDistricts(allDistricts);

        // Enrich with API data
        const enrichedSearches = enrichRecentSearches(
          storedSearches,
          categories,
          breeds,
          citiesData,
          t,
          colorsData,
          allDistricts,
        );
        setRecentSearches(enrichedSearches);
      } catch (error) {
        console.error("Failed to load data:", error);
        // Still load recent searches even if API calls fail
        const storedSearches = getStoredRecentSearches();
        const enrichedSearches = enrichRecentSearches(
          storedSearches,
          categories,
          breeds,
          [],
          t,
          [],
          [],
        );
        setRecentSearches(enrichedSearches);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, [categories, breeds, t, locale]);

  // Save a new search
  const addRecentSearch = useCallback(
    (filters: FilterParams) => {
      // Validate search
      if (!isValidSearch(filters)) {
        return;
      }

      // Save to localStorage (only IDs)
      saveRecentSearch(filters);

      // Reload and enrich
      const storedSearches = getStoredRecentSearches();
      const enrichedSearches = enrichRecentSearches(
        storedSearches,
        categories,
        breeds,
        cities,
        t,
        colors,
        districts,
      );
      setRecentSearches(enrichedSearches);
    },
    [categories, breeds, cities, colors, districts, t],
  );

  // Clear all recent searches
  const clearAll = useCallback(() => {
    // Clear from localStorage
    clearRecentSearches();

    // Update state
    setRecentSearches([]);
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    clearAll,
    isLoaded,
  };
}
