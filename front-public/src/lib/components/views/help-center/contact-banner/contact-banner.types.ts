export interface ContactBannerProps {
  /**
   * Main title text
   */
  title: string;

  /**
   * Description text
   */
  description: string;

  /**
   * Email address
   */
  email: string;

  /**
   * Phone number
   */
  phone: string;

  /**
   * Working hours text
   */
  workingHours: string;

  /**
   * Icon for the banner header
   */
  icon?: React.ElementType;

  /**
   * Additional CSS classes
   */
  className?: string;
}
