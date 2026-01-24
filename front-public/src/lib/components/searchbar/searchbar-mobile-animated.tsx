"use client";

import { useReducer, useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/external/utils";
import { PetAdType, PetBreedDto, PetCategoryDetailedDto } from "@/lib/api";
import { getAdTypes } from "@/lib/utils/mappers";
import Button from "@/lib/primitives/button/button.component";
import { SearchFieldButton } from "./components/search-field-button";
import { MobileBottomSheet } from "./components/mobile-bottom-sheet";
import { AdTypeDropdown, CategoryDropdown, BreedDropdown } from "./dropdowns";
import {
  mobileSearchBarReducer,
  createInitialMobileState,
} from "./mobile-state";
import { useSearchBarSync } from "./searchbar-sync-context";
import {
  IconCategory,
  IconDna2,
  IconPaw,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { IconButton } from "@/lib/primitives/icon-button";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { useTranslations } from "next-intl";

/**
 * SearchBarMobileAnimated Component
 * Mobile pet ads search bar with Airbnb-inspired full-screen modal
 * Compact search pill that expands to full-screen overlay on tap
 */
export const SearchBarMobileAnimated = () => {
  const { initialValues, updateUrlFilters, isSearchRoute } = useSearchBarSync();
  const { navigateWithTransition } = useViewTransition();
  const tAccessibility = useTranslations("accessibility");
  const tSearch = useTranslations("search");
  const tCommon = useTranslations("common");
  const adTypes = getAdTypes(tCommon);

  // Initialize state with values from URL ONLY if on search route (/ads/s)
  // On other routes, start with empty state
  const initialStateWithValues = useMemo(
    () =>
      createInitialMobileState({
        selectedAdType:
          isSearchRoute && initialValues.adType !== null
            ? (adTypes[initialValues.adType]?.title ?? null)
            : null,
        selectedCategory: isSearchRoute ? initialValues.category : null,
        selectedBreed: isSearchRoute ? initialValues.breed : null,
      }),
    [initialValues, isSearchRoute, adTypes],
  );

  const [state, dispatch] = useReducer(
    mobileSearchBarReducer,
    initialStateWithValues,
  );
  const {
    isExpanded,
    activeSheet,
    selectedAdType,
    selectedCategory,
    selectedBreed,
  } = state;

  const handleExpandClick = useCallback(() => {
    dispatch({ type: "OPEN_MODAL" });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: "CLOSE_MODAL" });
  }, []);

  const handleSearchClick = useCallback(() => {
    // Build filter params from current local state
    const filterUpdates: Record<string, string | number | null> = {};

    // Convert ad type title back to PetAdType enum
    if (selectedAdType) {
      const adTypeEntry = Object.entries(adTypes).find(
        ([_, adType]) => adType.title === selectedAdType,
      );
      if (adTypeEntry) {
        filterUpdates["ad-type"] = adTypeEntry[0]; // Use the numeric key
      }
    } else {
      filterUpdates["ad-type"] = null; // Clear if empty
    }

    // Category and breed use IDs
    filterUpdates["category"] = selectedCategory?.id ?? null;
    filterUpdates["breed"] = selectedBreed?.id ?? null;

    // If not on search route, navigate to /ads/s with filters
    if (!isSearchRoute) {
      const searchParams = new URLSearchParams();
      Object.entries(filterUpdates).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      navigateWithTransition(`/ads/s${queryString ? `?${queryString}` : ""}`);
    } else {
      // Already on search route, just update URL filters
      updateUrlFilters(filterUpdates);
    }
    handleClose();
  }, [
    selectedAdType,
    selectedCategory,
    selectedBreed,
    updateUrlFilters,
    handleClose,
    isSearchRoute,
    navigateWithTransition,
    adTypes,
  ]);

  const handleClearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  const handleAdTypeSelect = useCallback(
    (value: PetAdType) => {
      const adTypeTitle = adTypes[value]?.title || value.toString();
      dispatch({ type: "SET_AD_TYPE", payload: adTypeTitle });
    },
    [adTypes],
  );

  const handleCategorySelect = useCallback((value: PetCategoryDetailedDto) => {
    dispatch({ type: "SET_CATEGORY", payload: value });
  }, []);

  const handleBreedSelect = useCallback((value: PetBreedDto) => {
    dispatch({ type: "SET_BREED", payload: value });
  }, []);

  // Helper to get ad type data by title
  const getAdTypeByTitle = useCallback(
    (title: string | null) => {
      if (!title) return null;
      const entry = Object.entries(adTypes).find(
        ([_, adType]) => adType.title === title,
      );
      return entry ? { key: Number(entry[0]) as PetAdType, ...entry[1] } : null;
    },
    [adTypes],
  );

  // Handle body scroll when modal opens/closes
  useEffect(() => {
    if (isExpanded || activeSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded, activeSheet]);

  // Generate summary text for collapsed state
  const getSummaryText = () => {
    const parts = [
      selectedAdType || "Any type",
      selectedCategory?.title || "Any category",
      selectedBreed?.title || "Any breed",
    ];
    return parts.join(" • ");
  };

  // Check if any filters are active
  const hasActiveFilters = selectedAdType || selectedCategory || selectedBreed;

  return (
    <>
      {/* Collapsed Search Pill */}
      {!isExpanded && (
        <button
          onClick={handleExpandClick}
          className={cn(
            "flex items-center gap-3 w-full px-5 py-3.5",
            "bg-white rounded-full",
            "border border-gray-200",
            "shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]",
            "active:scale-[0.98] transition-all duration-200",
            "hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)]",
            "hover:border-gray-300",
          )}
          aria-label={tAccessibility("openSearch")}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
            <IconSearch className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {tSearch("searchQuestion")}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {hasActiveFilters
                ? getSummaryText()
                : tSearch("filterSummaryPlaceholder")}
            </div>
          </div>
        </button>
      )}

      {/* Full-Screen Expanded Modal */}
      {isExpanded && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-white",
            "animate-in fade-in duration-200",
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 h-16">
              <IconButton
                size="md"
                variant="ghost"
                onClick={handleClose}
                icon={<IconX className="text-gray-700" strokeWidth={2} />}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label={tAccessibility("closeSearch")}
              />
              <h2 className="text-lg font-semibold text-gray-900">
                {tSearch("searchTitle")}
              </h2>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Search Content */}
          <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {/* Section Title */}
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  {tSearch("filterYourSearch")}
                </h3>

                {/* Ad Type Field */}
                <SearchFieldButton
                  icon={(() => {
                    const adTypeData = getAdTypeByTitle(selectedAdType);
                    return adTypeData ? (
                      <adTypeData.icon
                        className={cn("w-5 h-5", adTypeData.color.text)}
                        strokeWidth={2}
                      />
                    ) : (
                      <IconCategory
                        className="w-5 h-5 text-gray-500"
                        strokeWidth={2}
                      />
                    );
                  })()}
                  iconBgClass={(() => {
                    const adTypeData = getAdTypeByTitle(selectedAdType);
                    return adTypeData ? adTypeData.color.bg : "bg-gray-100";
                  })()}
                  label={tSearch("adType")}
                  value={selectedAdType || tSearch("anyAdType")}
                  hasValue={!!selectedAdType}
                  onClick={() =>
                    dispatch({ type: "OPEN_SHEET", payload: "ad-type" })
                  }
                  onClear={() => dispatch({ type: "CLEAR_AD_TYPE" })}
                />

                {/* Category Field */}
                <SearchFieldButton
                  icon={
                    selectedCategory && selectedCategory.svgIcon ? (
                      <div
                        className={cn(
                          "w-5 h-5 [&>svg]:w-full [&>svg]:h-full",
                          selectedCategory.iconColor,
                        )}
                        dangerouslySetInnerHTML={{
                          __html: selectedCategory.svgIcon,
                        }}
                      />
                    ) : (
                      <IconPaw
                        className="w-5 h-5 text-gray-500"
                        strokeWidth={2}
                      />
                    )
                  }
                  iconBgClass={
                    selectedCategory
                      ? selectedCategory.backgroundColor
                      : "bg-gray-100"
                  }
                  label={tSearch("category")}
                  value={selectedCategory?.title || tSearch("allPets")}
                  hasValue={!!selectedCategory}
                  onClick={() =>
                    dispatch({ type: "OPEN_SHEET", payload: "category" })
                  }
                  onClear={() => dispatch({ type: "CLEAR_CATEGORY" })}
                />

                {/* Breed Field */}
                <SearchFieldButton
                  icon={
                    <IconDna2
                      className="w-5 h-5 text-emerald-600"
                      strokeWidth={2}
                    />
                  }
                  iconBgClass="bg-emerald-100"
                  label={tSearch("breed")}
                  value={
                    selectedBreed?.title ||
                    (selectedCategory
                      ? tSearch("anyBreed")
                      : tSearch("selectCategoryFirst"))
                  }
                  hasValue={!!selectedBreed}
                  disabled={!selectedCategory}
                  onClick={() =>
                    selectedCategory &&
                    dispatch({ type: "OPEN_SHEET", payload: "breed" })
                  }
                  onClear={() => dispatch({ type: "CLEAR_BREED" })}
                />
              </div>

              {/* Tips Section */}
              <div className="px-6 py-8">
                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      <IconSearch
                        className="w-5 h-5 text-gray-600"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {tSearch("searchTips")}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {hasActiveFilters
                          ? tSearch("searchTipsActive")
                          : tSearch("searchTipsInactive")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-4 shadow-[0_-4px_12px_0_rgba(0,0,0,0.08)] safe-area-bottom">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClearAll}
                  disabled={!hasActiveFilters}
                  className="px-6 whitespace-nowrap rounded-full border-2"
                >
                  {tSearch("clearAll")}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSearchClick}
                  leftSection={<IconSearch size={20} strokeWidth={2.5} />}
                  fullWidth
                  className="rounded-full shadow-lg"
                >
                  {tSearch("searchButton")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheets for Selections */}
      <MobileBottomSheet
        isOpen={activeSheet === "ad-type"}
        title={tAccessibility("selectAdType")}
        onClose={() => dispatch({ type: "CLOSE_SHEET" })}
      >
        <AdTypeDropdown onSelect={handleAdTypeSelect} />
      </MobileBottomSheet>

      <MobileBottomSheet
        isOpen={activeSheet === "category"}
        title={tAccessibility("selectCategory")}
        onClose={() => dispatch({ type: "CLOSE_SHEET" })}
      >
        <CategoryDropdown onSelect={handleCategorySelect} />
      </MobileBottomSheet>

      <MobileBottomSheet
        isOpen={activeSheet === "breed"}
        title={tAccessibility("selectBreed")}
        onClose={() => dispatch({ type: "CLOSE_SHEET" })}
      >
        <BreedDropdown
          categoryId={selectedCategory?.id ?? null}
          onSelect={handleBreedSelect}
        />
      </MobileBottomSheet>
    </>
  );
};

export default SearchBarMobileAnimated;
