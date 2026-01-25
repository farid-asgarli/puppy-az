"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { NumberField } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout } from "../components";
import { Heading, Text } from "@/lib/primitives/typography";
import { cn } from "@/lib/external/utils";
import { petAdService } from "@/lib/api";
import { PetColorDto } from "@/lib/api/types/pet-ad.types";

/**
 * Physical Details View
 * Step 4: Enter color and weight
 */
export default function PhysicalView() {
  const t = useTranslations("adPlacementDetails.physicalView");
  const locale = useLocale();
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();

  const [colors, setColors] = useState<PetColorDto[]>([]);
  const [isLoadingColors, setIsLoadingColors] = useState(true);
  const [color, setColor] = useState<string>(formData.color || "");
  const [weight, setWeight] = useState<number | null>(formData.weight);

  // Fetch colors from API
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const fetchedColors = await petAdService.getPetColors(locale);
        setColors(fetchedColors);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
      } finally {
        setIsLoadingColors(false);
      }
    };
    fetchColors();
  }, [locale]);

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
    updateFormData({ color: selectedColor });
  };

  const handleWeightChange = (value: number | null) => {
    const validWeight = value !== null ? Math.max(0, value) : null;
    setWeight(validWeight);
    updateFormData({ weight: validWeight });
  };

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition("/ads/ad-placement/details");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/basics");
  };

  const canProceed = color.trim().length > 0;

  return (
    <>
      <ViewLayout>
        <div className="space-y-12">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="subsection">{t("heading")}</Heading>
            <Text variant="body-lg" color="secondary">
              {t("subheading")}
            </Text>
          </div>

          {/* Color Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <Heading variant="subsection">{t("colorHeading")}</Heading>
            </div>
            <Text variant="small" color="secondary">
              {t("colorQuestion")}
            </Text>

            {isLoadingColors ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 rounded-xl bg-gray-100 animate-pulse h-12"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {colors.map((colorOption) => {
                  const isSelected = color === colorOption.title;
                  return (
                    <button
                      key={colorOption.id}
                      type="button"
                      onClick={() => handleColorSelect(colorOption.title)}
                      className={cn(
                        "px-4 py-3 rounded-xl transition-all font-medium text-sm",
                        isSelected
                          ? "ring-2 ring-offset-2 ring-teal-500 shadow-sm"
                          : "hover:shadow-sm",
                      )}
                      style={{
                        backgroundColor: colorOption.backgroundColor,
                        color: colorOption.textColor,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: colorOption.borderColor,
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSelected && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {colorOption.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weight Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <Heading variant="subsection">{t("weightHeading")}</Heading>
              <Text variant="small" color="muted">
                {t("optional")}
              </Text>
            </div>

            <NumberField
              label=""
              value={weight}
              onChange={handleWeightChange}
              min={0}
              step={0.1}
              suffix="kg"
              placeholder={t("weightPlaceholder")}
              helperText={t("weightHelper")}
            />

            {weight !== null && weight > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{t("weightLabel")}</span>{" "}
                  {weight >= 1000
                    ? `${(weight / 1000).toFixed(weight % 1000 === 0 ? 0 : 1)} ${t("ton")}`
                    : `${weight} kg`}
                  {weight < 1 && ` (${t("weightLessThan1")})`}
                  {weight >= 1 && weight < 10 && ` (${t("weightSmall")})`}
                  {weight >= 10 && weight < 25 && ` (${t("weightMedium")})`}
                  {weight >= 25 && weight < 50 && ` (${t("weightLarge")})`}
                  {weight >= 50 &&
                    weight < 1000 &&
                    ` (${t("weightVeryLarge")})`}
                  {weight >= 1000 && ` (${t("weightExtreme")})`}
                </p>
              </div>
            )}

            {/* Skip Weight Option */}
            {(weight === null || weight === 0) && (
              <p className="text-sm text-gray-500 italic">
                {t("skipWeightText")}
              </p>
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
