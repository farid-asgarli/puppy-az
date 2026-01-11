'use client';

import { useState, useMemo } from 'react';
import { PetGender, PetSize } from '@/lib/api/types/pet-ad.types';
import { useAdPlacement } from '@/lib/contexts/ad-placement-context';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { cn } from '@/lib/external/utils';
import { OptionCard } from '@/lib/components/views/ad-placement';
import { ViewFooter, ViewLayout } from '../components';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { getPetGender, getPetSizes } from '@/lib/utils/mappers';
import { useTranslations } from 'next-intl';

/**
 * Basic Details View
 * Step 3: Select gender, size, and enter age
 */
export default function BasicsView() {
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const t = useTranslations('adPlacementDetails.basicsView');
  const tCommon = useTranslations('common');

  const [gender, setGender] = useState<PetGender | null>(formData.gender);
  const [size, setSize] = useState<PetSize | null>(formData.size);
  const [ageInMonths, setAgeInMonths] = useState<number | null>(formData.ageInMonths);

  const petSizes = useMemo(() => getPetSizes(tCommon), [tCommon]);
  const petGenders = useMemo(() => getPetGender(tCommon), [tCommon]);

  // Calculate years and months from total months
  const years = ageInMonths ? Math.floor(ageInMonths / 12) : 0;
  const months = ageInMonths ? ageInMonths % 12 : 0;

  const handleGenderSelect = (value: PetGender) => {
    setGender(value);
    updateFormData({ gender: value });
  };

  const handleSizeSelect = (value: PetSize) => {
    setSize(value);
    updateFormData({ size: value });
  };

  const handleAgeChange = (totalMonths: number) => {
    const validAge = Math.max(0, Math.min(totalMonths, 600)); // Max 50 years
    setAgeInMonths(validAge);
    updateFormData({ ageInMonths: validAge });
  };

  const handleYearsChange = (newYears: number) => {
    const validYears = Math.max(0, Math.min(newYears, 50));
    handleAgeChange(validYears * 12 + months);
  };

  const handleMonthsChange = (newMonths: number) => {
    const validMonths = Math.max(0, Math.min(newMonths, 11));
    handleAgeChange(years * 12 + validMonths);
  };

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition('/ads/ad-placement/physical');
    }
  };

  const handleBack = () => {
    navigateWithTransition('/ads/ad-placement/breed');
  };

  const canProceed = gender !== null && size !== null && ageInMonths !== null && ageInMonths > 0;

  return (
    <>
      <ViewLayout>
        <div className="space-y-12">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="page-title">{t('heading')}</Heading>
            <Text variant="body-lg" color="secondary">
              {t('subheading')}
            </Text>
          </div>

          {/* Gender Section */}
          <div className="space-y-4">
            <Heading variant="subsection">{t('genderLabel')}</Heading>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(petGenders).map(([key, { label, icon }]) => {
                const _gender = +key as PetGender;
                return (
                  <OptionCard
                    key={_gender}
                    selected={gender === _gender}
                    onClick={() => handleGenderSelect(_gender)}
                    icon={icon}
                    title={label}
                    layout="vertical"
                    size="md"
                  />
                );
              })}
            </div>
          </div>

          {/* Size Section */}
          <div className="space-y-4">
            <Heading variant="subsection">{t('sizeLabel')}</Heading>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(petSizes).map(([key, { label, description }]) => {
                const _size = +key as PetSize;

                return (
                  <OptionCard
                    key={_size}
                    selected={size === _size}
                    onClick={() => handleSizeSelect(_size)}
                    title={label}
                    description={description}
                    layout="vertical"
                    size="sm"
                  />
                );
              })}
            </div>
          </div>

          {/* Age Section */}
          <div className="space-y-4">
            <Heading variant="subsection">{t('ageLabel')}</Heading>
            <Text variant="small" color="secondary">
              {t('ageQuestion')}
            </Text>

            <div className="grid grid-cols-2 gap-4">
              {/* Years Input */}
              <div className="space-y-2">
                <Label variant="field" htmlFor="years" className="block">
                  {t('yearsLabel')}
                </Label>
                <div className="relative">
                  <input
                    type="number"
                    id="years"
                    min="0"
                    max="50"
                    value={years}
                    onChange={(e) => handleYearsChange(parseInt(e.target.value) || 0)}
                    className={cn(
                      'w-full px-4 py-4 rounded-xl border-2 border-gray-200',
                      'focus:border-black focus:outline-none transition-colors',
                      'text-lg text-center font-semibold'
                    )}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Months Input */}
              <div className="space-y-2">
                <Label variant="field" htmlFor="months" className="block">
                  {t('monthsLabel')}
                </Label>
                <div className="relative">
                  <input
                    type="number"
                    id="months"
                    min="0"
                    max="11"
                    value={months}
                    onChange={(e) => handleMonthsChange(parseInt(e.target.value) || 0)}
                    className={cn(
                      'w-full px-4 py-4 rounded-xl border-2 border-gray-200',
                      'focus:border-black focus:outline-none transition-colors',
                      'text-lg text-center font-semibold'
                    )}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Age Display */}
            {ageInMonths !== null && ageInMonths > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-center text-gray-700">
                  <span className="font-semibold">Total age:</span> {years > 0 && `${years} year${years !== 1 ? 's' : ''}`}
                  {years > 0 && months > 0 && ' and '}
                  {months > 0 && `${months} month${months !== 1 ? 's' : ''}`}
                  <span className="text-gray-500 ml-2">({ageInMonths} months)</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </ViewLayout>

      <ViewFooter onBack={handleBack} onNext={handleNext} canProceed={canProceed} />
    </>
  );
}
