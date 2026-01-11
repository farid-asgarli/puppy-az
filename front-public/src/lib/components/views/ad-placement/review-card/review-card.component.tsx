'use client';

import { cn } from '@/lib/external/utils';
import { Heading } from '@/lib/primitives/typography';
import type { ReviewCardProps } from './review-card.types';

/**
 * ReviewCard - Card component for review sections
 *
 * Used in the review step to display summarized information with edit capability.
 *
 * Features:
 * - Title with optional edit button
 * - Bordered card container
 * - Consistent spacing and layout
 * - Accessibility: proper button labels
 *
 * @example
 * <ReviewCard
 *   title="Pet Details"
 *   onEdit={() => handleEdit('basics')}
 * >
 *   <div className="space-y-3">
 *     <p>Gender: Male</p>
 *     <p>Size: Medium</p>
 *   </div>
 * </ReviewCard>
 */
export function ReviewCard({ title, children, onEdit, editLabel = 'Edit', className, showEdit = true }: ReviewCardProps) {
  return (
    <div className={cn('border-2 border-gray-200 rounded-xl p-6', className)}>
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <Heading variant='card'>{title}</Heading>
        {showEdit && onEdit && (
          <button
            type='button'
            onClick={onEdit}
            className='text-sm font-semibold text-gray-900 underline hover:text-gray-600 transition-colors'
            aria-label={`Edit ${title}`}
          >
            {editLabel}
          </button>
        )}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
