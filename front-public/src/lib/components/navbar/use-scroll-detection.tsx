'use client';

import { useEffect, useState, useRef } from 'react';

const SCROLL_THRESHOLD = 5; // Small threshold to prevent jitter

/**
 * Hook to detect if user has scrolled from the top of the page
 * Returns true when window.scrollY <= SCROLL_THRESHOLD, false otherwise
 * Includes hysteresis to prevent jittering
 *
 * Note: Initial state is always true to match SSR and prevent hydration errors.
 * Actual scroll position is checked after mount.
 */
export function useScrollDetection() {
  // Always start with true to match server-side rendering
  const [isAtTop, setIsAtTop] = useState(true);
  const previousScrollY = useRef(0);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Set initial state only once after mount
    if (!isInitialized.current) {
      const initialAtTop = window.scrollY <= SCROLL_THRESHOLD;
      setIsAtTop(initialAtTop);
      previousScrollY.current = window.scrollY;
      isInitialized.current = true;
    }

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const currentAtTop = currentScrollY <= SCROLL_THRESHOLD;

          // Only update state if the "at top" status actually changed
          if (currentAtTop !== previousScrollY.current <= SCROLL_THRESHOLD) {
            setIsAtTop(currentAtTop);
          }

          previousScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return isAtTop;
}
