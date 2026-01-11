'use client';

import { useId } from 'react';
import { cn } from '@/lib/external/utils';
import { Text, Label } from '@/lib/primitives/typography';
import type { TextareaFieldProps } from './form-field.types';

/**
 * TextareaField - Multi-line text input with label, validation, and character count
 *
 * Features:
 * - Character counter with color coding
 * - Min/max length validation
 * - Validation states (error, success)
 * - Helper text
 * - Optional resizing
 * - Accessibility: proper labels, ARIA attributes
 *
 * @example
 * <TextareaField
 *   label="Description"
 *   value={description}
 *   onChange={setDescription}
 *   rows={8}
 *   maxLength={2000}
 *   minLength={30}
 *   showCharCount
 *   placeholder="Describe your pet..."
 * />
 */
export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  minLength,
  showCharCount,
  helperText,
  errorText,
  successText,
  disabled = false,
  required = false,
  resizable = false,
  className,
  id: providedId,
}: TextareaFieldProps) {
  const autoId = useId();
  const id = providedId || autoId;
  const shouldShowCharCount = showCharCount ?? !!maxLength;

  // Determine validation state
  const hasError = !!errorText;
  const hasSuccess = !!successText && !hasError;

  // Auto-generate validation messages if minLength is provided
  const isValid = !minLength || value.length >= minLength;
  const remainingChars = minLength ? minLength - value.length : 0;

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

      {/* Textarea */}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-4 py-4 rounded-xl border-2 transition-colors text-base',
          'focus:outline-none',
          resizable ? 'resize-y' : 'resize-none',
          hasError && 'border-red-300 focus:border-red-500',
          hasSuccess && 'border-green-300 focus:border-green-500',
          !hasError && !hasSuccess && 'border-gray-200 focus:border-black',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
        )}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
      />

      {/* Validation Messages */}
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
      {!errorText && !successText && minLength && value.length > 0 && !isValid && (
        <Text variant="small" as="p">
          Need at least {remainingChars} more character{remainingChars !== 1 ? 's' : ''}
        </Text>
      )}
      {!errorText && !successText && isValid && minLength && value.length >= minLength && (
        <Text variant="small" className="text-green-600 flex items-center gap-1" as="p">
          <span>✓</span>
          <span>Great! Minimum length met</span>
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
