import { cn } from '@/lib/external/utils';
import React, { useState, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentSizing } from '@/lib/types/component-sizing';

/**
 * Button variants styled after Airbnb's design patterns
 */
const buttonVariants = cva(
  'inline-flex justify-center items-center font-medium leading-none text-center transition-all duration-150 no-underline focus-ring clicky',
  {
    variants: {
      variant: {
        // Primary lavender button (main CTA)
        primary: 'rounded-24 bg-primary-600 text-white hover:bg-primary-700',

        accent: 'rounded-24 bg-primary-600 text-white hover:bg-primary-700',

        // Outline button with primary border
        outline: 'rounded-24 bg-white border border-primary-600 text-primary-600 hover:bg-primary-50',

        // Light outline button with gray border
        light: 'rounded-24 bg-white border border-gray-300 text-black hover:border-black',

        // Underlined text button
        underlined: 'bg-transparent text-black underline hover:text-gray-800 p-0 h-auto',

        // Simple text button
        text: 'bg-transparent text-black hover:underline p-0 h-auto',

        // Inverse for dark backgrounds
        inverse: 'rounded-24 bg-white text-black border border-transparent hover:bg-gray-100',

        // Filter button (matching the images)
        filter: 'rounded-16 bg-white border border-gray-200 text-black hover:border-black',

        // Design System Variants (border-2, rounded-xl)
        // Lavender solid button for primary actions
        solid: 'rounded-xl border-2 bg-primary-600 border-primary-600 text-white hover:bg-primary-700 hover:border-primary-700',

        // Secondary outline button with gray border
        secondary: 'rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300',

        // Danger/destructive action button
        danger: 'rounded-xl border-2 bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700',

        // Disabled state (handled in compound variants but defined here for type safety)
        ghost: 'rounded-xl border-2 bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
      },
      size: {
        xs: 'h-8 px-3 text-xs',
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-5 text-base',
        lg: 'h-14 px-6 text-base',
        xl: 'h-16 px-8 text-lg',
      } as Record<ComponentSizing, string>,
      loading: {
        true: 'opacity-70 pointer-events-none',
      },
      fullWidth: {
        true: 'w-full',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
      },
    },
    compoundVariants: [
      {
        loading: true,
        class: 'cursor-wait',
      },
      {
        variant: ['text', 'underlined'],
        class: 'shadow-none border-none',
      },
      {
        variant: ['text', 'underlined'],
        size: ['xs', 'sm', 'md', 'lg', 'xl'],
        class: 'h-auto',
      },
      {
        variant: 'filter',
        class: 'flex items-center gap-2',
      },
      {
        variant: 'primary',
        disabled: true,
        class: 'bg-gray-300 text-gray-500 hover:bg-gray-300 border-transparent',
      },
      {
        variant: 'accent',
        disabled: true,
        class: 'bg-primary-200 text-primary-400 hover:bg-primary-200 border-transparent',
      },
      {
        variant: 'outline',
        disabled: true,
        class: 'border-gray-200 text-gray-400 hover:bg-white',
      },
      {
        variant: 'light',
        disabled: true,
        class: 'border-gray-200 text-gray-400 hover:border-gray-200',
      },
      {
        variant: ['text', 'underlined'],
        disabled: true,
        class: 'text-gray-400 hover:no-underline',
      },
      {
        variant: 'inverse',
        disabled: true,
        class: 'bg-gray-100 text-gray-400 hover:bg-gray-100',
      },
      {
        variant: 'filter',
        disabled: true,
        class: 'border-gray-200 text-gray-400 hover:border-gray-200',
      },
      {
        variant: 'solid',
        disabled: true,
        class: 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-100 hover:border-gray-200',
      },
      {
        variant: 'secondary',
        disabled: true,
        class: 'border-gray-200 text-gray-400 hover:border-gray-200',
      },
      {
        variant: 'danger',
        disabled: true,
        class: 'bg-red-200 border-red-200 text-red-400 hover:bg-red-200 hover:border-red-200',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      loading: false,
      fullWidth: false,
      disabled: false,
    },
  }
);

/**
 * Button props with support for anchor variant and async handling
 */
type ButtonProps<TAnchor extends boolean> = React.ComponentProps<TAnchor extends true ? 'a' : 'button'> &
  VariantProps<typeof buttonVariants> & {
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
    anchor?: TAnchor;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    /**
     * Async click handler that automatically manages loading state
     * Takes precedence over regular onClick when provided
     */
    onClickAsync?: (event: React.MouseEvent<TAnchor extends true ? HTMLAnchorElement : HTMLButtonElement>) => Promise<void>;
    /**
     * Called when async operation completes successfully
     */
    onAsyncSuccess?: () => void;
    /**
     * Called when async operation fails
     */
    onAsyncError?: (error: Error) => void;
    /**
     * Prevent multiple simultaneous async operations
     * @default true
     */
    preventConcurrentAsync?: boolean;
  };

/**
 * Button component that follows Airbnb's design patterns with async support
 *
 * @example
 * // Primary button (black) - main CTA
 * <Button>Book now</Button>
 *
 * @example
 * // Async button with automatic loading state
 * <Button onClickAsync={async () => {
 *   await saveData();
 * }}>
 *   Save changes
 * </Button>
 *
 * @example
 * // Async button with error handling
 * <Button
 *   onClickAsync={handleSubmit}
 *   onAsyncError={(error) => toast.error(error.message)}
 *   onAsyncSuccess={() => toast.success('Saved!')}
 * >
 *   Submit
 * </Button>
 *
 * @example
 * // Outline button - secondary action
 * <Button variant="outline">See details</Button>
 *
 * @example
 * // Light button - tertiary action
 * <Button variant="light" size="sm">Filter</Button>
 *
 * @example
 * // Text button - for minimal UI footprint
 * <Button variant="text">Learn more</Button>
 *
 * @example
 * // With icon
 * <Button leftSection={<IconSearch size={18} />}>Search</Button>
 *
 * @example
 * // Disabled button
 * <Button disabled>Cannot proceed</Button>
 */
export default function Button<TAnchor extends boolean = false>({
  variant,
  size,
  anchor,
  leftSection,
  rightSection,
  children,
  className,
  loading: externalLoading = false,
  disabled = false,
  fullWidth,
  onClickAsync,
  onAsyncSuccess,
  onAsyncError,
  preventConcurrentAsync = true,
  onClick,
  ...props
}: ButtonProps<TAnchor>) {
  const [internalLoading, setInternalLoading] = useState(false);

  // Combine external loading with internal async loading
  const isLoading = externalLoading || internalLoading;

  // Handle async click with automatic loading state management
  const handleAsyncClick = useCallback(
    async (event: React.MouseEvent<TAnchor extends true ? HTMLAnchorElement : HTMLButtonElement>) => {
      if (!onClickAsync) return;

      // Prevent concurrent operations if enabled
      if (preventConcurrentAsync && internalLoading) {
        event.preventDefault();
        return;
      }

      try {
        setInternalLoading(true);
        await onClickAsync(event);
        onAsyncSuccess?.();
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('An error occurred');
        onAsyncError?.(errorObj);

        // Re-throw if no error handler provided so it's not silently swallowed
        if (!onAsyncError) {
          throw error;
        }
      } finally {
        setInternalLoading(false);
      }
    },
    [onClickAsync, onAsyncSuccess, onAsyncError, preventConcurrentAsync, internalLoading]
  );

  // Loading dots component
  const LoadingDots = () => (
    <div className="inline-flex space-x-1 items-center">
      <span className="animate-dot-1 h-1.5 w-1.5 bg-current rounded-full"></span>
      <span className="animate-dot-2 h-1.5 w-1.5 bg-current rounded-full"></span>
      <span className="animate-dot-3 h-1.5 w-1.5 bg-current rounded-full"></span>
    </div>
  );

  // Build the content with optional left/right sections
  const content = (
    <>
      {leftSection && !isLoading && <span className="inline-flex justify-center items-center mr-2">{leftSection}</span>}
      {isLoading ? <LoadingDots /> : children}
      {rightSection && !isLoading && <span className="inline-flex justify-center items-center ml-2">{rightSection}</span>}
    </>
  );

  // Determine the click handler to use
  const clickHandler = onClickAsync ? handleAsyncClick : onClick;

  // Render as either button or anchor
  return React.createElement(anchor ? 'a' : 'button', {
    className: cn(buttonVariants({ variant, size, loading: isLoading, fullWidth, disabled }), className),
    type: anchor ? undefined : 'button',
    disabled: disabled || isLoading,
    'aria-disabled': disabled || isLoading,
    onClick: clickHandler,
    children: content,
    ...props,
  });
}

// Also export the variants for use in other components
export { buttonVariants };
