'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n';

/**
 * Resets the window scroll position to the top whenever the route (pathname)
 * changes. Next.js App Router navigation that goes through a custom
 * startTransition/next-intl router can skip the default scroll-to-top, which
 * left users mid-page after navigating (e.g. home -> ad details).
 *
 * Notes:
 * - Triggers on pathname changes only, so query-param updates (filters,
 *   pagination) on the same page do NOT force a scroll.
 * - Skips when the URL has a hash so in-page anchor links keep working.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
