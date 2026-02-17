"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MappedPetAdType } from "@/lib/api";
import { getAdTypeIcon } from "@/lib/utils/mappers";
import type { Icon } from "@tabler/icons-react";

/**
 * Default fallback ad types for when context is not available
 */
const FALLBACK_AD_TYPES: MappedPetAdType[] = [
  {
    id: 1,
    key: "sale",
    title: "Satış",
    description: "Satılıq ev heyvanları tapın",
    emoji: "💰",
    color: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-400",
    },
  },
  {
    id: 2,
    key: "match",
    title: "Cütləşmə",
    description: "Cütləşmə sorğuları üçün",
    emoji: "❤️",
    color: {
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-400",
    },
  },
  {
    id: 3,
    key: "found",
    title: "Tapılıb",
    description: "Yaxınlıqda tapılmış heyvanlar",
    emoji: "🔍",
    color: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-400",
    },
  },
  {
    id: 4,
    key: "lost",
    title: "İtirilmişdir",
    description: "İtirilmiş heyvanların tapılmasına kömək edin",
    emoji: "😢",
    color: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-400",
    },
  },
  {
    id: 5,
    key: "owning",
    title: "Sahiblənmə",
    description: "Ev axtaran heyvanlar",
    emoji: "🏠",
    color: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-400",
    },
  },
];

/**
 * Extended ad type with icon component for UI usage
 */
export interface AdTypeWithIcon extends MappedPetAdType {
  icon: Icon;
}

/**
 * Context for pet ad types
 * Provides access to database-driven listing types throughout the app
 */
interface AdTypesContextValue {
  /** Array of all pet ad types */
  adTypes: MappedPetAdType[];
  /** Array of all pet ad types with icons */
  adTypesWithIcons: AdTypeWithIcon[];
  /** Map of ad types keyed by their key (e.g., 'sale', 'match') */
  adTypesMap: Record<string, MappedPetAdType>;
  /** Map of ad types keyed by their id */
  adTypesById: Record<number, AdTypeWithIcon>;
  /** Get ad type by key */
  getAdType: (key: string) => MappedPetAdType | undefined;
  /** Get ad type by id (returns type with icon) */
  getAdTypeById: (id: number) => AdTypeWithIcon | undefined;
}

const AdTypesContext = createContext<AdTypesContextValue | null>(null);

interface AdTypesProviderProps {
  children: ReactNode;
  initialAdTypes: MappedPetAdType[];
}

/**
 * Provider component for pet ad types
 * Should be placed in the root layout and receive server-fetched data
 */
export function AdTypesProvider({
  children,
  initialAdTypes,
}: AdTypesProviderProps) {
  // Create types with icons
  const adTypesWithIcons: AdTypeWithIcon[] = initialAdTypes.map((type) => ({
    ...type,
    icon: getAdTypeIcon(type.key),
  }));

  // Create a map by key for quick lookups
  const adTypesMap = initialAdTypes.reduce(
    (acc, type) => {
      acc[type.key] = type;
      return acc;
    },
    {} as Record<string, MappedPetAdType>,
  );

  // Create a map by id for quick lookups (with icons)
  const adTypesById = adTypesWithIcons.reduce(
    (acc, type) => {
      acc[type.id] = type;
      return acc;
    },
    {} as Record<number, AdTypeWithIcon>,
  );

  const getAdType = (key: string) => adTypesMap[key];
  const getAdTypeById = (id: number) => adTypesById[id];

  return (
    <AdTypesContext.Provider
      value={{
        adTypes: initialAdTypes,
        adTypesWithIcons,
        adTypesMap,
        adTypesById,
        getAdType,
        getAdTypeById,
      }}
    >
      {children}
    </AdTypesContext.Provider>
  );
}

/**
 * Create fallback context value for use outside provider
 * Lazy initialized to avoid circular dependency issues
 */
let _fallbackContextValue: AdTypesContextValue | null = null;

function getFallbackContextValue(): AdTypesContextValue {
  if (_fallbackContextValue) return _fallbackContextValue;

  const adTypesWithIcons: AdTypeWithIcon[] = FALLBACK_AD_TYPES.map((type) => ({
    ...type,
    icon: getAdTypeIcon(type.key),
  }));

  const adTypesMap = FALLBACK_AD_TYPES.reduce(
    (acc, type) => {
      acc[type.key] = type;
      return acc;
    },
    {} as Record<string, MappedPetAdType>,
  );

  const adTypesById = adTypesWithIcons.reduce(
    (acc, type) => {
      acc[type.id] = type;
      return acc;
    },
    {} as Record<number, AdTypeWithIcon>,
  );

  _fallbackContextValue = {
    adTypes: FALLBACK_AD_TYPES,
    adTypesWithIcons,
    adTypesMap,
    adTypesById,
    getAdType: (key: string) => adTypesMap[key],
    getAdTypeById: (id: number) => adTypesById[id],
  };

  return _fallbackContextValue;
}

/**
 * Hook to access pet ad types
 * Returns fallback values if used outside of AdTypesProvider (e.g., 404 page)
 */
export function useAdTypes(): AdTypesContextValue {
  const context = useContext(AdTypesContext);
  return context ?? getFallbackContextValue();
}

/**
 * Hook to get a specific ad type by key
 * Returns undefined if not found
 */
export function useAdType(key: string): MappedPetAdType | undefined {
  const { getAdType } = useAdTypes();
  return getAdType(key);
}
