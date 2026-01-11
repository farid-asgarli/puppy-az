export type CarouselNavDirection = 'prev' | 'next';
export type CarouselNavSize = 'sm' | 'md' | 'lg';

export interface CarouselNavButtonProps {
  /**
   * Navigation direction
   */
  direction: CarouselNavDirection;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Button size variant
   * @default 'md'
   */
  size?: CarouselNavSize;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label override
   */
  ariaLabel?: string;
}
