/**
 * Color configuration for info cards
 */
export interface InfoCardColor {
  /**
   * Text color (Tailwind class)
   */
  text: string;

  /**
   * Background color (Tailwind class)
   */
  bg: string;
}

export interface InfoCardProps {
  /**
   * Tabler icon component to display
   */
  icon: React.ComponentType<{ size?: number; className?: string }>;

  /**
   * Label/title text
   */
  label: string;

  /**
   * Main value to display
   */
  value: string | number;

  /**
   * Visual variant of the card
   * - 'default': Gray background, standard appearance
   * - 'colored': Custom color scheme with icon background
   * - 'stat': Colored background for statistics
   */
  variant?: 'default' | 'colored' | 'stat';

  /**
   * Custom color configuration (used with 'colored' and 'stat' variants)
   */
  color?: InfoCardColor;

  /**
   * Icon size in pixels
   * @default 22
   */
  iconSize?: number;

  /**
   * Whether the card should have hover effects
   * @default true for 'default' variant, false otherwise
   */
  hoverable?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
