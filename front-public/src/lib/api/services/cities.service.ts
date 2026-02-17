import { BaseService } from "../core/base-service";
import { CityDto, DistrictDto } from "@/lib/api/types/city.types";

/**
 * Cities service
 * Handles all city-related API calls
 */
export class CitiesService extends BaseService {
  /**
   * Fetch all cities from the API
   */
  async getCities(locale?: string): Promise<CityDto[]> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.get<CityDto[]>("/api/cities", context);
  }

  /**
   * Fetch districts by city ID from the API
   */
  async getDistrictsByCity(
    cityId: number,
    locale?: string,
  ): Promise<DistrictDto[]> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.get<DistrictDto[]>(
      `/api/districts/by-city/${cityId}`,
      context,
    );
  }
}

/**
 * Singleton cities service instance
 */
export const citiesService = new CitiesService();
