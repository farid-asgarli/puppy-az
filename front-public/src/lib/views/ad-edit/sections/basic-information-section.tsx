'use client';

import { useState, useEffect, useMemo } from 'react';
import { PetAdDetailsDto, PetBreedDto, PetGender, PetSize } from '@/lib/api/types/pet-ad.types';
import { getPetBreedsAction } from '@/lib/auth/actions';
import { getPetGender, getPetSizes } from '@/lib/utils/mappers';
import { cn } from '@/lib/external/utils';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { OptionCard } from '@/lib/components/views/ad-placement';
import { SearchableSelect } from '@/lib/form/components/select/select';
import { IconLock } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface BasicInformationSectionProps {
  ad: PetAdDetailsDto;
  formData: {
    petBreedId: number;
    gender: PetGender;
    ageInMonths: number;
    size: PetSize | null;
  };
  onChange: (data: Partial<BasicInformationSectionProps['formData']>) => void;
  errors?: {
    petBreedId?: string;
    gender?: string;
    ageInMonths?: string;
    size?: string;
  };
}

/**
 * Basic Information Section
 * Category (read-only), Breed (editable), Gender, Age, Size
 */
export const BasicInformationSection = ({ ad, formData, onChange, errors = {} }: BasicInformationSectionProps) => {
  const [breeds, setBreeds] = useState<PetBreedDto[]>([]);
  const [loadingBreeds, setLoadingBreeds] = useState(false);
  const tCommon = useTranslations('common');
  const t = useTranslations('adEdit.basicInfo');

  const petSizes = useMemo(() => getPetSizes(tCommon), [tCommon]);
  const petGenders = useMemo(() => getPetGender(tCommon), [tCommon]);

  // Calculate years and months from total months
  const years = Math.floor(formData.ageInMonths / 12);
  const months = formData.ageInMonths % 12;

  // Fetch breeds for the category using Server Action
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoadingBreeds(true);
        const result = await getPetBreedsAction(ad.breed.id);
        if (result.success) {
          setBreeds(result.data);
        } else {
          console.error('Failed to fetch breeds:', result.error);
        }
      } catch (error) {
        console.error('Failed to fetch breeds:', error);
      } finally {
        setLoadingBreeds(false);
      }
    };

    fetchBreeds();
  }, [ad.breed.id]);

  const handleYearsChange = (newYears: number) => {
    const validYears = Math.max(0, Math.min(newYears, 50));
    onChange({ ageInMonths: validYears * 12 + months });
  };

  const handleMonthsChange = (newMonths: number) => {
    const validMonths = Math.max(0, Math.min(newMonths, 11));
    onChange({ ageInMonths: years * 12 + validMonths });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-2">
        <Heading variant="section" as="h2">
          {t('heading')}
        </Heading>
        <Text variant="body" color="secondary">
          {t('subheading')}
        </Text>
      </div>

      {/* Category - Read Only */}
      <div className="space-y-3">
        <Label variant="field">{t('category')}</Label>
        <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Text variant="body" className="font-medium text-gray-900">
                {ad.categoryTitle}
              </Text>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <IconLock size={16} />
              <Text variant="small" color="secondary">
                {t('categoryLocked')}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Breed - Editable */}
      <div className="space-y-3">
        <Label variant="field" htmlFor="breed-select">
          {t('breed')}
        </Label>
        <SearchableSelect
          options={breeds.map((breed) => ({
            value: breed.id.toString(),
            label: breed.title,
          }))}
          value={formData.petBreedId.toString()}
          onChange={(value) => onChange({ petBreedId: parseInt(value) })}
          placeholder={t('breedPlaceholder')}
          searchPlaceholder={t('breedSearch')}
          emptyMessage={t('breedNoResults')}
          loading={loadingBreeds}
          error={!!errors.petBreedId}
          searchable
          size="lg"
        />
        {errors.petBreedId && (
          <Text variant="small" className="text-red-600">
            {errors.petBreedId}
          </Text>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <Label variant="field">{t('gender')}</Label>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(petGenders).map(([key, { label, icon }]) => {
            const gender = +key as PetGender;
            return (
              <OptionCard
                key={gender}
                selected={formData.gender === gender}
                onClick={() => onChange({ gender })}
                icon={icon}
                title={label}
                layout="vertical"
                size="md"
              />
            );
          })}
        </div>
        {errors.gender && (
          <Text variant="small" className="text-red-600">
            {errors.gender}
          </Text>
        )}
      </div>

      {/* Age */}
      <div className="space-y-3">
        <Label variant="field">{t('age')}</Label>
        <Text variant="small" color="secondary">
          {t('ageQuestion', { default: 'How old is your pet?' })}
        </Text>

        <div className="grid grid-cols-2 gap-4">
          {/* Years Input */}
          <div className="space-y-2">
            <Label variant="field" htmlFor="years" className="block text-sm">
              {t('years')}
            </Label>
            <input
              type="number"
              id="years"
              min="0"
              max="50"
              value={years}
              onChange={(e) => handleYearsChange(parseInt(e.target.value) || 0)}
              onBlur={(e) => {
                // Validation on blur
                const value = parseInt(e.target.value) || 0;
                if (value < 0 || value > 50) {
                  handleYearsChange(Math.max(0, Math.min(value, 50)));
                }
              }}
              className={cn(
                'w-full px-4 py-4 rounded-xl border-2 transition-colors',
                'text-lg text-center font-semibold',
                errors.ageInMonths ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black focus:outline-none'
              )}
              placeholder="0"
            />
          </div>

          {/* Months Input */}
          <div className="space-y-2">
            <Label variant="field" htmlFor="months" className="block text-sm">
              {t('months')}
            </Label>
            <input
              type="number"
              id="months"
              min="0"
              max="11"
              value={months}
              onChange={(e) => handleMonthsChange(parseInt(e.target.value) || 0)}
              onBlur={(e) => {
                // Validation on blur
                const value = parseInt(e.target.value) || 0;
                if (value < 0 || value > 11) {
                  handleMonthsChange(Math.max(0, Math.min(value, 11)));
                }
              }}
              className={cn(
                'w-full px-4 py-4 rounded-xl border-2 transition-colors',
                'text-lg text-center font-semibold',
                errors.ageInMonths ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black focus:outline-none'
              )}
              placeholder="0"
            />
          </div>
        </div>

        {/* Age Display */}
        {formData.ageInMonths > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <Text variant="small" className="text-center text-gray-700">
              <span className="font-semibold">{t('totalAge')}</span> {years > 0 && `${years} ${t('year')} `}
              {months > 0 && `${months} ${t('month')}`}
              {years === 0 && months === 0 && `0 ${t('month')}`}
            </Text>
          </div>
        )}

        {errors.ageInMonths && (
          <Text variant="small" className="text-red-600">
            {errors.ageInMonths}
          </Text>
        )}
      </div>

      {/* Size */}
      <div className="space-y-3">
        <Label variant="field">{t('size')}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(petSizes).map(([key, { label, description }]) => {
            const size = +key as PetSize;
            return (
              <OptionCard
                key={size}
                selected={formData.size === size}
                onClick={() => onChange({ size })}
                title={label}
                description={description}
                layout="vertical"
                size="sm"
              />
            );
          })}
        </div>
        {errors.size && (
          <Text variant="small" className="text-red-600">
            {errors.size}
          </Text>
        )}
      </div>
    </div>
  );
};

export default BasicInformationSection;
