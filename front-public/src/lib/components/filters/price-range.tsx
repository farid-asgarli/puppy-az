// Full component implementation with enhanced design

import React, { useState, useEffect, forwardRef } from 'react';
import * as Slider from '@radix-ui/react-slider';
import Button from '@/lib/primitives/button/button.component';
import { cn } from '@/lib/external/utils';
import TextInput from '@/lib/form/components/text/text-input.component';
import { Label, Text } from '@/lib/primitives/typography';
import { useTranslations } from 'next-intl';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  value?: [number, number];
  currency?: string;
  onChange?: (range: [number, number]) => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  allowCustomInput?: boolean;
  showMinMaxLabels?: boolean;
  error?: string;
  helperText?: string;
}

const PriceRangeSlider = forwardRef<HTMLDivElement, PriceRangeSliderProps>(
  (
    {
      min = 0,
      max = 1000,
      step = 10,
      defaultValue = [0, 500],
      value: controlledValue,
      currency = '₼',
      onChange,
      label,
      className,
      size = 'md',
      allowCustomInput = true,
      showMinMaxLabels = true,
      error,
      helperText,
    },
    ref
  ) => {
    const t = useTranslations('filters');
    const tAccessibility = useTranslations('accessibility');
    const displayLabel = label || t('priceRange');

    // Support controlled and uncontrolled modes
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
    const value = isControlled ? controlledValue : internalValue;

    const [inputMin, setInputMin] = useState<string>(value[0].toString());
    const [inputMax, setInputMax] = useState<string>(value[1].toString());
    const [isCustomRange, setIsCustomRange] = useState<boolean>(false);

    // Generate unique IDs for accessibility
    const id = React.useId();
    const minInputId = `${id}-min`;
    const maxInputId = `${id}-max`;
    const sliderId = `${id}-slider`;

    // Update internal state when controlled value changes
    useEffect(() => {
      if (isControlled && controlledValue) {
        setInputMin(controlledValue[0].toString());
        setInputMax(controlledValue[1].toString());
      }
    }, [isControlled, controlledValue]);

    // Update inputs when slider changes (if not in custom input mode)
    useEffect(() => {
      if (!isCustomRange) {
        setInputMin(value[0].toString());
        setInputMax(value[1].toString());
      }
    }, [value, isCustomRange]);

    const handleSliderChange = (newValues: number[]) => {
      const typedValues = newValues as [number, number];

      if (!isControlled) {
        setInternalValue(typedValues);
      }

      if (onChange) {
        onChange(typedValues);
      }
    };

    const handleInputChange = () => {
      const minValue = Math.max(min, Math.min(max, Number(inputMin) || min));
      const maxValue = Math.max(minValue, Math.min(max, Number(inputMax) || max));

      const newRange: [number, number] = [minValue, maxValue];

      if (!isControlled) {
        setInternalValue(newRange);
      }

      setInputMin(minValue.toString());
      setInputMax(maxValue.toString());

      if (onChange) {
        onChange(newRange);
      }
    };

    return (
      <div className={cn('w-full', className)} ref={ref}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {displayLabel && (
              <Label variant="field" htmlFor={sliderId} className={cn(error && 'text-red-600')}>
                {displayLabel}
              </Label>
            )}
            {helperText && !error && (
              <Text variant="tiny" className="mt-1 text-gray-500" as="span">
                {helperText}
              </Text>
            )}
          </div>

          {allowCustomInput && (
            <Button onClick={() => setIsCustomRange(!isCustomRange)} variant="underlined" size="sm">
              {isCustomRange ? t('useSlider') : t('enterExactNumber')}
            </Button>
          )}
        </div>

        {/* Enhanced Price Range Display */}
        <div
          className={cn(
            'relative flex items-center justify-center py-4 px-6 rounded-xl transition-colors mb-5',
            error ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200',
            size === 'sm' && 'py-3',
            size === 'md' && 'py-4',
            size === 'lg' && 'py-5'
          )}
        >
          <div className="flex flex-col items-center">
            <div className={cn('flex items-center mb-1', error ? 'text-red-600' : 'text-gray-900')}>
              <Text
                variant={size === 'sm' ? 'body' : size === 'lg' ? 'body-xl' : 'body-lg'}
                weight="semibold"
                className={error ? 'text-red-600' : 'text-gray-900'}
                as="span"
              >
                {value[0].toLocaleString()} — {value[1].toLocaleString()} {currency}
              </Text>
            </div>

            {/* Percent of range info */}
            <Text variant="tiny" className="text-gray-500" as="div">
              {Math.round(((value[1] - value[0]) / (max - min)) * 100)}% of available range
            </Text>
          </div>
        </div>

        {/* Price inputs using our custom Input component */}
        {isCustomRange && (
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <TextInput
                id={minInputId}
                type="number"
                label={t('minimum')}
                value={inputMin}
                onChange={(e) => setInputMin(e.target.value)}
                onBlur={handleInputChange}
                min={min}
                max={max}
                leftIcon={<span className="text-gray-500">{currency}</span>}
                size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
                error={error ? ' ' : undefined} // Pass a space to show error styling without text
                fullWidth
              />
            </div>
            <div className={cn('flex-0 self-center', error ? 'text-red-500' : 'text-gray-600')}>
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex-1">
              <TextInput
                id={maxInputId}
                type="number"
                label={t('maximum')}
                value={inputMax}
                onChange={(e) => setInputMax(e.target.value)}
                onBlur={handleInputChange}
                min={min}
                max={max}
                leftIcon={<span className="text-gray-500">{currency}</span>}
                size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
                error={error ? ' ' : undefined} // Pass a space to show error styling without text
                fullWidth
              />
            </div>
          </div>
        )}

        {/* Price slider */}
        {!isCustomRange && (
          <>
            <div className={cn('px-1', size === 'lg' ? 'py-2' : 'py-1')}>
              <Slider.Root
                id={sliderId}
                className="relative flex items-center select-none touch-none w-full h-5"
                value={value}
                onValueChange={handleSliderChange}
                min={min}
                max={max}
                step={step}
                minStepsBetweenThumbs={1}
                aria-label={tAccessibility('priceRange')}
                aria-invalid={!!error}
              >
                <Slider.Track className={cn('relative grow rounded-full h-2', error ? 'bg-red-200' : 'bg-gray-200')}>
                  <Slider.Range className={cn('absolute rounded-full h-full', error ? 'bg-red-500' : 'bg-primary')} />
                </Slider.Track>
                <Slider.Thumb
                  className={cn(
                    'block w-6 h-6 bg-white border-2 rounded-full shadow-md hover:scale-110 focus:scale-110 transition-all focus:outline-none',
                    error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-primary focus:ring-2 focus:ring-primary/20'
                  )}
                  aria-label={tAccessibility('minPrice')}
                />
                <Slider.Thumb
                  className={cn(
                    'block w-6 h-6 bg-white border-2 rounded-full shadow-md hover:scale-110 focus:scale-110 transition-all focus:outline-none',
                    error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-primary focus:ring-2 focus:ring-primary/20'
                  )}
                  aria-label={tAccessibility('maxPrice')}
                />
              </Slider.Root>
            </div>

            {showMinMaxLabels && (
              <div className="flex justify-between mt-2">
                <Text variant="tiny" weight="medium" className="text-gray-500" as="span">
                  {min.toLocaleString()} {currency}
                </Text>
                <Text variant="tiny" weight="medium" className="text-gray-500" as="span">
                  {max.toLocaleString()} {currency}
                </Text>
              </div>
            )}
          </>
        )}

        {/* Error message */}
        {error && (
          <Text variant="small" className="mt-1.5 text-red-600" as="p">
            {error}
          </Text>
        )}
      </div>
    );
  }
);

PriceRangeSlider.displayName = 'PriceRangeSlider';

export default PriceRangeSlider;
