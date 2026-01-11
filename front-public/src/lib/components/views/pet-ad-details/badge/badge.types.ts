/**
 * Color configuration for badges
 */
export interface BadgeColor {
  /**
   * Text color (Tailwind class)
   */
  text: string;

  /**
   * Background color (Tailwind class)
   */
  bg: string;

  /**
   * Border color (Tailwind class, optional)
   */
  border?: string;
}

export interface BadgeProps {
  /**
   * Visual variant of the badge
   * - 'premium': Purple premium badge with crown icon
   * - 'ad-type': Colored badge for ad type (sell, adopt, mate, lost/found)
   * - 'meta': Gray metadata tags (location, views, date)
   * - 'status': Status indicators
   */
  variant?: 'premium' | 'ad-type' | 'meta' | 'status';

  /**
   * Icon component to display (optional)
   */
  icon?: React.ComponentType<{ size?: number; className?: string }>;

  /**
   * Badge content (text)
   */
  children: React.ReactNode;

  /**
   * Custom color configuration
   * Required for 'ad-type' variant, optional for others
   */
  color?: BadgeColor;

  /**
   * Size variant
   * - 'sm': Small (compact for sticky header)
   * - 'md': Medium (default)
   * - 'lg': Large (prominent display)
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;
}
