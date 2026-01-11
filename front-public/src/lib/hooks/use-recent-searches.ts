import { useState, useEffect, useCallback } from 'react';
import { FilterParams } from '@/lib/filtering/types';
import { PetCategoryDetailedDto, PetBreedDto, CityDto } from '@/lib/api';
import {
  RecentSearch,
  getStoredRecentSearches,
  saveRecentSearch,
  enrichRecentSearches,
  isValidSearch,
  clearRecentSearches,
} from '@/lib/utils/recent-searches';
import { citiesService } from '@/lib/api/services/cities.service';
import { useTranslations } from 'next-intl';

interface UseRecentSearchesOptions {
  categories: PetCategoryDetailedDto[];
  breeds: PetBreedDto[] | null;
}

/**
 * Hook for managing recent searches
 */
export function useRecentSearches({ categories, breeds }: UseRecentSearchesOptions) {
  const t = useTranslations('common');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cities, setCities] = useState<CityDto[]>([]);

  // Load cities and enrich recent searches on mount
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch cities from API
        const citiesData = await citiesService.getCities();
        setCities(citiesData);

        // Load stored searches (IDs only)
        const storedSearches = getStoredRecentSearches();

        // Enrich with API data
        const enrichedSearches = enrichRecentSearches(storedSearches, categories, breeds, citiesData, t);
        setRecentSearches(enrichedSearches);
      } catch (error) {
        console.error('Failed to load cities:', error);
        // Still load recent searches even if cities fail
        const storedSearches = getStoredRecentSearches();
        const enrichedSearches = enrichRecentSearches(storedSearches, categories, breeds, [], t);
        setRecentSearches(enrichedSearches);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, [categories, breeds, t]);

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
      const enrichedSearches = enrichRecentSearches(storedSearches, categories, breeds, cities, t);
      setRecentSearches(enrichedSearches);
    },
    [categories, breeds, cities, t]
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
