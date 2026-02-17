/**
 * Paginated result wrapper
 */
/**
 * City DTO from API
 */
export interface CityDto {
  id: number;
  name: string | null;
}

/**
 * District DTO from API
 */
export interface DistrictDto {
  id: number;
  name: string | null;
  cityId: number;
}
