import { cn } from '@/lib/external/utils';
import type { SectionHeaderProps } from './section-header.types';

const sizeStyles = {
  sm: 'text-base sm:text-lg lg:text-xl',
  md: 'text-lg sm:text-xl lg:text-2xl',
  lg: 'text-xl sm:text-2xl lg:text-3xl',
  xl: 'text-2xl sm:text-3xl lg:text-4xl',
};

/**
 * Unified SectionHeader Component
 * Supports both stacked (center-aligned) and horizontal (action button) layouts
 *
 * Usage:
 * - Stacked layout: Content pages (about, help, etc) - title/subtitle centered
 * - Horizontal layout: Detail/listing pages - title left, action right, with size variants
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  level = 'h2',
  align = 'center',
  layout = 'stacked',
  size = 'lg',
  className,
}) => {
  const HeadingTag = level;

  // Stacked layout: centered/aligned content pages
  if (layout === 'stacked') {
    const alignClass = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }[align];

    return (
      <div className={cn('space-y-3 sm:space-y-4', alignClass, className)}>
        <HeadingTag className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold text-gray-900">{title}</HeadingTag>
        {subtitle && <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    );
  }

  // Horizontal layout: detail/listing pages with optional action button and size variants
  return (
    <div className={cn('flex items-center justify-between gap-3 sm:gap-4', className)}>
      <div className="space-y-1 min-w-0">
        <HeadingTag className={cn('font-semibold font-heading text-gray-900', sizeStyles[size])}>{title}</HeadingTag>
        {subtitle && <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 border-gray-200 flex-shrink-0',
            'text-xs sm:text-sm font-medium text-gray-700',
            'hover:border-gray-400 hover:bg-gray-50',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
