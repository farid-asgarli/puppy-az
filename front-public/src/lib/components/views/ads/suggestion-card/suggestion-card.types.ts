export interface SuggestionCardProps {
  /**
   * Icon component from tabler-icons
   */
  icon: React.ComponentType<{ size?: number; className?: string }>;

  /**
   * Card title
   */
  title: string;

  /**
   * Card description
   */
  description: string;

  /**
   * Icon background color variant
   * @default 'purple'
   */
  iconBgColor?: 'purple' | 'blue' | 'green' | 'yellow' | 'red';

  /**
   * Additional CSS classes
   */
  className?: string;
}
