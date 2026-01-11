'use client';

import { cn } from '@/lib/external/utils';
import { IconX } from '@tabler/icons-react';
import DancingDogAnimation from '@/lib/components/animations/dancing-dog';

interface AdSubmissionSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

/**
 * Ad Submission Success Dialog
 * Shows a celebratory dancing dog animation when an ad is successfully submitted
 */
export default function AdSubmissionSuccessDialog({ isOpen, onClose, title, message, buttonText = 'Got it!' }: AdSubmissionSuccessDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
            aria-label="Close"
          >
            <IconX size={20} className="text-gray-600" />
          </button>

          {/* Animation Container */}
          <div className="relative bg-primary-50 p-8 pb-6">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-200 rounded-full blur-3xl opacity-40" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-info-200 rounded-full blur-3xl opacity-40" />

            {/* Dancing Dog Animation */}
            <div className="relative w-full max-w-xs mx-auto aspect-square">
              <DancingDogAnimation />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 pt-6 space-y-6">
            {/* Title & Message */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900">{title}</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{message}</p>
            </div>

            {/* Info Box */}
            <div className="bg-info-50 border-2 border-info-200 rounded-2xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-info-500 flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className={cn(
                'w-full px-6 py-4 rounded-xl font-semibold text-lg',
                'bg-purple-600 text-white shadow-lg',
                'hover:bg-purple-700 hover:shadow-xl hover:scale-[1.02]',
                'active:scale-[0.98]',
                'transition-all duration-200',
                'focus:outline-none focus:ring-4 focus:ring-purple-500/20'
              )}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
