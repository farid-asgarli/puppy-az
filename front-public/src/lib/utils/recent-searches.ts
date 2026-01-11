import { FilterParams } from '@/lib/filtering/types';
import { PetAdType } from '@/lib/api';
import { getAdTypes } from '@/lib/utils/mappers';

/**
 * Minimal recent search stored in localStorage (only IDs)
 */
export interface StoredRecentSearch {
  id: string;
  filters: FilterParams;
  timestamp: number;
}

/**
 * Recent search item with enriched data from API
 */
export interface RecentSearch {
  id: string;
  filters: FilterParams;
  timestamp: number;
  displayText: {
    primary: string; // e.g., "Dogs • Golden Retriever"
    secondary?: string; // e.g., "Baku • ₼500-1000"
  };
  adType?: PetAdType;
  category?: {
    id: number;
    svgIcon: string;
    iconColor: string;
  };
}

const STORAGE_KEY = 'puppy_recent_searches';
const MAX_RECENT_SEARCHES = 3;

/**
 * Generate unique ID for a search based on filters
 */
function generateSearchId(filters: FilterParams): string {
  const relevantKeys = ['ad-type', 'category', 'breed', 'city', 'price-min', 'price-max'];
  const values = relevantKeys.map((key) => filters[key as keyof FilterParams] || '').join('-');
  return values;
}

/**
 * Check if a search is valid (has at least ad-type or category)
 */
export function isValidSearch(filters: FilterParams): boolean {
  return !!(filters['ad-type'] || filters.category);
}

/**
 * Get stored recent searches from localStorage (IDs only)
 */
export function getStoredRecentSearches(): StoredRecentSearch[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const searches = JSON.parse(stored) as StoredRecentSearch[];

    // Filter out invalid searches
    const validSearches = searches.filter((search) => search && search.id && search.filters);

    // Sort by timestamp descending (most recent first)
    return validSearches.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load recent searches:', error);
    return [];
  }
}

/**
 * Save a new search to localStorage (only IDs and filters)
 * Removes duplicates and keeps only the 3 most recent
 */
export function saveRecentSearch(filters: FilterParams): void {
  if (typeof window === 'undefined') return;

  // Validate filters
  if (!filters || !isValidSearch(filters)) {
    console.warn('Invalid filters, skipping save:', filters);
    return;
  }

  try {
    const existing = getStoredRecentSearches();
    const searchId = generateSearchId(filters);

    // Remove duplicate if exists
    const filtered = existing.filter((s) => s.id !== searchId);

    // Create minimal stored search
    const storedSearch: StoredRecentSearch = {
      id: searchId,
      filters,
      timestamp: Date.now(),
    };

    // Add new search at the beginning
    const updated = [storedSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent search:', error);
  }
}

/**
 * Remove a specific search by ID
 */
export function removeRecentSearch(searchId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getStoredRecentSearches();
    const filtered = existing.filter((s) => s.id !== searchId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove recent search:', error);
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recent searches:', error);
  }
}

/**
 * Enrich stored searches with API data to create full RecentSearch objects
 */
export function enrichRecentSearches(
  storedSearches: StoredRecentSearch[],
  categories: Array<{ id: number; title: string; svgIcon: string; iconColor: string }>,
  breeds: Array<{ id: number; title: string }> | null,
  cities: Array<{ id: number; name: string | null }>,
  t: (key: string) => string
): RecentSearch[] {
  const adTypes = getAdTypes(t);

  return storedSearches.map((stored) => {
    const { id, filters, timestamp } = stored;

    // Extract ad type
    const adType = filters['ad-type'] ? (+filters['ad-type'] as PetAdType) : undefined;
    const adTypeInfo = adType !== undefined ? adTypes[adType] : null;

    // Extract category info
    let categoryInfo: { id: number; svgIcon: string; iconColor: string } | undefined;

    // Build primary text (ad-type + category + breed)
    const primaryParts: string[] = [];

    // Add ad type title first if available
    if (adTypeInfo) {
      primaryParts.push(adTypeInfo.title);
    }

    if (filters.category) {
      const category = categories.find((c) => c.id === +filters.category!);
      if (category) {
        primaryParts.push(category.title);
        categoryInfo = {
          id: category.id,
          svgIcon: category.svgIcon,
          iconColor: category.iconColor,
        };
      }
    }

    if (filters.breed && breeds) {
      const breed = breeds.find((b) => b.id === +filters.breed!);
      if (breed) {
        primaryParts.push(breed.title);
      }
    }

    const primary = primaryParts.join(' • ') || 'All Pets';

    // Build secondary text (city + price)
    const secondaryParts: string[] = [];

    if (filters.city) {
      const city = cities.find((c) => c.id === +filters.city!);
      if (city && city.name) {
        secondaryParts.push(city.name);
      }
    }

    if (filters['price-min'] || filters['price-max']) {
      const min = filters['price-min'] ? `₼${filters['price-min']}` : '';
      const max = filters['price-max'] ? `₼${filters['price-max']}` : '';

      if (min && max) {
        secondaryParts.push(`${min}-${max}`);
      } else if (min) {
        secondaryParts.push(`From ${min}`);
      } else if (max) {
        secondaryParts.push(`Up to ${max}`);
      }
    }

    const secondary = secondaryParts.length > 0 ? secondaryParts.join(' • ') : undefined;

    return {
      id,
      filters,
      timestamp,
      displayText: {
        primary,
        secondary,
      },
      adType,
      category: categoryInfo,
    };
  });
}
