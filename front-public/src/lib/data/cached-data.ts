import { unstable_cache } from "next/cache";
import { petAdService } from "@/lib/api/services/pet-ad.service";
import { citiesService } from "@/lib/api/services/cities.service";
import type { PetCategoryDetailedDto } from "@/lib/api/types/pet-ad.types";
import type { CityDto } from "@/lib/api/types/city.types";

/**
 * Cached version of getPetCategoriesDetailed
 * Revalidates every 60 seconds to keep categories fresh but avoid constant refetching
 */
export const getCachedCategories = unstable_cache(
  async (locale: string): Promise<PetCategoryDetailedDto[]> => {
    try {
      return await petAdService.getPetCategoriesDetailed(locale);
    } catch (error) {
      console.error("[getCachedCategories] Failed to fetch categories:", error);
      return [];
    }
  },
  ["pet-categories-detailed"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["categories"],
  },
);

/**
 * Cached version of getCities
 * Revalidates every 5 minutes since cities rarely change
 */
export const getCachedCities = unstable_cache(
  async (locale: string): Promise<CityDto[]> => {
    try {
      return await citiesService.getCities(locale);
    } catch (error) {
      console.error("[getCachedCities] Failed to fetch cities:", error);
      return [];
    }
  },
  ["cities"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["cities"],
  },
);
