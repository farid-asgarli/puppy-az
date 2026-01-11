import { useLayoutEffect } from 'react';
import type { ActiveField } from '../constants';
import { LAYOUT } from '../constants';

interface UseDropdownPositionProps {
  activeField: ActiveField;
  isExpanded: boolean;
  fieldRefs: React.MutableRefObject<Record<NonNullable<ActiveField>, HTMLDivElement | null>>;
  searchBarRef: React.RefObject<HTMLDivElement | null>;
  onPositionCalculated: (position: { left: number; width: number }) => void;
}

/**
 * Hook to calculate and manage dropdown positioning
 * Uses useLayoutEffect to ensure calculation happens after DOM updates but before paint
 */
export function useDropdownPosition({ activeField, isExpanded, fieldRefs, searchBarRef, onPositionCalculated }: UseDropdownPositionProps) {
  // Calculate and update dropdown position synchronously after DOM updates
  useLayoutEffect(() => {
    if (activeField && fieldRefs.current[activeField] && searchBarRef.current) {
      const fieldElement = fieldRefs.current[activeField];
      const searchBarElement = searchBarRef.current;

      if (fieldElement) {
        const fieldRect = fieldElement.getBoundingClientRect();
        const searchBarRect = searchBarElement.getBoundingClientRect();

        // Calculate initial left position (aligned with field)
        let left = fieldRect.left - searchBarRect.left;

        // Only constrain dropdown to stay within searchbar bounds if the searchbar is expanded
        // When collapsed (searchbar narrower than dropdown), allow natural positioning
        if (searchBarRect.width >= LAYOUT.DROPDOWN_WIDTH) {
          // Ensure dropdown doesn't overflow the right edge
          const maxLeft = searchBarRect.width - LAYOUT.DROPDOWN_WIDTH;
          left = Math.max(0, Math.min(left, maxLeft));
        }

        onPositionCalculated({ left, width: LAYOUT.DROPDOWN_WIDTH });
      }
    } else if (!activeField) {
      // Reset position when no field is active
      onPositionCalculated({ left: 0, width: LAYOUT.DROPDOWN_WIDTH });
    }
  }, [activeField, isExpanded, fieldRefs, searchBarRef, onPositionCalculated]);
}
