import { ApiClient } from "../client";

/**
 * Static Section Localization DTO
 */
export interface StaticSectionLocalization {
  id: number;
  localeCode: string;
  title: string;
  subtitle: string;
  content: string;
  metadata: string | null; // JSON string from API
}

/**
 * Parsed metadata with any structure
 */
export type ParsedMetadata = Record<string, unknown>;

/**
 * Static Section DTO
 */
export interface StaticSection {
  id: number;
  key: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  localizations: StaticSectionLocalization[];
}

/**
 * Parse metadata JSON string safely
 */
export function parseMetadata(
  metadata: string | null | undefined,
): ParsedMetadata | null {
  if (!metadata) return null;
  try {
    return JSON.parse(metadata) as ParsedMetadata;
  } catch {
    return null;
  }
}

/**
 * Static Sections Service
 * Provides methods to fetch static content sections from API
 */
export class StaticSectionsService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get static section by key
   * @param key - Section key (e.g., 'home_hero', 'home_how_it_works')
   * @param locale - Optional locale code for filtering
   */
  async getByKey(key: string, locale?: string): Promise<StaticSection> {
    const queryParam = locale ? `?locale=${locale}` : "";
    const response = await this.client.get<StaticSection>(
      `/api/static-sections/${key}${queryParam}`,
    );
    return response;
  }

  /**
   * Get localized content for a section
   * @param section - Static section data
   * @param locale - Locale code (az, en, ru)
   * @returns Localization for the specified locale or first available
   */
  getLocalizedContent(
    section: StaticSection,
    locale: string,
  ): StaticSectionLocalization | undefined {
    return (
      section.localizations.find((l) => l.localeCode === locale) ||
      section.localizations[0]
    );
  }
}

// Singleton instance
let staticSectionsService: StaticSectionsService | null = null;

export function getStaticSectionsService(
  client: ApiClient,
): StaticSectionsService {
  if (!staticSectionsService) {
    staticSectionsService = new StaticSectionsService(client);
  }
  return staticSectionsService;
}
