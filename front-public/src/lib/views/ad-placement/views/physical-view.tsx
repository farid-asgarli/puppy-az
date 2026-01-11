'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAdPlacement } from '@/lib/contexts/ad-placement-context';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { OptionCard, NumberField } from '@/lib/components/views/ad-placement';
import { ViewFooter, ViewLayout } from '../components';
import { Heading, Text } from '@/lib/primitives/typography';

/**
 * Physical Details View
 * Step 4: Enter color and weight
 */
export default function PhysicalView() {
  const t = useTranslations('adPlacementDetails.physicalView');
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();

  /**
   * Common pet colors for quick selection (localized)
   */
  const COMMON_COLORS = [
    { key: 'black', label: t('colorBlack') },
    { key: 'white', label: t('colorWhite') },
    { key: 'brown', label: t('colorBrown') },
    { key: 'gray', label: t('colorGray') },
    { key: 'golden', label: t('colorGolden') },
    { key: 'cream', label: t('colorCream') },
    { key: 'tan', label: t('colorTan') },
    { key: 'orange', label: t('colorOrange') },
    { key: 'spotted', label: t('colorSpotted') },
    { key: 'striped', label: t('colorStriped') },
    { key: 'mixed', label: t('colorMixed') },
    { key: 'other', label: t('colorOther') },
  ] as const;

  const [color, setColor] = useState<string>(formData.color || '');
  const [weight, setWeight] = useState<number | null>(formData.weight);
  const colorLabels = COMMON_COLORS.map((c) => c.label);
  const [customColorMode, setCustomColorMode] = useState<boolean>(formData.color !== '' && !colorLabels.includes(formData.color));

  const handleColorSelect = (selectedColor: string) => {
    if (selectedColor === t('colorOther')) {
      setCustomColorMode(true);
      setColor('');
    } else {
      setCustomColorMode(false);
      setColor(selectedColor);
      updateFormData({ color: selectedColor });
    }
  };

  const handleCustomColorChange = (value: string) => {
    setColor(value);
    updateFormData({ color: value });
  };

  const handleWeightChange = (value: number | null) => {
    const validWeight = value !== null ? Math.max(0, Math.min(value, 500)) : null; // Max 500kg
    setWeight(validWeight);
    updateFormData({ weight: validWeight });
  };

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition('/ads/ad-placement/location');
    }
  };

  const handleBack = () => {
    navigateWithTransition('/ads/ad-placement/basics');
  };

  const canProceed = color.trim().length > 0;

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

          {/* Color Section */}
          <div className="space-y-4">
            <Heading variant="subsection">{t('colorHeading')}</Heading>
            <Text variant="small" color="secondary">
              {t('colorQuestion')}
            </Text>

            {!customColorMode ? (
              <>
                {/* Common Colors Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {COMMON_COLORS.map((colorOption) => (
                    <OptionCard
                      key={colorOption.key}
                      selected={color === colorOption.label}
                      onClick={() => handleColorSelect(colorOption.label)}
                      title={colorOption.label}
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
                    value={color}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder={t('customColorPlaceholder')}
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-colors text-lg"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomColorMode(false);
                      setColor('');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    {t('backToCommonColors')}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Weight Section */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <Heading variant="subsection">{t('weightHeading')}</Heading>
              <Text variant="small" color="muted">
                {t('optional')}
              </Text>
            </div>

            <NumberField
              label=""
              value={weight}
              onChange={handleWeightChange}
              min={0}
              max={500}
              step={0.1}
              suffix="kg"
              placeholder={t('weightPlaceholder')}
              helperText={t('weightHelper')}
            />

            {weight !== null && weight > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{t('weightLabel')}</span> {weight} kg
                  {weight < 1 && ` (${t('weightLessThan1')})`}
                  {weight >= 1 && weight < 10 && ` (${t('weightSmall')})`}
                  {weight >= 10 && weight < 25 && ` (${t('weightMedium')})`}
                  {weight >= 25 && weight < 50 && ` (${t('weightLarge')})`}
                  {weight >= 50 && ` (${t('weightVeryLarge')})`}
                </p>
              </div>
            )}

            {/* Skip Weight Option */}
            {(weight === null || weight === 0) && <p className="text-sm text-gray-500 italic">{t('skipWeightText')}</p>}
          </div>
        </div>
      </ViewLayout>

      <ViewFooter onBack={handleBack} onNext={handleNext} canProceed={canProceed} />
    </>
  );
}
