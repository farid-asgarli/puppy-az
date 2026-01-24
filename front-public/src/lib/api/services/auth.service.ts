import { BaseService } from "../core/base-service";
import type {
  LoginWithEmailCommand,
  RegisterCommand,
  SendVerificationCodeCommand,
  AuthenticationResponse,
  UserProfileDto,
  UserDashboardStatsDto,
  UpdateUserProfileCommand,
  ChangePasswordCommand,
  CurrentUserResponse,
  LoginWithMobileCommand,
} from "../types/auth.types";

/**
 * Authentication service
 * Handles all auth-related API calls
 */
export class AuthService extends BaseService {
  /**
   * Login with email and password
   */
  async loginWithEmail(
    credentials: LoginWithEmailCommand,
    locale?: string,
  ): Promise<AuthenticationResponse> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<AuthenticationResponse>(
      "/api/auth/login-with-email",
      credentials,
      context,
    );
  }

  /**
   * Login with phone number
   */
  async loginWithMobile(
    credentials: LoginWithMobileCommand,
    locale?: string,
  ): Promise<AuthenticationResponse> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<AuthenticationResponse>(
      "/api/auth/login-with-mobile",
      credentials,
      context,
    );
  }

  /**
   * Register new user
   */
  async register(
    data: RegisterCommand,
    locale?: string,
  ): Promise<AuthenticationResponse> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<AuthenticationResponse>(
      "/api/auth/register",
      data,
      context,
    );
  }

  /**
   * Send verification code to phone number
   */
  async sendVerificationCode(
    data: SendVerificationCodeCommand,
    locale?: string,
  ): Promise<void> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<void>(
      "/api/auth/send-verification-code",
      data,
      context,
    );
  }

  /**
   * Get current user profile (requires auth token)
   */
  async getProfile(token: string, locale?: string): Promise<UserProfileDto> {
    return this.http.get<UserProfileDto>(
      "/api/users/profile",
      this.withAuth(token, locale),
    );
  }

  /**
   * Update user profile (requires auth token)
   */
  async updateProfile(
    data: UpdateUserProfileCommand,
    token: string,
    locale?: string,
  ): Promise<UserProfileDto> {
    return this.http.put<UserProfileDto>(
      "/api/users/profile",
      data,
      this.withAuth(token, locale),
    );
  }

  /**
   * Change password (requires auth token)
   */
  async changePassword(
    data: ChangePasswordCommand,
    token: string,
    locale?: string,
  ): Promise<void> {
    return this.http.post<void>(
      "/api/users/change-password",
      data,
      this.withAuth(token, locale),
    );
  }

  /**
   * Get user dashboard statistics (requires auth token)
   */
  async getDashboardStats(
    token: string,
    locale?: string,
  ): Promise<UserDashboardStatsDto> {
    return this.http.get<UserDashboardStatsDto>(
      "/api/users/dashboard/stats",
      this.withAuth(token, locale),
    );
  }

  /**
   * Refresh access token using refresh token from httpOnly cookie
   *
   * The backend reads the refreshToken from the httpOnly cookie automatically.
   * Returns new access token and refresh token.
   */
  async refreshToken(): Promise<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      "/api/auth/refresh",
      undefined,
    );
  }

  /**
   * Logout and invalidate refresh token
   *
   * Requires auth token. Backend will clear the refreshToken httpOnly cookie.
   */
  async logout(token: string, locale?: string): Promise<void> {
    return this.http.post<void>(
      "/api/auth/logout",
      undefined,
      this.withAuth(token, locale),
    );
  }

  /**
   * Get current authenticated user information
   *
   * Returns user details from the JWT token (user ID, email, name, roles).
   */
  async getCurrentUser(
    token: string,
    locale?: string,
  ): Promise<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(
      "/api/auth/me",
      this.withAuth(token, locale),
    );
  }

  /**
   * Request password reset
   * Sends a reset link to the user's email
   */
  async forgotPassword(email: string, locale?: string): Promise<void> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<void>(
      "/api/auth/forgot-password",
      { email },
      context,
    );
  }

  /**
   * Verify reset token validity
   */
  async verifyResetToken(
    token: string,
    locale?: string,
  ): Promise<{ valid: boolean }> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<{ valid: boolean }>(
      "/api/auth/verify-reset-token",
      { token },
      context,
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string,
    locale?: string,
  ): Promise<void> {
    const context = locale ? this.withLocale(locale) : this.noContext();
    return this.http.post<void>(
      "/api/auth/reset-password",
      { token, newPassword },
      context,
    );
  }
}

/**
 * Singleton auth service instance
 */
export const authService = new AuthService();
