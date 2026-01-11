export type AdGridVariant = 'standard' | 'compact' | 'large';

export interface AdGridProps {
  /**
   * Grid items (typically ad cards)
   */
  children: React.ReactNode;

  /**
   * Grid variant determines column count and spacing
   * - standard: Up to 6 columns on 2xl screens
   * - compact: More columns, tighter spacing
   * - large: Fewer columns, larger cards
   * @default 'standard'
   */
  variant?: AdGridVariant;

  /**
   * Additional CSS classes
   */
  className?: string;
}
