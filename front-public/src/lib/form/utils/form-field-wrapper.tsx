import { cn } from '@/lib/external/utils';
import { ComponentSizing } from '@/lib/types/component-sizing';

export interface FormFieldWrapperProps {
  children: React.ReactNode;
  label?: string;
  labelFor?: string;
  helperText?: string;
  error?: string;
  size?: ComponentSizing;
  disabled?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

/**
 * Shared wrapper component for form fields that handles labels, errors, and helper text.
 * Reduces code duplication across input components.
 */
export function FormFieldWrapper({
  children,
  label,
  labelFor,
  helperText,
  error,
  size = 'md',
  disabled,
  fullWidth = true,
  containerClassName,
  labelClassName,
  helperTextClassName,
  errorClassName,
}: FormFieldWrapperProps) {
  return (
    <div className={cn('mb-4', fullWidth && 'w-full', containerClassName)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={labelFor}
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

      {/* Input field (passed as children) */}
      {children}

      {/* Error message */}
      {error && (
        <p id={labelFor ? `${labelFor}-error` : undefined} className={cn('mt-1.5 text-sm text-red-600', errorClassName)}>
          {error}
        </p>
      )}

      {/* Helper text (only shown if no error) */}
      {helperText && !error && (
        <p id={labelFor ? `${labelFor}-helper` : undefined} className={cn('mt-1.5 text-sm text-gray-500', helperTextClassName)}>
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Shared utility to generate consistent input wrapper styles.
 * Used by all input components for consistent border, background, and focus states.
 */
export function getInputWrapperStyles(error?: string, disabled?: boolean) {
  return cn(
    'relative flex items-center rounded-2xl overflow-hidden transition-all duration-200 border-2',
    disabled && 'bg-gray-50 cursor-not-allowed',
    error
      ? 'border-red-500 bg-red-50/30'
      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white focus-within:border-primary-500 focus-within:bg-primary-50/30'
  );
}

/**
 * Shared utility to generate consistent input field styles.
 * Used by all input components for consistent text, padding, and state styles.
 */
export function getInputFieldStyles(
  size: ComponentSizing = 'md',
  hasLeftIcon: boolean = false,
  hasRightIcon: boolean = false,
  error?: string,
  disabled?: boolean,
  additionalClasses?: string
) {
  return cn(
    'flex-1 min-w-0 bg-transparent focus:outline-none',
    size === 'xs' && 'py-1 text-xs',
    size === 'sm' && 'py-1.5 text-sm',
    size === 'md' && 'py-3 text-base',
    size === 'lg' && 'py-3.5 text-lg',
    size === 'xl' && 'py-4 text-xl',
    hasLeftIcon ? 'pr-4' : 'px-4',
    hasRightIcon && !hasLeftIcon && 'pl-4',
    disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900',
    error ? 'placeholder-red-300' : 'placeholder-gray-400',
    additionalClasses
  );
}

/**
 * Shared utility for icon container styles.
 * Ensures icons don't shrink and maintain consistent spacing.
 */
export function getIconContainerStyles(position: 'left' | 'right' = 'left') {
  return cn('flex items-center shrink-0', position === 'left' ? 'px-4' : 'px-4');
}
