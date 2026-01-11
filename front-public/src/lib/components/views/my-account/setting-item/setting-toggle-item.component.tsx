import { cn } from '@/lib/external/utils';
import { Toggle } from '@/lib/primitives/toggle';
import { Text } from '@/lib/primitives/typography';
import type { SettingToggleItemProps } from './setting-toggle-item.types';

/**
 * Setting item with toggle switch
 * Used for binary on/off settings with icon, label, and description
 */
export const SettingToggleItem: React.FC<SettingToggleItemProps> = ({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border-2 border-gray-200',
        'hover:border-gray-300 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
        <Icon size={20} className="sm:w-[22px] sm:h-[22px] text-gray-700" />
      </div>
      <div className="flex-1 min-w-0">
        <Text variant="body" weight="semibold" color="primary" className="mb-1 text-sm sm:text-base" as="div">
          {label}
        </Text>
        <Text variant="small" className="text-xs sm:text-sm" as="div">
          {description}
        </Text>
      </div>
      <div className="flex-shrink-0">
        <Toggle checked={checked} onChange={onChange} ariaLabel={label} size="md" color="black" disabled={disabled} />
      </div>
    </div>
  );
};

export default SettingToggleItem;
