'use client';

import { useId } from 'react';
import { cn } from '@/lib/external/utils';
import { Text, Label } from '@/lib/primitives/typography';
import type { NumberFieldProps } from './form-field.types';

/**
 * NumberField - Number input with label, validation, and prefix/suffix support
 *
 * Features:
 * - Min/max value constraints
 * - Step increment control
 * - Prefix/suffix support (currency, units)
 * - Validation states (error, success)
 * - Helper text
 * - Accessibility: proper labels, ARIA attributes
 *
 * @example
 * <NumberField
 *   label="Price"
 *   value={price}
 *   onChange={setPrice}
 *   min={0}
 *   step={0.01}
 *   prefix="₼"
 *   decimals={2}
 * />
 */
export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  helperText,
  errorText,
  successText,
  disabled = false,
  required = false,
  className,
  id: providedId,
  prefix,
  suffix,
  decimals,
}: NumberFieldProps) {
  const autoId = useId();
  const id = providedId || autoId;

  // Determine validation state
  const hasError = !!errorText;
  const hasSuccess = !!successText && !hasError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input
    if (inputValue === '') {
      onChange(null);
      return;
    }

    // Parse number
    const numValue = parseFloat(inputValue);

    // Validate and constrain
    if (!isNaN(numValue)) {
      let constrainedValue = numValue;

      if (min !== undefined && numValue < min) {
        constrainedValue = min;
      }
      if (max !== undefined && numValue > max) {
        constrainedValue = max;
      }

      onChange(constrainedValue);
    }
  };

  // Format display value with decimals
  const displayValue = value !== null && decimals !== undefined ? value.toFixed(decimals) : value ?? '';

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label variant="field" htmlFor={id}>
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </Label>

      {/* Input Container */}
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
            <span className="text-gray-500 text-lg sm:text-2xl font-semibold">{prefix}</span>
          </div>
        )}

        {/* Input */}
        <input
          type="number"
          id={id}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full px-4 py-4 rounded-xl border-2 transition-colors text-lg',
            'focus:outline-none',
            prefix && 'pl-12 sm:pl-16',
            suffix && 'pr-12 sm:pr-16',
            hasError && 'border-red-300 focus:border-red-500',
            hasSuccess && 'border-green-300 focus:border-green-500',
            !hasError && !hasSuccess && 'border-gray-200 focus:border-black',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        />

        {/* Suffix */}
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center pointer-events-none">
            <span className="text-gray-500 font-medium">{suffix}</span>
          </div>
        )}
      </div>

      {/* Helper/Error/Success Text */}
      {errorText && (
        <div id={`${id}-error`} role="alert">
          <Text variant="small" className="text-red-600" as="p">
            {errorText}
          </Text>
        </div>
      )}
      {!errorText && successText && (
        <Text variant="small" className="text-green-600 flex items-center gap-1" as="p">
          <span>✓</span>
          <span>{successText}</span>
        </Text>
      )}
      {!errorText && !successText && helperText && (
        <div id={`${id}-helper`}>
          <Text variant="small" as="p">
            {helperText}
          </Text>
        </div>
      )}
    </div>
  );
}
