import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import type { FilterPillProps } from './filter-pill.types';

/**
 * FilterPill Component
 * Removable filter tag for active search filters
 * Shows label:value pair with remove button
 */
export const FilterPill: React.FC<FilterPillProps> = ({ label, value, onRemove, disabled = false, className }) => {
  return (
    <button
      onClick={onRemove}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl',
        'bg-primary-50 hover:bg-primary-100 border-2 border-primary-200',
        'transition-all duration-200',
        'text-xs sm:text-sm font-medium text-gray-900 group',
        'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={`${label}: ${value} filtirini sil`}
    >
      <span className="text-purple-700">{label}:</span>
      <span className="text-gray-900">{value}</span>
      <IconX size={12} className="sm:w-[14px] sm:h-[14px] text-gray-600 group-hover:text-red-600 transition-colors" aria-hidden="true" />
    </button>
  );
};

export default FilterPill;
