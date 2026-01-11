import { cn } from '@/lib/external/utils';
import type { SuggestionCardProps } from './suggestion-card.types';

const iconBgColors = {
  purple: 'bg-primary-100 text-primary-600',
  blue: 'bg-info-100 text-info-600',
  green: 'bg-success-100 text-success-600',
  yellow: 'bg-premium-100 text-premium-600',
  red: 'bg-error-100 text-error-600',
};

/**
 * SuggestionCard Component
 * Displays a helpful tip or suggestion with icon
 * Used in empty states and help sections
 */
export const SuggestionCard: React.FC<SuggestionCardProps> = ({ icon: Icon, title, description, iconBgColor = 'purple', className }) => {
  return (
    <div className={cn('p-3 sm:p-4 rounded-xl bg-gray-50 border-2 border-gray-200', className)}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={cn('w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', iconBgColors[iconBgColor])}>
          <Icon size={16} className="sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{title}</h4>
          <p className="text-xs sm:text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
