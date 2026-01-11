'use client';

import { ExpandableSection } from '@/lib/components/views/pet-ad-details/expandable-section';
import { SectionHeader } from '@/lib/components/views/common';
import { useTranslations } from 'next-intl';

export interface AdDetailsDescriptionSectionProps {
  description: string;
}

export function AdDetailsDescriptionSection({ description }: AdDetailsDescriptionSectionProps) {
  const t = useTranslations('petAdDetails.description');

  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader title={t('title')} />

      <div className="p-4 sm:p-6 rounded-xl border-2 border-gray-200">
        <ExpandableSection type="text" threshold={300} className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
          {description}
        </ExpandableSection>
      </div>
    </div>
  );
}
