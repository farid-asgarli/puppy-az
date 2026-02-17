/**
 * FilterValidator - Type-based URL filter validation
 *
 * Pure validation logic - no cache, no API calls, no side effects.
 * Only validates data structure and format.
 *
 * Responsibilities:
 * - Is this a valid integer?
 * - Is this within allowed range?
 * - Is this a known enum value?
 *
 * NOT responsible for:
 * - Does this category exist? (API handles this)
 * - Storing UI display data (see FilterDataCache)
 * - Fetching data (components do this)
 *
 * @example
 * ```typescript
 * const { filters } = useFilterUrl();
 * // filters.category = 5 (validated as positive integer)
 * // API will return 404 if category 5 doesn't exist
 * ```
 */

import { FilterParams } from "@/lib/filtering/types";
import { DEFAULT_FILTER_VALUES } from "@/lib/filtering/filter-default-values";
import { PetAdType, PetGender, PetSize } from "@/lib/api";
import type { PetCategoryDto } from "@/lib/api";
import { getEnumValues } from "@/lib/utils/enum-utils";
import { DisplayCache } from "@/lib/caching/display-cache";

// ============================================================================
// Slug <-> Enum Mappings
// ============================================================================

const AD_TYPE_SLUGS: Record<string, PetAdType> = {
  sale: PetAdType.Sale,
  match: PetAdType.Match,
  found: PetAdType.Found,
  lost: PetAdType.Lost,
  owning: PetAdType.Owning,
};

const AD_TYPE_TO_SLUG: Record<number, string> = Object.fromEntries(
  Object.entries(AD_TYPE_SLUGS).map(([slug, id]) => [id, slug]),
);

const GENDER_SLUGS: Record<string, PetGender> = {
  unknown: PetGender.Unknown,
  male: PetGender.Male,
  female: PetGender.Female,
};

const GENDER_TO_SLUG: Record<number, string> = Object.fromEntries(
  Object.entries(GENDER_SLUGS).map(([slug, id]) => [id, slug]),
);

const SIZE_SLUGS: Record<string, PetSize> = {
  xs: PetSize.ExtraSmall,
  sm: PetSize.Small,
  md: PetSize.Medium,
  lg: PetSize.Large,
  xl: PetSize.ExtraLarge,
};

const SIZE_TO_SLUG: Record<number, string> = Object.fromEntries(
  Object.entries(SIZE_SLUGS).map(([slug, id]) => [id, slug]),
);

export class FilterValidator {
  private static readonly VALID_AD_TYPES = getEnumValues(PetAdType);
  private static readonly VALID_GENDERS = getEnumValues(PetGender);
  private static readonly VALID_SIZES = getEnumValues(PetSize);
  private static readonly VALID_SORTS = [
    "newest",
    "oldest",
    "price-low",
    "price-high",
    "distance",
  ];
  private static readonly MAX_PRICE = DEFAULT_FILTER_VALUES.MAX_AD_PRICE;
  private static readonly MAX_PAGE = 1000;

  // ============================================================================
  // Type Validators (structure only, no entity existence checks)
  // ============================================================================

  /**
   * Validate ad type enum value (accepts slug like "sale" or number like "1")
   */
  static validateAdType(value: string | number): PetAdType | null {
    if (
      typeof value === "string" &&
      AD_TYPE_SLUGS[value.toLowerCase()] !== undefined
    ) {
      return AD_TYPE_SLUGS[value.toLowerCase()];
    }
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return this.VALID_AD_TYPES.includes(num) ? num : null;
  }

  /**
   * Validate category ID - checks if it's a positive integer
   * API will validate if category exists
   */
  static validateCategory(value: string | number): number | null {
    const categoryId = typeof value === "string" ? parseInt(value, 10) : value;
    return !isNaN(categoryId) && categoryId > 0 ? categoryId : null;
  }

  /**
   * Validate breed ID - checks if it's a positive integer
   * API will validate if breed exists and belongs to category
   */
  static validateBreed(value: string | number): number | null {
    const breedId = typeof value === "string" ? parseInt(value, 10) : value;
    return !isNaN(breedId) && breedId > 0 ? breedId : null;
  }

  /**
   * Validate city ID - checks if it's a positive integer
   * API will validate if city exists
   */
  static validateCity(value: string | number): number | null {
    const cityId = typeof value === "string" ? parseInt(value, 10) : value;
    return !isNaN(cityId) && cityId > 0 ? cityId : null;
  }

  /**
   * Validate district ID - checks if it's a positive integer
   * API will validate if district exists
   */
  static validateDistrict(value: string | number): number | null {
    const districtId = typeof value === "string" ? parseInt(value, 10) : value;
    return !isNaN(districtId) && districtId > 0 ? districtId : null;
  }

  /**
   * Validate gender (accepts slug like "male" or number like "1")
   */
  static validateGender(value: string | number): PetGender | null {
    if (
      typeof value === "string" &&
      GENDER_SLUGS[value.toLowerCase()] !== undefined
    ) {
      return GENDER_SLUGS[value.toLowerCase()];
    }
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return this.VALID_GENDERS.includes(num) ? num : null;
  }

  /**
   * Validate size (accepts slug like "md" or number like "3")
   */
  static validateSize(value: string | number): PetSize | null {
    if (
      typeof value === "string" &&
      SIZE_SLUGS[value.toLowerCase()] !== undefined
    ) {
      return SIZE_SLUGS[value.toLowerCase()];
    }
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return this.VALID_SIZES.includes(num) ? num : null;
  }

  static validatePrice(value: string): number | null {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 && num <= this.MAX_PRICE ? num : null;
  }

  static validateAge(value: string): number | null {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 && num <= 999 ? num : null;
  }

  static validateWeight(value: string): number | null {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 9999 ? num : null;
  }

  static validatePage(value: string): number | null {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 1 && num <= this.MAX_PAGE ? num : null;
  }

  static validateSort(value: string): string | null {
    return this.VALID_SORTS.includes(value) ? value : null;
  }

  // ============================================================================
  // Filter Validation (type-based only)
  // ============================================================================

  /**
   * Validate all filters from URL params
   * Only validates structure and format - API validates entity existence
   */
  static validateFilters(params: Record<string, string>): FilterParams {
    const validated: FilterParams = {};

    // Validate each parameter
    if (params["ad-type"]) {
      const adType = this.validateAdType(params["ad-type"]);
      if (adType) validated["ad-type"] = adType;
    }

    if (params.category) {
      const category = this.validateCategory(params.category);
      if (category) validated.category = category;
    }

    if (params.breed) {
      const breed = this.validateBreed(params.breed);
      if (breed) validated.breed = breed;
    }

    if (params.city) {
      const city = this.validateCity(params.city);
      if (city) validated.city = city;
    }

    if (params.district) {
      const district = this.validateDistrict(params.district);
      if (district) validated.district = district;
    }

    if (params.gender) {
      const gender = this.validateGender(params.gender);
      if (gender) validated.gender = gender;
    }

    if (params.size) {
      const size = this.validateSize(params.size);
      if (size) validated.size = size;
    }

    if (params["price-min"]) {
      const priceMin = this.validatePrice(params["price-min"]);
      if (priceMin !== null) validated["price-min"] = priceMin;
    }

    if (params["price-max"]) {
      const priceMax = this.validatePrice(params["price-max"]);
      if (priceMax !== null) validated["price-max"] = priceMax;
    }

    if (params["age-min"]) {
      const ageMin = this.validateAge(params["age-min"]);
      if (ageMin !== null) validated["age-min"] = ageMin;
    }

    if (params["age-max"]) {
      const ageMax = this.validateAge(params["age-max"]);
      if (ageMax !== null) validated["age-max"] = ageMax;
    }

    if (params["weight-min"]) {
      const weightMin = this.validateWeight(params["weight-min"]);
      if (weightMin !== null) validated["weight-min"] = weightMin;
    }

    if (params["weight-max"]) {
      const weightMax = this.validateWeight(params["weight-max"]);
      if (weightMax !== null) validated["weight-max"] = weightMax;
    }

    if (params.color) {
      validated.color = params.color;
    }

    if (params.page) {
      const page = this.validatePage(params.page);
      if (page) validated.page = page;
    }

    if (params.sort) {
      const sort = this.validateSort(params.sort);
      if (sort) validated.sort = sort as FilterParams["sort"];
    }

    // Cross-validation: ensure price-min <= price-max
    if (
      validated["price-min"] &&
      validated["price-max"] &&
      validated["price-min"] > validated["price-max"]
    ) {
      delete validated["price-max"];
    }

    // Cross-validation: district requires city
    if (validated.district && !validated.city) {
      delete validated.district;
    }

    return validated;
  }

  // ============================================================================
  // URL Building
  // ============================================================================

  /**
   * Build URL with filter params
   */
  static buildFilterUrl(
    filters: FilterParams,
    basePath: string = "/ads/s",
  ): string {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      // Convert enum values to slugs for readable URLs
      if (
        key === "ad-type" &&
        typeof value === "number" &&
        AD_TYPE_TO_SLUG[value]
      ) {
        params.set(key, AD_TYPE_TO_SLUG[value]);
      } else if (
        key === "gender" &&
        typeof value === "number" &&
        GENDER_TO_SLUG[value]
      ) {
        params.set(key, GENDER_TO_SLUG[value]);
      } else if (
        key === "size" &&
        typeof value === "number" &&
        SIZE_TO_SLUG[value]
      ) {
        params.set(key, SIZE_TO_SLUG[value]);
      } else {
        params.set(key, value.toString());
      }
    });

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  /**
   * Build slug-based URL with filter params
   *
   * If the filters include a category (and optionally breed), builds a path like:
   *   /{categorySlug} or /{categorySlug}/{breedSlug}
   * with remaining filters as query params (excluding category/breed).
   *
   * Falls back to /ads/s?category=X if category slug is not available.
   *
   * @param filters - The filter params to encode
   * @param categories - Available categories (for slug lookup). If not provided, falls back to DisplayCache.
   */
  static buildSlugFilterUrl(
    filters: FilterParams,
    categories?: PetCategoryDto[],
  ): string {
    const categoryId = filters.category;

    // If no category, go to /ads/s with all filters as query params
    if (!categoryId) {
      return this.buildFilterUrl(filters, "/ads/s");
    }

    // Look up category slug
    const categoryList = categories ?? DisplayCache.getCategories();
    const category = categoryList?.find((c) => c.id === categoryId);

    if (!category?.slug) {
      // Can't find slug, fall back to query param style
      return this.buildFilterUrl(filters, "/ads/s");
    }

    // Build base path with category slug
    let basePath = `/${category.slug}`;

    // Look up breed slug if breed is in filters
    const breedId = filters.breed;
    if (breedId) {
      const breed = DisplayCache.getBreedById(categoryId, breedId);
      if (breed?.slug) {
        basePath = `/${category.slug}/${breed.slug}`;
      }
      // If breed slug not found (breeds not cached yet), keep breed as query param
      // This handles the edge case where breeds haven't been fetched yet
    }

    // Build remaining filters as query params (exclude category and breed if in path)
    const remainingFilters: FilterParams = { ...filters };
    delete remainingFilters.category;

    // Only remove breed from query params if it's in the slug path
    if (breedId && basePath.includes("/")) {
      const pathSegments = basePath.split("/").filter(Boolean);
      if (pathSegments.length >= 2) {
        delete remainingFilters.breed;
      }
    }

    return this.buildFilterUrl(remainingFilters, basePath);
  }

  /**
   * Parse URL search params to filters
   */
  static parseUrlToFilters(searchParams: URLSearchParams): FilterParams {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return this.validateFilters(params);
  }

  // ============================================================================
  // Helper Getters
  // ============================================================================

  /**
   * Get all valid ad types
   */
  static getAllAdTypes(): PetAdType[] {
    return [...this.VALID_AD_TYPES];
  }

  /**
   * Get all valid genders
   */
  static getAllGenders(): PetGender[] {
    return [...this.VALID_GENDERS];
  }

  /**
   * Get all valid sizes
   */
  static getAllSizes(): PetSize[] {
    return [...this.VALID_SIZES];
  }
}
