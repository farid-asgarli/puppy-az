'use client';

import { useEffect, useRef } from 'react';
import { DisplayCache } from '@/lib/caching/display-cache';
import { CityDto, PetCategoryDetailedDto, PetBreedDto } from '@/lib/api';

interface DisplayCacheProviderProps {
  categories?: PetCategoryDetailedDto[];
  cities?: CityDto[];
  breeds?: { categoryId: number; breeds: PetBreedDto[] };
  children: React.ReactNode;
}

/**
 * DisplayCacheProvider - Populates display cache for UI
 *
 * Stores SSR data in DisplayCache to avoid prop drilling.
 * Components can then access category/city/breed names anywhere in the tree.
 *
 * Usage:
 * ```tsx
 * <DisplayCacheProvider categories={categories} cities={cities}>
 *   <YourComponent />
 * </DisplayCacheProvider>
 * ```
 */
export function DisplayCacheProvider({ categories, cities, breeds, children }: DisplayCacheProviderProps) {
  const storedRef = useRef({
    categories: false,
    cities: false,
    breeds: new Set<number>(),
  });

  useEffect(() => {
    if (categories && categories.length > 0 && !storedRef.current.categories) {
      DisplayCache.setCategories(categories);
      storedRef.current.categories = true;
    }
  }, [categories]);

  useEffect(() => {
    if (cities && cities.length > 0 && !storedRef.current.cities) {
      DisplayCache.setCities(cities);
      storedRef.current.cities = true;
    }
  }, [cities]);

  useEffect(() => {
    if (breeds && !storedRef.current.breeds.has(breeds.categoryId)) {
      DisplayCache.setBreeds(breeds.categoryId, breeds.breeds);
      storedRef.current.breeds.add(breeds.categoryId);
    }
  }, [breeds]);

  return <>{children}</>;
}
