import { cn } from '@/lib/external/utils';
import { IconX } from '@tabler/icons-react';

interface SearchFieldButtonProps {
  icon: React.ReactNode;
  iconBgClass?: string;
  label: string;
  value: string;
  hasValue: boolean;
  disabled?: boolean;
  onClick: () => void;
  onClear?: () => void;
}

/**
 * Mobile search field button component
 * Reusable button for Ad Type, Category, and Breed fields
 */
export const SearchFieldButton = ({
  icon,
  iconBgClass = 'bg-gray-100',
  label,
  value,
  hasValue,
  disabled = false,
  onClick,
  onClear,
}: SearchFieldButtonProps) => {
  return (
    <button
      className={cn(
        'w-full bg-white rounded-2xl border-2 border-gray-200',
        'shadow-sm hover:shadow-md',
        'transition-all duration-200',
        'px-5 py-4 text-left flex items-center gap-4',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 active:scale-[0.98]'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center', 'shadow-sm', iconBgClass)}>{icon}</div>

      {/* Label and Value */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</div>
        <div className={cn('text-base truncate', hasValue ? 'text-gray-900 font-semibold' : 'text-gray-500 font-medium')}>{value}</div>
      </div>

      {/* Clear Button */}
      {hasValue && onClear && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center"
          role="button"
          aria-label={`Clear ${label.toLowerCase()}`}
        >
          <IconX className="w-4 h-4 text-gray-700" strokeWidth={2.5} />
        </div>
      )}
    </button>
  );
};
