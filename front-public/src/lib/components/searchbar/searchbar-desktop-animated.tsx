"use client";

import React, {
  useReducer,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
  useEffect,
} from "react";
import { PetAdType, PetBreedDto, PetCategoryDetailedDto } from "@/lib/api";
import { getAdTypes } from "@/lib/utils/mappers";
import { LAYOUT, type ActiveField } from "./constants";
import { searchBarReducer, createInitialState } from "./state";
import { Divider } from "./components/divider";
import { SearchButton } from "./components/search-button";
import { SearchField } from "./components/search-field";
import { AdTypeDropdown, CategoryDropdown, BreedDropdown } from "./dropdowns";
import { useDropdownPosition, useClickOutside } from "./hooks";
import { useSearchBarSync } from "./searchbar-sync-context";
import { cn } from "@/lib/external/utils";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { FilterButton } from "@/lib/components/filters/filter-button";
import { useTranslations } from "next-intl";
const TRANSITION_DURATION = 500; // Match navbar transition duration (500ms)
const TRANSITION_TIMING = "cubic-bezier(0.4, 0.0, 0.2, 1)"; // Material Design emphasized decelerate

interface SearchBarDesktopAnimatedProps {
  onExpandedChange?: (expanded: boolean) => void;
  hideFilterButton?: boolean;
  dropdownDirection?: "up" | "down";
  className?: string;
}

/**
 * SearchBarDesktopAnimated Component
 * Pet ads search bar with smooth expand/collapse transitions
 * Morphs between collapsed and expanded states
 * Auto-collapses when user scrolls down (isAtTop = false)
 */
export const SearchBarDesktopAnimated = ({
  onExpandedChange,
  hideFilterButton = false,
  dropdownDirection = "down",
  className,
}: SearchBarDesktopAnimatedProps) => {
  const { initialValues, updateUrlFilters, isSearchRoute } = useSearchBarSync();
  const { navigateWithTransition } = useViewTransition();
  const t = useTranslations("search");
  const tCommon = useTranslations("common");
  const adTypes = getAdTypes(tCommon);

  // Initialize state with values from URL ONLY if on search route (/ads/s)
  // On other routes, start with empty state
  const initialStateWithValues = useMemo(
    () =>
      createInitialState({
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
    searchBarReducer,
    initialStateWithValues,
  );
  const {
    isExpanded,
    activeField,
    isDropdownVisible,
    dropdownPosition,
    selectedAdType,
    selectedCategory,
    selectedBreed,
    inputAdType,
    inputCategory,
    inputBreed,
  } = state;

  const searchBarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<
    Record<NonNullable<ActiveField>, HTMLDivElement | null>
  >({
    "ad-type": null,
    category: null,
    breed: null,
  });
  const previousBreedRef = useRef<PetBreedDto | null>(null);

  const handleFieldClick = useCallback(
    (field: ActiveField) => {
      // Mark as manual interaction to prevent auto-collapse
      hasManualInteraction.current = true;

      // If collapsed, expand first then set active field
      if (!isExpanded) {
        dispatch({ type: "EXPAND" });
      }

      // If breed is clicked but no category is selected, redirect to category field
      if (field === "breed" && !selectedCategory) {
        dispatch({ type: "SET_ACTIVE_FIELD", payload: "category" });
        return;
      }

      dispatch({ type: "SET_ACTIVE_FIELD", payload: field });
    },
    [selectedCategory, isExpanded],
  );

  const handleAdTypeSelect = useCallback(
    (value: PetAdType) => {
      const adTypeTitle = adTypes[value]?.title || value.toString();
      console.log("Selected ad type:", adTypeTitle);
      dispatch({ type: "SET_AD_TYPE", payload: adTypeTitle });
    },
    [adTypes],
  );

  const handleCategorySelect = useCallback((value: PetCategoryDetailedDto) => {
    console.log("Selected category:", value);
    dispatch({ type: "SET_CATEGORY", payload: value });
  }, []);

  // Shared search trigger function - defined before handleBreedSelect
  const triggerSearch = useCallback(() => {
    hasManualInteraction.current = false;
    dispatch({ type: "COLLAPSE" });

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
  }, [
    selectedAdType,
    selectedCategory,
    selectedBreed,
    updateUrlFilters,
    isSearchRoute,
    navigateWithTransition,
    adTypes,
  ]);

  const handleBreedSelect = useCallback((value: PetBreedDto) => {
    dispatch({ type: "SET_BREED", payload: value });
  }, []);

  const handleInputAdTypeChange = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT_AD_TYPE", payload: value });
  }, []);

  const handleInputCategoryChange = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT_CATEGORY", payload: value });
  }, []);

  const handleInputBreedChange = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT_BREED", payload: value });
  }, []);

  const handleInputAdTypeBlur = useCallback(() => {
    dispatch({ type: "RESET_INPUT_AD_TYPE" });
  }, []);

  const handleInputCategoryBlur = useCallback(() => {
    dispatch({ type: "RESET_INPUT_CATEGORY" });
  }, []);

  const handleInputBreedBlur = useCallback(() => {
    dispatch({ type: "RESET_INPUT_BREED" });
  }, []);

  const handleClearAdType = useCallback(() => {
    dispatch({ type: "CLEAR_AD_TYPE" });
    // Refocus the input after clearing
    setTimeout(() => {
      const input = fieldRefs.current["ad-type"]?.querySelector("input");
      input?.focus();
    }, 0);
  }, []);

  const handleClearCategory = useCallback(() => {
    dispatch({ type: "CLEAR_CATEGORY" });
    // Refocus the input after clearing
    setTimeout(() => {
      const input = fieldRefs.current["category"]?.querySelector("input");
      input?.focus();
    }, 0);
  }, []);

  const handleClearBreed = useCallback(() => {
    dispatch({ type: "CLEAR_BREED" });
    // Refocus the input after clearing
    setTimeout(() => {
      const input = fieldRefs.current["breed"]?.querySelector("input");
      input?.focus();
    }, 0);
  }, []);

  const handlePositionCalculated = useCallback(
    (position: { left: number; width: number }) => {
      dispatch({ type: "SHOW_DROPDOWN", payload: position });
    },
    [],
  );

  const handleClickOutside = useCallback(() => {
    hasManualInteraction.current = false;
    dispatch({ type: "COLLAPSE" });
  }, []);

  const handleSearchClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerSearch();
    },
    [triggerSearch],
  );

  // Handle Enter key press for search
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        triggerSearch();
      }
    },
    [triggerSearch],
  );

  // Track if user has manually interacted to prevent auto-collapse
  const hasManualInteraction = useRef(false);

  // Notify parent when expanded state changes for coordinated transitions
  useLayoutEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  // Dropdown positioning hook
  useDropdownPosition({
    activeField,
    isExpanded,
    fieldRefs,
    searchBarRef,
    onPositionCalculated: handlePositionCalculated,
  });

  // Click outside hook
  useClickOutside({
    activeField,
    searchBarRef,
    dropdownRef,
    onClickOutside: handleClickOutside,
  });

  // Auto-trigger search when breed is selected
  useEffect(() => {
    // Only trigger if breed actually changed (not just component re-render)
    if (selectedBreed && selectedBreed !== previousBreedRef.current) {
      previousBreedRef.current = selectedBreed;
      triggerSearch();
    } else if (!selectedBreed) {
      previousBreedRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBreed]); // Only depend on selectedBreed to avoid infinite loop

  // Global Enter key listener when search bar is expanded
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isExpanded) {
        e.preventDefault();
        triggerSearch();
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleGlobalKeyDown);
      return () => document.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [isExpanded, triggerSearch]);

  return (
    <div
      className={cn(
        "flex lg:justify-center justify-start items-center gap-4 mx-8 ml-28",
        className,
      )}
    >
      {/* Main Search Bar Container */}
      <div
        ref={searchBarRef}
        className={cn(
          "flex items-center justify-between relative w-full cursor-pointer",
        )}
        style={{
          maxWidth: isExpanded
            ? `${LAYOUT.EXPANDED_WIDTH}px`
            : `${LAYOUT.COLLAPSED_WIDTH}px`,
          height: isExpanded
            ? `${LAYOUT.EXPANDED_HEIGHT}px`
            : `${LAYOUT.COLLAPSED_HEIGHT}px`,
          transition: `all ${TRANSITION_DURATION}ms ${TRANSITION_TIMING}`,
        }}
        role="search"
        onKeyDown={handleKeyDown}
      >
        {/* Background */}
        <div
          className={cn(
            "absolute inset-0 bg-white rounded-xl -z-[3]",
            isExpanded
              ? "shadow-[0_8px_24px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)]"
              : "border border-gray-300  hover:shadow-md",
          )}
          style={{
            transition: `box-shadow ${TRANSITION_DURATION}ms ${TRANSITION_TIMING}, border ${TRANSITION_DURATION}ms ${TRANSITION_TIMING}`,
          }}
        />

        {/* Gray overlay when field is active - Airbnb style */}
        <div
          className={cn(
            "absolute inset-0 bg-gray-200 rounded-xl transition-opacity duration-200 -z-[2]",
            activeField ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Expanded State */}
        {isExpanded ? (
          <>
            <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr_auto] gap-0.5 items-center w-full h-16 rounded-xl animate-in fade-in duration-200">
              <SearchField
                fieldId="ad-type"
                label={t("adType")}
                placeholder={t("adTypePlaceholder")}
                displayValue={selectedAdType || t("anyType")}
                inputValue={inputAdType}
                isExpanded={true}
                isActive={activeField === "ad-type"}
                onFieldClick={() => handleFieldClick("ad-type")}
                onInputChange={handleInputAdTypeChange}
                onInputBlur={handleInputAdTypeBlur}
                onClear={handleClearAdType}
                onKeyDown={handleKeyDown}
                fieldRef={(el) => {
                  fieldRefs.current["ad-type"] = el;
                }}
              />

              <Divider isExpanded={true} />

              <SearchField
                fieldId="category"
                label={t("category")}
                placeholder={t("categoryPlaceholder")}
                displayValue={selectedCategory?.title || t("allPets")}
                inputValue={inputCategory}
                isExpanded={true}
                isActive={activeField === "category"}
                onFieldClick={() => handleFieldClick("category")}
                onInputChange={handleInputCategoryChange}
                onInputBlur={handleInputCategoryBlur}
                onClear={handleClearCategory}
                onKeyDown={handleKeyDown}
                fieldRef={(el) => {
                  fieldRefs.current.category = el;
                }}
              />

              <Divider isExpanded={true} />

              <SearchField
                fieldId="breed"
                label={t("breed")}
                placeholder={
                  selectedCategory ? t("selectBreed") : t("selectCategoryFirst")
                }
                displayValue={selectedBreed?.title || t("anyBreed")}
                inputValue={inputBreed}
                isExpanded={true}
                isActive={activeField === "breed"}
                onFieldClick={() => handleFieldClick("breed")}
                onInputChange={handleInputBreedChange}
                onInputBlur={handleInputBreedBlur}
                onClear={handleClearBreed}
                onKeyDown={handleKeyDown}
                fieldRef={(el) => {
                  fieldRefs.current.breed = el;
                }}
              />

              <SearchButton
                isExpanded={true}
                activeField={!!activeField}
                onClick={handleSearchClick}
              />
            </div>
          </>
        ) : (
          /* Collapsed State */
          <>
            <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] items-center h-[46px] w-full animate-in fade-in duration-200">
              <SearchField
                fieldId="ad-type"
                label={t("adType")}
                placeholder={t("adTypePlaceholder")}
                displayValue={selectedAdType || t("anyType")}
                inputValue={inputAdType}
                isExpanded={false}
                isActive={activeField === "ad-type"}
                onFieldClick={() => handleFieldClick("ad-type")}
                onInputChange={handleInputAdTypeChange}
                onInputBlur={handleInputAdTypeBlur}
                onClear={handleClearAdType}
                fieldRef={(el) => {
                  fieldRefs.current["ad-type"] = el;
                }}
              />

              <Divider isExpanded={false} />

              <SearchField
                fieldId="category"
                label={t("category")}
                placeholder={t("categoryPlaceholder")}
                displayValue={selectedCategory?.title || t("allPets")}
                inputValue={inputCategory}
                isExpanded={false}
                isActive={activeField === "category"}
                onFieldClick={() => handleFieldClick("category")}
                onInputChange={handleInputCategoryChange}
                onInputBlur={handleInputCategoryBlur}
                onClear={handleClearCategory}
                fieldRef={(el) => {
                  fieldRefs.current.category = el;
                }}
              />

              <Divider isExpanded={false} />

              <SearchField
                fieldId="breed"
                label={t("breed")}
                placeholder={t("breedPlaceholder")}
                displayValue={selectedBreed?.title || t("anyBreed")}
                inputValue={inputBreed}
                isExpanded={false}
                isActive={activeField === "breed"}
                onFieldClick={() => handleFieldClick("breed")}
                onInputChange={handleInputBreedChange}
                onInputBlur={handleInputBreedBlur}
                onClear={handleClearBreed}
                fieldRef={(el) => {
                  fieldRefs.current.breed = el;
                }}
              />
            </div>

            <SearchButton
              isExpanded={false}
              activeField={!!activeField}
              onClick={handleSearchClick}
            />
          </>
        )}

        {/* Dropdown */}
        {activeField && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute z-50 rounded-xl shadow-[0_8px_24px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.02)]",
              dropdownDirection === "up"
                ? "bottom-[calc(100%+16px)]"
                : "top-[calc(100%+16px)]",
              isDropdownVisible
                ? "opacity-100 translate-y-0"
                : dropdownDirection === "up"
                  ? "opacity-0 translate-y-2 pointer-events-none"
                  : "opacity-0 -translate-y-2 pointer-events-none",
            )}
            style={
              {
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                transition: `all 300ms ${TRANSITION_TIMING}`,
              } as React.CSSProperties
            }
          >
            {activeField === "ad-type" && (
              <AdTypeDropdown
                onSelect={handleAdTypeSelect}
                searchQuery={inputAdType}
              />
            )}
            {activeField === "category" && (
              <CategoryDropdown
                onSelect={handleCategorySelect}
                searchQuery={inputCategory}
              />
            )}
            {activeField === "breed" && (
              <BreedDropdown
                categoryId={selectedCategory?.id ?? null}
                onSelect={handleBreedSelect}
                searchQuery={inputBreed}
              />
            )}
          </div>
        )}
      </div>
      {!isExpanded && !hideFilterButton && <FilterButton />}
    </div>
  );
};

export default SearchBarDesktopAnimated;
