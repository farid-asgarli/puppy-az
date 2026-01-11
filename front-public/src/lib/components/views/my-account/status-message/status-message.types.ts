export interface StatusMessageProps {
  /**
   * Visual style and semantic meaning of the message
   */
  variant: 'success' | 'error' | 'warning' | 'info';

  /**
   * Bold title text
   */
  title: string;

  /**
   * Descriptive message text
   */
  message: string;

  /**
   * Custom icon to override the default variant icon
   */
  icon?: React.ReactNode;

  /**
   * Callback when the dismiss button is clicked
   * If provided, a dismiss button will be shown
   */
  onDismiss?: () => void;

  /**
   * Additional CSS classes for the message container
   */
  className?: string;

  /**
   * ARIA live region politeness level
   * @default 'polite' for success/info, 'assertive' for error/warning
   */
  ariaLive?: 'polite' | 'assertive' | 'off';
}
