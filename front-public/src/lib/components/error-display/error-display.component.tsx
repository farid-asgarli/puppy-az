'use client';

import { cn } from '@/lib/external/utils';
import { IconAlertCircle, IconX } from '@tabler/icons-react';

interface ErrorDisplayProps {
  /** Primary error message */
  message: string;
  /** Additional error details (validation errors, etc.) */
  details?: string[];
  /** Optional title */
  title?: string;
  /** Whether the error can be dismissed */
  dismissible?: boolean;
  /** Callback when error is dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Variant style */
  variant?: 'default' | 'compact';
}

/**
 * Component for displaying API errors with Problem Details support
 */
export function ErrorDisplay({ message, details, title, dismissible = false, onDismiss, className, variant = 'default' }: ErrorDisplayProps) {
  if (!message) return null;

  const isCompact = variant === 'compact';

  return (
    <div className={cn('rounded-lg border border-red-200 bg-red-50 text-red-900', isCompact ? 'p-3' : 'p-4', className)} role="alert">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <IconAlertCircle className={cn('flex-shrink-0 text-red-600', isCompact ? 'h-4 w-4' : 'h-5 w-5')} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && !isCompact && <div className="font-semibold mb-1">{title}</div>}
          <div className={cn('text-sm', isCompact && 'text-xs')}>{message}</div>

          {/* Validation errors list */}
          {details && details.length > 0 && (
            <ul className={cn('mt-2 space-y-1 list-disc list-inside', isCompact ? 'text-xs' : 'text-sm')}>
              {details.map((detail, index) => (
                <li key={index} className="text-red-800">
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
            aria-label="Dismiss error"
          >
            <IconX className={cn(isCompact ? 'h-4 w-4' : 'h-5 w-5')} />
          </button>
        )}
      </div>
    </div>
  );
}
