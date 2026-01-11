'use client';

import RangeSlider from '@/lib/form/components/slider/slider.component';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Example usage for price range
export function SliderDemo() {
  const t = useTranslations('sliderDemo');
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 2700]);

  const formatPrice = (value: number) => {
    return value === 2700 ? `$${value}+` : `$${value}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h3 className="text-lg font-medium mb-2">{t('title')}</h3>
      <p className="text-gray-600 mb-6">{t('subtitle')}</p>

      {/* Histogram for visual reference */}
      <div className="h-24 mb-4 flex items-end">
        {Array(40)
          .fill(0)
          .map((_, i) => {
            // Generate a simple bell curve for the histogram
            const height = Math.sin((i / 40) * Math.PI) * 100;
            return <div key={i} className="w-1 bg-red-500 mx-0.5" style={{ height: `${height}%` }} />;
          })}
      </div>

      <RangeSlider
        min={0}
        max={3000}
        step={50}
        minValue={priceRange[0]}
        maxValue={priceRange[1]}
        onChange={setPriceRange}
        formatValue={formatPrice}
        rangeColor="bg-red-500"
      />

      <div className="flex justify-between mt-6">
        <div>
          <p className="text-gray-500 mb-2">{t('minimum')}</p>
          <div className="border border-gray-300 rounded-full px-4 py-2">
            <span>{formatPrice(priceRange[0])}</span>
          </div>
        </div>

        <div>
          <p className="text-gray-500 mb-2">{t('maximum')}</p>
          <div className="border border-gray-300 rounded-full px-4 py-2">
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
