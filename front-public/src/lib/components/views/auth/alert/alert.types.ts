export type AuthAlertVariant = 'error' | 'success' | 'info';

export interface AuthAlertProps {
  /**
   * Visual style variant
   */
  variant: AuthAlertVariant;

  /**
   * Main alert message
   */
  message: string;

  /**
   * Optional additional description text
   */
  description?: string;

  /**
   * Optional detailed error messages (e.g., validation errors from ProblemDetails)
   */
  details?: string[];

  /**
   * Additional CSS classes
   */
  className?: string;
}
