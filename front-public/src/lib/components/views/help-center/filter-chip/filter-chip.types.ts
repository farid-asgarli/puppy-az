export interface FilterChipProps {
  /**
   * Chip label text
   */
  label: string;

  /**
   * Whether the chip is selected
   */
  selected: boolean;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Optional icon
   */
  icon?: React.ElementType;

  /**
   * Additional CSS classes
   */
  className?: string;
}
