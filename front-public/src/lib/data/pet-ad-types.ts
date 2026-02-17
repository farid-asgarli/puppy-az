import {
  petAdTypesService,
  type PetAdTypeDto,
  type MappedPetAdType,
} from "@/lib/api";

/**
 * Default fallback ad types in case API fails
 * These match the database seed data
 */
const FALLBACK_AD_TYPES: MappedPetAdType[] = [
  {
    id: 1,
    key: "sale",
    title: "Satış",
    description: "Satılıq ev heyvanları tapın",
    emoji: "💰",
    color: { bg: "bg-sky-100", text: "text-sky-600", border: "border-sky-200" },
  },
  {
    id: 2,
    key: "match",
    title: "Cütləşmə",
    description: "Cütləşmə sorğuları üçün",
    emoji: "❤️",
    color: {
      bg: "bg-rose-100",
      text: "text-rose-600",
      border: "border-rose-200",
    },
  },
  {
    id: 3,
    key: "found",
    title: "Tapılıb",
    description: "Yaxınlıqda tapılmış heyvanlar",
    emoji: "🔍",
    color: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      border: "border-indigo-200",
    },
  },
  {
    id: 4,
    key: "lost",
    title: "İtirilmişdir",
    description: "İtirilmiş heyvanların tapılmasına kömək edin",
    emoji: "😢",
    color: {
      bg: "bg-teal-100",
      text: "text-teal-600",
      border: "border-teal-200",
    },
  },
  {
    id: 5,
    key: "owning",
    title: "Sahiblənmə",
    description: "Ev axtaran heyvanlar",
    emoji: "🏠",
    color: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      border: "border-amber-200",
    },
  },
];

/**
 * Map API response to UI-friendly format
 */
function mapPetAdType(dto: PetAdTypeDto): MappedPetAdType {
  return {
    id: dto.id,
    key: dto.key,
    title: dto.title,
    description: dto.description || "",
    emoji: dto.emoji || "📋",
    color: {
      bg: dto.backgroundColor || "bg-gray-100",
      text: dto.textColor || "text-gray-600",
      border: dto.borderColor || "border-gray-200",
    },
  };
}

/**
 * Fetch pet ad types from the API (server-side)
 * Uses Next.js caching with revalidation
 *
 * @param locale - The locale for localized content
 * @returns Array of mapped pet ad types
 */
export async function getPetAdTypes(
  locale: string = "az",
): Promise<MappedPetAdType[]> {
  try {
    const types = await petAdTypesService.getPetAdTypes(locale);

    if (!types || types.length === 0) {
      console.warn(
        "[getPetAdTypes] No types returned from API, using fallback",
      );
      return FALLBACK_AD_TYPES;
    }

    return types.map(mapPetAdType);
  } catch (error) {
    console.error("[getPetAdTypes] Failed to fetch pet ad types:", error);
    return FALLBACK_AD_TYPES;
  }
}

/**
 * Get pet ad types as a map keyed by the type key (e.g., 'sale', 'match')
 * This is useful for quick lookups by type key
 */
export async function getPetAdTypesMap(
  locale: string = "az",
): Promise<Record<string, MappedPetAdType>> {
  const types = await getPetAdTypes(locale);
  return types.reduce(
    (acc, type) => {
      acc[type.key] = type;
      return acc;
    },
    {} as Record<string, MappedPetAdType>,
  );
}
