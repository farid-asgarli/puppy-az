'use client';

import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { useTranslations } from 'next-intl';
import TransitionLink from '@/lib/components/transition-link';
import Button from '@/lib/primitives/button/button.component';
import { IconArrowRight, IconRefresh, IconArrowLeft } from '@tabler/icons-react';

/**
 * Example component demonstrating React 19.2 View Transitions
 *
 * Shows various use cases:
 * - Navigation with TransitionLink
 * - Programmatic navigation with useViewTransition
 * - Loading states during transitions
 * - Browser navigation (back/forward)
 * - Page refresh with transitions
 */
export default function ViewTransitionsExample() {
  const t = useTranslations('viewTransitionsDemo');
  const { navigateWithTransition, backWithTransition, forwardWithTransition, refreshWithTransition, isPending } = useViewTransition();

  return (
    <div className="space-y-8 p-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Declarative navigation with TransitionLink */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('sections.declarative.title')}</h2>
        <div className="flex flex-wrap gap-3">
          <TransitionLink href="/ads" className="button-base">
            {t('sections.declarative.links.viewAllAds')}
          </TransitionLink>

          <TransitionLink href="/ads/favorites" showPending>
            {t('sections.declarative.links.myFavorites')}
          </TransitionLink>

          <TransitionLink href="/my-account" pendingIndicator={<span className="ml-2">⏳</span>}>
            {t('sections.declarative.links.myAccount')}
          </TransitionLink>
        </div>
      </section>

      {/* Programmatic navigation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('sections.programmatic.title')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigateWithTransition('/ads/ad-placement')} disabled={isPending} variant="primary">
            {t('sections.programmatic.buttons.createNewAd')}
            <IconArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button onClick={() => navigateWithTransition('/premium')} disabled={isPending} variant="secondary">
            {t('sections.programmatic.buttons.goPremium')} {isPending && '...'}
          </Button>
        </div>
      </section>

      {/* Browser navigation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('sections.browser.title')}</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={backWithTransition} disabled={isPending} variant="outline">
            <IconArrowLeft className="mr-2 w-4 h-4" />
            {t('sections.browser.buttons.back')}
          </Button>

          <Button onClick={forwardWithTransition} disabled={isPending} variant="outline">
            {t('sections.browser.buttons.forward')}
            <IconArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <Button onClick={refreshWithTransition} disabled={isPending} variant="outline">
            <IconRefresh className="mr-2 w-4 h-4" />
            {t('sections.browser.buttons.refresh')}
          </Button>
        </div>
      </section>

      {/* Loading state indicator */}
      {isPending && (
        <div className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">{t('navigating')}</div>
      )}

      {/* Example with filter updates */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('sections.filters.title')}</h2>
        <p className="text-sm text-gray-600">{t('sections.filters.description')}</p>
        <div className="flex flex-wrap gap-3">
          <TransitionLink href="/ads?category=dog" scroll={false}>
            {t('sections.filters.links.dogs')}
          </TransitionLink>
          <TransitionLink href="/ads?category=cat" scroll={false}>
            {t('sections.filters.links.cats')}
          </TransitionLink>
          <TransitionLink href="/ads?type=sale" scroll={false}>
            {t('sections.filters.links.forSale')}
          </TransitionLink>
        </div>
      </section>

      {/* Info box */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h3 className="font-semibold text-primary-900 mb-2">{t('benefits.title')}</h3>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>✓ {t('benefits.list.smoother')}</li>
          <li>✓ {t('benefits.list.performance')}</li>
          <li>✓ {t('benefits.list.loadingStates')}</li>
          <li>✓ {t('benefits.list.concurrent')}</li>
          <li>✓ {t('benefits.list.progressive')}</li>
        </ul>
      </div>
    </div>
  );
}
