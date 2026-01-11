import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/external/utils';

const toggleVariants = cva(
  'relative rounded-full transition-all duration-200 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'w-10 h-6',
        md: 'w-12 h-7',
        lg: 'w-14 h-8',
      },
      color: {
        blue: '',
        green: '',
        purple: '',
        gray: '',
        black: '',
      },
      checked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Blue variants
      {
        color: 'blue',
        checked: true,
        className: 'bg-info-600',
      },
      {
        color: 'blue',
        checked: false,
        className: 'bg-gray-200',
      },
      // Green variants
      {
        color: 'green',
        checked: true,
        className: 'bg-green-600',
      },
      {
        color: 'green',
        checked: false,
        className: 'bg-gray-200',
      },
      // Purple variants
      {
        color: 'purple',
        checked: true,
        className: 'bg-primary-600',
      },
      {
        color: 'purple',
        checked: false,
        className: 'bg-gray-200',
      },
      // Gray variants
      {
        color: 'gray',
        checked: true,
        className: 'bg-gray-700',
      },
      {
        color: 'gray',
        checked: false,
        className: 'bg-gray-200',
      },
      // Black variants (modern iOS-style)
      {
        color: 'black',
        checked: true,
        className: 'bg-black',
      },
      {
        color: 'black',
        checked: false,
        className: 'bg-gray-300',
      },
    ],
    defaultVariants: {
      size: 'md',
      color: 'black',
      checked: false,
    },
  }
);

const toggleDotVariants = cva('absolute bg-white rounded-full transition-all duration-200 shadow-sm flex items-center justify-center', {
  variants: {
    size: {
      sm: 'top-1 left-1 w-4 h-4',
      md: 'top-1 left-1 w-5 h-5',
      lg: 'top-1 left-1 w-6 h-6',
    },
    checked: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Small size translations
    {
      size: 'sm',
      checked: true,
      className: 'translate-x-4',
    },
    {
      size: 'sm',
      checked: false,
      className: 'translate-x-0',
    },
    // Medium size translations
    {
      size: 'md',
      checked: true,
      className: 'translate-x-5',
    },
    {
      size: 'md',
      checked: false,
      className: 'translate-x-0',
    },
    // Large size translations
    {
      size: 'lg',
      checked: true,
      className: 'translate-x-6',
    },
    {
      size: 'lg',
      checked: false,
      className: 'translate-x-0',
    },
  ],
  defaultVariants: {
    size: 'md',
    checked: false,
  },
});

export interface ToggleProps extends VariantProps<typeof toggleVariants> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  showCheckmark?: boolean;
}

export default function Toggle({ checked, onChange, disabled = false, size, color, className, ariaLabel, showCheckmark = true }: ToggleProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(toggleVariants({ size, color, checked }), className)}
    >
      <span className={toggleDotVariants({ size, checked })}>
        {/* Checkmark icon - only shows when checked and showCheckmark is true */}
        {checked && showCheckmark && (
          <svg
            className={cn('text-black', size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </button>
  );
}
