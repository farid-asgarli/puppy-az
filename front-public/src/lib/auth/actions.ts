"use server";

import { redirect } from "next/navigation";
import { authService } from "../api/services/auth.service";
import { favoriteAdService } from "../api/services/favorite-ad.service";
import { petAdService } from "../api/services/pet-ad.service";
import type {
  LoginWithEmailCommand,
  LoginWithMobileCommand,
  RegisterCommand,
  SendVerificationCodeCommand,
  UpdateUserProfileCommand,
  ChangePasswordCommand,
  AuthenticationResponse,
  UserProfileDto,
  UserDashboardStatsDto,
  CurrentUserResponse,
} from "../api/types/auth.types";
import type {
  PetAdListItemDto,
  SubmitPetAdCommand,
  UpdatePetAdCommand,
  AskQuestionCommand,
  AnswerQuestionCommand,
  MyPetAdDto,
  MyAdQuestionDto,
  MyAdQuestionsSummaryDto,
  MyAdListItemDto,
} from "../api/types/pet-ad.types";
import {
  setAuthCookies,
  clearAuthCookies,
  getAccessToken,
  isAuthenticated,
} from "./cookies";
import { handleActionError, withAuth, type ActionResult } from "./utils";
import { PaginatedResult, QuerySpecification } from "@/lib/api";
import { getCurrentLocale } from "./locale-utils";

/**
 * Login action - sets cookies and returns auth response
 */
export async function loginWithEmailAction(
  credentials: LoginWithEmailCommand,
): Promise<ActionResult<AuthenticationResponse>> {
  try {
    const locale = await getCurrentLocale();
    const authResponse = await authService.loginWithEmail(credentials, locale);

    await setAuthCookies(authResponse);

    return { success: true, data: authResponse };
  } catch (error) {
    return handleActionError(error, "Login failed");
  }
}

/**
 * Login with mobile/phone action - sets cookies and returns auth response
 */
export async function loginWithMobileAction(
  credentials: LoginWithMobileCommand,
): Promise<ActionResult<AuthenticationResponse>> {
  try {
    const locale = await getCurrentLocale();
    const authResponse = await authService.loginWithMobile(credentials, locale);
    await setAuthCookies(authResponse);

    return { success: true, data: authResponse };
  } catch (error) {
    return handleActionError(error, "Login failed");
  }
}

/**
 * Register action - sets cookies and returns auth response
 */
export async function registerAction(
  data: RegisterCommand,
): Promise<ActionResult<AuthenticationResponse>> {
  try {
    const locale = await getCurrentLocale();
    const authResponse = await authService.register(data, locale);
    await setAuthCookies(authResponse);

    return { success: true, data: authResponse };
  } catch (error) {
    return handleActionError(error, "Registration failed");
  }
}

/**
 * Send verification code action
 */
export async function sendVerificationCodeAction(
  data: SendVerificationCodeCommand,
): Promise<ActionResult<void>> {
  try {
    const locale = await getCurrentLocale();
    await authService.sendVerificationCode(data, locale);
    return { success: true, data: undefined };
  } catch (error) {
    return handleActionError(error, "Failed to send verification code");
  }
}

/**
 * Forgot password action - sends reset link to email
 */
export async function forgotPasswordAction(data: {
  email: string;
}): Promise<ActionResult<void>> {
  try {
    const locale = await getCurrentLocale();
    await authService.forgotPassword(data.email, locale);
    return { success: true, data: undefined };
  } catch (error) {
    return handleActionError(error, "Failed to send reset link");
  }
}

/**
 * Verify reset token action - checks if token is valid
 */
export async function verifyResetTokenAction(data: {
  token: string;
}): Promise<ActionResult<{ valid: boolean }>> {
  try {
    const locale = await getCurrentLocale();
    const result = await authService.verifyResetToken(data.token, locale);
    return { success: true, data: result };
  } catch (error) {
    return handleActionError(error, "Invalid or expired token");
  }
}

/**
 * Reset password action - sets new password using token
 */
export async function resetPasswordAction(data: {
  token: string;
  newPassword: string;
}): Promise<ActionResult<void>> {
  try {
    const locale = await getCurrentLocale();
    await authService.resetPassword(data.token, data.newPassword, locale);
    return { success: true, data: undefined };
  } catch (error) {
    return handleActionError(error, "Failed to reset password");
  }
}

/**
 * Get the access token from cookies
 * This is a Server Action that can be called from client components
 */
export async function getAccessTokenAction(): Promise<string | null> {
  const token = await getAccessToken();
  return token || null;
}

/**
 * Logout action - calls backend logout endpoint and redirects
 *
 * Backend will clear the refreshToken httpOnly cookie.
 * We clear our Next.js managed cookies.
 */
export async function logoutAction(): Promise<void> {
  try {
    const token = await getAccessToken();
    const locale = await getCurrentLocale();

    // Call backend logout if we have a token
    if (token) {
      await authService.logout(token, locale);
    }
  } catch (error) {
    // Continue with logout even if API call fails
    console.error("Logout API call failed:", error);
  } finally {
    // Always clear our cookies and redirect
    await clearAuthCookies();
    redirect("/auth");
  }
}

/**
 * Refresh token action - gets new access token using refresh token from cookie
 *
 * The backend reads the refreshToken from httpOnly cookie automatically.
 */
export async function refreshTokenAction(): Promise<
  ActionResult<AuthenticationResponse>
> {
  try {
    const authResponse = await authService.refreshToken();
    await setAuthCookies(authResponse);

    return { success: true, data: authResponse };
  } catch (error) {
    // Refresh token expired or invalid - clear cookies
    await clearAuthCookies();
    return handleActionError(error, "Session expired");
  }
}

/**
 * Get current user profile (server-side)
 */
export async function getProfileAction(): Promise<
  ActionResult<UserProfileDto>
> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const profile = await authService.getProfile(token, locale);
    return { success: true, data: profile };
  });
}

/**
 * Update user profile action
 */
export async function updateProfileAction(
  data: UpdateUserProfileCommand,
): Promise<ActionResult<UserProfileDto>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const profile = await authService.updateProfile(data, token, locale);
    return { success: true, data: profile };
  });
}

/**
 * Upload profile picture action
 */
export async function uploadProfilePictureAction(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const locale = await getCurrentLocale();
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "No file provided" };
  }

  return withAuth(async (token) => {
    const result = await authService.uploadProfilePicture(file, token, locale);
    return { success: true, data: result };
  });
}

/**
 * Delete profile picture action
 */
export async function deleteProfilePictureAction(): Promise<
  ActionResult<void>
> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await authService.deleteProfilePicture(token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Change password action
 */
export async function changePasswordAction(
  data: ChangePasswordCommand,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await authService.changePassword(data, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Get dashboard statistics action
 */
export async function getDashboardStatsAction(): Promise<
  ActionResult<UserDashboardStatsDto>
> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const stats = await authService.getDashboardStats(token, locale);
    return { success: true, data: stats };
  });
}

/**
 * Get current user action (from JWT token claims)
 *
 * This calls GET /api/auth/me which returns user info from the token.
 * Different from getProfileAction which fetches full user profile.
 */
export async function getCurrentUserAction(): Promise<
  ActionResult<CurrentUserResponse>
> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const user = await authService.getCurrentUser(token, locale);
    return { success: true, data: user };
  });
}

/**
 * Check authentication status (helper for server components)
 */
export async function checkAuthAction(): Promise<boolean> {
  return isAuthenticated();
}

/**
 * Sync local favorites to backend after login
 * Server action that has access to auth cookies
 */
export async function syncFavoritesAction(
  localFavoriteIds: number[],
): Promise<ActionResult<void>> {
  if (localFavoriteIds.length === 0) {
    return { success: true, data: undefined };
  }

  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await favoriteAdService.addFavoriteAd(localFavoriteIds, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Get user's active ads action
 */
export async function getUserActiveAdsAction(
  spec: QuerySpecification,
): Promise<ActionResult<PaginatedResult<PetAdListItemDto>>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const ads = await petAdService.getUserActiveAds(spec, token, locale);
    return { success: true, data: ads };
  });
}

/**
 * Get user's pending ads action
 */
export async function getUserPendingAdsAction(
  spec: QuerySpecification,
): Promise<ActionResult<PaginatedResult<PetAdListItemDto>>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const ads = await petAdService.getUserPendingAds(spec, token, locale);
    return { success: true, data: ads };
  });
}

/**
 * Get user's rejected ads with pagination
 */
export async function getUserRejectedAdsAction(
  spec: QuerySpecification,
): Promise<ActionResult<PaginatedResult<PetAdListItemDto>>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const ads = await petAdService.getUserRejectedAds(spec, token, locale);
    return { success: true, data: ads };
  });
}

/**
 * Get all user's ads (active, pending, rejected) with pagination
 */
export async function getAllUserAdsAction(
  spec: QuerySpecification,
): Promise<ActionResult<PaginatedResult<MyAdListItemDto>>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const ads = await petAdService.getAllUserAds(spec, token, locale);
    return { success: true, data: ads };
  });
}

/**
 * Close/deactivate a pet ad action
 */
export async function closeAdAction(adId: number): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await petAdService.closeAdById(adId, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Get user's favorite ads action
 */
export async function getUserFavoriteAdsAction(
  spec: QuerySpecification,
): Promise<ActionResult<PaginatedResult<PetAdListItemDto>>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const ads = await favoriteAdService.getFavoriteAds(spec, token, locale);
    return { success: true, data: ads };
  });
}

/**
 * Add a pet ad to favorites action
 */
export async function addFavoriteAdAction(
  petAdIds: number[],
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await favoriteAdService.addFavoriteAd(petAdIds, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Remove a pet ad from favorites action
 */
export async function removeFavoriteAdAction(
  petAdId: number,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await favoriteAdService.removeFavoriteAd(petAdId, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Get user's favorite ad IDs only (lightweight for SSR)
 * Returns just the IDs, not full ad data
 */
export async function getFavoriteAdIdsAction(): Promise<
  ActionResult<number[]>
> {
  // Check if user is authenticated
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return { success: true, data: [] };
  }

  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    // Fetch first page with max items to get all IDs
    const spec: QuerySpecification = {
      pagination: { number: 1, size: 1000 },
    };

    const result = await favoriteAdService.getFavoriteAds(spec, token, locale);
    const ids = result.items.map((ad) => ad.id);

    return { success: true, data: ids };
  });
}

/**
 * Delete an uploaded pet ad image
 * Only the user who uploaded the image can delete it, and only if it's not yet attached to an ad
 */
export async function deletePetAdImageAction(
  imageId: number,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await petAdService.deletePetAdImage(imageId, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Submit a new pet advertisement
 *
 * @param data The pet ad submission data with all required fields
 * @returns The ID of the newly created pet ad
 */
export async function submitPetAdAction(
  data: SubmitPetAdCommand,
): Promise<ActionResult<number>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const petAdId = await petAdService.submitPetAd(data, token, locale);
    return { success: true, data: petAdId };
  });
}

/**
 * Update an existing pet advertisement
 *
 * @param data The pet ad update data with all fields including ID
 * @returns Success result with no data payload
 */
export async function updatePetAdAction(
  data: UpdatePetAdCommand,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await petAdService.updatePetAd(data, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Ask a question about a specific pet ad
 * Requires authentication
 *
 * @param adId The ID of the pet ad
 * @param question The question text
 * @returns Success result with no data payload
 */
export async function askQuestionAction(
  adId: number,
  question: string,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const data: AskQuestionCommand = {
      petAdId: adId,
      question,
    };
    await petAdService.askQuestion(adId, data, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Answer a question about a pet ad (owner only)
 * Requires authentication
 *
 * @param questionId The ID of the question to answer
 * @param answer The answer text
 * @returns Success result with no data payload
 */
export async function answerQuestionAction(
  questionId: number,
  answer: string,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const data: AnswerQuestionCommand = {
      questionId,
      answer,
    };
    await petAdService.answerQuestion(questionId, data, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Reply to a question (Facebook-style comment system).
 * Any authenticated user can reply to questions.
 *
 * @param questionId The ID of the question to reply to
 * @param text The reply text
 * @returns Success result with no data payload
 */
export async function replyToQuestionAction(
  questionId: number,
  text: string,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await petAdService.replyToQuestion(questionId, text, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Get all cities with localized names
 * Used by client components that need city data
 *
 * @returns List of cities with localized names
 */
export async function getCitiesAction(): Promise<
  ActionResult<import("../api/types/city.types").CityDto[]>
> {
  const locale = await getCurrentLocale();
  try {
    const { citiesService } = await import("../api/services/cities.service");
    const cities = await citiesService.getCities(locale);
    return { success: true, data: cities };
  } catch (error) {
    return handleActionError(error, "Failed to fetch cities");
  }
}

/**
 * Get breeds for a specific category with localized names
 * Used by client components that need breed data
 *
 * @param categoryId The pet category ID
 * @returns List of breeds for the category with localized names
 */
export async function getPetBreedsAction(
  categoryId: number,
): Promise<ActionResult<import("../api/types/pet-ad.types").PetBreedDto[]>> {
  const locale = await getCurrentLocale();
  try {
    const breeds = await petAdService.getPetBreeds(categoryId, locale);
    return { success: true, data: breeds };
  } catch (error) {
    return handleActionError(error, "Failed to fetch breeds");
  }
}

/**
 * Record a view for a specific pet ad
 * Used to track user's recently viewed ads
 *
 * @param adId The ID of the pet ad to record a view for
 * @returns Success status
 */
export async function recordViewAction(
  adId: number,
): Promise<ActionResult<void>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    await petAdService.recordView(adId, token, locale);
    return { success: true, data: undefined };
  });
}

/**
 * Increment view count for a pet ad (anonymous access allowed)
 * Used to track ad popularity
 *
 * @param adId The ID of the pet ad
 * @returns Success status
 */
export async function incrementViewCountAction(
  adId: number,
): Promise<ActionResult<void>> {
  try {
    const locale = await getCurrentLocale();
    await petAdService.incrementViewCount(adId, locale);
    return { success: true, data: undefined };
  } catch (error) {
    return handleActionError(error, "Failed to increment view count");
  }
}

/**
 * Get recently viewed pet ads for the current user
 * Used to display user's recently viewed ads
 *
 * @param query Query specification for pagination and filtering
 * @returns Paginated result of recently viewed pet ads
 */
export async function getRecentlyViewedAdsAction(
  query: QuerySpecification,
): Promise<ActionResult<PaginatedResult<PetAdListItemDto>>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const result = await petAdService.getRecentlyViewedAds(
      query,
      token,
      locale,
    );
    return { success: true, data: result };
  });
}

/**
 * Get detailed information for a specific user's ad
 * **Authorization**: Required - user must own the ad
 */
export async function getMyPetAdAction(
  petAdId: number,
): Promise<ActionResult<MyPetAdDto>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const result = await petAdService.getMyPetAd(petAdId, token, locale);
    return { success: true, data: result };
  });
}

/**
 * Get questions for the current user's ads
 * Returns paginated list of questions with ad details
 * **Authorization**: Required
 *
 * @param query Query specification for pagination and filtering
 * @returns Paginated result of questions asked about user's ads
 */
export async function getMyAdsQuestionsAction(
  query: QuerySpecification,
): Promise<ActionResult<PaginatedResult<MyAdQuestionDto>>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const result = await petAdService.getMyAdsQuestions(query, token, locale);
    return { success: true, data: result };
  });
}

/**
 * Get summary statistics for the current user's ad questions
 * Shows total questions, unanswered count, and latest activity
 * **Authorization**: Required
 *
 * @returns Summary statistics for user's ad questions
 */
export async function getMyAdsQuestionsSummaryAction(): Promise<
  ActionResult<MyAdQuestionsSummaryDto>
> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const result = await petAdService.getMyAdsQuestionsSummary(token, locale);
    return { success: true, data: result };
  });
}

/**
 * Send a message to a pet ad owner
 * **Authorization**: Required
 */
export interface SendMessageCommand {
  receiverId: string;
  petAdId: number;
  content: string;
}

export async function sendMessageAction(
  data: SendMessageCommand,
): Promise<ActionResult<{ conversationId: number }>> {
  const locale = await getCurrentLocale();
  return withAuth(async (token) => {
    const { messageService } = await import("../api/services/message.service");
    const result = await messageService.sendMessage(data, token, locale);
    return { success: true, data: result };
  });
}
