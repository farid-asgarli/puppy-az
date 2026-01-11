'use client';

import { useTranslations } from 'next-intl';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import type { PaginationProps } from './pagination.types';
import { getPageNumbers } from './pagination.utils';

/**
 * Pagination Component
 * Airbnb-style pagination with page numbers, ellipsis, and navigation
 * Supports keyboard navigation and accessibility
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  showEdgePages = true,
  disabled = false,
  className,
}) => {
  const tAccessibility = useTranslations('accessibility');

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages, maxVisible);

  const handlePageChange = (page: number) => {
    if (disabled || page === currentPage) return;
    onPageChange(page);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className={cn('flex items-center justify-center gap-3', className)} role="navigation" aria-label={tAccessibility('pageNavigation')}>
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!canGoPrev || disabled}
        aria-label={tAccessibility('previousPage')}
        className={cn(
          'h-10 w-10 bg-white rounded-full border border-gray-300',
          'flex items-center justify-center',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
          !disabled && canGoPrev && 'hover:border-gray-900 hover:shadow-md',
          (!canGoPrev || disabled) && 'opacity-30 cursor-not-allowed'
        )}
      >
        <IconChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          const isEllipsis = page === '...';
          const isCurrentPage = page === currentPage;

          return (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={isEllipsis || disabled}
              aria-label={typeof page === 'number' ? tAccessibility('page', { number: page }) : undefined}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={cn(
                'h-10 min-w-10 px-3 rounded-full font-semibold text-sm',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
                isCurrentPage && 'bg-black text-white',
                isEllipsis && 'bg-transparent text-gray-400 cursor-default',
                !isEllipsis && !isCurrentPage && 'bg-white border border-gray-300 text-gray-700 hover:border-gray-900 hover:shadow-md',
                disabled && !isEllipsis && 'opacity-50 cursor-not-allowed'
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!canGoNext || disabled}
        aria-label={tAccessibility('nextPage')}
        className={cn(
          'h-10 w-10 bg-white rounded-full border border-gray-300',
          'flex items-center justify-center',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
          !disabled && canGoNext && 'hover:border-gray-900 hover:shadow-md',
          (!canGoNext || disabled) && 'opacity-30 cursor-not-allowed'
        )}
      >
        <IconChevronRight size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
