import { ReactNode } from 'react';

/**
 * Size variants for OptionCard
 */
export type OptionCardSize = 'sm' | 'md' | 'lg';

/**
 * Layout variants for OptionCard
 */
export type OptionCardLayout = 'horizontal' | 'vertical';

/**
 * Props for OptionCard component
 */
export interface OptionCardProps {
  /**
   * Whether the card is currently selected
   */
  selected: boolean;

  /**
   * Callback when the card is clicked
   */
  onClick: () => void;

  /**
   * Title text (required)
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Optional icon (emoji string or ReactNode for SVG)
   */
  icon?: ReactNode | string;

  /**
   * Whether to show the radio-style checkmark indicator
   * @default true
   */
  showCheckmark?: boolean;

  /**
   * Size of the card
   * @default 'md'
   */
  size?: OptionCardSize;

  /**
   * Layout direction
   * @default 'horizontal'
   */
  layout?: OptionCardLayout;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional metadata text (e.g., "5 active listings")
   */
  metadata?: string;

  /**
   * Custom content to render inside the card (overrides title/description)
   */
  children?: ReactNode;
}
