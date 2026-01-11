import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/external/utils';
import { ComponentSizing } from '@/lib/types/component-sizing';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: ComponentSizing;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  characterCountClassName?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      rows = 4,
      maxLength,
      showCharacterCount = false,
      fullWidth = true,
      containerClassName,
      labelClassName,
      textareaClassName,
      helperTextClassName,
      errorClassName,
      characterCountClassName,
      resize = 'vertical',
      className,
      id,
      disabled,
      value = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    const characterCount = typeof value === 'string' ? value.length : 0;
    const showCount = showCharacterCount || maxLength !== undefined;

    return (
      <div className={cn('mb-4', fullWidth && 'w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
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

        {/* Textarea wrapper */}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            disabled={disabled}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className={cn(
              // Base styles
              'w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200',
              'focus:outline-none',
              // Size variations
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-base',
              size === 'lg' && 'text-lg',
              size === 'xl' && 'text-xl',
              // Resize options
              `resize-${resize}`,
              // State variations
              disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
              // Error state
              error
                ? 'border-red-500 bg-red-50/30 text-red-900 placeholder-red-300'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white focus:border-primary-500 focus:bg-primary-50/30 text-gray-900 placeholder-gray-400',
              textareaClassName,
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : showCount ? `${textareaId}-count` : undefined}
            {...props}
          />
        </div>

        {/* Footer area with error, helper text, and character count */}
        <div className="mt-1.5 flex flex-wrap justify-between items-start">
          <div className="flex-1 min-w-0">
            {/* Error message */}
            {error && (
              <p id={`${textareaId}-error`} className={cn('text-sm text-red-600', errorClassName)}>
                {error}
              </p>
            )}

            {/* Helper text (only shown if no error) */}
            {helperText && !error && (
              <p id={`${textareaId}-helper`} className={cn('text-sm text-gray-500', helperTextClassName)}>
                {helperText}
              </p>
            )}
          </div>

          {/* Character count */}
          {showCount && (
            <div className="flex-shrink-0 ml-2">
              <p
                id={`${textareaId}-count`}
                className={cn(
                  'text-xs text-gray-500',
                  maxLength && characterCount >= maxLength * 0.9 && 'text-amber-600',
                  maxLength && characterCount >= maxLength && 'text-red-600',
                  characterCountClassName
                )}
              >
                {characterCount}
                {maxLength ? `/${maxLength}` : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TextAreaInput.displayName = 'TextArea';

export default TextAreaInput;
