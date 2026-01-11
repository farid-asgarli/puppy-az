export interface TeamMemberCardProps {
  /**
   * Member's full name
   */
  name: string;

  /**
   * Job title or role
   */
  role: string;

  /**
   * Brief description about the member
   */
  description: string;

  /**
   * Avatar image URL (optional)
   */
  avatar?: string | null;

  /**
   * Fallback icon when no avatar (optional)
   */
  fallbackIcon?: React.ElementType;

  /**
   * Additional CSS classes
   */
  className?: string;
}
