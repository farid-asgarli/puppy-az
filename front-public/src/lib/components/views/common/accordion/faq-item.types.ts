export interface FAQItemProps {
  /**
   * Question text
   */
  question: string;

  /**
   * Answer text or React node
   */
  answer: string | React.ReactNode;

  /**
   * Whether the FAQ is expanded (controlled mode)
   */
  isExpanded?: boolean;

  /**
   * Whether the FAQ is expanded by default (uncontrolled mode)
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Toggle expansion handler
   */
  onToggle?: () => void;

  /**
   * Whether to use Framer Motion animations
   * @default true
   */
  animated?: boolean;

  /**
   * Visual variant
   * - 'bordered': With border and rounded corners
   * - 'borderless': No border (for use in bordered containers)
   * @default 'borderless'
   */
  variant?: 'bordered' | 'borderless';

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
