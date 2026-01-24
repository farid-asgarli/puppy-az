"use client";

import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { useFilterUrl } from "@/lib/filtering/use-filter-url";
import { FilterParams } from "@/lib/filtering/types";
import { getAdTypes, getPetSizes } from "@/lib/utils/mappers";
import { PetAdType, PetGender, PetSize, CityDto, PetBreedDto } from "@/lib/api";
import { useTranslations } from "next-intl";
import NarrowContainer from "@/lib/components/narrow-container";
import { DisplayCache } from "@/lib/caching/display-cache";

interface ActiveFiltersBarProps {
  categories?: Array<{ id: number; title: string }>;
  cities?: CityDto[];
  breeds?: PetBreedDto[];
}

export const ActiveFiltersBar = ({
  categories,
  cities,
  breeds: breedsProp,
}: ActiveFiltersBarProps) => {
  const t = useTranslations("adsSearch.activeFilters");
  const tCommon = useTranslations("common");
  const { filters, updateFilter, clearFilters } = useFilterUrl();
  const adTypes = getAdTypes(tCommon);
  const petSizes = getPetSizes(tCommon);

  // Get breeds from prop or cache
  const categoryId = filters.category ? Number(filters.category) : null;
  const breeds =
    breedsProp ??
    (categoryId ? DisplayCache.getBreeds(categoryId) : null) ??
    [];

  // Helper to format filter labels
  const getFilterLabel = (
    key: keyof FilterParams,
    value: string | number,
  ): string => {
    switch (key) {
      case "ad-type":
        return adTypes[value as PetAdType]?.title || value.toString();
      case "category":
        return (
          categories?.find((c) => c.id === Number(value))?.title ||
          t("category")
        );
      case "breed":
        return breeds?.find((b) => b.id === Number(value))?.title || t("breed");
      case "city": {
        const city = cities?.find((c) => c.id === Number(value));
        return city?.name || t("city");
      }
      case "gender":
        return value === PetGender.Male
          ? t("gender.male")
          : value === PetGender.Female
            ? t("gender.female")
            : value.toString();
      case "size":
        return petSizes[value as PetSize]?.label || value.toString();
      case "price-min":
        return t("priceMin", { value });
      case "price-max":
        return t("priceMax", { value });
      case "age-min":
        return t("ageMin", { value });
      case "age-max":
        return t("ageMax", { value });
      case "weight-min":
        return t("weightMin", { value });
      case "weight-max":
        return t("weightMax", { value });
      case "color":
        return t("color", { value });
      default:
        return value.toString();
    }
  };

  // Get active filters (exclude page and sort)
  const activeFilterEntries = Object.entries(filters).filter(
    ([key, value]) =>
      value !== undefined && value !== null && key !== "page" && key !== "sort",
  );

  // Don't render if no active filters
  if (activeFilterEntries.length === 0) {
    return null;
  }

  const handleRemoveFilter = (key: keyof FilterParams) => {
    // If removing category, also remove breed
    if (key === "category") {
      updateFilter("breed", undefined);
    }
    updateFilter(key, undefined);
  };

  return (
    <div className="bg-white px-4">
      <NarrowContainer className="mt-8 mb-0 mx-auto border border-gray-200 p-4 sm:px-6 lg:px-8 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Optional: Active Filters Label */}
          <span className="text-sm font-semibold text-gray-500 flex-shrink-0 hidden sm:block">
            {t("activeFilters")}:
          </span>

          {/* Active filter pills with wrapping */}
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {activeFilterEntries.map(([key, value]) => {
              const label = getFilterLabel(key as keyof FilterParams, value);

              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center gap-2 pl-4 pr-2 py-2 rounded-full",
                    "bg-white border border-gray-200",
                    "transition-all duration-200",
                    "flex-shrink-0",
                  )}
                >
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    {label}
                  </span>
                  <button
                    onClick={() =>
                      handleRemoveFilter(key as keyof FilterParams)
                    }
                    className={cn(
                      "w-5 h-5 rounded-full",
                      "bg-gray-100 hover:bg-gray-200",
                      "flex items-center justify-center",
                      "transition-colors duration-200",
                      "group",
                    )}
                    aria-label={`Remove ${label} filter`}
                  >
                    <IconX
                      size={12}
                      className="text-gray-600 group-hover:text-gray-900"
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Clear all button */}
          {activeFilterEntries.length > 1 && (
            <button
              onClick={clearFilters}
              className={cn(
                "px-4 py-2 rounded-full",
                "bg-white text-sm font-semibold text-gray-700",
                "hover:bg-gray-100",
                "border border-gray-200",
                "transition-all duration-200",
                "flex-shrink-0 whitespace-nowrap",
                "w-full sm:w-auto",
              )}
            >
              {t("clearAll")}
            </button>
          )}
        </div>
      </NarrowContainer>
    </div>
  );
};

export default ActiveFiltersBar;
