"use client";

import { useState, useMemo } from "react";
import { PetGender, PetSize } from "@/lib/api/types/pet-ad.types";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { cn } from "@/lib/external/utils";
import { OptionCard } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout } from "../components";
import { Heading, Text, Label } from "@/lib/primitives/typography";
import { getPetGender, getPetSizes } from "@/lib/utils/mappers";
import { useTranslations } from "next-intl";

/**
 * Basic Details View
 * Step 3: Select gender, size, and enter age
 */
export default function BasicsView() {
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const t = useTranslations("adPlacementDetails.basicsView");
  const tCommon = useTranslations("common");

  const [gender, setGender] = useState<PetGender | null>(formData.gender);
  const [size, setSize] = useState<PetSize | null>(formData.size);
  const [ageInMonths, setAgeInMonths] = useState<number | null>(
    formData.ageInMonths,
  );

  const petSizes = useMemo(() => getPetSizes(tCommon), [tCommon]);
  const petGenders = useMemo(() => getPetGender(tCommon), [tCommon]);

  // Calculate years and months from total months
  const years = ageInMonths ? Math.floor(ageInMonths / 12) : 0;
  const months = ageInMonths ? ageInMonths % 12 : 0;

  const handleGenderSelect = (value: PetGender) => {
    setGender(value);
    updateFormData({ gender: value });
  };

  const handleSizeSelect = (value: PetSize) => {
    setSize(value);
    updateFormData({ size: value });
  };

  const handleAgeChange = (totalMonths: number) => {
    const validAge = Math.max(0, Math.min(totalMonths, 600)); // Max 50 years
    setAgeInMonths(validAge);
    updateFormData({ ageInMonths: validAge });
  };

  const handleYearsChange = (newYears: number) => {
    const validYears = Math.max(0, Math.min(newYears, 50));
    handleAgeChange(validYears * 12 + months);
  };

  const handleMonthsChange = (newMonths: number) => {
    const validMonths = Math.max(0, Math.min(newMonths, 11));
    handleAgeChange(years * 12 + validMonths);
  };

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition("/ads/ad-placement/physical");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/breed");
  };

  const canProceed =
    gender !== null && size !== null && ageInMonths !== null && ageInMonths > 0;

  return (
    <>
      <ViewLayout>
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="subsection">{t("heading")}</Heading>
            <Text variant="body-lg" color="secondary">
              {t("subheading")}
            </Text>
          </div>

          {/* Gender Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <Heading variant="subsection">{t("genderLabel")}</Heading>
            </div>
            <div className="flex gap-3">
              {Object.entries(petGenders).map(([key, { label, icon }]) => {
                const _gender = +key as PetGender;
                const isSelected = gender === _gender;
                return (
                  <button
                    key={_gender}
                    type="button"
                    onClick={() => handleGenderSelect(_gender)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all",
                      "font-semibold text-base",
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                    )}
                  >
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Section */}
          <div className="pt-5 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <Heading variant="subsection">{t("sizeLabel")}</Heading>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(petSizes).map(
                  ([key, { label, description }]) => {
                    const _size = +key as PetSize;
                    const isSelected = size === _size;
                    return (
                      <button
                        key={_size}
                        type="button"
                        onClick={() => handleSizeSelect(_size)}
                        className={cn(
                          "flex flex-col items-center justify-center px-5 py-4 rounded-xl border-2 transition-all",
                          "font-semibold text-base",
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-400",
                        )}
                      >
                        <span>{label}</span>
                        <span
                          className={cn(
                            "text-sm font-normal mt-1",
                            isSelected ? "text-gray-300" : "text-gray-500",
                          )}
                        >
                          {description}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* Age Section */}
          <div className="pt-5 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <Heading variant="subsection">{t("ageLabel")}</Heading>
              </div>
              <div className="flex gap-4">
                {/* Years Input */}
                <div className="flex-1">
                  <Label
                    variant="field"
                    htmlFor="years"
                    className="block mb-1.5 text-sm text-gray-500"
                  >
                    {t("yearsLabel")}
                  </Label>
                  <input
                    type="number"
                    id="years"
                    min="0"
                    max="50"
                    value={years || ""}
                    onChange={(e) =>
                      handleYearsChange(parseInt(e.target.value) || 0)
                    }
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border-2 border-gray-200",
                      "focus:border-black focus:outline-none transition-colors",
                      "text-center font-semibold",
                    )}
                    placeholder="0"
                  />
                </div>

                {/* Months Input */}
                <div className="flex-1">
                  <Label
                    variant="field"
                    htmlFor="months"
                    className="block mb-1.5 text-sm text-gray-500"
                  >
                    {t("monthsLabel")}
                  </Label>
                  <input
                    type="number"
                    id="months"
                    min="0"
                    max="11"
                    value={months || ""}
                    onChange={(e) =>
                      handleMonthsChange(parseInt(e.target.value) || 0)
                    }
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border-2 border-gray-200",
                      "focus:border-black focus:outline-none transition-colors",
                      "text-center font-semibold",
                    )}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Total Age Summary */}
              {ageInMonths !== null && ageInMonths > 0 && (
                <div className="text-center text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <span className="font-semibold">{t("totalAge")}</span>{" "}
                  {years > 0 &&
                    `${years} ${years === 1 ? t("year") : t("years")} `}
                  {(months > 0 || years === 0) &&
                    `${months} ${months === 1 ? t("month") : t("months")}`}
                  {years > 0 && ` (${ageInMonths} ${t("months")})`}
                </div>
              )}
            </div>
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
