import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/external/utils';
import { ComponentSizing } from '@/lib/types/component-sizing';

export interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ComponentSizing;
  fullWidth?: boolean;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number | 'any';
  currency?: string;
  allowDecimals?: boolean;
  decimalPlaces?: number;
  showControls?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = true,
      value,
      onChange,
      min,
      max,
      step = 1,
      currency,
      allowDecimals = true,
      decimalPlaces = 2,
      showControls = false,
      containerClassName,
      labelClassName,
      inputClassName,
      helperTextClassName,
      errorClassName,
      disabled,
      onBlur,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a random ID if none is provided
    const inputId = id || `numeric-input-${Math.random().toString(36).substring(2, 9)}`;

    // Internal value state for string representation (display)
    const [inputValue, setInputValue] = useState<string>(value?.toString() || '');

    // Number value for calculations
    const [numericValue, setNumericValue] = useState<number | null>(value !== undefined && value !== null ? Number(value) : null);

    // Update internal state when controlled value changes
    useEffect(() => {
      if (value !== undefined && value !== null) {
        const parsedValue = Number(value);
        setNumericValue(parsedValue);

        // Format value based on settings
        if (!isNaN(parsedValue)) {
          if (allowDecimals) {
            setInputValue(parsedValue.toFixed(decimalPlaces));
          } else {
            setInputValue(Math.round(parsedValue).toString());
          }
        }
      }
    }, [value, allowDecimals, decimalPlaces]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: newValue } = e.target;

      // Store raw input value
      setInputValue(newValue);

      // Parse value
      let parsedValue: number | null = null;

      if (newValue !== '') {
        parsedValue = allowDecimals ? parseFloat(newValue) : parseInt(newValue, 10);

        // Validate limits if they exist
        if (!isNaN(parsedValue)) {
          if (min !== undefined && parsedValue < min) {
            parsedValue = min;
          }

          if (max !== undefined && parsedValue > max) {
            parsedValue = max;
          }

          // Handle decimal limitations
          if (!allowDecimals) {
            parsedValue = Math.round(parsedValue);
          }
        }
      }

      // Store numeric value
      setNumericValue(isNaN(parsedValue!) ? null : parsedValue);

      // Call onChange handler
      if (onChange) {
        onChange(isNaN(parsedValue!) ? null : parsedValue);
      }
    };

    // Handle blur event to format the value
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Format the value on blur
      if (numericValue !== null && !isNaN(numericValue)) {
        if (allowDecimals) {
          setInputValue(numericValue.toFixed(decimalPlaces));
        } else {
          setInputValue(Math.round(numericValue).toString());
        }
      } else if (inputValue !== '') {
        setInputValue('');
      }

      // Call onBlur handler
      if (onBlur) {
        onBlur(e);
      }
    };

    // Handle increment/decrement
    const handleIncrement = () => {
      if (disabled) return;

      let newValue = (numericValue !== null ? numericValue : 0) + (step === 'any' ? 1 : Number(step));

      if (max !== undefined && newValue > max) {
        newValue = max;
      }

      setNumericValue(newValue);
      setInputValue(allowDecimals ? newValue.toFixed(decimalPlaces) : Math.round(newValue).toString());

      if (onChange) {
        onChange(newValue);
      }
    };

    const handleDecrement = () => {
      if (disabled) return;

      let newValue = (numericValue !== null ? numericValue : 0) - (step === 'any' ? 1 : Number(step));

      if (min !== undefined && newValue < min) {
        newValue = min;
      }

      setNumericValue(newValue);
      setInputValue(allowDecimals ? newValue.toFixed(decimalPlaces) : Math.round(newValue).toString());

      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <div className={cn('mb-4', fullWidth && 'w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block mb-2 font-semibold',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg',
              disabled ? 'text-gray-400' : 'text-gray-700',
              error && 'text-red-600',
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {/* Input container */}
        <div
          className={cn(
            'relative flex items-center rounded-2xl overflow-hidden transition-all duration-200 border-2',
            disabled && 'bg-gray-50 cursor-not-allowed',
            error
              ? 'border-red-500 bg-red-50/30'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white focus-within:border-primary-500 focus-within:bg-primary-50/30'
          )}
        >
          {/* Left icon or currency */}
          {(leftIcon || currency) && (
            <div className="flex items-center px-4 shrink-0">
              <div className={cn('text-gray-400', error && 'text-red-500')}>
                {currency ? (
                  <span
                    className={cn(
                      'text-gray-500 font-medium',
                      size === 'xs' && 'text-xs',
                      size === 'sm' && 'text-sm',
                      size === 'md' && 'text-sm',
                      size === 'lg' && 'text-base',
                      size === 'xl' && 'text-lg',
                      error && 'text-red-400'
                    )}
                  >
                    {currency}
                  </span>
                ) : (
                  leftIcon
                )}
              </div>
            </div>
          )}

          {/* Input element */}
          <input
            id={inputId}
            ref={ref}
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={cn(
              'flex-1 min-w-0 bg-transparent focus:outline-none',
              size === 'xs' && 'py-1 text-xs',
              size === 'sm' && 'py-1.5 text-sm',
              size === 'md' && 'py-3 text-base',
              size === 'lg' && 'py-3.5 text-lg',
              size === 'xl' && 'py-4 text-xl',
              leftIcon || currency ? 'pr-4' : 'px-4',
              (rightIcon || showControls) && !(leftIcon || currency) && 'pl-4',
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900',
              error ? 'placeholder-red-300' : 'placeholder-gray-400',
              inputClassName,
              className
            )}
            min={min}
            max={max}
            step={step}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {/* Right icon or increment/decrement controls */}
          {(showControls || rightIcon) && (
            <div className="flex items-center px-3 shrink-0">
              {showControls ? (
                <div className="flex border border-gray-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    className={cn(
                      'flex items-center justify-center h-full px-2 bg-gray-50 hover:bg-gray-100 transition-colors',
                      disabled && 'cursor-not-allowed opacity-50',
                      error && 'text-red-400'
                    )}
                    onClick={handleDecrement}
                    disabled={disabled || (min !== undefined && numericValue !== null && numericValue <= min)}
                    tabIndex={-1}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex items-center justify-center h-full px-2 bg-gray-50 hover:bg-gray-100 transition-colors',
                      disabled && 'cursor-not-allowed opacity-50',
                      error && 'text-red-400'
                    )}
                    onClick={handleIncrement}
                    disabled={disabled || (max !== undefined && numericValue !== null && numericValue >= max)}
                    tabIndex={-1}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className={cn('text-gray-400', error && 'text-red-400')}>{rightIcon}</div>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} className={cn('mt-1.5 text-sm text-red-600', errorClassName)}>
            {error}
          </p>
        )}

        {/* Helper text (only shown if no error) */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className={cn('mt-1.5 text-sm text-gray-500', helperTextClassName)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

NumericInput.displayName = 'NumericInput';

export default NumericInput;
