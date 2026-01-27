import { formatApiError, logApiError } from "../api/utils/error-handler";
import { getAccessToken } from "./cookies";

/**
 * Result type for server actions
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: string[] };

/**
 * Centralized error handler for auth actions
 * Uses the new error handler utility for consistent error formatting
 */
export function handleActionError(
  error: unknown,
  defaultMessage?: string,
): { success: false; error: string; details?: string[] } {
  // Server Actions serialize errors, so we need to handle both ApiError instances
  // and plain objects that look like ApiError
  let errorMessage = defaultMessage || "Əməliyyat uğursuz oldu";
  let errorDetails: string[] | undefined;

  // Debug log
  console.log("[DEBUG] handleActionError received error:", error);

  if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;

    // Check if it has details with problemDetails structure
    if (errorObj.details && typeof errorObj.details === "object") {
      const details = errorObj.details as Record<string, unknown>;
      // Get message from problemDetails.detail
      if (details.detail && typeof details.detail === "string") {
        errorMessage = details.detail;
        console.log("[DEBUG] Found detail message:", errorMessage);
      } else if (details.title && typeof details.title === "string") {
        errorMessage = details.title;
      }
      // Extract errors array if present
      if (details.errors) {
        errorDetails = extractErrorDetails(details.errors);
      }
    }
    // Fallback to message property
    else if (errorObj.message && typeof errorObj.message === "string") {
      errorMessage = errorObj.message;
      console.log("[DEBUG] Found message:", errorMessage);
    }
  }

  // Also try formatApiError for properly typed errors
  const formatted = formatApiError(error);
  console.log("[DEBUG] formatted result:", JSON.stringify(formatted, null, 2));

  // Use formatted message if it's not empty and not the default
  if (formatted.message && formatted.message !== "Gözlənilməz xəta baş verdi") {
    errorMessage = formatted.message;
  }
  if (formatted.details && formatted.details.length > 0) {
    errorDetails = formatted.details;
  }

  // Log error for debugging (server-side only)
  if (typeof window === "undefined") {
    logApiError(error, "Server Action");
  }

  return {
    success: false,
    error: errorMessage,
    details: errorDetails,
  };
}

/**
 * Helper to extract error details from various formats
 */
function extractErrorDetails(errors: unknown): string[] | undefined {
  if (!errors) return undefined;

  if (Array.isArray(errors)) {
    return errors.filter((e) => typeof e === "string");
  }

  if (typeof errors === "object") {
    const errorList: string[] = [];
    for (const [, fieldErrors] of Object.entries(errors)) {
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((err) => {
          if (typeof err === "string") {
            errorList.push(err);
          }
        });
      }
    }
    return errorList.length > 0 ? errorList : undefined;
  }

  return undefined;
}

/**
 * Wrapper for authenticated actions
 * Automatically handles token retrieval and validation
 *
 * Usage:
 * ```typescript
 * export async function someAction(data: SomeData) {
 *   return withAuth(async (token) => {
 *     const result = await someService.doSomething(data, token);
 *     return { success: true, data: result };
 *   });
 * }
 * ```
 */
export async function withAuth<T>(
  action: (token: string) => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    return await action(token);
  } catch (error) {
    return handleActionError(error, "Əməliyyat uğursuz oldu");
  }
}

// JWT utilities have been moved to jwt-utils.ts to avoid mixing server and client code
// Re-export for backward compatibility
export { JwtUtils } from "./jwt-utils";
