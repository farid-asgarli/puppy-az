export interface UserRight {
  /**
   * Bold label for the right (e.g., "Məlumat əldə etmək")
   */
  label: string;
  /**
   * Description of what the right allows
   */
  description: string;
}

export interface UserRightsListProps {
  /**
   * Array of user rights to display
   */
  rights: UserRight[];
  /**
   * Optional className for the container
   */
  className?: string;
}
