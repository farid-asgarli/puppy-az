'use client';

import { useEffect, useState, useMemo } from 'react';
import PriceRangeSlider from '@/lib/components/filters/price-range';
import { DEFAULT_FILTER_VALUES } from '@/lib/filtering/filter-default-values';
import { FilterParamsSecondary } from '@/lib/filtering/types';
import { SearchableSelect } from '@/lib/form/components/select/select';
import { IconToggleButton } from '@/lib/form/components/toggle/toggle.component';
import TextInput from '@/lib/form/components/text/text-input.component';
import Row from '@/lib/primitives/row/row.component';
import { IconVenus, IconMars } from '@tabler/icons-react';
import { PetGender, PetSize, CityDto } from '@/lib/api';
import { citiesService } from '@/lib/api/services/cities.service';
import { cn } from '@/lib/external/utils';
import { getPetSizes } from '@/lib/utils/mappers';
import { Heading } from '@/lib/primitives/typography';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/lib/hooks/use-client-locale';

interface FilterBodyProps {
  currentFilters: FilterParamsSecondary;
  updateFilter<T extends keyof FilterParamsSecondary>(key: T, value: FilterParamsSecondary[T]): void;
  cities?: CityDto[]; // Optional: if provided, skips API fetch
}

export const FilterBody = ({ currentFilters, updateFilter, cities: citiesProp }: FilterBodyProps) => {
  const locale = useLocale();
  const [cities, setCities] = useState<CityDto[]>(citiesProp || []);
  const [isLoadingCities, setIsLoadingCities] = useState(!citiesProp);
  const t = useTranslations('filters');
  const tCommon = useTranslations('common');

  const petSizes = useMemo(() => getPetSizes(tCommon), [tCommon]);

  useEffect(() => {
    // If cities were provided as prop (from SSR cache), use them
    if (citiesProp) {
      setCities(citiesProp);
      setIsLoadingCities(false);
      return;
    }

    // Otherwise fetch from API (will use cache if available) with locale
    const loadCities = async () => {
      try {
        const citiesData = await citiesService.getCities(locale);
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [citiesProp, locale]);

  const cityOptions = cities.map((city) => ({
    value: city.id.toString(),
    label: city.name || '',
  }));

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* City Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading variant="label" as="h3" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {t('city')}
        </Heading>
        <SearchableSelect
          usePortal={false}
          value={currentFilters['city']?.toString()}
          onChange={(val) => updateFilter('city', val ? Number(val) : undefined)}
          options={cityOptions}
          placeholder={t('allCities')}
          disabled={isLoadingCities}
        />
      </div>

      {/* Gender Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading variant="label" as="h3" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {t('gender')}
        </Heading>
        <Row gap="sm">
          <IconToggleButton
            icon={IconMars}
            label={t('male')}
            size="md"
            isActive={currentFilters['gender'] === PetGender.Male}
            onChange={(isActive) => updateFilter('gender', isActive ? PetGender.Male : undefined)}
            fullWidth
          />
          <IconToggleButton
            icon={IconVenus}
            label={t('female')}
            size="md"
            isActive={currentFilters['gender'] === PetGender.Female}
            onChange={(isActive) => updateFilter('gender', isActive ? PetGender.Female : undefined)}
            fullWidth
          />
        </Row>
      </div>

      {/* Size Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading variant="label" as="h3" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {t('size')}
        </Heading>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {Object.entries(petSizes).map(([key, { label }]) => {
            const size = +key as PetSize;
            return (
              <button
                key={size}
                onClick={() => updateFilter('size', currentFilters['size'] === size ? undefined : size)}
                className={cn(
                  'px-2 py-2 sm:px-3 sm:py-2 rounded-xl border-2 text-xs sm:text-sm font-medium transition-colors',
                  currentFilters['size'] === size
                    ? 'border-primary-400 bg-primary-50 text-primary-600'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Age Range Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading variant="label" as="h3" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {t('ageInMonths')}
        </Heading>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <TextInput
            type="number"
            label={t('minimum')}
            placeholder="0"
            min={0}
            value={currentFilters['age-min'] || ''}
            onChange={(e) => updateFilter('age-min', e.target.value ? Number(e.target.value) : undefined)}
            size="md"
            fullWidth
          />
          <TextInput
            type="number"
            label={t('maximum')}
            placeholder="120"
            min={0}
            value={currentFilters['age-max'] || ''}
            onChange={(e) => updateFilter('age-max', e.target.value ? Number(e.target.value) : undefined)}
            size="md"
            fullWidth
          />
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 sm:mb-8">
        <PriceRangeSlider
          min={DEFAULT_FILTER_VALUES.MIN_AD_PRICE}
          max={DEFAULT_FILTER_VALUES.MAX_AD_PRICE}
          step={50}
          currency="₼"
          value={[
            currentFilters['price-min'] || DEFAULT_FILTER_VALUES.MIN_AD_PRICE,
            currentFilters['price-max'] || DEFAULT_FILTER_VALUES.MAX_AD_PRICE,
          ]}
          onChange={([priceMin, priceMax]) => {
            updateFilter('price-min', priceMin);
            updateFilter('price-max', priceMax);
          }}
        />
      </div>

      {/* Weight Range Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading variant="label" as="h3" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {t('weight')}
        </Heading>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <TextInput
            type="number"
            label={t('minimum')}
            placeholder="0"
            min={0}
            step={0.5}
            value={currentFilters['weight-min'] || ''}
            onChange={(e) => updateFilter('weight-min', e.target.value ? Number(e.target.value) : undefined)}
            size="md"
            fullWidth
          />
          <TextInput
            type="number"
            label={t('maximum')}
            placeholder="100"
            min={0}
            step={0.5}
            value={currentFilters['weight-max'] || ''}
            onChange={(e) => updateFilter('weight-max', e.target.value ? Number(e.target.value) : undefined)}
            size="md"
            fullWidth
          />
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading variant="label" as="h3" className="mb-3 sm:mb-4 text-sm sm:text-base">
          {t('color')}
        </Heading>
        <TextInput
          type="text"
          placeholder={t('colorPlaceholder')}
          value={currentFilters['color'] || ''}
          onChange={(e) => updateFilter('color', e.target.value || undefined)}
          size="md"
          fullWidth
        />
      </div>
    </div>
  );
};
