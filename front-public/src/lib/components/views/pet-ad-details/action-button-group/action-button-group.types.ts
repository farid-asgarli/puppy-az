import { PetAdType } from '@/lib/api';

export interface ActionButtonGroupProps {
  /**
   * Pet ad ID for favorite functionality
   */
  adId: number;

  /**
   * Ad title for sharing
   */
  adTitle: string;

  /**
   * Ad description for sharing
   */
  adDescription: string;

  /**
   * Ad type for displaying badge (optional)
   */
  adType?: PetAdType;

  /**
   * Visual variant of the button group
   * - 'hero': Full-size buttons with back button (used in hero section)
   * - 'sticky': Compact buttons for sticky header
   * - 'compact': Icon-only buttons without back button
   */
  variant?: 'hero' | 'sticky' | 'compact';

  /**
   * Whether the view is in a modal (affects back button behavior)
   * @default false
   */
  isInModal?: boolean;

  /**
   * Whether the component is hydrated (affects favorite state display)
   * @default true
   */
  isHydrated?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}
