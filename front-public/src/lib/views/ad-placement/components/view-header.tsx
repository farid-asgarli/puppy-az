'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n';
import AppLogo from '@/lib/components/logo/logo';
import TransitionLink from '@/lib/components/transition-link/transition-link';
import { useTranslations } from 'next-intl';
import { useAdPlacement } from '@/lib/contexts/ad-placement-context';

/**
 * Shared header component for ad placement views
 * Draft is auto-saved to localStorage, so "Save & Exit" just navigates home
 * Also tracks the current step for draft continuation
 */
export function ViewHeader() {
  const t = useTranslations('adPlacement');
  const pathname = usePathname();
  const { setCurrentStep } = useAdPlacement();

  // Track current step whenever pathname changes
  useEffect(() => {
    // Remove locale prefix from pathname (e.g., /az/ads/ad-placement/basics -> /ads/ad-placement/basics)
    const pathWithoutLocale = pathname.replace(/^\/(az|en|ru)/, '');
    setCurrentStep(pathWithoutLocale);
  }, [pathname, setCurrentStep]);

  return (
    <header className='sticky top-0 z-10 bg-white border-b border-gray-200'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between'>
        <AppLogo showTagline={false} />
        <TransitionLink
          href='/'
          className='px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition whitespace-nowrap'
        >
          {t('saveAndExit')}
        </TransitionLink>
      </div>
    </header>
  );
}
