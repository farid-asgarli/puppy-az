"use client";

import { useState, useEffect } from "react";
import { API_CONFIG } from "../api/client";
import {
  StaticSection,
  StaticSectionLocalization,
} from "../api/services/static-sections.service";
import { useLocale } from "./use-client-locale";

interface UseStaticSectionResult {
  data: StaticSectionLocalization | null;
  section: StaticSection | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch static section content from API
 * @param key - Section key (e.g., 'home_hero', 'home_how_it_works')
 */
export function useStaticSection(key: string): UseStaticSectionResult {
  const locale = useLocale();
  const [section, setSection] = useState<StaticSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${API_CONFIG.BASE_URL}/api/static-sections/${key}`,
          {
            headers: {
              "Accept-Language": locale,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch section: ${response.status}`);
        }

        const data: StaticSection = await response.json();

        if (mounted) {
          setSection(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch section"),
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSection();

    return () => {
      mounted = false;
    };
  }, [key, locale]);

  // Get localized content
  const data =
    section?.localizations.find((l) => l.localeCode === locale) ||
    section?.localizations[0] ||
    null;

  return { data, section, isLoading, error };
}
