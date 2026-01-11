import { cn } from '@/lib/external/utils';
import type { BadgeProps, BadgeVariant, BadgeSize } from './badge.types';

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-purple-50 border-2 border-purple-200 text-purple-700',
  secondary: 'bg-gray-50 text-gray-900',
  outline: 'bg-white border-2 border-gray-200 text-gray-900',
  count: 'bg-gray-50 text-gray-900',
  filter: 'bg-gray-100 text-gray-700',
};

const sizeStyles: Record<BadgeSize, { container: string; icon: number; text: string }> = {
  sm: {
    container: 'px-2 py-0.5 gap-1',
    icon: 14,
    text: 'text-xs',
  },
  md: {
    container: 'px-4 py-2 gap-2',
    icon: 18,
    text: 'text-sm',
  },
  lg: {
    container: 'px-5 py-2.5 gap-2.5',
    icon: 20,
    text: 'text-base',
  },
};

/**
 * Badge Component
 * Unified badge/pill system for labels, counts, and filters
 * Supports multiple variants and sizes with consistent styling
 */
export const Badge: React.FC<BadgeProps> = ({ variant = 'secondary', icon: Icon, children, size = 'md', className, onClick, interactive = false }) => {
  const styles = sizeStyles[size];
  const isClickable = interactive || !!onClick;

  const Component = isClickable ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-xl font-semibold',
        'transition-all duration-200',
        variantStyles[variant],
        styles.container,
        styles.text,
        isClickable && 'cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
        !isClickable && 'pointer-events-none',
        className
      )}
      {...(isClickable && { type: 'button' })}
    >
      {Icon && <Icon size={styles.icon} aria-hidden='true' />}
      <span>{children}</span>
    </Component>
  );
};

export default Badge;
