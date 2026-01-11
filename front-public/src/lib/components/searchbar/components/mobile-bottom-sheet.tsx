'use client';

import { cn } from '@/lib/external/utils';
import { IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface MobileBottomSheetProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Mobile bottom sheet component for selections
 * Slides up from bottom with backdrop
 */
export const MobileBottomSheet = ({ isOpen, title, onClose, children }: MobileBottomSheetProps) => {
  const tAccessibility = useTranslations('accessibility');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-200 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[61]',
          'bg-white rounded-t-3xl',
          'max-h-[85vh] flex flex-col',
          'shadow-[0_-4px_20px_0_rgba(0,0,0,0.15)]',
          'animate-in slide-in-from-bottom duration-300 ease-out'
        )}
      >
        {/* Handle Bar */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 -mr-2 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center"
            aria-label={tAccessibility('close')}
          >
            <IconX className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  );
};
