'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/external/utils';

interface SelectionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  showCheckmark?: boolean;
}

/**
 * Reusable selection button with radio-style indicator
 */
export function SelectionButton({ selected, onClick, children, className, showCheckmark = true }: SelectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-xl border-2 transition-all duration-200',
        'flex items-center justify-between text-left',
        'hover:border-gray-400 hover:shadow-md',
        selected ? 'border-black bg-gray-50 shadow-lg' : 'border-gray-200 bg-white',
        className
      )}
    >
      {children}
      {showCheckmark && (
        <div
          className={cn(
            'w-6 h-6 rounded-full border-2 transition-colors flex-shrink-0',
            selected ? 'border-black bg-black' : 'border-gray-300 bg-white'
          )}
        >
          {selected && (
            <svg className="w-full h-full text-white p-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      )}
    </button>
  );
}
