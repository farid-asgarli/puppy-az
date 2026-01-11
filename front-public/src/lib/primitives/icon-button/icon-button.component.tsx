import { cn } from '@/lib/external/utils';

import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentSizing } from '@/lib/types/component-sizing';

/**
 * Icon button variants for circular/rounded icon-only buttons
 * Common use cases: camera upload, delete, share, like, close, etc.
 */
const iconButtonVariants = cva(
  'inline-flex items-center justify-center transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // Overlay styles (for use on images/cards)
        overlay: 'bg-white/90 backdrop-blur-sm border border-white hover:bg-white',
        'overlay-dark': 'bg-gray-700 border-2 border-white text-white hover:bg-gray-600',

        // Solid colors
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        danger: 'bg-error-500 text-white hover:bg-error-600',
        success: 'bg-success-500 text-white hover:bg-success-600',

        // Light backgrounds
        light: 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',

        // Transparent with hover (for navigation)
        transparent: 'bg-transparent hover:bg-gray-100',
      },
      size: {
        xs: 'w-6 h-6',
        sm: 'w-7 h-7',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
        xl: 'w-12 h-12',
      } as Record<ComponentSizing, string>,
      shape: {
        circle: 'rounded-full',
        rounded: 'rounded-lg',
        square: 'rounded-none',
      },
      position: {
        none: '',
        'top-left': 'absolute top-2 left-2',
        'top-right': 'absolute top-2 right-2',
        'bottom-left': 'absolute bottom-2 left-2',
        'bottom-right': 'absolute bottom-2 right-2',
        'top-left-tight': 'absolute -top-1 -left-1',
        'top-right-tight': 'absolute -top-1 -right-1',
        'bottom-left-tight': 'absolute -bottom-1 -left-1',
        'bottom-right-tight': 'absolute -bottom-1 -right-1',
        'top-left-overlap': 'absolute -top-2 -left-2',
        'top-right-overlap': 'absolute -top-2 -right-2',
        'bottom-left-overlap': 'absolute -bottom-2 -left-2',
        'bottom-right-overlap': 'absolute -bottom-2 -right-2',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
    },
    compoundVariants: [
      {
        variant: 'overlay',
        shape: 'circle',
        class: 'backdrop-blur-sm',
      },
      {
        variant: 'danger',
        position: ['top-right-overlap', 'top-left-overlap', 'bottom-right-overlap', 'bottom-left-overlap'],
        class: 'opacity-0 group-hover:opacity-100 transition-opacity',
      },
    ],
    defaultVariants: {
      variant: 'light',
      size: 'md',
      shape: 'circle',
      position: 'none',
      shadow: 'none',
    },
  }
);

/**
 * Icon button props
 */
type IconButtonProps = Omit<React.ComponentProps<'button'>, 'children'> &
  VariantProps<typeof iconButtonVariants> & {
    icon: React.ReactNode;
    /**
     * Accessible label for screen readers
     */
    ariaLabel?: string;
  };

/**
 * Icon-only button component for common UI patterns
 *
 * @example
 * // Camera button on avatar (overlay style)
 * <IconButton
 *   icon={<IconCamera size={14} />}
 *   variant="primary"
 *   size="sm"
 *   position="bottom-right-tight"
 *   ariaLabel="Upload photo"
 * />
 *
 * @example
 * // Delete button on image (appears on hover)
 * <IconButton
 *   icon={<IconX size={14} />}
 *   variant="danger"
 *   size="sm"
 *   position="top-right-overlap"
 *   shadow="lg"
 *   ariaLabel="Remove image"
 * />
 *
 * @example
 * // Like button on card
 * <IconButton
 *   icon={<IconHeart size={16} />}
 *   variant="overlay"
 *   position="top-right"
 *   ariaLabel="Add to favorites"
 * />
 *
 * @example
 * // Close button in modal
 * <IconButton
 *   icon={<IconX size={20} />}
 *   variant="transparent"
 *   ariaLabel="Close"
 * />
 */
export default function IconButton({ variant, size, shape, position, shadow, icon, ariaLabel, className, ...props }: IconButtonProps) {
  return (
    <button type="button" className={cn(iconButtonVariants({ variant, size, shape, position, shadow }), className)} aria-label={ariaLabel} {...props}>
      {icon}
    </button>
  );
}

// Export variants for use in other components
export { iconButtonVariants };
