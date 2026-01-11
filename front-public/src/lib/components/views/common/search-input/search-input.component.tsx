import { IconSearch } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import type { SearchInputProps } from './search-input.types';

/**
 * Search Input Component
 * Reusable search input with icon
 * Used for filtering content across different pages
 *
 * Features:
 * - Two size variants (md, lg)
 * - Optional max-width constraint
 * - Disabled state support
 * - Accessible labeling
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Axtar...',
  disabled = false,
  size = 'md',
  maxWidth,
  className,
}) => {
  // Size-based styling
  const sizeStyles = {
    md: {
      container: 'h-12',
      input: 'pl-12 pr-4',
      icon: { size: 20, position: 'left-4' },
    },
    lg: {
      container: 'h-14',
      input: 'pl-14 pr-4',
      icon: { size: 22, position: 'left-5' },
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={cn('relative', maxWidth, className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full rounded-xl border-2 border-gray-200',
          'focus:border-black focus:outline-none transition-colors',
          'text-base placeholder:text-gray-400',
          styles.container,
          styles.input,
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
        )}
        aria-label={placeholder}
      />
      <IconSearch
        size={styles.icon.size}
        className={cn('absolute top-1/2 -translate-y-1/2 text-gray-400', styles.icon.position)}
        aria-hidden="true"
      />
    </div>
  );
};

export default SearchInput;
