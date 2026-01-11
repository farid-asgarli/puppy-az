'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import type { CarouselNavButtonProps, CarouselNavSize } from './carousel-nav-button.types';
import { useTranslations } from 'next-intl';

const sizeStyles: Record<CarouselNavSize, { button: string; icon: number }> = {
  sm: {
    button: 'w-7 h-7',
    icon: 16,
  },
  md: {
    button: 'w-8 h-8',
    icon: 18,
  },
  lg: {
    button: 'w-10 h-10',
    icon: 20,
  },
};

/**
 * CarouselNavButton Component
 * Airbnb-style circular navigation button for carousels
 * Provides consistent styling and accessibility for prev/next navigation
 */
export const CarouselNavButton: React.FC<CarouselNavButtonProps> = ({ direction, onClick, disabled = false, size = 'md', className, ariaLabel }) => {
  const Icon = direction === 'prev' ? IconChevronLeft : IconChevronRight;
  const tAccessibility = useTranslations('accessibility');
  const defaultAriaLabel = direction === 'prev' ? tAccessibility('previousSlide') : tAccessibility('nextSlide');
  const styles = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || defaultAriaLabel}
      className={cn(
        'bg-white rounded-full',
        'border border-gray-300 shadow-md',
        'flex items-center justify-center',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
        !disabled && 'hover:shadow-lg hover:scale-105',
        disabled && 'opacity-50 cursor-not-allowed',
        styles.button,
        className
      )}
    >
      <Icon size={styles.icon} className="text-gray-900" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
};

export default CarouselNavButton;
