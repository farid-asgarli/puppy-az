export interface AccountMenuItemProps {
  /**
   * Icon component from tabler-icons
   */
  icon: React.ElementType;

  /**
   * Primary title/label for the menu item
   */
  title: string;

  /**
   * Descriptive subtitle text
   */
  subtitle: string;

  /**
   * Navigation URL
   */
  href: string;

  /**
   * Whether this is a premium feature
   * @default false
   */
  premium?: boolean;

  /**
   * Optional badge text or number to display
   */
  badge?: string | number;

  /**
   * Optional click handler (in addition to navigation)
   */
  onClick?: () => void;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
