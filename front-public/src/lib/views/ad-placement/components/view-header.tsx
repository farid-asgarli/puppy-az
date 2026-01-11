'use client';

import AppLogo from '@/lib/components/logo/logo';
import TransitionLink from '@/lib/components/transition-link/transition-link';
import { useTranslations } from 'next-intl';

/**
 * Shared header component for ad placement views
 * Draft is auto-saved to localStorage, so "Save & Exit" just navigates home
 */
export function ViewHeader() {
  const t = useTranslations('adPlacement');

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <AppLogo showTagline={false} />
        <TransitionLink href="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
          {t('saveAndExit')}
        </TransitionLink>
      </div>
    </header>
  );
}
