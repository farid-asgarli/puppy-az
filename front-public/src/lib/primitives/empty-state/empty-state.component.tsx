import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/external/utils';
import { motion } from 'framer-motion';
import type { ReactElement } from 'react';

const emptyStateVariants = cva('flex flex-col items-center justify-center py-16 text-center', {
  variants: {
    spacing: {
      sm: 'py-8',
      md: 'py-16',
      lg: 'py-24',
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
});

const iconContainerVariants = cva('rounded-2xl flex items-center justify-center mb-6', {
  variants: {
    size: {
      sm: 'w-16 h-16',
      md: 'w-24 h-24',
      lg: 'w-32 h-32',
    },
    color: {
      gray: 'bg-gray-100',
      blue: 'bg-info-50',
      red: 'bg-error-50',
      green: 'bg-success-50',
      yellow: 'bg-premium-50',
      purple: 'bg-primary-50',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'gray',
  },
});

const iconVariants = cva('flex justify-center items-center', {
  variants: {
    size: {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    },
    color: {
      gray: 'text-gray-400',
      blue: 'text-info-400',
      red: 'text-error-400',
      green: 'text-success-400',
      yellow: 'text-premium-400',
      purple: 'text-primary-400',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'gray',
  },
});

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon?: ReactElement;
  iconSize?: VariantProps<typeof iconContainerVariants>['size'];
  iconColor?: VariantProps<typeof iconContainerVariants>['color'];
  title: string;
  description?: string;
  action?: ReactElement;
  animate?: boolean;
  className?: string;
}

export default function EmptyState({
  icon,
  iconSize = 'md',
  iconColor = 'gray',
  title,
  description,
  action,
  animate = true,
  spacing,
  className,
}: EmptyStateProps) {
  const content = (
    <div className={cn(emptyStateVariants({ spacing }), className)}>
      {icon && (
        <div className={iconContainerVariants({ size: iconSize, color: iconColor })}>
          <div className={iconVariants({ size: iconSize, color: iconColor })}>{icon}</div>
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );

  if (animate) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {content}
      </motion.div>
    );
  }

  return content;
}
