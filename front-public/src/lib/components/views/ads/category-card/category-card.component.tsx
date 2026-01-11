import { IconTrendingUp } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import TransitionLink from '@/lib/components/transition-link';
import type { CategoryCardProps, CategoryCardVariant } from './category-card.types';

const variantStyles: Record<CategoryCardVariant, { container: string; iconSize: string; iconWrapper: string }> = {
  full: {
    container: 'p-5 sm:p-6 rounded-xl border-2 border-gray-200 bg-white',
    iconSize: 'w-12 h-12 sm:w-14 sm:h-14',
    iconWrapper: 'w-7 h-7 sm:w-8 sm:h-8',
  },
  compact: {
    container: 'p-3 sm:p-4 rounded-xl border-2 border-gray-200 bg-white',
    iconSize: 'w-9 h-9 sm:w-10 sm:h-10',
    iconWrapper: 'w-5 h-5 sm:w-6 sm:h-6',
  },
  pill: {
    container: 'px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border-2 border-gray-200 bg-white',
    iconSize: 'w-5 h-5 sm:w-6 sm:h-6',
    iconWrapper: 'w-5 h-5 sm:w-6 sm:h-6',
  },
};

/**
 * CategoryCard Component
 * Displays a category with icon, title, and optional count
 * Supports multiple variants for different layouts (desktop full/compact, mobile pill)
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({ category, href, variant = 'full', showCount = true, onClick, className }) => {
  const styles = variantStyles[variant];
  const isPill = variant === 'pill';
  const isFull = variant === 'full';

  const content = (
    <>
      {/* Full & Compact Variants */}
      {!isPill && (
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Category Icon */}
            <div
              className={cn(
                'rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0',
                category.backgroundColor,
                styles.iconSize
              )}
              aria-hidden="true"
            >
              <div
                className={cn('flex justify-center items-center', category.iconColor, styles.iconWrapper)}
                dangerouslySetInnerHTML={{ __html: category.svgIcon }}
              />
            </div>

            {/* Category Info */}
            <div className="min-w-0">
              <h4 className={cn('font-semibold text-gray-900 truncate', isFull ? 'text-base sm:text-lg mb-1' : 'text-sm sm:text-base')}>
                {category.title}
              </h4>
              {isFull && <p className="text-xs sm:text-sm text-gray-600 truncate">{category.subtitle}</p>}
            </div>
          </div>

          {/* Ad Count Badge */}
          {showCount && (
            <div
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-lg flex-shrink-0"
              role="status"
              aria-label={`${category.petAdsCount} elan`}
            >
              <IconTrendingUp size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold text-gray-900">{category.petAdsCount}</span>
            </div>
          )}
        </div>
      )}

      {/* Pill Variant */}
      {isPill && (
        <div className="inline-flex items-center gap-1.5 sm:gap-2 font-medium text-gray-900 text-sm sm:text-base">
          <div className={cn(styles.iconSize, category.iconColor)} dangerouslySetInnerHTML={{ __html: category.svgIcon }} aria-hidden="true" />
          <span className="truncate">{category.title}</span>
          {showCount && <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">({category.petAdsCount})</span>}
        </div>
      )}
    </>
  );

  const sharedClasses = cn(
    'group flex transition-all duration-200',
    'hover:border-gray-400 hover:shadow-lg',
    'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
    styles.container,
    className
  );

  // Render as link if href provided
  if (href) {
    return (
      <TransitionLink href={href} className={sharedClasses}>
        {content}
      </TransitionLink>
    );
  }

  // Render as button if onClick provided
  if (onClick) {
    return (
      <button onClick={onClick} className={sharedClasses} type="button">
        {content}
      </button>
    );
  }

  // Render as static div
  return <div className={cn(styles.container, 'pointer-events-none', className)}>{content}</div>;
};

export default CategoryCard;
