import { BaseService } from '../core/base-service';
import { PaginatedResult, QuerySpecification } from '@/lib/api/types/common.types';
import { PetAdListItemDto } from '../types/pet-ad.types';

/**
 * Favorite Ad service
 * Handles all favorite ad-related API calls
 */
export class FavoriteAdService extends BaseService {
  /**
   * Get user's favorite ads (requires authentication)
   */
  async getFavoriteAds(spec: QuerySpecification, token: string, locale?: string): Promise<PaginatedResult<PetAdListItemDto>> {
    return this.http.post<PaginatedResult<PetAdListItemDto>>('/api/favorite-ads/list', spec, this.withAuth(token, locale));
  }

  /**
   * Add pet ads to favorites (requires authentication)
   */
  async addFavoriteAd(petAdIds: number[], token: string, locale?: string): Promise<void> {
    return this.http.post<void>('/api/favorite-ads/', petAdIds, this.withAuth(token, locale));
  }

  /**
   * Remove a pet ad from favorites (requires authentication)
   */
  async removeFavoriteAd(petAdId: number, token: string, locale?: string): Promise<void> {
    return this.http.delete<void>(`/api/favorite-ads/${petAdId}`, this.withAuth(token, locale));
  }

  /**
   * Sync local favorites to backend (called after login)
   * This will add all local favorites to the user's account
   */
  async syncLocalFavorites(localFavoriteIds: number[], token: string, locale?: string): Promise<void> {
    if (localFavoriteIds.length === 0) return;

    try {
      // Send all favorites in a single request
      await this.addFavoriteAd(localFavoriteIds, token, locale);
    } catch (error) {
      console.error('Failed to sync local favorites:', error);
      throw error;
    }
  }
}

/**
 * Singleton favorite ad service instance
 */
export const favoriteAdService = new FavoriteAdService();
