import { cn } from '@/lib/external/utils';
import { ComponentSizing } from '@/lib/types/component-sizing';

export interface ReadOnlyInputProps {
  label?: string;
  value: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  size?: ComponentSizing;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
}

/**
 * Read-only input component for displaying non-editable data (e.g., email)
 * Follows the same design system as TextInput
 */
export default function ReadOnlyInput({
  label,
  value,
  helperText,
  leftIcon,
  size = 'md',
  fullWidth = true,
  containerClassName,
  labelClassName,
  inputClassName,
  helperTextClassName,
}: ReadOnlyInputProps) {
  return (
    <div className={cn('mb-4', fullWidth && 'w-full', containerClassName)}>
      {label && (
        <label
          className={cn(
            'block mb-2 font-medium',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
            size === 'xl' && 'text-lg',
            'text-gray-700',
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{leftIcon}</div>
          </div>
        )}

        <input
          type="text"
          value={value}
          disabled
          readOnly
          className={cn(
            'w-full px-4 rounded-xl border-2 transition-colors',
            'focus:outline-none',
            size === 'xs' && 'h-8 py-1 text-xs',
            size === 'sm' && 'h-10 py-1.5 text-sm',
            size === 'md' && 'h-12 py-2.5 text-base',
            size === 'lg' && 'h-14 py-2.5 text-lg',
            size === 'xl' && 'h-16 py-3 text-xl',
            leftIcon && 'pl-10',
            'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed',
            inputClassName
          )}
        />
      </div>

      {helperText && <p className={cn('mt-1.5 text-xs text-gray-500', helperTextClassName)}>{helperText}</p>}
    </div>
  );
}
