/**
 * Auth module exports
 *
 * Centralized exports for all auth-related functionality
 *
 * Usage:
 * ```typescript
 * import { loginAction, useAuth, type LoginCommand } from '@/lib/auth';
 * ```
 */

// Server Actions (use in client or server components)
export {
  loginWithEmailAction as loginAction,
  registerAction,
  logoutAction,
  sendVerificationCodeAction,
  refreshTokenAction,
  getProfileAction,
  updateProfileAction,
  changePasswordAction,
  getDashboardStatsAction,
  getCurrentUserAction,
  checkAuthAction,
  getAccessTokenAction,
} from './actions';

// Cookie utilities (server-side only)
export { setAuthCookies, getAccessToken, getRefreshToken, getUserId, isAuthenticated, clearAuthCookies, getAuthData, TOKEN_COOKIES } from './cookies';

// Client-side hooks
export { useAuth, useAuthCheck, useUserProfile } from '../hooks/use-auth';

// Auth utilities and helpers
export { handleActionError, withAuth, JwtUtils, type ActionResult } from './utils';

// Auth constants
export { PROTECTED_ROUTES, AUTH_ROUTES, AUTH_REDIRECT_URL, LOGIN_REDIRECT_URL, TOKEN_EXPIRY_BUFFER_SECONDS } from './constants';

// Types (re-export from API types)
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
} from '../api/types/auth.types';
