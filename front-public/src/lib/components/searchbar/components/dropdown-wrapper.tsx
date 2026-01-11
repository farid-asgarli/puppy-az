import React, { ReactNode } from 'react';
import { cn } from '@/lib/external/utils';
import { useTranslations } from 'next-intl';

export interface ListDropdownOption<T = string> {
  id: string | number;
  value: T;
  label: string;
  description: string;
  icon?: ReactNode;
  iconClassName?: string;
}

export interface ListDropdownProps<T = string> {
  title: string;
  titleId: string;
  options: ListDropdownOption<T>[];
  searchQuery?: string;
  onSelect: (value: T) => void;
  emptyMessage?: string;
  renderIcon?: (option: ListDropdownOption<T>) => ReactNode;
}

/**
 * Reusable list dropdown component with filtering and keyboard navigation
 */
export function ListDropdown<T = string>({ title, titleId, options, searchQuery = '', onSelect, emptyMessage, renderIcon }: ListDropdownProps<T>) {
  const t = useTranslations('common');
  const defaultEmptyMessage = emptyMessage || t('noResults');

  // Filter based on search query (case-insensitive, match label only)
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelect = (value: T) => {
    onSelect(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: T) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(value);
    }
  };

  return (
    <div className="w-full md:w-[425px] bg-white md:rounded-xl overflow-hidden">
      <div className="w-full h-full px-4 md:px-6 py-4 md:py-6 max-h-[60vh] md:max-h-[400px] overflow-y-auto">
        <div aria-labelledby={titleId} role="group">
          <div className="text-xs font-semibold text-gray-700 mb-3 leading-tight" id={titleId}>
            {title}
          </div>

          {filteredOptions.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">{defaultEmptyMessage}</div>}

          {filteredOptions.map((option) => (
            <div
              key={option.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(option.value)}
              onMouseDown={(e) => {
                // Prevent blur event from firing before selection
                e.preventDefault();
              }}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              className="flex items-center gap-4 px-4 py-3 -mx-2 rounded-xl cursor-pointer transition-all duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:bg-gray-100 focus:ring-2 focus:ring-gray-200 active:scale-[0.98] active:bg-gray-100"
            >
              {/* Icon/Avatar */}
              {renderIcon ? (
                renderIcon(option)
              ) : option.icon ? (
                <div className={cn('h-14 w-14 flex-shrink-0 rounded-lg flex items-center justify-center', option.iconClassName)}>{option.icon}</div>
              ) : (
                <div className="h-14 w-14 flex-shrink-0 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200">
                  <span className="text-2xl">{option.label[0]}</span>
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-0.5">{option.label}</div>
                <div className="text-xs text-gray-600 truncate">{option.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
