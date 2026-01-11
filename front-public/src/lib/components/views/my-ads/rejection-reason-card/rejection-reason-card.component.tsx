'use client';

import { IconInfoCircle } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Heading, Text } from '@/lib/primitives/typography';
import type { RejectionReasonCardProps } from './rejection-reason-card.types';
import { useTranslations } from 'next-intl';

/**
 * Alert card displaying rejection reason for rejected ads
 * Features distinctive red styling and icon indicator
 */
export const RejectionReasonCard: React.FC<RejectionReasonCardProps> = ({ reason, className }) => {
  const t = useTranslations('ads');

  return (
    <div className={cn('mt-3 p-4 rounded-xl border-2 border-red-200 bg-red-50', className)} role="alert" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5" aria-hidden="true">
          <IconInfoCircle size={14} className="text-white" />
        </div>
        <div>
          <Heading variant="label" as="h4" className="text-red-900 text-sm mb-1">
            {t('rejectionReason')}
          </Heading>
          <Text variant="small" className="text-red-800" as="p">
            {reason}
          </Text>
        </div>
      </div>
    </div>
  );
};
