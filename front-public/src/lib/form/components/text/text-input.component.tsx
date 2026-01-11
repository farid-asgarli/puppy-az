import React, { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/external/utils';
import { ComponentSizing } from '@/lib/types/component-sizing';
import { FormFieldWrapper, getInputWrapperStyles, getInputFieldStyles, getIconContainerStyles } from '@/lib/form/utils';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: ComponentSizing;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

/**
 * Text Input Component
 *
 * A reusable text input with consistent styling across the app.
 * Uses shared utilities from @/lib/form/utils for reduced code duplication.
 *
 * Features:
 * - Rounded-2xl borders with border-2 thickness
 * - Blue focus states with bg-blue-50/30 background
 * - Hover effects (hover:border-gray-300, hover:bg-white)
 * - Font-semibold labels
 * - Flex layout with shrink-0 icons (prevents icon squeezing)
 * - min-w-0 on input prevents text overflow issues
 *
 * @example
 * <TextInput
 *   label="Email"
 *   placeholder="Enter your email"
 *   leftIcon={<IconMail size={18} />}
 *   error={errors.email}
 * />
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
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
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <FormFieldWrapper
        label={label}
        labelFor={inputId}
        helperText={helperText}
        error={error}
        size={size}
        disabled={disabled}
        fullWidth={fullWidth}
        containerClassName={containerClassName}
        labelClassName={labelClassName}
        helperTextClassName={helperTextClassName}
        errorClassName={errorClassName}
      >
        <div className={getInputWrapperStyles(error, disabled)}>
          {leftIcon && (
            <div className={getIconContainerStyles('left')}>
              <div className={cn('text-gray-400', error && 'text-red-500')}>{leftIcon}</div>
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(getInputFieldStyles(size, !!leftIcon, !!rightIcon, error, disabled), inputClassName, className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className={getIconContainerStyles('right')}>
              <div className={cn('text-gray-400', error && 'text-red-500')}>{rightIcon}</div>
            </div>
          )}
        </div>
      </FormFieldWrapper>
    );
  }
);

TextInput.displayName = 'Input';

export default TextInput;
