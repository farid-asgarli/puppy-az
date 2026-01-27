'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from '@/i18n';
import { cn } from '@/lib/external/utils';
import { IconSparkles, IconClock } from '@tabler/icons-react';
import { useAdPlacement } from '@/lib/contexts/ad-placement-context';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { Heading, Text } from '@/lib/primitives/typography';
import { ActionCard } from '@/lib/components/views/ad-placement';

/**
 * Intro screen for ad placement wizard
 * Inspired by Airbnb's "Tell us about your place" intro
 * Elegantly handles draft continuation with choice cards
 * Note: Edit mode is handled directly in ad-type-view (skips intro)
 */
export default function IntroView() {
  const t = useTranslations('adPlacement');
  const searchParams = useSearchParams();
  const { hasSavedDraft, getSavedStep, resetFormData, clearEditMode } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [showDraftOptions, setShowDraftOptions] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run once on mount
    if (isInitialized) return;

    const isNew = searchParams.get('new') === 'true';

    if (isNew) {
      // Clear draft and edit mode, stay on intro page
      clearEditMode();
      resetFormData();
      // Remove query param from URL
      window.history.replaceState({}, '', window.location.pathname);
      setShowDraftOptions(false);
      setIsInitialized(true);
    } else {
      // Check for draft and show options if exists
      setShowDraftOptions(hasSavedDraft());
      setIsInitialized(true);
    }
  }, [isInitialized, searchParams, hasSavedDraft, resetFormData, navigateWithTransition, clearEditMode]);

  const handleContinueDraft = () => {
    const savedStep = getSavedStep();
    navigateWithTransition(savedStep || '/ads/ad-placement/ad-type');
  };

  const handleStartFresh = () => {
    clearEditMode();
    resetFormData();
    navigateWithTransition('/ads/ad-placement/ad-type');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-6 py-12'>
      <div className='max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center'>
        {/* Left: Text Content */}
        <div className='space-y-8'>
          <div className='space-y-3'>
            {/* <p className="text-lg font-medium text-gray-600">Step 1</p> */}
            <Heading variant='hero'>{showDraftOptions ? t('introTitleReturning') : t('introTitle')}</Heading>
          </div>

          <Text variant='body-xl' leading='relaxed'>
            {showDraftOptions ? t('introDescriptionDraft') : t('introDescription')}
          </Text>

          {/* Choice Cards - Draft Mode */}
          {showDraftOptions ? (
            <div className='pt-4 space-y-4'>
              <ActionCard
                icon={<IconClock className='w-6 h-6 text-white' />}
                title={t('continueDraft')}
                description={t('continueDraftDescription')}
                onClick={handleContinueDraft}
                variant='primary'
              />

              <ActionCard
                icon={<IconSparkles className='w-6 h-6 text-gray-700' />}
                title={t('startFresh')}
                description={t('startFreshDescription')}
                onClick={handleStartFresh}
                variant='secondary'
              />

              <p className='text-sm text-gray-500 text-center pt-2'>{t('draftExpiryNote')}</p>
            </div>
          ) : (
            /* Get Started Button - No Draft Mode */
            <div className='pt-4'>
              <button
                onClick={handleStartFresh}
                className={cn(
                  'inline-flex items-center justify-center gap-2',
                  'px-8 py-4 rounded-xl',
                  'bg-black text-white font-semibold text-lg',
                  'hover:bg-gray-800 transition-all duration-200',
                  'shadow-lg hover:shadow-xl',
                )}
              >
                {t('getStarted')}
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Right: Illustration */}
        <div className='hidden lg:block'>
          <div className='relative'>
            {/* Card with Image Placeholder */}
            <div className='relative w-full aspect-square max-w-lg mx-auto'>
              <div className='absolute inset-0 bg-gradient-to-br from-accent-100 via-primary-100 to-info-100 rounded-3xl transform rotate-3 opacity-50' />
              <div className='absolute inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100'>
                  {/* Image placeholder - Replace src with your image */}
                  <img src='/images/intro.png' alt='Get started with your pet ad' className='w-full h-full object-cover' loading='eager' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
