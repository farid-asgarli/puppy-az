'use client';

import { useState, useEffect } from 'react';

/**
 * Enhanced media query hook with SSR awareness
 * @param {string} query - CSS media query string
 * @returns {boolean | undefined} - True if media query matches, false if it doesn't, undefined during SSR
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Sync initial value in case it changed between mount and effect
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
