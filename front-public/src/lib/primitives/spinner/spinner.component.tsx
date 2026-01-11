import { cn } from '@/lib/external/utils';
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Spinner/Loading indicator variants
 */
const spinnerVariants = cva('animate-spin rounded-full border-2 border-current border-t-transparent', {
  variants: {
    size: {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-10 h-10',
      '2xl': 'w-12 h-12',
    },
    color: {
      primary: 'text-primary-600',
      white: 'text-white',
      gray: 'text-gray-400',
      success: 'text-success-600',
      danger: 'text-error-600',
      warning: 'text-warning-600',
      current: 'text-current',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export interface SpinnerProps extends Omit<React.ComponentProps<'div'>, 'children' | 'color'>, VariantProps<typeof spinnerVariants> {
  /**
   * Accessible label for screen readers
   */
  label?: string;
  /**
   * Show spinner with centered container
   */
  centered?: boolean;
  /**
   * Text to display below the spinner
   */
  text?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size, color, label = 'Loading...', centered = false, text, className, ...props }, ref) => {
    const spinner = (
      <div ref={ref} className={cn(spinnerVariants({ size, color }), className)} role="status" aria-label={label} {...props}>
        <span className="sr-only">{label}</span>
      </div>
    );

    if (centered || text) {
      return (
        <div className={cn('flex flex-col items-center justify-center gap-2', centered && 'w-full min-h-[200px]')}>
          {spinner}
          {text && <p className="text-sm text-gray-600">{text}</p>}
        </div>
      );
    }

    return spinner;
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
