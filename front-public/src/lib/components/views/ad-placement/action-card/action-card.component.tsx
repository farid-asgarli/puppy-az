'use client';

import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { ActionCardProps } from './action-card.types';

/**
 * ActionCard - Interactive card for actions with icon, title, and description
 *
 * Used for presenting choices or actions in a visually appealing way.
 * Perfect for onboarding flows, draft continuation dialogs, or feature selection.
 *
 * Features:
 * - Icon with circular background
 * - Title and description layout
 * - Arrow indicator on the right
 * - Hover states and shadows
 * - Primary/secondary variants
 * - Accessibility: keyboard navigation, ARIA labels
 *
 * @example
 * <ActionCard
 *   icon={<IconClock className="w-6 h-6 text-white" />}
 *   title="Continue Draft"
 *   description="Pick up where you left off"
 *   onClick={handleContinue}
 *   variant="primary"
 * />
 */
export function ActionCard({ title, description, icon, onClick, variant = 'primary', disabled = false, className }: ActionCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full p-6 rounded-2xl border-2 transition-all duration-200',
        'flex items-start gap-4 text-left group',
        isPrimary ? 'border-gray-200 bg-white hover:border-black hover:shadow-xl' : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed hover:border-gray-200 hover:shadow-none',
        className
      )}
      aria-label={`${title}: ${description}`}
      aria-disabled={disabled}
    >
      {/* Icon Container */}
      <div
        className={cn(
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all',
          isPrimary ? 'bg-black' : 'bg-gray-100 group-hover:bg-gray-200'
        )}
      >
        {typeof icon === 'string' ? <span className="text-2xl">{icon}</span> : icon}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <Heading variant="card">{title}</Heading>
        <Text variant="body">{description}</Text>
      </div>

      {/* Arrow Indicator */}
      <div
        className={cn(
          'flex-shrink-0 transition-colors',
          isPrimary ? 'text-gray-400 group-hover:text-black' : 'text-gray-400 group-hover:text-gray-600'
        )}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
