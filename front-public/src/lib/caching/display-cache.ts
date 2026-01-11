/**
 * DisplayCache - UI display data store
 *
 * Caches categories, cities, and breeds for showing labels/names in the UI.
 * Separate from validation logic (FilterValidator handles that).
 *
 * Purpose: Avoid prop drilling and redundant API calls
 * Usage: Components use this to display entity names in dropdowns/labels
 *
 * @example
 * ```typescript
 * // Store data (typically from SSR)
 * DisplayCache.setCategories(categories);
 *
 * // Read for display
 * const cityName = DisplayCache.getCityById(1)?.name;
 * ```
 */

import { CityDto } from '@/lib/api';
import { PetCategoryDto, PetBreedDto } from '@/lib/api/types/pet-ad.types';
import { SingletonCacheManager, CacheManager } from '@/lib/utils/cache-manager';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class DisplayCacheStore {
  private categoriesCache = new SingletonCacheManager<PetCategoryDto[]>({ ttl: CACHE_TTL });
  private citiesCache = new SingletonCacheManager<CityDto[]>({ ttl: CACHE_TTL });
  private breedsCache = new CacheManager<number, PetBreedDto[]>({ ttl: CACHE_TTL });

  // ============================================================================
  // Categories
  // ============================================================================

  setCategories(categories: PetCategoryDto[]): void {
    this.categoriesCache.set(categories);
  }

  getCategories(): PetCategoryDto[] | null {
    return this.categoriesCache.getSync();
  }

  getCategoryById(id: number): PetCategoryDto | undefined {
    return this.getCategories()?.find((cat) => cat.id === id);
  }

  // ============================================================================
  // Cities
  // ============================================================================

  setCities(cities: CityDto[]): void {
    this.citiesCache.set(cities);
  }

  getCities(): CityDto[] | null {
    return this.citiesCache.getSync();
  }

  getCityById(id: number): CityDto | undefined {
    return this.getCities()?.find((city) => city.id === id);
  }

  // ============================================================================
  // Breeds
  // ============================================================================

  setBreeds(categoryId: number, breeds: PetBreedDto[]): void {
    this.breedsCache.set(categoryId, breeds);
  }

  getBreeds(categoryId: number): PetBreedDto[] | null {
    return this.breedsCache.getSync(categoryId);
  }

  getBreedById(categoryId: number, breedId: number): PetBreedDto | undefined {
    return this.getBreeds(categoryId)?.find((breed) => breed.id === breedId);
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  clear(): void {
    this.categoriesCache.clear();
    this.citiesCache.clear();
    this.breedsCache.clear();
  }

  clearCategories(): void {
    this.categoriesCache.clear();
  }

  clearCities(): void {
    this.citiesCache.clear();
  }

  clearBreeds(categoryId?: number): void {
    if (categoryId) {
      this.breedsCache.delete(categoryId);
    } else {
      this.breedsCache.clear();
    }
  }
}

// Singleton instance
export const DisplayCache = new DisplayCacheStore();
