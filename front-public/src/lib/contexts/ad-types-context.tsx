"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MappedPetAdType } from "@/lib/api";

/**
 * Context for pet ad types
 * Provides access to database-driven listing types throughout the app
 */
interface AdTypesContextValue {
  /** Array of all pet ad types */
  adTypes: MappedPetAdType[];
  /** Map of ad types keyed by their key (e.g., 'sale', 'match') */
  adTypesMap: Record<string, MappedPetAdType>;
  /** Get ad type by key */
  getAdType: (key: string) => MappedPetAdType | undefined;
  /** Get ad type by id */
  getAdTypeById: (id: number) => MappedPetAdType | undefined;
}

const AdTypesContext = createContext<AdTypesContextValue | null>(null);

interface AdTypesProviderProps {
  children: ReactNode;
  adTypes: MappedPetAdType[];
}

/**
 * Provider component for pet ad types
 * Should be placed in the root layout and receive server-fetched data
 */
export function AdTypesProvider({ children, adTypes }: AdTypesProviderProps) {
  // Create a map for quick lookups
  const adTypesMap = adTypes.reduce(
    (acc, type) => {
      acc[type.key] = type;
      return acc;
    },
    {} as Record<string, MappedPetAdType>,
  );

  const getAdType = (key: string) => adTypesMap[key];
  const getAdTypeById = (id: number) => adTypes.find((t) => t.id === id);

  return (
    <AdTypesContext.Provider
      value={{ adTypes, adTypesMap, getAdType, getAdTypeById }}
    >
      {children}
    </AdTypesContext.Provider>
  );
}

/**
 * Hook to access pet ad types
 * @throws Error if used outside of AdTypesProvider
 */
export function useAdTypes(): AdTypesContextValue {
  const context = useContext(AdTypesContext);
  if (!context) {
    throw new Error("useAdTypes must be used within an AdTypesProvider");
  }
  return context;
}

/**
 * Hook to get a specific ad type by key
 * Returns undefined if not found
 */
export function useAdType(key: string): MappedPetAdType | undefined {
  const { getAdType } = useAdTypes();
  return getAdType(key);
}
