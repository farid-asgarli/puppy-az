'use client';

import { createContext, useContext, ReactNode } from 'react';
import { PetAdType, PetBreedDto, PetCategoryDetailedDto } from '@/lib/api';
import { FilterParams } from '@/lib/filtering/types';

/**
 * Initial filter values from URL - single source of truth
 */
export interface SearchBarInitialValues {
  adType: PetAdType | null;
  category: PetCategoryDetailedDto | null;
  breed: PetBreedDto | null;
}

/**
 * Context value with initial values and update function
 */
interface SearchBarSyncContextValue {
  initialValues: SearchBarInitialValues;
  updateUrlFilters: (filters: Partial<FilterParams>) => void;
  currentUrlFilters: FilterParams;
  isSearchRoute: boolean; // True if on /ads/s route where filtering happens
}

const SearchBarSyncContext = createContext<SearchBarSyncContextValue | null>(null);

/**
 * Provider component that wraps both searchbar components
 * Provides initial values from URL and update function
 */
export function SearchBarSyncProvider({
  children,
  initialValues,
  updateUrlFilters,
  currentUrlFilters,
  isSearchRoute,
}: {
  children: ReactNode;
  initialValues: SearchBarInitialValues;
  updateUrlFilters: (filters: Partial<FilterParams>) => void;
  currentUrlFilters: FilterParams;
  isSearchRoute: boolean; // True if on /ads/s route
}) {
  return (
    <SearchBarSyncContext.Provider value={{ initialValues, updateUrlFilters, currentUrlFilters, isSearchRoute }}>
      {children}
    </SearchBarSyncContext.Provider>
  );
}

/**
 * Hook to access searchbar sync context
 */
export function useSearchBarSync() {
  const context = useContext(SearchBarSyncContext);
  if (!context) {
    throw new Error('useSearchBarSync must be used within SearchBarSyncProvider');
  }
  return context;
}
