'use client';

import { useTranslations } from 'next-intl';
import { IconLayoutGrid, IconList } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import type { ViewToggleProps } from './view-toggle.types';

/**
 * View Toggle Component
 * Toggle between grid and list view modes
 * Commonly used in content listing pages
 */
export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onModeChange, gridLabel, listLabel, className }) => {
  const tAccessibility = useTranslations('accessibility');

  const displayGridLabel = gridLabel || tAccessibility('gridView');
  const displayListLabel = listLabel || tAccessibility('listView');

  return (
    <div className={cn('flex gap-2', className)} role="group" aria-label={tAccessibility('viewMode')}>
      <button
        onClick={() => onModeChange('grid')}
        className={cn(
          'w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200',
          mode === 'grid' ? 'border-black bg-gray-50 text-gray-900' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
        )}
        aria-label={displayGridLabel}
        aria-pressed={mode === 'grid'}
        title={displayGridLabel}
      >
        <IconLayoutGrid size={20} />
      </button>
      <button
        onClick={() => onModeChange('list')}
        className={cn(
          'w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200',
          mode === 'list' ? 'border-black bg-gray-50 text-gray-900' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
        )}
        aria-label={displayListLabel}
        aria-pressed={mode === 'list'}
        title={displayListLabel}
      >
        <IconList size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;
