// Generated from Swagger API definition
// Base URL: http://localhost:5005

/**
 * Login credentials email/password
 */
export interface LoginWithEmailCommand {
  email: string;
  password: string;
}

/**
 * Login credentials
 */
export interface LoginWithMobileCommand {
  phoneNumber: string;
  verificationCode: string;
}

/**
 * Registration data
 */
export interface RegisterCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  verificationCode: string;
}

/**
 * Send verification code to phone number
 */
export interface SendVerificationCodeCommand {
  phoneNumber: string;
  purpose: 'Registration' | 'Login' | 'PasswordReset';
}

/**
 * Change password command
 */
export interface ChangePasswordCommand {
  currentPassword: string;
  newPassword: string;
}

/**
 * Authentication response with tokens
 */
export interface AuthenticationResponse {
  userId: string; // UUID format
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO date-time
}

/**
 * User profile information
 */
export interface UserProfileDto {
  id: string; // UUID format
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  createdAt: string; // ISO date-time
  lastLoginAt: string | null; // ISO date-time
}

/**
 * Update user profile command
 */
export interface UpdateUserProfileCommand {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl?: string;
}

/**
 * User dashboard statistics
 */
export interface UserDashboardStatsDto {
  totalAdCount: number;
  activeAdCount: number;
  pendingAdCount: number;
  rejectedAdCount: number;
  totalViews: number;
  totalFavoriteCount: number;
  unansweredQuestionCount: number;
}

/**
 * Current user response from GET /api/auth/me
 * Based on backend controller GetCurrentUser method
 */
export interface CurrentUserResponse {
  userId: string;
  email: string;
  userName: string;
  roles: string[];
  userType: string;
}

/**
 * API error response following RFC 7807 Problem Details standard
 * Matches the .NET backend ProblemDetails format
 */
export interface ProblemDetails {
  /** A URI reference that identifies the problem type */
  type?: string;
  /** A short, human-readable summary of the problem type */
  title?: string;
  /** The HTTP status code */
  status?: number;
  /** A human-readable explanation specific to this occurrence */
  detail?: string;
  /** A URI reference that identifies the specific occurrence */
  instance?: string;
  /** Trace ID for debugging (added by backend) */
  traceId?: string;
  /** Timestamp when error occurred (added by backend) */
  timestamp?: string;
  /** Multiple validation errors as array of strings */
  errors?: string[] | Record<string, string[]>;
  /** Allow other extensions */
  [key: string]: any;
}

/**
 * API response wrapper for typed responses
 */
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: ProblemDetails };
