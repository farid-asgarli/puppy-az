'use client';

import { CityDto } from '@/lib/api';
import { FilterBody } from '@/lib/components/filters/components/filter-body';
import { FilterFooter } from '@/lib/components/filters/components/filter-footer';
import { DEFAULT_FILTER_VALUES, DEFAULT_SECONDARY_FILTER_VALUES } from '@/lib/filtering/filter-default-values';
import { FilterParamsSecondary } from '@/lib/filtering/types';
import { useFilterUrl } from '@/lib/filtering/use-filter-url';
import { sleep } from '@/lib/utils/sleep';
import { useState } from 'react';

interface FilterContentProps {
  onClose(): void;
  cities?: CityDto[];
}

export const FilterContent = ({ cities, ...props }: FilterContentProps) => {
  const filterUrl = useFilterUrl();

  const [currentFilters, setCurrentFilters] = useState<FilterParamsSecondary>({
    city: filterUrl.filters['city'],
    gender: filterUrl.filters['gender'],
    size: filterUrl.filters['size'],
    'price-min': filterUrl.filters['price-min'] ?? DEFAULT_FILTER_VALUES.MIN_AD_PRICE,
    'price-max': filterUrl.filters['price-max'] ?? DEFAULT_FILTER_VALUES.MAX_AD_PRICE,
    'age-min': filterUrl.filters['age-min'],
    'age-max': filterUrl.filters['age-max'],
    'weight-min': filterUrl.filters['weight-min'],
    'weight-max': filterUrl.filters['weight-max'],
    color: filterUrl.filters['color'],
  });

  function updateFilter<T extends keyof FilterParamsSecondary>(key: T, value: FilterParamsSecondary[T]) {
    setCurrentFilters((p) => ({ ...p, [key]: value }));
  }

  function resetFilters() {
    setCurrentFilters(DEFAULT_SECONDARY_FILTER_VALUES);
  }

  async function submitFilters() {
    filterUrl.updateFilters(currentFilters);
    await sleep(500);
    props.onClose();
  }

  return (
    <>
      <FilterBody currentFilters={currentFilters} updateFilter={updateFilter} cities={cities} />
      <FilterFooter submitFilters={submitFilters} resetFilters={resetFilters} />
    </>
  );
};
