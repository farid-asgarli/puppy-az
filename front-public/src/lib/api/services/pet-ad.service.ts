import { BaseService } from '../core/base-service';
import { PaginatedResult, QuerySpecification } from '@/lib/api/types/common.types';
import {
  PetCategoryDetailedDto,
  PetCategoryDto,
  PetBreedDto,
  PetAdListItemDto,
  PetAdDetailsDto,
  RelatedPetAdsQuery,
  PetCategoryWithAdsDto,
  DeletePetAdImageResponse,
  SubmitPetAdCommand,
  PetAdImageDto,
  UpdatePetAdCommand,
  AskQuestionCommand,
  AnswerQuestionCommand,
  MyAdQuestionDto,
  MyAdQuestionsSummaryDto,
  MyPetAdDto,
  MyAdListItemDto,
} from '../types/pet-ad.types';

/**
 * Pet Ad service
 * Handles all pet ad-related API calls
 */
export class PetAdService extends BaseService {
  /**
   * Search pet ads with filters and pagination
   */
  async searchPetAds(request: QuerySpecification, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/pet-ads/search', request, context);
  }

  /**
   * Get all pet categories with counts, icons and styling info
   */
  async getPetCategoriesDetailed(locale?: string): Promise<PetCategoryDetailedDto[]> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.get<PetCategoryDetailedDto[]>('/api/pet-ads/categories/detailed', context);
  }

  /**
   * Submit a new pet advertisement
   * @param data The pet ad submission data
   * @param token Authentication token for the user
   * @returns The ID of the newly created pet ad
   */
  async submitPetAd(data: SubmitPetAdCommand, token: string, locale?: string): Promise<number> {
    return this.http.post<number>('/api/pet-ads', data, this.withAuth(token, locale));
  }

  /**
   * Submit a new pet advertisement
   * @param data The pet ad update data
   * @param token Authentication token for the user
   * @returns The ID of the newly created pet ad
   */
  async updatePetAd(data: UpdatePetAdCommand, token: string, locale?: string): Promise<void> {
    return this.http.put('/api/pet-ads', data, this.withAuth(token, locale));
  }

  /**
   * Close/deactivate a pet advertisement
   * @param petAdId The ID of the pet ad to close
   * @param token Authentication token for the user
   * @returns
   */
  async closePetAd(petAdId: number, token: string, locale?: string): Promise<void> {
    return this.http.post<void>(`/api/pet-ads/${petAdId}/close`, undefined, this.withAuth(token, locale));
  }

  /**
   * Get all pet categories
   */
  async getPetCategories(locale?: string): Promise<PetCategoryDto[]> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.get<PetCategoryDto[]>('/api/pet-ads/categories', context);
  }

  /**
   * Get top pet categories with ads (for homepage display)
   */
  async getPetCategoriesWithAds(locale?: string): Promise<PetCategoryWithAdsDto[]> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.get<PetCategoryWithAdsDto[]>('/api/pet-ads/categories/top-with-ads', context);
  }

  /**
   * Get premium ads with pagination
   */
  async getPremiumAds(request: QuerySpecification, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/pet-ads/premium', request, context);
  }

  /**
   * Get breeds for a specific category
   */
  async getPetBreeds(categoryId: number, locale?: string): Promise<PetBreedDto[]> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.get<PetBreedDto[]>(`/api/pet-ads/breeds${this.buildQueryString({ categoryId })}`, context);
  }

  /**
   * Get pet ad details by ID
   */
  async getPetAdDetails(id: number, locale?: string): Promise<PetAdDetailsDto> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.get<PetAdDetailsDto>(`/api/pet-ads/${id}`, context);
  }

  /**
   * Get related pet ads
   */
  async getRelatedPetAds(query: RelatedPetAdsQuery, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/pet-ads/related', query, context);
  }

  /**
   * Close/deactivate a pet ad (requires auth token)
   */
  async closeAdById(id: number, token: string, locale?: string): Promise<void> {
    return this.http.post<void>(`/api/pet-ads/${id}/close`, undefined, this.withAuth(token, locale));
  }

  /**
   * Get user's active ads with pagination
   */
  async getUserActiveAds(spec: QuerySpecification, token: string, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/users/ads/active', spec, this.withAuth(token, locale));
  }

  /**
   * Get user's pending ads with pagination
   */
  async getUserPendingAds(spec: QuerySpecification, token: string, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/users/ads/pending', spec, this.withAuth(token, locale));
  }

  /**
   * Get user's rejected ads with pagination
   */
  async getUserRejectedAds(spec: QuerySpecification, token: string, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/users/ads/rejected', spec, this.withAuth(token, locale));
  }

  /**
   * Get all user's ads with pagination
   */
  async getAllUserAds(spec: QuerySpecification, token: string, locale?: string): Promise<PaginatedResult<MyAdListItemDto>> {
    return this.http.post<PaginatedResult<MyAdListItemDto>>('/api/users/ads/all', spec, this.withAuth(token, locale));
  }

  /**
   * Upload an image for a pet advertisement.
   * Image will be stored with ownership tracking and can be attached to an ad later.
   * Max file size: 10MB
   * Supported formats: jpg, jpeg, png, webp
   *
   * @param file - The image file to upload
   * @returns Promise with the uploaded image ID
   */
  async uploadPetAdImage(file: File, token: string, locale?: string): Promise<PetAdImageDto> {
    // Defensive check: ensure file is valid before uploading
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file: file must be a valid File object');
    }

    // Additional validation: check file has content
    if (!file.name || file.size === 0) {
      throw new Error('Invalid file: file must have a name and content');
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PetAdImageDto>('/api/pet-ad-images/upload', formData, {
      token,
      locale,
    });
  }

  /**
   * Delete an uploaded pet ad image.
   * Only the user who uploaded the image can delete it, and only if it's not yet attached to an ad.
   *
   * @param imageId - The ID of the image to delete
   * @returns Promise with success status
   */
  async deletePetAdImage(imageId: number, token: string, locale?: string): Promise<DeletePetAdImageResponse> {
    return this.http.delete<DeletePetAdImageResponse>(`/api/pet-ad-images/${imageId}`, this.withAuth(token, locale));
  }

  /**
   * Get the current user's uploaded images that are not yet attached to an ad.
   * Useful for displaying preview of uploaded images before ad submission.
   *
   * **Authorization**: Required
   *
   * @returns Promise with list of uploaded images
   */
  async getMyUploadedImages(token: string, locale?: string): Promise<PetAdImageDto[]> {
    return this.http.get<PetAdImageDto[]>('/api/pet-ad-images/my-uploads', this.withAuth(token, locale));
  }

  /**
   * Ask a question about a specific pet ad.
   * **Authorization**: Required
   *
   * @param adId - The ID of the pet ad
   * @param data - The question data
   * @param token - Authorization token
   * @returns Promise<void>
   */
  async askQuestion(adId: number, data: AskQuestionCommand, token: string, locale?: string): Promise<void> {
    return this.http.post<void>(`/api/pet-ads/${adId}/questions`, data, this.withAuth(token, locale));
  }

  /**
   * Answer a question about a specific pet ad.
   * **Authorization**: Required
   *
   * @param questionId - The ID of the question
   * @param data - The answer data
   * @param token - Authorization token
   * @returns Promise<void>
   */
  async answerQuestion(questionId: number, data: AnswerQuestionCommand, token: string, locale?: string): Promise<void> {
    return this.http.post<void>(`/api/pet-ads/questions/${questionId}/answer`, data, this.withAuth(token, locale));
  }

  /**   * Record a view for a specific pet ad.
   * @param adId - The ID of the pet ad
   * @param token - Authorization token
   * @returns Promise<void>
   */

  async recordView(adId: number, token: string, locale?: string): Promise<void> {
    const context = this.withAuth(token, locale);
    return this.http.post<void>(`/api/pet-ads/${adId}/view`, undefined, context);
  }

  /**   * Get recently viewed pet ads for the current user.
   * **Authorization**: Required
   * @param query - Query specification for pagination and filtering
   * @param token - Authorization token
   * @returns Promise with paginated result of pet ad list items
   */
  async getRecentlyViewedAds(query: QuerySpecification, token: string, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    const context = this.withAuth(token, locale);
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/users/recently-viewed', query, context);
  }

  /**   * Get questions for the current user's ads.
   * **Authorization**: Required
   * @param query - Query specification for pagination and filtering
   * @param token - Authorization token
   * @returns Promise with paginated result of my ad questions
   */
  async getMyAdsQuestions(query: QuerySpecification, token: string, locale?: string): Promise<PaginatedResult<MyAdQuestionDto>> {
    const context = this.withAuth(token, locale);
    return this.http.post<PaginatedResult<MyAdQuestionDto>>('/api/users/ads/questions', query, context);
  }

  /**   * Get summary of questions for the current user's ads.
   * **Authorization**: Required
   * @param token - Authorization token
   * @returns Promise with my ad questions summary
   */
  async getMyAdsQuestionsSummary(token: string, locale?: string): Promise<MyAdQuestionsSummaryDto> {
    const context = this.withAuth(token, locale);
    return this.http.get<MyAdQuestionsSummaryDto>('/api/users/ads/questions/summary', context);
  }
  /**   * Get a specific pet ad belonging to the current user.
   * **Authorization**: Required
   * @param petAdId - The ID of the pet ad
   * @param token - Authorization token
   * @returns Promise with my pet ad details
   */

  async getMyPetAd(petAdId: number, token: string, locale?: string): Promise<MyPetAdDto> {
    const context = this.withAuth(token, locale);
    return this.http.get<MyPetAdDto>(`/api/users/ads/${petAdId}`, context);
  }
}

/**
 * Singleton pet ad service instance
 */
export const petAdService = new PetAdService();
