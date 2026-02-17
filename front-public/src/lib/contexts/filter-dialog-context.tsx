"use client";

import { createContext, useContext } from "react";

interface FilterDialogContextValue {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const FilterDialogContext =
  createContext<FilterDialogContextValue | null>(null);

/**
 * Hook to access FilterDialog state from any component in the main layout
 * Used by FilterButton in navbar to open the shared dialog
 */
export function useFilterDialog() {
  const context = useContext(FilterDialogContext);
  if (!context) {
    // Return no-op defaults when used outside FilterDialogContext.Provider (e.g. not-found page)
    return {
      isOpen: false,
      openDialog: () => {},
      closeDialog: () => {},
    };
  }
  return context;
}
