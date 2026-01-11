'use client';

import { useId } from 'react';
import { cn } from '@/lib/external/utils';
import { Text, Label } from '@/lib/primitives/typography';
import type { TextFieldProps } from './form-field.types';

/**
 * TextField - Single line text input with label, validation, and character count
 *
 * Features:
 * - Character counter with color coding
 * - Prefix/suffix support (currency, units)
 * - Validation states (error, success)
 * - Helper text
 * - Accessibility: proper labels, ARIA attributes
 *
 * @example
 * <TextField
 *   label="Pet Name"
 *   value={name}
 *   onChange={setName}
 *   maxLength={50}
 *   showCharCount
 *   placeholder="Enter pet name..."
 * />
 */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  showCharCount,
  helperText,
  errorText,
  successText,
  disabled = false,
  required = false,
  className,
  id: providedId,
  prefix,
  suffix,
}: TextFieldProps) {
  const autoId = useId();
  const id = providedId || autoId;
  const shouldShowCharCount = showCharCount ?? !!maxLength;

  // Determine validation state
  const hasError = !!errorText;
  const hasSuccess = !!successText && !hasError;

  // Character count color
  const getCharCountColor = () => {
    if (!maxLength) return 'text-gray-500';
    if (value.length < maxLength * 0.8) return 'text-gray-500';
    if (value.length >= maxLength) return 'text-red-600';
    return 'text-orange-600';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label and Character Count */}
      <div className="flex items-center justify-between">
        <Label variant="field" htmlFor={id}>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </Label>
        {shouldShowCharCount && maxLength && (
          <Text variant="small" weight="medium" className={getCharCountColor()} as="span">
            {value.length} / {maxLength}
          </Text>
        )}
      </div>

      {/* Input Container */}
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
            <Text variant="body-xl" weight="semibold" className="text-gray-500" as="span">
              {prefix}
            </Text>
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
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
            <Text variant="body" weight="medium" className="text-gray-500" as="span">
              {suffix}
            </Text>
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
