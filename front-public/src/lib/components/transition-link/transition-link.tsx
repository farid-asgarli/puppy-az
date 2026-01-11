'use client';

import Link from 'next/link';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { ComponentProps, MouseEvent } from 'react';

export interface TransitionLinkProps extends Omit<ComponentProps<typeof Link>, 'onClick'> {
  /**
   * Show loading state while transition is pending
   * @default false
   */
  showPending?: boolean;
  /**
   * Custom pending indicator to show while transition is in progress
   */
  pendingIndicator?: React.ReactNode;
  /**
   * Optional onClick handler that can prevent navigation
   */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void | boolean;
}

/**
 * Enhanced Next.js Link component with React 19.2 View Transitions
 *
 * Provides smooth animations between route changes using React's built-in
 * transition system. Wraps navigation in startTransition() to mark updates
 * as non-urgent and enable concurrent rendering optimizations.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TransitionLink href="/ads">View Ads</TransitionLink>
 *
 * // With pending indicator
 * <TransitionLink href="/profile" showPending>
 *   My Profile
 * </TransitionLink>
 *
 * // Custom pending state
 * <TransitionLink
 *   href="/search"
 *   pendingIndicator={<Spinner />}
 * >
 *   Search
 * </TransitionLink>
 * ```
 */
export default function TransitionLink({ href, showPending = false, pendingIndicator, onClick, children, scroll, ...props }: TransitionLinkProps) {
  const { navigateWithTransition, isPending } = useViewTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      const result = onClick(e);
      // If onClick returns false, prevent navigation
      if (result === false) {
        e.preventDefault();
        return;
      }
    }

    // Check if it's a modifier key click (cmd/ctrl click to open in new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      // Let the default Link behavior handle it
      return;
    }

    // Prevent default Link navigation
    e.preventDefault();

    // Navigate with transition
    navigateWithTransition(href.toString(), { scroll });
  };

  return (
    <Link href={href} onClick={handleClick} scroll={scroll} {...props}>
      {children}
      {showPending && isPending && (pendingIndicator || '...')}
    </Link>
  );
}
