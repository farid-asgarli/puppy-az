import React, { forwardRef, useState, useId } from 'react';
import { cn } from '@/lib/external/utils';
import { IconPlus, IconCheck, IconProps } from '@tabler/icons-react';

export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  isActive?: boolean;
  onChange?: (isActive: boolean) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'outline';
  label?: string;
  icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  showActiveIcon?: boolean;
  fullWidth?: boolean;
}

const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      className,
      children,
      isActive: controlledIsActive,
      onChange,
      size = 'md',
      variant = 'default',
      label,
      icon: IconComponent,
      showActiveIcon = true,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    // Support both controlled and uncontrolled modes
    const [internalIsActive, setInternalIsActive] = useState(false);
    const isActive = controlledIsActive !== undefined ? controlledIsActive : internalIsActive;
    const uniqueId = useId();

    const handleToggle = () => {
      const newState = !isActive;

      // Update internal state if uncontrolled
      if (controlledIsActive === undefined) {
        setInternalIsActive(newState);
      }

      // Call external handler if provided
      if (onChange) {
        onChange(newState);
      }
    };

    return (
      <button
        type="button"
        id={props.id || uniqueId}
        onClick={handleToggle}
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 border-2',
          size === 'xs' && 'h-8 px-3 text-xs',
          size === 'sm' && 'h-10 px-4 text-sm',
          size === 'md' && 'h-12 px-5 text-base',
          size === 'lg' && 'h-14 px-6 text-lg',
          size === 'xl' && 'h-16 px-7 text-xl',
          // Width control
          fullWidth ? 'w-full' : '',
          // Visual state - Default variant
          variant === 'default' && !isActive && 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-white focus:ring-primary',
          variant === 'default' && isActive && 'bg-black border-black text-white hover:bg-gray-900 focus:ring-black',
          // Visual state - Primary variant
          variant === 'primary' && !isActive && 'bg-gray-50 border-gray-200 text-primary hover:border-gray-300 hover:bg-white focus:ring-primary',
          variant === 'primary' && isActive && 'bg-primary border-primary text-white hover:bg-primary-dark focus:ring-primary',
          // Visual state - Outline variant
          variant === 'outline' &&
            !isActive &&
            'bg-transparent border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
          variant === 'outline' && isActive && 'bg-gray-100 border-gray-700 text-gray-900 hover:bg-gray-200 focus:ring-gray-700',
          className
        )}
        aria-pressed={isActive}
        {...props}
      >
        {IconComponent && (
          <span className="inline-flex items-center mr-2">
            <IconComponent
              size={size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'lg' ? 22 : size === 'xl' ? 24 : 20}
              stroke={1.5}
              className={cn(isActive && variant === 'primary' ? 'text-white' : '')}
            />
          </span>
        )}

        {children || label}

        {isActive && showActiveIcon && (
          <span className="ml-2 flex-shrink-0">
            <IconCheck size={size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 22 : 18} className="text-current" />
          </span>
        )}
      </button>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

/**
 * Toggle button with an icon on the left and text
 */
export function IconToggleButton({
  icon,
  label,
  ...props
}: ToggleButtonProps & { icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>> }) {
  return <ToggleButton icon={icon} label={label} {...props} />;
}

/**
 * Toggle button with a plus/x icon that transforms on toggle
 */
export function PlusIconToggleButton({ children, ...props }: ToggleButtonProps) {
  const [isActive, setIsActive] = useState(props.isActive || false);

  const handleChange = (active: boolean) => {
    setIsActive(active);
    if (props.onChange) {
      props.onChange(active);
    }
  };

  return (
    <ToggleButton {...props} isActive={isActive} onChange={handleChange} showActiveIcon={false}>
      <span className="block">{children}</span>
      <span className="flex items-center justify-center flex-shrink-0 ml-2">
        <span className={cn('transition-transform duration-200', isActive && 'rotate-45')}>
          <IconPlus
            stroke={2}
            size={props.size === 'xs' ? 14 : props.size === 'sm' ? 16 : props.size === 'lg' ? 20 : props.size === 'xl' ? 22 : 18}
          />
        </span>
      </span>
    </ToggleButton>
  );
}
