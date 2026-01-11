import { ReactNode } from 'react';

/**
 * Variant styles for ActionCard
 */
export type ActionCardVariant = 'primary' | 'secondary';

/**
 * Props for ActionCard component
 */
export interface ActionCardProps {
  /**
   * Card title
   */
  title: string;

  /**
   * Card description
   */
  description: string;

  /**
   * Icon (ReactNode for SVG component or emoji string)
   */
  icon: ReactNode;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Visual variant
   * - primary: Black border on hover, prominent styling
   * - secondary: Gray border on hover, subtle styling
   * @default 'primary'
   */
  variant?: ActionCardVariant;

  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
