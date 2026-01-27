'use client';

import { useRouter } from '@/i18n';
import { useTransition, useCallback } from 'react';

/**
 * Hook to navigate with React 19.2 View Transitions
 *
 * Provides smooth animations between route changes using the new
 * View Transitions API from React 19.2
 *
 * @example
 * ```tsx
 * const { navigateWithTransition, isPending } = useViewTransition();
 *
 * <button onClick={() => navigateWithTransition('/ads')}>
 *   Go to Ads {isPending && '...'}
 * </button>
 * ```
 */
export function useViewTransition() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateWithTransition = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      startTransition(() => {
        router.push(href, options);
      });
    },
    [router],
  );

  const replaceWithTransition = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      startTransition(() => {
        router.replace(href, options);
      });
    },
    [router],
  );

  const backWithTransition = useCallback(() => {
    startTransition(() => {
      router.back();
    });
  }, [router]);

  const forwardWithTransition = useCallback(() => {
    startTransition(() => {
      router.forward();
    });
  }, [router]);

  const refreshWithTransition = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  return {
    navigateWithTransition,
    replaceWithTransition,
    backWithTransition,
    forwardWithTransition,
    refreshWithTransition,
    isPending,
  };
}
