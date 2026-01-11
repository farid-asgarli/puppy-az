'use client';

import Button from '@/lib/primitives/button/button.component';
import { useTranslations } from 'next-intl';

interface FilterFooterProps {
  resetFilters(): void;
  submitFilters(): Promise<void>;
}

export const FilterFooter = ({ resetFilters, submitFilters }: FilterFooterProps) => {
  const t = useTranslations('filters');

  return (
    <div className="border-t border-gray-200 p-6 flex items-center justify-between shrink-0">
      <Button variant="underlined" size="md" onClick={resetFilters}>
        {t('reset')}
      </Button>
      <Button variant="primary" size="lg" onClickAsync={submitFilters}>
        {t('showResults')}
      </Button>
    </div>
  );
};
