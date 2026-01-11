export interface EmptyStateAction {
  /**
   * Button label text
   */
  label: string;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Icon component to display in the button (optional)
   */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export type EmptyStateVariant = 'bordered' | 'borderless';

export interface EmptyStateProps {
  /**
   * Icon component to display
   */
  icon: React.ComponentType<{ size?: number; className?: string }>;

  /**
   * Title text (optional)
   */
  title?: string;

  /**
   * Message/description text
   */
  message: string;

  /**
   * Optional action button configuration
   */
  action?: EmptyStateAction;

  /**
   * Visual variant
   * - 'bordered': With border and padding (rounded box)
   * - 'borderless': No border, minimal padding
   * @default 'borderless'
   */
  variant?: EmptyStateVariant;

  /**
   * Icon size in pixels
   * @default 32
   */
  iconSize?: number;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
