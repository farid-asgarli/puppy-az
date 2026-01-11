'use client';

import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import Button from '@/lib/primitives/button/button.component';
import type { EmptyStateProps } from './empty-state.types';

/**
 * EmptyState Component
 *
 * Unified empty state component for displaying no results/content scenarios.
 * Supports both bordered and borderless variants with optional action buttons.
 *
 * @example
 * ```tsx
 * // Borderless variant (help-center style)
 * <EmptyState
 *   icon={IconSearch}
 *   title="No results found"
 *   message="Try adjusting your search criteria"
 * />
 *
 * // Bordered variant with action (pet-ad-details style)
 * <EmptyState
 *   variant="bordered"
 *   icon={IconPhoto}
 *   message="No photos uploaded yet"
 *   action={{
 *     label: "Upload Photo",
 *     icon: IconUpload,
 *     onClick: () => handleUpload()
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, message, action, variant = 'borderless', iconSize = 32, className }) => {
  return (
    <div className={cn('text-center', variant === 'bordered' ? 'p-8 rounded-xl border-2 border-gray-200' : 'py-16', className)}>
      {/* Icon */}
      <div
        className={cn(
          'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center',
          variant === 'bordered' ? 'mx-auto mb-4' : 'inline-flex mb-6'
        )}
        aria-hidden="true"
      >
        <Icon size={iconSize} className="text-gray-400" />
      </div>

      {/* Title (optional) */}
      {title && (
        <Heading variant={variant === 'bordered' ? 'label' : 'card'} as="h3" className="mb-2">
          {title}
        </Heading>
      )}

      {/* Message */}
      <Text variant="body" color="secondary" className={cn('max-w-md mx-auto', action ? 'mb-4' : '')}>
        {message}
      </Text>

      {/* Action Button (optional) */}
      {action && (
        <Button
          variant="secondary"
          size="md"
          className="rounded-xl font-medium"
          leftSection={action.icon ? <action.icon size={18} /> : undefined}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
