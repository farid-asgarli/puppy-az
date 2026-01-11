'use client';

import { IconChevronDown, IconArrowsSort } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { useFilterUrl } from '@/lib/filtering/use-filter-url';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ResultsHeaderProps {
  totalCount: number;
  isLoading?: boolean;
  categoryTitle?: string | null;
}

type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high';

export const ResultsHeader = ({ totalCount, isLoading, categoryTitle }: ResultsHeaderProps) => {
  const t = useTranslations('adsSearch.resultsHeader');
  const { filters, updateFilter } = useFilterUrl();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'newest', label: t('sortOptions.newest') },
    { value: 'oldest', label: t('sortOptions.oldest') },
    { value: 'price-low', label: t('sortOptions.priceLow') },
    { value: 'price-high', label: t('sortOptions.priceHigh') },
  ];

  const currentSort = (filters.sort as SortOption) || 'newest';
  const currentSortLabel = sortOptions.find((opt) => opt.value === currentSort)?.label || t('sortOptions.newest');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleSortChange = (sortValue: SortOption) => {
    updateFilter('sort', sortValue);
    setIsDropdownOpen(false);
  };

  // Build results text
  const getResultsText = () => {
    if (isLoading) {
      return t('searching');
    }

    if (categoryTitle) {
      return t('foundInCategory', { count: totalCount, category: categoryTitle });
    }

    return t('found', { count: totalCount });
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Results count */}
          <div className="flex items-center gap-3 min-w-0">
            <IconArrowsSort size={20} className="text-gray-400 flex-shrink-0 hidden sm:block" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{getResultsText()}</h2>
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg',
                'border-2 border-gray-200',
                'text-sm font-medium text-gray-700',
                'hover:border-gray-300 hover:bg-gray-50',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
              )}
            >
              <span className="hidden sm:inline">{currentSortLabel}</span>
              <span className="sm:hidden">{t('sortButton')}</span>
              <IconChevronDown size={16} className={cn('text-gray-500 transition-transform duration-200', isDropdownOpen && 'rotate-180')} />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      'w-full px-4 py-3 text-left text-sm transition-colors',
                      'hover:bg-gray-50',
                      currentSort === option.value ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;
