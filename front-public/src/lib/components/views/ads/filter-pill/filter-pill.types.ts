export interface FilterPillProps {
  /**
   * Filter label (e.g., "Kateqoriya", "Qiymət")
   */
  label: string;

  /**
   * Filter value (e.g., "Köpək", "100-500 ₼")
   */
  value: string;

  /**
   * Remove handler
   */
  onRemove: () => void;

  /**
   * Whether the pill is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
