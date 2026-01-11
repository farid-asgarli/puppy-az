import { BaseService } from '../core/base-service';
import { CityDto } from '@/lib/api/types/city.types';

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
    return this.http.get<CityDto[]>('/api/cities', context);
  }
}

/**
 * Singleton cities service instance
 */
export const citiesService = new CitiesService();
