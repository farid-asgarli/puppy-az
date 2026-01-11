'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { IconAdjustments } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { useFilterUrl } from '@/lib/filtering/use-filter-url';
import { useFilterDialog } from '@/lib/contexts/filter-dialog-context';
import Button from '@/lib/primitives/button/button.component';

interface FilterButtonProps {
  className?: string;
}

/**
 * Filter button component that opens the shared FilterDialog
 * Uses FilterDialogContext to access dialog state
 * Shows badge with count of active secondary filters
 */
export function FilterButton({ className }: FilterButtonProps) {
  const t = useTranslations('filters');
  const tAccessibility = useTranslations('accessibility');
  const { openDialog } = useFilterDialog();
  const { filters } = useFilterUrl();

  // Count active secondary filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.gender) count++;
    if (filters.size) count++;
    if (filters['price-min'] || filters['price-max']) count++;
    if (filters['age-min'] || filters['age-max']) count++;
    if (filters['weight-min'] || filters['weight-max']) count++;
    if (filters.color) count++;
    return count;
  }, [filters]);

  return (
    <Button variant="filter" size="md" onClick={openDialog} className={cn('relative', className)} aria-label={tAccessibility('filters')}>
      <IconAdjustments size={20} className="rotate-90" />
      <span className="hidden lg:block">{t('applyFilters')}</span>
      {activeFilterCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-semibold rounded-full flex items-center justify-center">
          {activeFilterCount}
        </span>
      )}
    </Button>
  );
}
