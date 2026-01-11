'use client';

import { cn } from '@/lib/external/utils';
import { Text } from '@/lib/primitives/typography';
import type { InfoCardProps } from './info-card.types';

/**
 * InfoCard Component
 *
 * Reusable card component for displaying icon + label + value information.
 * Used in quick-info and stats sections across the application.
 *
 * Supports three variants:
 * - default: Gray background with hover effect (quick info cards)
 * - colored: Custom colored icon background (stats cards)
 * - stat: Fully colored background (special stats)
 *
 * @example
 * ```tsx
 * // Default variant
 * <InfoCard
 *   icon={IconCalendar}
 *   label="Yaş"
 *   value="2 ay"
 * />
 *
 * // Colored variant with custom colors
 * <InfoCard
 *   variant="colored"
 *   icon={IconEye}
 *   label="Baxış sayı"
 *   value={1234}
 *   color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
 * />
 * ```
 */
export function InfoCard({ icon: Icon, label, value, variant = 'default', color, iconSize, className, hoverable }: InfoCardProps) {
  // Determine default icon size based on variant
  const defaultIconSize = 22;
  const finalIconSize = iconSize ?? defaultIconSize;

  // Determine if card should be hoverable
  const isHoverable = hoverable ?? variant === 'default';

  // Format value if it's a number
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'colored':
        return {
          container: 'flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 border-gray-200',
          iconContainer: cn('w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0', color?.bg || 'bg-gray-100'),
          icon: color?.text || 'text-gray-700',
        };
      case 'stat':
        return {
          container: 'flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 border-gray-200',
          iconContainer: cn('w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0', color?.bg || 'bg-info-100'),
          icon: color?.text || 'text-info-600',
        };
      case 'default':
      default:
        return {
          container: cn(
            'flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 border-gray-200',
            isHoverable && 'hover:border-gray-300 transition-colors'
          ),
          iconContainer: 'w-10 h-10 sm:w-11 sm:h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0',
          icon: 'text-gray-700',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(styles.container, className)}>
      {/* Icon Container */}
      <div className={styles.iconContainer}>
        <Icon size={finalIconSize} className={styles.icon} />
      </div>

      {/* Label & Value */}
      <div className="flex-1 min-w-0">
        <Text variant="small" className="mb-1 text-xs sm:text-sm" as="div">
          {label}
        </Text>
        <Text variant="body" weight="semibold" color="primary" className="truncate text-sm sm:text-base" as="div">
          {formattedValue}
        </Text>
      </div>
    </div>
  );
}

export default InfoCard;
