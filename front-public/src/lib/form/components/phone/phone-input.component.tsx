import React, { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/external/utils';
import { ComponentSizing } from '@/lib/types/component-sizing';
import { IconPhone } from '@tabler/icons-react';

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: ComponentSizing;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  countryCode?: string; // Default: +994 for Azerbaijan
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = true,
      containerClassName,
      labelClassName,
      inputClassName,
      helperTextClassName,
      errorClassName,
      className,
      id,
      disabled,
      countryCode = '+994',
      placeholder = '50 123 45 67',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={cn(fullWidth && 'w-full', containerClassName)}>
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

        <div
          className={cn(
            'relative flex items-center rounded-xl overflow-hidden transition-all duration-200 border-2',
            disabled && 'bg-gray-50 cursor-not-allowed',
            error ? 'border-red-500 bg-red-50/30' : 'border-gray-200 bg-white hover:border-gray-400 focus-within:border-black focus-within:bg-white'
          )}
        >
          {/* Phone Icon */}
          <div className="flex items-center pl-4 shrink-0">
            <IconPhone size={18} className={cn('text-gray-400', error && 'text-red-500')} />
          </div>

          {/* Country Code Prefix */}
          <div
            className={cn(
              'flex items-center px-2 shrink-0 font-medium text-gray-700',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-base',
              size === 'lg' && 'text-lg',
              size === 'xl' && 'text-xl',
              error && 'text-red-600'
            )}
          >
            {countryCode}
          </div>

          <input
            id={inputId}
            ref={ref}
            type="tel"
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'flex-1 min-w-0 bg-transparent focus:outline-none pr-4',
              size === 'xs' && 'py-1 text-xs',
              size === 'sm' && 'py-1.5 text-sm',
              size === 'md' && 'py-3 text-base',
              size === 'lg' && 'py-3.5 text-lg',
              size === 'xl' && 'py-4 text-xl',
              disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900',
              error ? 'placeholder-red-300' : 'placeholder-gray-400',
              inputClassName,
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} className={cn('mt-2 text-sm text-red-600 font-medium', errorClassName)}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className={cn('mt-2 text-sm text-gray-500', helperTextClassName)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
