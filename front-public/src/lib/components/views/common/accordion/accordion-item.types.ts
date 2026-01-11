import type { Icon } from '@tabler/icons-react';

export interface AccordionItemProps {
  /**
   * Unique identifier for the accordion item (used for aria-controls)
   */
  id: string;

  /**
   * Title text or React node displayed in the header
   */
  title: string | React.ReactNode;

  /**
   * Optional Tabler icon component to display in the header
   */
  icon?: Icon;

  /**
   * Content to display when expanded
   */
  children: React.ReactNode;

  /**
   * Whether the item is currently expanded (controlled mode)
   */
  isExpanded?: boolean;

  /**
   * Whether the item is expanded by default (uncontrolled mode)
   * Only used when isExpanded is not provided
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Callback when the accordion item is toggled
   */
  onToggle?: () => void;

  /**
   * Whether to use Framer Motion animations
   * @default false
   */
  animated?: boolean;

  /**
   * Visual variant of the accordion
   * - 'bordered': Full border with rounded corners (default)
   * - 'borderless': No border, suitable for use inside bordered containers
   * @default 'bordered'
   */
  variant?: 'bordered' | 'borderless';

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Additional CSS classes for the header button
   */
  headerClassName?: string;

  /**
   * Additional CSS classes for the content area
   */
  contentClassName?: string;
}
