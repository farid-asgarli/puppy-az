import { cn } from '@/lib/external/utils';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * ListItem variants for menu items, settings rows, and action lists
 */
const listItemVariants = cva('w-full flex items-center gap-4 p-4 transition-colors text-left', {
  variants: {
    variant: {
      default: 'hover:bg-gray-50',
      danger: 'hover:bg-red-50',
      success: 'hover:bg-green-50',
      primary: 'hover:bg-primary-50',
    },
    bordered: {
      true: 'border-b-2 border-gray-100 last:border-b-0',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    bordered: false,
  },
});

const iconContainerVariants = cva('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', {
  variants: {
    color: {
      blue: 'bg-info-100',
      red: 'bg-error-100',
      green: 'bg-success-100',
      gray: 'bg-gray-100',
      purple: 'bg-primary-100',
      amber: 'bg-premium-100',
    },
  },
  defaultVariants: {
    color: 'gray',
  },
});

const iconVariants = cva('', {
  variants: {
    color: {
      blue: 'text-info-600',
      red: 'text-error-600',
      green: 'text-success-600',
      gray: 'text-gray-600',
      purple: 'text-primary-600',
      amber: 'text-premium-600',
    },
  },
  defaultVariants: {
    color: 'gray',
  },
});

export interface ListItemProps extends Omit<React.ComponentProps<'div'>, 'title'>, VariantProps<typeof listItemVariants> {
  /**
   * Icon component from @tabler/icons-react
   */
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /**
   * Item title/label
   */
  title: React.ReactNode;
  /**
   * Item description/subtitle
   */
  description?: React.ReactNode;
  /**
   * Icon color scheme
   */
  iconColor?: 'blue' | 'red' | 'green' | 'gray' | 'purple' | 'amber';
  /**
   * Show chevron arrow on the right
   */
  showChevron?: boolean;
  /**
   * Link href (if provided, renders as Link instead of button)
   */
  href?: string;
  /**
   * Click handler (only used if href is not provided)
   */
  onClick?: () => void;
  /**
   * Optional badge or additional content on the right
   */
  rightContent?: React.ReactNode;
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      icon: Icon,
      title,
      description,
      iconColor = 'gray',
      showChevron = true,
      href,
      onClick,
      rightContent,
      disabled = false,
      variant,
      bordered,
      className,
      ...props
    },
    ref
  ) => {
    const content = (
      <>
        <div className={iconContainerVariants({ color: iconColor })}>
          <Icon size={20} className={iconVariants({ color: iconColor })} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn('font-medium', variant === 'danger' ? 'text-red-600' : 'text-gray-900')}>{title}</div>
          {description && <div className="text-sm text-gray-600 mt-0.5">{description}</div>}
        </div>
        {rightContent}
        {showChevron && !rightContent && <IconChevronRight size={18} className="text-gray-400 flex-shrink-0" />}
      </>
    );

    const combinedClassName = cn(listItemVariants({ variant, bordered }), disabled && 'opacity-50 cursor-not-allowed pointer-events-none', className);

    if (href) {
      return (
        <Link ref={ref as any} href={href} className={combinedClassName} {...(props as any)}>
          {content}
        </Link>
      );
    }

    if (onClick) {
      return (
        <button ref={ref as any} type="button" onClick={onClick} disabled={disabled} className={combinedClassName} {...(props as any)}>
          {content}
        </button>
      );
    }

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {content}
      </div>
    );
  }
);

ListItem.displayName = 'ListItem';

export default ListItem;
