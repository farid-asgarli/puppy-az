'use client';

import React, { useState, forwardRef } from 'react';
import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { motion } from 'framer-motion';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  checkboxClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, labelClassName, checkboxClassName, id, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    // Handle controlled or uncontrolled state
    const [isChecked, setIsChecked] = useState(defaultChecked || false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    };

    // Determine if controlled or uncontrolled
    const isControlled = checked !== undefined;
    const isSelected = isControlled ? checked : isChecked;

    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className='relative flex items-center justify-center mt-0.5'>
          <input
            type='checkbox'
            id={id}
            ref={ref}
            checked={isControlled ? checked : isChecked}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'sr-only', // Hide visually but keep accessible to screen readers
              checkboxClassName
            )}
            {...props}
          />

          <label
            htmlFor={id}
            className={cn(
              'relative flex items-center justify-center size-6 border rounded-md cursor-pointer transition-all duration-200',
              isSelected ? 'border-black bg-black' : 'border-gray-300 bg-white',
              disabled && 'opacity-50 cursor-not-allowed',
              'hover:border-gray-400'
            )}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className='text-white'
              >
                <IconCheck size={18} stroke={3} />
              </motion.div>
            )}
          </label>
        </div>

        {(label || description) && (
          <div className='flex flex-col'>
            {label && (
              <label htmlFor={id} className={cn('text-md cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', labelClassName)}>
                {label}
              </label>
            )}

            {description && <p className={cn('text-xs text-gray-500 mt-0.5', disabled && 'opacity-50')}>{description}</p>}

            {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
