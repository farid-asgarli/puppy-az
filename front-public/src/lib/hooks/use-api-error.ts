'use client';

import { useCallback } from 'react';
import { formatApiError, getUserErrorMessage, formatValidationErrors } from '@/lib/api/utils/error-handler';
import type { FormattedError } from '@/lib/api/utils/error-handler';

/**
 * Hook for handling and displaying API errors
 */
export function useApiError() {
  /**
   * Format error for display
   */
  const format = useCallback((error: unknown): FormattedError => {
    return formatApiError(error);
  }, []);

  /**
   * Get simple error message for display
   */
  const getMessage = useCallback((error: unknown): string => {
    return getUserErrorMessage(error);
  }, []);

  /**
   * Get validation errors formatted for forms
   */
  const getValidationErrors = useCallback((error: unknown): Record<string, string> | null => {
    return formatValidationErrors(error);
  }, []);

  /**
   * Check if error has validation details
   */
  const hasValidationErrors = useCallback((error: unknown): boolean => {
    const formatted = formatApiError(error);
    return formatted.statusCode === 400 || formatted.statusCode === 422;
  }, []);

  /**
   * Check if error is authentication error
   */
  const isAuthError = useCallback((error: unknown): boolean => {
    const formatted = formatApiError(error);
    return formatted.statusCode === 401;
  }, []);

  return {
    format,
    getMessage,
    getValidationErrors,
    hasValidationErrors,
    isAuthError,
  };
}
