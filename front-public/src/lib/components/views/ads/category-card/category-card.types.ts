import type { PetCategoryDetailedDto } from '@/lib/api/types/pet-ad.types';

export type CategoryCardVariant = 'full' | 'compact' | 'pill';

export interface CategoryCardProps {
  /**
   * Category data from API
   */
  category: PetCategoryDetailedDto;

  /**
   * Link URL (if not provided, uses onClick)
   */
  href?: string;

  /**
   * Display variant
   * - full: Desktop card with icon, title, subtitle, count badge
   * - compact: Smaller card without subtitle
   * - pill: Mobile compact pill
   * @default 'full'
   */
  variant?: CategoryCardVariant;

  /**
   * Whether to show ad count
   * @default true
   */
  showCount?: boolean;

  /**
   * Click handler (alternative to href)
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
