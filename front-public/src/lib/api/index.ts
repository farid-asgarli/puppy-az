/**
 * API module exports
 *
 * Centralized exports for all API-related functionality
 */

// Core Infrastructure
export { httpClient } from './core/http-client';
export { BaseService } from './core/base-service';
export type { RequestContext, RequestInterceptor, ResponseInterceptor } from './core/interceptors';

// Legacy API Client (deprecated - use services instead)
/** @deprecated Use service instances instead (authService, petAdService, etc.) */
export { apiClient, ApiClient, ApiError, API_CONFIG } from './client';

// Error Handling
export {
  formatApiError,
  getUserErrorMessage,
  formatValidationErrors,
  getLocalizedErrorMessage,
  isAuthError,
  isValidationError,
  isNotFoundError,
  isConflictError,
  logApiError,
  type FormattedError,
} from './utils/error-handler';

// Services (Singleton Instances)
export { authService, AuthService } from './services/auth.service';
export { petAdService, PetAdService } from './services/pet-ad.service';
export { favoriteAdService, FavoriteAdService } from './services/favorite-ad.service';
export { citiesService, CitiesService } from './services/cities.service';

export {
  LogicalOperator,
  FilterEquation,
  type QuerySpecification,
  type SearchFilter,
  type FilterEntry,
  type PaginationParams,
  type PaginatedResult,
} from './types/common.types';

// Types
export type {
  LoginWithEmailCommand,
  LoginWithMobileCommand,
  RegisterCommand,
  SendVerificationCodeCommand,
  ChangePasswordCommand,
  UpdateUserProfileCommand,
  AuthenticationResponse,
  UserProfileDto,
  UserDashboardStatsDto,
  CurrentUserResponse,
  ProblemDetails,
  ApiResponse,
} from './types/auth.types';

export type {
  PetAdListItemDto,
  PetAdDetailsDto,
  PetBreedDto,
  PetCategoryDetailedDto,
  PetCategoryDto,
  PetCategoryWithAdsDto,
  PetAdImageDto,
  PetAdQuestionDto,
  SubmitPetAdCommand,
  UpdatePetAdCommand,
  AskQuestionCommand,
  AnswerQuestionCommand,
} from './types/pet-ad.types';

export type { CityDto } from './types/city.types';

export { PetAdType, PetGender, PetSize } from './types/pet-ad.types';
