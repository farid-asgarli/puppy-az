import { ApiError } from "../core/base-client";

/**
 * Formatted error message for user display
 */
export interface FormattedError {
  /** Primary error message */
  message: string;
  /** Additional error details (validation errors, etc.) */
  details?: string[];
  /** HTTP status code */
  statusCode: number;
  /** Error title/category */
  title?: string;
  /** Trace ID for debugging */
  traceId?: string;
}

/**
 * Check if error message indicates a network/connection issue
 */
export function isNetworkError(message: string): boolean {
  const networkErrorPatterns = [
    "fetch failed",
    "network error",
    "failed to fetch",
    "net::",
    "econnrefused",
    "enotfound",
    "etimedout",
    "unable to connect",
    "connection refused",
    "network request failed",
  ];
  const lowerMessage = message.toLowerCase();
  return networkErrorPatterns.some((pattern) => lowerMessage.includes(pattern));
}

/**
 * Extract user-friendly error message from API error
 */
export function formatApiError(error: unknown): FormattedError {
  // Handle ApiError instances OR objects that look like ApiError (for Server Actions serialization)
  if (
    error instanceof ApiError ||
    (error &&
      typeof error === "object" &&
      "details" in error &&
      "status" in error)
  ) {
    const apiError = error as ApiError;
    const problemDetails = apiError.details;

    // Check for network errors (status 0)
    if (apiError.status === 0) {
      return {
        message:
          "Serverə qoşulmaq mümkün olmadı. İnternet bağlantınızı yoxlayın və yenidən cəhd edin.",
        statusCode: 0,
      };
    }

    // Check for timeout errors
    if (apiError.status === 408) {
      return {
        message: "Sorğu vaxtı bitdi. Zəhmət olmasa yenidən cəhd edin.",
        statusCode: 408,
      };
    }

    if (problemDetails) {
      const details = extractErrorDetails(problemDetails.errors);

      // If we have specific validation errors, don't show the generic message
      const message =
        details && details.length > 0
          ? "" // Empty message when we have specific details
          : problemDetails.detail || problemDetails.title || apiError.message;

      return {
        message,
        details,
        statusCode: problemDetails.status || apiError.status,
        title: problemDetails.title,
        traceId: problemDetails.traceId,
      };
    }

    return {
      message: apiError.message,
      statusCode: apiError.status,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Check if it's a network error
    if (isNetworkError(error.message)) {
      return {
        message:
          "Serverə qoşulmaq mümkün olmadı. İnternet bağlantınızı yoxlayın və yenidən cəhd edin.",
        statusCode: 0,
      };
    }

    return {
      message: error.message,
      statusCode: 500,
    };
  }

  // Unknown error
  return {
    message: "Gözlənilməz xəta baş verdi",
    statusCode: 500,
  };
}

/**
 * Extract validation errors from ProblemDetails
 */
function extractErrorDetails(
  errors?: string[] | Record<string, string[]>,
): string[] | undefined {
  if (!errors) return undefined;

  // Array of strings (simple error list)
  if (Array.isArray(errors)) {
    return errors;
  }

  // Dictionary of field errors (validation errors)
  const errorList: string[] = [];
  for (const [, fieldErrors] of Object.entries(errors)) {
    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach((err) => {
        // Don't include field name - the error message is already descriptive
        errorList.push(err);
      });
    }
  }

  return errorList.length > 0 ? errorList : undefined;
}

/**
 * Get localized error message based on status code
 */
export function getLocalizedErrorMessage(
  statusCode: number,
  defaultMessage?: string,
): string {
  const messages: Record<number, string> = {
    0: "Serverə qoşulmaq mümkün olmadı. İnternet bağlantınızı yoxlayın.",
    400: "Yanlış sorğu. Zəhmət olmasa məlumatları yoxlayın.",
    401: "Giriş tələb olunur. Zəhmət olmasa hesabınıza daxil olun.",
    403: "Bu əməliyyat üçün icazəniz yoxdur.",
    404: "Axtardığınız məlumat tapılmadı.",
    408: "Sorğu vaxtı bitdi. Zəhmət olmasa yenidən cəhd edin.",
    409: "Bu əməliyyat mövcud məlumatlarla ziddiyyət təşkil edir.",
    422: "Göndərilən məlumatlar düzgün deyil.",
    500: "Server xətası baş verdi. Zəhmət olmasa sonra yenidən cəhd edin.",
    503: "Xidmət müvəqqəti olaraq əlçatan deyil.",
  };

  return messages[statusCode] || defaultMessage || "Xəta baş verdi";
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401;
  }
  return false;
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 400 || error.status === 422;
  }
  return false;
}

/**
 * Check if error is not found error
 */
export function isNotFoundError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 404;
  }
  return false;
}

/**
 * Check if error is conflict error
 */
export function isConflictError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 409;
  }
  return false;
}

/**
 * Get user-friendly error message with fallback to localized message
 */
export function getUserErrorMessage(error: unknown): string {
  const formatted = formatApiError(error);

  // Use the detail from problem details, or fallback to localized message
  if (formatted.message && formatted.message !== formatted.title) {
    return formatted.message;
  }

  return getLocalizedErrorMessage(formatted.statusCode, formatted.message);
}

/**
 * Format validation errors for form display
 * Returns a map of field names to error messages
 */
export function formatValidationErrors(
  error: unknown,
): Record<string, string> | null {
  if (!(error instanceof ApiError) || !error.details?.errors) {
    return null;
  }

  const errors = error.details.errors;
  const formErrors: Record<string, string> = {};

  // Handle array of strings (no field mapping)
  if (Array.isArray(errors)) {
    formErrors._general = errors.join(", ");
    return formErrors;
  }

  // Handle dictionary of field errors
  for (const [field, fieldErrors] of Object.entries(errors)) {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      // Convert field name to camelCase for form compatibility
      const camelField = field.charAt(0).toLowerCase() + field.slice(1);
      formErrors[camelField] = fieldErrors[0]; // Take first error for simplicity
    }
  }

  return Object.keys(formErrors).length > 0 ? formErrors : null;
}

/**
 * Log error with context (useful for debugging)
 */
export function logApiError(error: unknown, context?: string): void {
  const formatted = formatApiError(error);

  console.error("[API Error]", {
    context,
    message: formatted.message,
    statusCode: formatted.statusCode,
    title: formatted.title,
    details: formatted.details,
    traceId: formatted.traceId,
  });
}
