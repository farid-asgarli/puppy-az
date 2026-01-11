'use client';

import { useState } from 'react';
import { IconEye, IconEyeOff, IconAlertCircle } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { Label } from '@/lib/primitives/typography';
import type { AuthFormFieldProps } from './form-field.types';
import { useTranslations } from 'next-intl';

/**
 * Auth Form Field Component
 * Unified form input with icon, error handling, and accessibility
 * Supports both controlled and React Hook Form modes
 */
export const AuthFormField: React.FC<AuthFormFieldProps> = ({
  type,
  label,
  icon: Icon,
  placeholder,
  error,
  disabled = false,
  showPasswordToggle = false,
  value,
  onChange,
  registerProps,
  id,
  className,
  inputProps = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations('auth');
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
          <Icon size={20} />
        </div>

        {/* Input Field */}
        <input
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'w-full pl-12 py-3 rounded-xl border-2 transition-all duration-200',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-0',
            error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-200 bg-white focus:border-gray-900',
            disabled && 'opacity-50 cursor-not-allowed',
            isPasswordField && showPasswordToggle ? 'pr-12' : 'pr-4'
          )}
          {...registerProps}
          {...inputProps}
        />

        {/* Password Toggle Button */}
        {isPasswordField && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2',
              'text-gray-400 hover:text-gray-600 transition-colors',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={showPassword ? t('hidePassword') : t('showPassword')}
          >
            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
          <IconAlertCircle size={16} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthFormField;
