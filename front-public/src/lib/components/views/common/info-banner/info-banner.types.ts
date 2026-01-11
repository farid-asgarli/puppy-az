export type InfoBannerVariant = 'default' | 'info' | 'warning' | 'error' | 'success';

export type InfoBannerSize = 'sm' | 'md';

export interface InfoBannerProps {
  /**
   * Visual style variant
   */
  variant: InfoBannerVariant;

  /**
   * Icon component to display (optional - uses default icon if not provided)
   */
  icon?: React.ComponentType<{ size: number; className?: string }>;

  /**
   * Banner title
   */
  title: string;

  /**
   * Banner description text or content
   */
  description?: React.ReactNode;

  /**
   * Optional action button or element
   */
  action?: React.ReactNode;

  /**
   * Size variant
   * - sm: Compact padding (p-4) for inline alerts
   * - md: Standard padding (p-5) for section banners
   * @default 'md'
   */
  size?: InfoBannerSize;

  /**
   * Additional CSS classes
   */
  className?: string;
}
