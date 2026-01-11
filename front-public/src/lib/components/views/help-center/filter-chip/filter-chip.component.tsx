import { cn } from '@/lib/external/utils';
import type { FilterChipProps } from './filter-chip.types';

/**
 * Filter chip button for category/tag selection
 * Used in filter bars and category selectors
 */
export const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onClick, icon: Icon, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200',
        'flex items-center gap-2',
        selected ? 'border-black bg-gray-50 text-gray-900' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400',
        className
      )}
      aria-pressed={selected}
      aria-label={`Filter by ${label}`}
    >
      {Icon && <Icon size={18} aria-hidden="true" />}
      {label}
    </button>
  );
};

export default FilterChip;
