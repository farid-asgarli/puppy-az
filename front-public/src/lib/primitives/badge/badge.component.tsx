import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/external/utils';

const badgeVariants = cva('rounded-full flex-shrink-0', {
  variants: {
    size: {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
    },
    color: {
      blue: 'bg-info-600',
      green: 'bg-success-600',
      red: 'bg-error-600',
      yellow: 'bg-premium-500',
      purple: 'bg-primary-600',
      gray: 'bg-gray-600',
      emerald: 'bg-success-400',
      white: 'bg-white',
    },
    position: {
      none: '',
      'top-right': 'absolute -top-0.5 -right-0.5',
      'top-left': 'absolute -top-0.5 -left-0.5',
      'bottom-right': 'absolute -bottom-0.5 -right-0.5',
      'bottom-left': 'absolute -bottom-0.5 -left-0.5',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'blue',
    position: 'none',
  },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  ariaLabel?: string;
}

export default function Badge({ size, color, position, className, ariaLabel }: BadgeProps) {
  return <div className={cn(badgeVariants({ size, color, position }), className)} role={ariaLabel ? 'status' : undefined} aria-label={ariaLabel} />;
}
