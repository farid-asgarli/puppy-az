export type SearchInputSize = 'md' | 'lg';

export interface SearchInputProps {
  /**
   * Search input value
   */
  value: string;

  /**
   * Callback when value changes
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text
   * @default 'Axtar...'
   */
  placeholder?: string;

  /**
   * Whether input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Input size variant
   * - md: h-12 (default)
   * - lg: h-14 (larger for hero sections)
   * @default 'md'
   */
  size?: SearchInputSize;

  /**
   * Maximum width constraint for the container
   * Useful when you want to limit search input width
   * @example 'max-w-md', 'max-w-lg'
   */
  maxWidth?: string;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
