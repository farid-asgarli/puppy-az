export type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'count' | 'filter';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /**
   * Badge style variant
   * - primary: Purple accent background
   * - secondary: Gray background
   * - outline: White with border
   * - count: Gray with icon
   * - filter: Small pill for filter tags
   * @default 'secondary'
   */
  variant?: BadgeVariant;

  /**
   * Optional icon component from tabler-icons
   */
  icon?: React.ComponentType<{ size?: number; className?: string }>;

  /**
   * Badge content
   */
  children: React.ReactNode;

  /**
   * Size variant
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Click handler for interactive badges
   */
  onClick?: () => void;

  /**
   * Whether the badge is interactive
   * @default false
   */
  interactive?: boolean;
}
