"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CityDto } from "@/lib/api/types/city.types";
import { getCitiesAction } from "@/lib/auth/actions";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import {
  ViewFooter,
  ViewLayout,
  LoadingState,
  SearchInput,
} from "../components";
import { OptionCard } from "@/lib/components/views/ad-placement";
import { Heading, Text } from "@/lib/primitives/typography";

/**
 * Location Selection View
 * Step 5: Choose city from API
 */
export default function LocationView() {
  const t = useTranslations("adPlacementDetails.locationView");
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [cities, setCities] = useState<CityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<number | null>(
    formData.cityId,
  );

  // Fetch cities from API using Server Action
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const result = await getCitiesAction();
        if (result.success) {
          setCities(result.data);
        } else {
          console.error("Failed to fetch cities:", result.error);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;

    const query = searchQuery.toLowerCase();
    return cities.filter((city) => city.name?.toLowerCase().includes(query));
  }, [cities, searchQuery]);

  const handleSelect = (cityId: number) => {
    setSelectedCityId(cityId);
    updateFormData({ cityId });
  };

  const handleNext = () => {
    if (selectedCityId !== null) {
      navigateWithTransition("/ads/ad-placement/photos");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/details");
  };

  const canProceed = selectedCityId !== null;

  if (loading) {
    return <LoadingState message={t("loading")} />;
  }

  return (
    <>
      <ViewLayout>
        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="subsection">{t("heading")}</Heading>
            <Text variant="body-lg" color="secondary">
              {cities.length > 0
                ? t("subtitle", { count: cities.length })
                : t("noCities")}
            </Text>
          </div>

          {/* Search Input */}
          {cities.length > 0 && (
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("searchPlaceholder")}
            />
          )}

          {/* Results Count */}
          {searchQuery && (
            <Text variant="small" color="secondary">
              {filteredCities.length === 0
                ? t("noResults")
                : t("resultsCount", {
                    count: filteredCities.length,
                  })}
            </Text>
          )}

          {/* City List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredCities.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t("noMatch", { query: searchQuery })}
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-black underline font-medium"
                >
                  {t("clearSearch")}
                </button>
              </div>
            ) : (
              filteredCities.map((city) => (
                <OptionCard
                  key={city.id}
                  selected={selectedCityId === city.id}
                  onClick={() => handleSelect(city.id)}
                  icon={
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  }
                  title={city.name || "Unknown City"}
                  size="sm"
                />
              ))
            )}
          </div>
        </div>
      </ViewLayout>

      <ViewFooter
        onBack={handleBack}
        onNext={handleNext}
        canProceed={canProceed}
      />
    </>
  );
}
