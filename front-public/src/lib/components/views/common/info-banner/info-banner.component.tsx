import { IconAlertCircle, IconCheck, IconInfoCircle, IconAlertTriangle, IconShieldCheck } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { InfoBannerProps, InfoBannerVariant } from './info-banner.types';

const variantStyles: Record<
  InfoBannerVariant,
  {
    container: string;
    iconBg: string;
    icon: string;
    title: string;
    description: string;
  }
> = {
  default: {
    container: 'border-gray-200 bg-gray-50',
    iconBg: 'bg-gray-900',
    icon: 'text-white',
    title: 'text-gray-900',
    description: 'text-gray-600',
  },
  error: {
    container: 'border-red-200 bg-red-50',
    iconBg: 'bg-red-500',
    icon: 'text-white',
    title: 'text-red-900',
    description: 'text-red-800',
  },
  warning: {
    container: 'border-warning-200 bg-warning-50',
    iconBg: 'bg-warning-500',
    icon: 'text-white',
    title: 'text-warning-900',
    description: 'text-warning-800',
  },
  info: {
    container: 'border-info-200 bg-info-50',
    iconBg: 'bg-info-100',
    icon: 'text-info-600',
    title: 'text-info-900',
    description: 'text-info-800',
  },
  success: {
    container: 'border-success-200 bg-success-50',
    iconBg: 'bg-green-100',
    icon: 'text-green-600',
    title: 'text-green-900',
    description: 'text-green-800',
  },
};

const defaultIcons: Record<InfoBannerVariant, React.ComponentType<{ size: number; className?: string }>> = {
  default: IconShieldCheck,
  error: IconAlertCircle,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
  success: IconCheck,
};

/**
 * Info Banner Component
 * Colored banner with icon, title, description, and optional action
 * Used for alerts, notifications, and informational messages
 *
 * Features:
 * - Four variants (info, warning, error, success)
 * - Default icons per variant (can be overridden)
 * - Two sizes (sm for inline alerts, md for section banners)
 * - Optional action element support
 * - Accessible ARIA attributes
 */
export const InfoBanner: React.FC<InfoBannerProps> = ({ variant, icon, title, description, action, size = 'md', className }) => {
  const styles = variantStyles[variant];
  const Icon = icon ?? defaultIcons[variant];
  const isErrorOrWarning = variant === 'error' || variant === 'warning';

  // Size-based styling
  const sizeStyles = {
    sm: {
      container: 'p-3 sm:p-4',
      iconSize: 18,
      iconContainer: 'w-9 h-9 sm:w-10 sm:h-10',
      gap: 'gap-2 sm:gap-3',
    },
    md: {
      container: 'p-4 sm:p-5',
      iconSize: 20,
      iconContainer: 'w-10 h-10 sm:w-11 sm:h-11',
      gap: 'gap-3 sm:gap-4',
    },
  };

  const sizing = sizeStyles[size];

  // Check if description is a string or React element
  const isStringDescription = typeof description === 'string';

  return (
    <div
      className={cn('rounded-xl border-2', styles.container, sizing.container, className)}
      role={isErrorOrWarning ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className={cn('flex items-center', sizing.gap)}>
        <div className={cn('flex-shrink-0 rounded-xl flex items-center justify-center', sizing.iconContainer, styles.iconBg)} aria-hidden="true">
          <Icon size={sizing.iconSize} className={styles.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <Heading variant="label" as="h3" className={cn('mb-1 text-sm sm:text-base', styles.title)}>
            {title}
          </Heading>
          {description && isStringDescription && (
            <Text variant="small" className={cn('text-xs sm:text-sm', styles.description)} as="p">
              {description}
            </Text>
          )}
          {description && !isStringDescription && <div className={cn('text-xs sm:text-sm', styles.description)}>{description}</div>}
          {action && <div className="mt-2 sm:mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
