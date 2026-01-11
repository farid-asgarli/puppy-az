'use client';

import { useTranslations } from 'next-intl';
import { PetAdType } from '@/lib/api/types/pet-ad.types';
import { cn } from '@/lib/external/utils';
import { Heading, Text, Label } from '@/lib/primitives/typography';
import { IconInfoCircle, IconCurrencyManat } from '@tabler/icons-react';

interface PricingSectionProps {
  adType: PetAdType;
  formData: {
    price: number;
  };
  onChange: (data: Partial<PricingSectionProps['formData']>) => void;
  errors?: {
    price?: string;
  };
}

/**
 * Pricing Section
 * Conditional pricing section for Sale ads only
 */
export const PricingSection = ({ adType, formData, onChange, errors = {} }: PricingSectionProps) => {
  const t = useTranslations('adEdit.pricing');

  // Only show for Sale ads
  if (adType !== PetAdType.Sale) {
    return null;
  }

  const handlePriceChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || value === '') {
      onChange({ price: 0 });
    } else {
      const validPrice = Math.max(0, numValue);
      onChange({ price: validPrice });
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const validPrice = Math.max(0, value);
      onChange({ price: validPrice });
    } else {
      onChange({ price: 0 });
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

      {/* Price Input */}
      <div className="space-y-3">
        <Label variant="field" htmlFor="price">
          {t('price')}
          <span className="text-red-600 ml-1">{t('priceRequired')}</span>
        </Label>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-1">
            <IconCurrencyManat size={20} />
          </div>
          <input
            type="number"
            id="price"
            value={formData.price || ''}
            onChange={(e) => handlePriceChange(e.target.value)}
            onBlur={handlePriceBlur}
            min="0"
            step="0.01"
            placeholder={t('pricePlaceholder')}
            className={cn(
              'w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-colors text-lg font-semibold',
              'focus:outline-none',
              errors.price ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-200 focus:border-black'
            )}
          />
        </div>

        {errors.price && (
          <Text variant="small" className="text-red-600">
            {errors.price}
          </Text>
        )}

        <Text variant="small" color="secondary">
          {t('priceNote')}
        </Text>
      </div>

      {/* Price Display */}
      {formData.price > 0 && (
        <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <Text variant="body" color="secondary">
              {t('adPrice')}
            </Text>
            <div className="flex items-center gap-2">
              <IconCurrencyManat size={24} className="text-gray-900" />
              <span className="text-2xl font-bold text-gray-900">{formData.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tips */}
      <div className="p-4 rounded-xl bg-green-50 border-2 border-green-100">
        <div className="flex gap-3">
          <IconInfoCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900 mb-2">{t('pricingTips')}</p>
            <ul className="space-y-1 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>{t('pricingTip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>{t('pricingTip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>{t('pricingTip3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>{t('pricingTip4')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>{t('pricingTip5')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Price Ranges Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border-2 border-gray-200 bg-white">
          <Text variant="small" color="secondary" className="mb-1">
            {t('lowPrice')}
          </Text>
          <div className="flex items-center gap-1">
            <IconCurrencyManat size={18} className="text-gray-600" />
            <p className="text-lg font-semibold text-gray-900">{t('lowPriceRange')}</p>
          </div>
          <Text variant="small" color="muted" className="mt-1">
            {t('lowPriceNote')}
          </Text>
        </div>

        <div className="p-4 rounded-xl border-2 border-gray-200 bg-white">
          <Text variant="small" color="secondary" className="mb-1">
            {t('mediumPrice')}
          </Text>
          <div className="flex items-center gap-1">
            <IconCurrencyManat size={18} className="text-gray-600" />
            <p className="text-lg font-semibold text-gray-900">{t('mediumPriceRange')}</p>
          </div>
          <Text variant="small" color="muted" className="mt-1">
            {t('mediumPriceNote')}
          </Text>
        </div>

        <div className="p-4 rounded-xl border-2 border-gray-200 bg-white">
          <Text variant="small" color="secondary" className="mb-1">
            {t('highPrice')}
          </Text>
          <div className="flex items-center gap-1">
            <IconCurrencyManat size={18} className="text-gray-600" />
            <p className="text-lg font-semibold text-gray-900">{t('highPriceRange')}</p>
          </div>
          <Text variant="small" color="muted" className="mt-1">
            {t('highPriceNote')}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
