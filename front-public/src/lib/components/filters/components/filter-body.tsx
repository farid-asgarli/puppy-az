"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import PriceRangeSlider from "@/lib/components/filters/price-range";
import { DEFAULT_FILTER_VALUES } from "@/lib/filtering/filter-default-values";
import { FilterParams } from "@/lib/filtering/types";
import { SearchableSelect } from "@/lib/form/components/select/select";
import { IconToggleButton } from "@/lib/form/components/toggle/toggle.component";
import TextInput from "@/lib/form/components/text/text-input.component";
import Row from "@/lib/primitives/row/row.component";
import {
  IconVenus,
  IconMars,
  IconGenderBigender,
  IconX,
  IconChevronDown,
} from "@tabler/icons-react";
import {
  PetGender,
  PetSize,
  CityDto,
  DistrictDto,
  PetAdType,
  PetCategoryDetailedDto,
  PetBreedDto,
  PetColorDto,
} from "@/lib/api";
import { citiesService } from "@/lib/api/services/cities.service";
import { petAdService } from "@/lib/api/services/pet-ad.service";
import { DisplayCache } from "@/lib/caching/display-cache";
import { cn } from "@/lib/external/utils";
import { getPetSizes } from "@/lib/utils/mappers";
import { useAdTypes } from "@/lib/hooks/use-ad-types";
import { Heading } from "@/lib/primitives/typography";
import { useTranslations } from "next-intl";
import { useLocale } from "@/lib/hooks/use-client-locale";

interface FilterBodyProps {
  currentFilters: FilterParams;
  updateFilter<T extends keyof FilterParams>(
    key: T,
    value: FilterParams[T],
  ): void;
  cities?: CityDto[]; // Optional: if provided, skips API fetch
}

export const FilterBody = ({
  currentFilters,
  updateFilter,
  cities: citiesProp,
}: FilterBodyProps) => {
  const locale = useLocale();
  const [cities, setCities] = useState<CityDto[]>(citiesProp || []);
  const [isLoadingCities, setIsLoadingCities] = useState(!citiesProp);
  const [categories, setCategories] = useState<PetCategoryDetailedDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [breeds, setBreeds] = useState<PetBreedDto[]>([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [colors, setColors] = useState<PetColorDto[]>([]);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [districts, setDistricts] = useState<DistrictDto[]>([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const t = useTranslations("filters");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");

  const petSizes = useMemo(() => getPetSizes(tCommon), [tCommon]);
  const { adTypesWithIcons } = useAdTypes();

  useEffect(() => {
    // If cities were provided as prop (from SSR cache), use them
    if (citiesProp) {
      setCities(citiesProp);
      setIsLoadingCities(false);
      return;
    }

    // Otherwise fetch from API (will use cache if available) with locale
    const loadCities = async () => {
      try {
        const citiesData = await citiesService.getCities(locale);
        setCities(citiesData);
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadCities();
  }, [citiesProp, locale]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData =
          await petAdService.getPetCategoriesDetailed(locale);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [locale]);

  // Load breeds when category changes
  useEffect(() => {
    if (!currentFilters.category) {
      setBreeds([]);
      return;
    }

    const loadBreeds = async () => {
      setIsLoadingBreeds(true);
      try {
        const breedsData = await petAdService.getPetBreeds(
          currentFilters.category!,
          locale,
        );
        setBreeds(breedsData);
        // Cache breeds so buildSlugFilterUrl can resolve breed slugs for SEO URLs
        DisplayCache.setBreeds(currentFilters.category!, breedsData);
      } catch (error) {
        console.error("Failed to load breeds:", error);
      } finally {
        setIsLoadingBreeds(false);
      }
    };

    loadBreeds();
  }, [currentFilters.category, locale]);

  // Load colors
  useEffect(() => {
    const loadColors = async () => {
      try {
        const colorsData = await petAdService.getPetColors(locale);
        setColors(colorsData);
      } catch (error) {
        console.error("Failed to load colors:", error);
      } finally {
        setIsLoadingColors(false);
      }
    };

    loadColors();
  }, [locale]);

  // Load districts when city changes
  useEffect(() => {
    if (!currentFilters.city) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      setIsLoadingDistricts(true);
      try {
        const districtsData = await citiesService.getDistrictsByCity(
          currentFilters.city!,
          locale,
        );
        setDistricts(districtsData);
      } catch (error) {
        console.error("Failed to load districts:", error);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [currentFilters.city, locale]);

  const cityOptions = cities.map((city) => ({
    value: city.id.toString(),
    label: city.name || "",
  }));

  const districtOptions = districts.map((district) => ({
    value: district.id.toString(),
    label: district.name || "",
  }));

  const adTypeOptions = adTypesWithIcons.map((type) => ({
    value: type.id.toString(),
    label: type.title,
  }));

  const colorOptions = colors.map((color) => ({
    value: color.key,
    label: color.title,
  }));

  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.title || "",
  }));

  const breedOptions = breeds.map((breed) => ({
    value: breed.id.toString(),
    label: breed.title || "",
  }));

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Primary Filters - Compact Grid */}
      <div className="mb-6 sm:mb-8 space-y-3">
        <Heading variant="label" as="h3" className="text-sm sm:text-base">
          {tSearch("searchCriteria")}
        </Heading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Ad Type */}
          <SearchableSelect
            value={currentFilters["ad-type"]?.toString() || ""}
            onChange={(val) =>
              updateFilter(
                "ad-type",
                val && val !== "" ? (Number(val) as PetAdType) : undefined,
              )
            }
            options={adTypeOptions}
            placeholder={tSearch("adType")}
            disabled={false}
            size="sm"
            clearable
            searchable={false}
          />

          {/* Category */}
          <SearchableSelect
            value={currentFilters.category?.toString() || ""}
            onChange={(val) => {
              const newCategory = val && val !== "" ? Number(val) : undefined;
              updateFilter("category", newCategory);
              // Clear breed when category changes
              if (!newCategory || newCategory !== currentFilters.category) {
                updateFilter("breed", undefined);
              }
            }}
            options={categoryOptions}
            placeholder={tSearch("category")}
            disabled={isLoadingCategories}
            size="sm"
            clearable
          />

          {/* Breed */}
          <div className="relative group">
            <SearchableSelect
              value={currentFilters.breed?.toString() || ""}
              onChange={(val) =>
                updateFilter(
                  "breed",
                  val && val !== "" ? Number(val) : undefined,
                )
              }
              options={breedOptions}
              placeholder={
                currentFilters.category
                  ? tSearch("breed")
                  : tSearch("selectCategoryFirst")
              }
              disabled={!currentFilters.category || isLoadingBreeds}
              loading={isLoadingBreeds}
              size="sm"
              clearable
            />
          </div>
        </div>
      </div>

      {/* City & District Filter */}
      <div className="mb-6 sm:mb-8">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Heading
              variant="label"
              as="h3"
              className="mb-3 sm:mb-4 text-sm sm:text-base"
            >
              {t("city")}
            </Heading>
            <SearchableSelect
              value={currentFilters["city"]?.toString() || ""}
              onChange={(val) => {
                const newCity = val ? Number(val) : undefined;
                updateFilter("city", newCity);
                // Clear district when city changes
                if (!newCity || newCity !== currentFilters.city) {
                  updateFilter("district", undefined);
                }
              }}
              options={cityOptions}
              placeholder={t("allCities")}
              disabled={isLoadingCities}
              clearable
            />
          </div>
          <div>
            <Heading
              variant="label"
              as="h3"
              className="mb-3 sm:mb-4 text-sm sm:text-base"
            >
              {t("district")}
            </Heading>
            <SearchableSelect
              value={currentFilters["district"]?.toString() || ""}
              onChange={(val) =>
                updateFilter("district", val ? Number(val) : undefined)
              }
              options={districtOptions}
              placeholder={
                currentFilters.city ? t("allDistricts") : t("selectCityFirst")
              }
              disabled={!currentFilters.city || isLoadingDistricts}
              loading={isLoadingDistricts}
              clearable
            />
          </div>
        </div>
      </div>

      {/* Gender Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading
          variant="label"
          as="h3"
          className="mb-3 sm:mb-4 text-sm sm:text-base"
        >
          {t("gender")}
        </Heading>
        <Row gap="sm">
          <IconToggleButton
            icon={IconGenderBigender}
            label={t("other")}
            size="md"
            isActive={currentFilters["gender"] === PetGender.Unknown}
            onChange={(isActive) =>
              updateFilter("gender", isActive ? PetGender.Unknown : undefined)
            }
            fullWidth
          />
          <IconToggleButton
            icon={IconMars}
            label={t("male")}
            size="md"
            isActive={currentFilters["gender"] === PetGender.Male}
            onChange={(isActive) =>
              updateFilter("gender", isActive ? PetGender.Male : undefined)
            }
            fullWidth
          />
          <IconToggleButton
            icon={IconVenus}
            label={t("female")}
            size="md"
            isActive={currentFilters["gender"] === PetGender.Female}
            onChange={(isActive) =>
              updateFilter("gender", isActive ? PetGender.Female : undefined)
            }
            fullWidth
          />
        </Row>
      </div>

      {/* Size Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading
          variant="label"
          as="h3"
          className="mb-3 sm:mb-4 text-sm sm:text-base"
        >
          {t("size")}
        </Heading>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {Object.entries(petSizes).map(([key, { label }]) => {
            const size = +key as PetSize;
            return (
              <button
                key={size}
                onClick={() =>
                  updateFilter(
                    "size",
                    currentFilters["size"] === size ? undefined : size,
                  )
                }
                className={cn(
                  "px-2 py-2 sm:px-3 sm:py-2 rounded-xl border-2 text-xs sm:text-sm font-medium transition-colors",
                  currentFilters["size"] === size
                    ? "border-primary-400 bg-primary-50 text-primary-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Age Range Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading
          variant="label"
          as="h3"
          className="mb-3 sm:mb-4 text-sm sm:text-base"
        >
          {t("ageInMonths")}
        </Heading>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <TextInput
            type="number"
            label={t("minimum")}
            placeholder="0"
            min={0}
            value={currentFilters["age-min"] || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              updateFilter(
                "age-min",
                e.target.value && val >= 0 ? val : undefined,
              );
            }}
            size="md"
            fullWidth
          />
          <TextInput
            type="number"
            label={t("maximum")}
            placeholder="120"
            min={0}
            value={currentFilters["age-max"] || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              updateFilter(
                "age-max",
                e.target.value && val >= 0 ? val : undefined,
              );
            }}
            size="md"
            fullWidth
          />
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 sm:mb-8">
        <PriceRangeSlider
          min={DEFAULT_FILTER_VALUES.MIN_AD_PRICE}
          max={DEFAULT_FILTER_VALUES.MAX_AD_PRICE}
          step={50}
          currency="₼"
          value={[
            currentFilters["price-min"] || DEFAULT_FILTER_VALUES.MIN_AD_PRICE,
            currentFilters["price-max"] || DEFAULT_FILTER_VALUES.MAX_AD_PRICE,
          ]}
          onChange={([priceMin, priceMax]) => {
            updateFilter("price-min", priceMin);
            updateFilter("price-max", priceMax);
          }}
        />
      </div>

      {/* Weight Range Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading
          variant="label"
          as="h3"
          className="mb-3 sm:mb-4 text-sm sm:text-base"
        >
          {t("weight")}
        </Heading>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <TextInput
            type="number"
            label={t("minimum")}
            placeholder="0"
            min={0}
            step={0.5}
            value={currentFilters["weight-min"] || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              updateFilter(
                "weight-min",
                e.target.value && val >= 0 ? val : undefined,
              );
            }}
            size="md"
            fullWidth
          />
          <TextInput
            type="number"
            label={t("maximum")}
            placeholder="100"
            min={0}
            step={0.5}
            value={currentFilters["weight-max"] || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              updateFilter(
                "weight-max",
                e.target.value && val >= 0 ? val : undefined,
              );
            }}
            size="md"
            fullWidth
          />
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6 sm:mb-8">
        <Heading
          variant="label"
          as="h3"
          className="mb-3 sm:mb-4 text-sm sm:text-base"
        >
          {t("color")}
        </Heading>
        <ColorCombobox
          options={colorOptions}
          value={currentFilters["color"]?.toString()}
          onChange={(val) => updateFilter("color", val || undefined)}
          placeholder={t("colorPlaceholder")}
          disabled={isLoadingColors}
        />
      </div>
    </div>
  );
};

/**
 * Inline combobox for color selection
 * - Type directly in input to search/filter
 * - Click to open dropdown
 * - Clear button to reset
 * - No separate search field
 */
function ColorCombobox({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Normalize text for search: handles Azerbaijani İ/i, ə, ö, ü, ş, ç, ğ
  const normalizeForSearch = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredOptions = searchTerm
    ? options.filter((o) =>
        normalizeForSearch(o.label).includes(normalizeForSearch(searchTerm)),
      )
    : options;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex items-center rounded-xl border-2 bg-gray-50 transition-all duration-200",
          isOpen
            ? "border-gray-300 bg-white"
            : "border-gray-200 hover:border-gray-300 hover:bg-white",
          disabled && "opacity-50 pointer-events-none",
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          className="flex-1 min-w-0 py-3 px-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base rounded-xl"
          disabled={disabled}
        />
        {value && (
          <button
            type="button"
            onMouseDown={handleClear}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
          >
            <IconX size={16} className="text-gray-500" />
          </button>
        )}
        <IconChevronDown
          size={18}
          className={cn(
            "text-gray-400 mr-3 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50",
                option.value === value
                  ? "text-primary-600 font-medium bg-primary-50"
                  : "text-gray-700",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && searchTerm && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-sm text-gray-400">
          Nəticə tapılmadı
        </div>
      )}
    </div>
  );
}
