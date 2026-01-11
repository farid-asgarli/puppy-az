export interface SettingToggleItemProps {
  /**
   * Icon component from tabler-icons
   */
  icon: React.ElementType;

  /**
   * Primary label for the setting
   */
  label: string;

  /**
   * Descriptive text explaining the setting
   */
  description: string;

  /**
   * Current toggle state
   */
  checked: boolean;

  /**
   * Callback when toggle state changes
   */
  onChange: (checked: boolean) => void;

  /**
   * Whether the toggle is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
