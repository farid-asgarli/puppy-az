export interface StatCardProps {
  /**
   * Icon component from tabler-icons
   */
  icon: React.ElementType;

  /**
   * Stat value (number or string)
   */
  value: string;

  /**
   * Label describing the stat
   */
  label: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
