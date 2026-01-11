import { useEffect, RefObject } from 'react';

/**
 * Hook that triggers a callback when a click occurs outside of the specified element
 * @param ref - React ref object for the element to detect clicks outside of
 * @param handler - Callback function to run when a click outside occurs
 * @param excludeRefs - Optional array of refs to exclude from being detected as outside
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  excludeRefs: RefObject<HTMLElement | null>[] = []
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Do nothing if the ref is not attached to an element or clicking the element
      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      // Check if the click was inside any of the excluded elements
      const isExcluded = excludeRefs.some((excludeRef) => excludeRef.current && excludeRef.current.contains(target));

      if (isExcluded) {
        return;
      }

      handler(event);
    };

    // Add event listeners
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);
}

export default useClickOutside;
