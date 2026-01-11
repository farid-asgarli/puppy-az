'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';

interface ViewFooterProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
}

/**
 * Shared footer navigation component for ad placement views
 */
export function ViewFooter({ onBack, onNext, canProceed, nextLabel, isSubmitting = false }: ViewFooterProps) {
  const t = useTranslations('adPlacement');

  const displayNextLabel = nextLabel || t('next');

  return (
    <footer className="sticky bottom-0 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition underline disabled:opacity-50"
        >
          {t('back')}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className={cn(
            'px-8 py-3 rounded-lg font-semibold transition-all duration-200',
            canProceed && !isSubmitting
              ? 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
              : isSubmitting
              ? 'bg-gray-400 text-white cursor-wait'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          {displayNextLabel}
        </button>
      </div>
    </footer>
  );
}
