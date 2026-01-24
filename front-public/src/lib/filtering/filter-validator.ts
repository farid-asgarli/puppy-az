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
import { getEnumValues } from "@/lib/utils/enum-utils";

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
   * Validate ad type enum value
   */
  static validateAdType(value: string | number): PetAdType | null {
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

  static validateGender(value: string | number): PetGender | null {
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return this.VALID_GENDERS.includes(num) ? num : null;
  }

  static validateSize(value: string | number): PetSize | null {
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
      if (sort) validated.sort = sort as any;
    }

    // Cross-validation: ensure price-min <= price-max
    if (
      validated["price-min"] &&
      validated["price-max"] &&
      validated["price-min"] > validated["price-max"]
    ) {
      delete validated["price-max"];
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
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString());
      }
    });

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
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
