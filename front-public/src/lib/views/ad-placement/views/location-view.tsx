"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CityDto, DistrictDto } from "@/lib/api/types/city.types";
import { getCitiesAction, getDistrictsByCityAction } from "@/lib/auth/actions";
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
import { cn } from "@/lib/external/utils";

/**
 * Location Selection View
 * Step 5: Choose city and optionally district
 */
export default function LocationView() {
  const t = useTranslations("adPlacementDetails.locationView");
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [cities, setCities] = useState<CityDto[]>([]);
  const [districts, setDistricts] = useState<DistrictDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");
  const [selectedCityId, setSelectedCityId] = useState<number | null>(
    formData.cityId,
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    formData.districtId,
  );

  // Custom district state
  const savedCustomDistrict = formData.customDistrictName ?? "";
  const [isCustomDistrict, setIsCustomDistrict] = useState(
    savedCustomDistrict.length > 0,
  );
  const [customDistrictName, setCustomDistrictName] =
    useState(savedCustomDistrict);
  const [customDistrictSubmitted, setCustomDistrictSubmitted] = useState(
    savedCustomDistrict.length > 0,
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

  // Fetch districts when city changes
  const fetchDistricts = useCallback(async (cityId: number) => {
    try {
      setDistrictsLoading(true);
      setDistricts([]);
      setDistrictSearchQuery("");
      const result = await getDistrictsByCityAction(cityId);
      if (result.success) {
        setDistricts(result.data);
      } else {
        console.error("Failed to fetch districts:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    } finally {
      setDistrictsLoading(false);
    }
  }, []);

  // Load districts for initially selected city (edit mode)
  useEffect(() => {
    if (selectedCityId) {
      fetchDistricts(selectedCityId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const query = searchQuery.toLowerCase();
    return cities.filter((city) => city.name?.toLowerCase().includes(query));
  }, [cities, searchQuery]);

  // Filter districts based on search query
  const filteredDistricts = useMemo(() => {
    if (!districtSearchQuery.trim()) return districts;
    const query = districtSearchQuery.toLowerCase();
    return districts.filter((district) =>
      district.name?.toLowerCase().includes(query),
    );
  }, [districts, districtSearchQuery]);

  const handleCitySelect = (cityId: number) => {
    setSelectedCityId(cityId);
    // Reset district and custom district when city changes
    setSelectedDistrictId(null);
    setIsCustomDistrict(false);
    setCustomDistrictName("");
    setCustomDistrictSubmitted(false);
    setDistrictsLoading(true);
    setDistricts([]);
    updateFormData({ cityId, districtId: null, customDistrictName: "" });
    // Fetch districts for the selected city
    fetchDistricts(cityId);
  };

  const handleDistrictSelect = (districtId: number) => {
    // Clear custom district when selecting from list
    setIsCustomDistrict(false);
    setCustomDistrictName("");
    setCustomDistrictSubmitted(false);
    if (selectedDistrictId === districtId) {
      // Deselect if clicking the same district (optional selection)
      setSelectedDistrictId(null);
      updateFormData({ districtId: null, customDistrictName: "" });
    } else {
      setSelectedDistrictId(districtId);
      updateFormData({ districtId, customDistrictName: "" });
    }
  };

  const handleStartCustomDistrict = () => {
    setIsCustomDistrict(true);
    setSelectedDistrictId(null);
    setCustomDistrictName(districtSearchQuery);
    updateFormData({
      districtId: null,
      customDistrictName: districtSearchQuery,
    });
  };

  const handleCustomDistrictNameChange = (value: string) => {
    setCustomDistrictName(value);
    updateFormData({ customDistrictName: value });
  };

  const handleSubmitCustomDistrict = () => {
    if (!customDistrictName.trim()) return;
    setCustomDistrictSubmitted(true);
    updateFormData({ customDistrictName: customDistrictName.trim() });
  };

  const handleCancelCustomDistrict = () => {
    setIsCustomDistrict(false);
    setCustomDistrictName("");
    setCustomDistrictSubmitted(false);
    updateFormData({ customDistrictName: "" });
  };

  const handleNext = () => {
    if (selectedCityId !== null) {
      navigateWithTransition("/ads/ad-placement/photos");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/details");
  };

  const canProceed =
    selectedCityId !== null &&
    (selectedDistrictId !== null ||
      (isCustomDistrict &&
        customDistrictSubmitted &&
        customDistrictName.trim().length > 0));

  const selectedCityName = useMemo(
    () => cities.find((c) => c.id === selectedCityId)?.name || "",
    [cities, selectedCityId],
  );

  if (loading) {
    return <LoadingState message={t("loading")} />;
  }

  return (
    <>
      <ViewLayout>
        <div className="space-y-5">
          {/* Side-by-side City & District Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City Selection */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Heading variant="label">{t("heading")}</Heading>
                <Text variant="small" color="secondary">
                  {cities.length > 0
                    ? t("subtitle", { count: cities.length })
                    : t("noCities")}
                </Text>
              </div>

              {/* City Search Input */}
              {cities.length > 0 && (
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t("searchPlaceholder")}
                />
              )}

              {/* City Results Count */}
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
              <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
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
                      onClick={() => handleCitySelect(city.id)}
                      icon={
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-3.5 h-3.5 text-gray-600"
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
                      className="!py-2.5 !px-3 !border !rounded-lg"
                    />
                  ))
                )}
              </div>
            </div>

            {/* District Selection */}
            {selectedCityId === null ? (
              /* Placeholder when no city selected yet */
              <div className="space-y-3">
                <div className="space-y-1">
                  <Heading variant="label">{t("districtHeading")}</Heading>
                  <Text variant="small" color="secondary">
                    {t("districtPlaceholderHint")}
                  </Text>
                </div>

                <div className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg
                      className="w-7 h-7 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <Text variant="small" color="muted" className="font-medium">
                    {t("districtPlaceholderTitle")}
                  </Text>
                  <Text
                    variant="small"
                    color="muted"
                    className="mt-1 text-center max-w-[200px]"
                  >
                    {t("districtPlaceholderDescription")}
                  </Text>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Heading variant="label">{t("districtHeading")}</Heading>
                  <Text variant="small" color="secondary">
                    {t("districtSubtitle", { city: selectedCityName })}
                  </Text>
                </div>

                {districtsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                    <Text variant="small" color="secondary" className="ml-3">
                      {t("districtLoading")}
                    </Text>
                  </div>
                ) : isCustomDistrict ? (
                  /* ── Custom district input mode ── */
                  <div className="space-y-3">
                    {customDistrictSubmitted ? (
                      /* ── Success state ── */
                      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>

                          <Text
                            variant="small"
                            className="font-semibold text-green-800"
                          >
                            {t("customDistrictSuccess")}
                          </Text>

                          <div className="flex items-center gap-2 rounded-lg bg-green-100/80 px-3 py-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-green-700 flex-shrink-0"
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
                            <Text
                              variant="small"
                              className="font-medium text-green-800"
                            >
                              &quot;{customDistrictName}&quot;
                            </Text>
                          </div>

                          <button
                            onClick={handleCancelCustomDistrict}
                            className="mt-1 text-xs text-green-700 hover:text-green-900 underline underline-offset-2 transition-colors"
                          >
                            {t("cancelCustomDistrict")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Input form ── */
                      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <Text variant="small" className="font-semibold">
                              {t("customDistrictTitle")}
                            </Text>
                            <Text variant="small" color="secondary">
                              {t("customDistrictDescription")}
                            </Text>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={customDistrictName}
                          onChange={(e) =>
                            handleCustomDistrictNameChange(e.target.value)
                          }
                          placeholder={t("customDistrictPlaceholder")}
                          maxLength={100}
                          className={cn(
                            "w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200",
                            "placeholder:text-gray-400 focus:outline-none",
                            "border-gray-200 bg-gray-50 focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-200",
                          )}
                          autoFocus
                        />

                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleSubmitCustomDistrict}
                            disabled={!customDistrictName.trim()}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200",
                              "disabled:cursor-not-allowed",
                              customDistrictName.trim()
                                ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed",
                            )}
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {t("submitCustomDistrict")}
                          </button>
                          <button
                            onClick={handleCancelCustomDistrict}
                            className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
                          >
                            {t("cancelCustomDistrict")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : districts.length === 0 ? (
                  /* ── No districts — show custom input directly ── */
                  <div className="space-y-3">
                    <Text variant="small" color="muted">
                      {t("noDistricts")}
                    </Text>
                    <button
                      onClick={handleStartCustomDistrict}
                      className="group flex items-center gap-2 w-full rounded-lg border border-dashed border-gray-200 px-3 py-2.5 text-left hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-200"
                    >
                      <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <svg
                          className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <Text
                        variant="small"
                        className="font-medium text-gray-500 group-hover:text-gray-700 transition-colors"
                      >
                        {t("cantFindDistrict")}
                      </Text>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* District Search */}
                    {districts.length > 5 && (
                      <SearchInput
                        value={districtSearchQuery}
                        onChange={setDistrictSearchQuery}
                        placeholder={t("districtSearchPlaceholder")}
                      />
                    )}

                    {/* District Results Count */}
                    {districtSearchQuery && (
                      <Text variant="small" color="secondary">
                        {filteredDistricts.length === 0
                          ? t("noResults")
                          : t("resultsCount", {
                              count: filteredDistricts.length,
                            })}
                      </Text>
                    )}

                    {/* District List */}
                    <div className="space-y-1.5 max-h-[350px] overflow-y-auto">
                      {filteredDistricts.length === 0 && districtSearchQuery ? (
                        <div className="text-center py-6 space-y-3">
                          <p className="text-gray-500 text-sm">
                            {t("noMatch", { query: districtSearchQuery })}
                          </p>
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={handleStartCustomDistrict}
                              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              &quot;{districtSearchQuery}&quot;
                            </button>
                            <button
                              onClick={() => setDistrictSearchQuery("")}
                              className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
                            >
                              {t("clearSearch")}
                            </button>
                          </div>
                        </div>
                      ) : (
                        filteredDistricts.map((district) => (
                          <OptionCard
                            key={district.id}
                            selected={selectedDistrictId === district.id}
                            onClick={() => handleDistrictSelect(district.id)}
                            icon={
                              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                              </div>
                            }
                            title={district.name || "Unknown District"}
                            size="sm"
                            className="!py-2.5 !px-3 !border !rounded-lg"
                          />
                        ))
                      )}
                    </div>

                    {/* "Can't find?" link at bottom */}
                    {!districtSearchQuery && (
                      <button
                        onClick={handleStartCustomDistrict}
                        className="group flex items-center gap-2 w-full rounded-lg border border-dashed border-gray-200 px-3 py-2.5 text-left hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-200"
                      >
                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                          <svg
                            className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <Text
                          variant="small"
                          className="font-medium text-gray-500 group-hover:text-gray-700 transition-colors"
                        >
                          {t("cantFindDistrict")}
                        </Text>
                      </button>
                    )}
                  </>
                )}
              </div>
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
