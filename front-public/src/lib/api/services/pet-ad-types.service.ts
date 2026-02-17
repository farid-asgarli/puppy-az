import { BaseService } from "../core/base-service";
import { PetAdTypeDto } from "@/lib/api/types/pet-ad-type.types";

/**
 * Pet Ad Types service
 * Handles fetching listing types from the database
 */
export class PetAdTypesService extends BaseService {
  /**
   * Fetch all active pet ad types from the API
   * @param locale - Optional locale for localized content
   */
  async getPetAdTypes(locale?: string): Promise<PetAdTypeDto[]> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    const response = await this.http.get<
      { value: PetAdTypeDto[]; Count: number } | PetAdTypeDto[]
    >("/api/pet-ads/types", context);

    // Handle both array and { value: [], Count: n } response formats
    if (Array.isArray(response)) {
      return response;
    }
    if (response && typeof response === "object" && "value" in response) {
      return response.value;
    }
    return [];
  }
}

/**
 * Singleton pet ad types service instance
 */
export const petAdTypesService = new PetAdTypesService();
