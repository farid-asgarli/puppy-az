'use client';

import { cn } from '@/lib/external/utils';
import { Text } from '@/lib/primitives/typography';
import type { TextVariant, TextWeight } from '@/lib/primitives/typography/typography.types';
import { BadgeProps } from './badge.types';

/**
 * Badge Component
 *
 * Reusable badge/tag component for displaying labels with icons.
 * Supports multiple variants for different contexts:
 * - premium: Purple badge with crown icon
 * - ad-type: Colored badges for ad types (sell, adopt, etc.)
 * - meta: Gray metadata tags (location, views, dates)
 * - status: Status indicators
 */
export function Badge({ variant = 'meta', icon: Icon, children, color, size = 'md', className }: BadgeProps) {
  // Get variant-specific styles
  const getVariantStyles = (): { container: string; iconSize: number; textVariant: TextVariant; textWeight: TextWeight } => {
    switch (variant) {
      case 'premium': {
        const textVariant: TextVariant = size === 'sm' ? 'tiny' : size === 'md' ? 'small' : 'body';
        return {
          container: cn(
            'inline-flex items-center gap-1.5 sm:gap-2 border-2 rounded-xl',
            'bg-premium-50 border-premium-200 text-premium-700',
            size === 'sm' && 'px-2 py-1 text-xs sm:text-sm',
            size === 'md' && 'px-2.5 py-1.5 sm:px-3 sm:py-2',
            size === 'lg' && 'px-3 py-2 sm:px-4 sm:py-2.5'
          ),
          iconSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18,
          textVariant,
          textWeight: 'semibold',
        };
      }

      case 'ad-type': {
        const textVariant: TextVariant = size === 'sm' ? 'small' : 'body';
        return {
          container: cn(
            'inline-flex items-center gap-1.5 sm:gap-2 border-2 rounded-xl',
            color?.text || 'text-gray-700',
            color?.bg || 'bg-gray-100',
            color?.border || 'border-current/20',
            size === 'sm' && 'px-2.5 py-1 sm:px-3 sm:py-1.5',
            size === 'md' && 'px-3 py-2 sm:px-4 sm:py-2.5',
            size === 'lg' && 'px-3 py-2 sm:px-4 sm:py-2.5'
          ),
          iconSize: size === 'sm' ? 14 : size === 'md' ? 18 : 18,
          textVariant,
          textWeight: 'semibold',
        };
      }

      case 'status':
        return {
          container: cn(
            'inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border-2',
            color?.text || 'text-gray-700',
            color?.bg || 'bg-gray-100',
            color?.border || 'border-gray-200'
          ),
          iconSize: 14,
          textVariant: 'small',
          textWeight: 'medium',
        };

      case 'meta':
      default: {
        const textVariant: TextVariant = size === 'sm' ? 'tiny' : size === 'md' ? 'small' : 'body';
        return {
          container: cn(
            'inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl',
            'bg-gray-50 border-2 border-gray-200 text-gray-700'
          ),
          iconSize: size === 'sm' ? 14 : 16,
          textVariant,
          textWeight: 'medium',
        };
      }
    }
  };

  const getIconSizeClass = () => {
    switch (variant) {
      case 'premium':
        return size === 'sm' ? 'sm:w-4 sm:h-4' : size === 'md' ? 'sm:w-[18px] sm:h-[18px]' : 'sm:w-5 sm:h-5';
      case 'ad-type':
        return size === 'sm' ? 'sm:w-4 sm:h-4' : 'sm:w-5 sm:h-5';
      case 'status':
        return 'sm:w-4 sm:h-4';
      case 'meta':
      default:
        return size === 'sm' ? 'sm:w-4 sm:h-4' : 'sm:w-[18px] sm:h-[18px]';
    }
  };

  const styles = getVariantStyles();
  const iconSizeClass = getIconSizeClass();

  return (
    <div className={cn(styles.container, className)}>
      {Icon && <Icon size={styles.iconSize} className={iconSizeClass} />}
      <Text variant={styles.textVariant} weight={styles.textWeight} as="span">
        {children}
      </Text>
    </div>
  );
}
