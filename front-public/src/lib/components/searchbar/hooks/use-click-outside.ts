import { useEffect } from 'react';
import type { ActiveField } from '../constants';

interface UseClickOutsideProps {
  activeField: ActiveField;
  searchBarRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onClickOutside: () => void;
}

/**
 * Hook to handle click outside behavior
 */
export function useClickOutside({ activeField, searchBarRef, dropdownRef, onClickOutside }: UseClickOutsideProps) {
  useEffect(() => {
    if (!activeField) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (searchBarRef.current && dropdownRef.current && !searchBarRef.current.contains(target) && !dropdownRef.current.contains(target)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeField, searchBarRef, dropdownRef, onClickOutside]);
}
