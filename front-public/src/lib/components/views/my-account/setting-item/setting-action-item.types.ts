export interface SettingActionItemProps {
  /**
   * Icon component from tabler-icons
   */
  icon: React.ElementType;

  /**
   * Primary title for the action
   */
  title: string;

  /**
   * Descriptive text explaining the action
   */
  description: string;

  /**
   * Label text for the action button
   */
  actionLabel: string;

  /**
   * Visual style of the action button
   * @default 'primary'
   */
  actionVariant?: 'primary' | 'secondary' | 'danger';

  /**
   * Callback when the action button is clicked
   */
  onAction: () => void;

  /**
   * Whether the action is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the action is in a loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}
