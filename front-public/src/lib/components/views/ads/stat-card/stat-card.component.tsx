import { useState, useEffect } from 'react';
import { cn } from '@/lib/external/utils';
import type { StatCardProps } from './stat-card.types';

/**
 * StatCard Component
 * Displays rotating stats with icon, value, and label
 * Supports auto-rotation or controlled mode
 */
export const StatCard: React.FC<StatCardProps> = ({
  stats,
  autoRotate = true,
  interval = 3000,
  activeIndex: controlledIndex,
  onIndexChange,
  className,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);

  // Use controlled index if provided, otherwise use internal
  const isControlled = controlledIndex !== undefined;
  const currentIndex = isControlled ? controlledIndex : internalIndex;

  // Auto-rotation logic
  useEffect(() => {
    if (!autoRotate || isControlled) return;

    const timer = setInterval(() => {
      setInternalIndex((prev) => (prev + 1) % stats.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, interval, stats.length, isControlled]);

  // Notify parent of index changes
  useEffect(() => {
    if (onIndexChange && !isControlled) {
      onIndexChange(internalIndex);
    }
  }, [internalIndex, onIndexChange, isControlled]);

  if (stats.length === 0) return null;

  return (
    <div className={cn('relative flex items-center gap-6 sm:gap-8', className)} role="status" aria-live="polite">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isActive = index === currentIndex;

        return (
          <div
            key={index}
            className={cn('transition-all duration-500', isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute')}
            aria-hidden={!isActive}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="sm:w-6 sm:h-6 text-gray-700" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCard;
