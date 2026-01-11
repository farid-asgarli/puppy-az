export interface FeatureCardProps {
  /**
   * Icon component from tabler-icons
   */
  icon: React.ElementType;

  /**
   * Feature title
   */
  title: string;

  /**
   * Feature description
   */
  description: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}
