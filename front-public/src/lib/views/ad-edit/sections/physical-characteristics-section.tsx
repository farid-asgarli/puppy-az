'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/external/utils';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { OptionCard } from '@/lib/components/views/ad-placement';

interface PhysicalCharacteristicsSectionProps {
  formData: {
    color: string;
    weight: number | null;
  };
  onChange: (data: Partial<PhysicalCharacteristicsSectionProps['formData']>) => void;
  errors?: {
    color?: string;
    weight?: string;
  };
}

/**
 * Physical Characteristics Section
 * Color (required), Weight (optional)
 */
export const PhysicalCharacteristicsSection = ({ formData, onChange, errors = {} }: PhysicalCharacteristicsSectionProps) => {
  const t = useTranslations('adEdit.physicalCharacteristics');

  const COMMON_COLORS = [
    t('colors.black'),
    t('colors.white'),
    t('colors.brown'),
    t('colors.gray'),
    t('colors.golden'),
    t('colors.cream'),
    t('colors.yellow'),
    t('colors.orange'),
    t('colors.spotted'),
    t('colors.striped'),
    t('colors.mixed'),
    t('colors.other'),
  ] as const;

  const [customColorMode, setCustomColorMode] = useState<boolean>(
    formData.color !== '' && !COMMON_COLORS.includes(formData.color as (typeof COMMON_COLORS)[number])
  );

  const handleColorSelect = (selectedColor: string) => {
    if (selectedColor === t('colors.other')) {
      setCustomColorMode(true);
      onChange({ color: '' });
    } else {
      setCustomColorMode(false);
      onChange({ color: selectedColor });
    }
  };

  const handleCustomColorChange = (value: string) => {
    onChange({ color: value });
  };

  const handleWeightChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || value === '') {
      onChange({ weight: null });
    } else {
      const validWeight = Math.max(0, Math.min(numValue, 500)); // Max 500kg
      onChange({ weight: validWeight });
    }
  };

  const handleWeightBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const validWeight = Math.max(0, Math.min(value, 500));
      onChange({ weight: validWeight });
    }
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

      {/* Color Section */}
      <div className="space-y-4">
        <Label variant="field">{t('color')}</Label>
        <Text variant="small" color="secondary">
          {t('colorQuestion')}
        </Text>

        {!customColorMode ? (
          <>
            {/* Common Colors Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {COMMON_COLORS.map((colorOption) => (
                <OptionCard
                  key={colorOption}
                  selected={formData.color === colorOption}
                  onClick={() => handleColorSelect(colorOption)}
                  title={colorOption}
                  showCheckmark={false}
                  size="sm"
                  layout="vertical"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Custom Color Input */}
            <div className="space-y-3">
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                onBlur={(e) => {
                  // Trim whitespace on blur
                  onChange({ color: e.target.value.trim() });
                }}
                placeholder={t('customColorPlaceholder')}
                className={cn(
                  'w-full px-4 py-4 rounded-xl border-2 transition-colors text-lg',
                  errors.color ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black focus:outline-none'
                )}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setCustomColorMode(false);
                  onChange({ color: '' });
                }}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                {t('backToCommonColors')}
              </button>
            </div>
          </>
        )}

        {errors.color && (
          <Text variant="small" className="text-red-600">
            {errors.color}
          </Text>
        )}
      </div>

      {/* Weight Section */}
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <Label variant="field">{t('weight')}</Label>
          <Text variant="small" color="muted">
            {t('weightOptional')}
          </Text>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="number"
              value={formData.weight ?? ''}
              onChange={(e) => handleWeightChange(e.target.value)}
              onBlur={handleWeightBlur}
              min="0"
              max="500"
              step="0.1"
              placeholder={t('weightPlaceholder')}
              className={cn(
                'w-full px-4 py-4 pr-16 rounded-xl border-2 transition-colors text-lg',
                errors.weight ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black focus:outline-none'
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{t('weightUnit')}</div>
          </div>

          <Text variant="small" color="secondary">
            {t('weightQuestion')}
          </Text>

          {/* Weight Display with Category */}
          {formData.weight !== null && formData.weight > 0 && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{t('weightDisplay')}</span> {formData.weight} {t('weightUnit')}
                {formData.weight < 1 && ` (${t('weightLessThan1')})`}
                {formData.weight >= 1 && formData.weight < 10 && ` (${t('weightSmall')})`}
                {formData.weight >= 10 && formData.weight < 25 && ` (${t('weightMedium')})`}
                {formData.weight >= 25 && formData.weight < 50 && ` (${t('weightLarge')})`}
                {formData.weight >= 50 && ` (${t('weightExtraLarge')})`}
              </p>
            </div>
          )}

          {/* Skip Weight Option */}
          {(formData.weight === null || formData.weight === 0) && <p className="text-sm text-gray-500 italic">{t('weightSkipNote')}</p>}

          {errors.weight && (
            <Text variant="small" className="text-red-600">
              {errors.weight}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhysicalCharacteristicsSection;
