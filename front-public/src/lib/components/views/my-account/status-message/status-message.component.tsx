import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { StatusMessageProps } from './status-message.types';

const variantStyles = {
  success: {
    container: 'border-green-200 bg-green-50',
    iconBg: 'bg-green-500',
    iconColor: 'text-white',
    title: 'text-green-900',
    message: 'text-green-800',
  },
  error: {
    container: 'border-red-200 bg-red-50',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    title: 'text-red-900',
    message: 'text-red-800',
  },
  warning: {
    container: 'border-amber-200 bg-amber-50',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    title: 'text-warning-900',
    message: 'text-warning-800',
  },
  info: {
    container: 'border-info-200 bg-info-50',
    iconBg: 'bg-info-500',
    iconColor: 'text-white',
    title: 'text-info-900',
    message: 'text-info-800',
  },
};

const defaultIcons = {
  success: <IconCheck size={14} />,
  error: <IconX size={14} />,
  warning: <IconAlertTriangle size={14} />,
  info: <IconInfoCircle size={14} />,
};

/**
 * Status message component for displaying success, error, warning, or info messages
 * Includes ARIA live regions for accessibility and optional dismiss functionality
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({ variant, title, message, icon, onDismiss, className, ariaLive }) => {
  const styles = variantStyles[variant];
  const displayIcon = icon ?? defaultIcons[variant];
  const liveRegion = ariaLive ?? (variant === 'error' || variant === 'warning' ? 'assertive' : 'polite');

  return (
    <div className={cn('p-5 rounded-xl border-2', styles.container, className)} role="alert" aria-live={liveRegion} aria-atomic="true">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0" aria-hidden="true">
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', styles.iconBg, styles.iconColor)}>{displayIcon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <Heading variant="label" as="h3" className={cn('mb-1', styles.title)}>
            {title}
          </Heading>
          <Text variant="small" as="p" className={styles.message}>
            {message}
          </Text>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-lg transition-colors',
              'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'success' && 'focus:ring-green-500',
              variant === 'error' && 'focus:ring-red-500',
              variant === 'warning' && 'focus:ring-amber-500',
              variant === 'info' && 'focus:ring-blue-500'
            )}
            aria-label="Mesajı bağla"
          >
            <IconX size={16} className={styles.title} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusMessage;
