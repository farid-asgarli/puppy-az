"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { NumberField } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout } from "../components";
import { Heading, Text } from "@/lib/primitives/typography";
import { cn } from "@/lib/external/utils";

/**
 * Color styles for each color option - soft pastel colors
 */
const COLOR_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  black: {
    bg: "bg-gray-200",
    text: "text-gray-800",
    border: "border-gray-300",
  },
  white: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
  },
  brown: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  gray: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
  golden: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  cream: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    border: "border-orange-200",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "border-yellow-200",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-200",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    border: "border-pink-200",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  spotted: {
    bg: "bg-stone-100",
    text: "text-stone-600",
    border: "border-stone-200",
  },
  striped: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
  mixed: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  other: {
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-100",
  },
};

/**
 * Physical Details View
 * Step 4: Enter color and weight
 */
export default function PhysicalView() {
  const t = useTranslations("adPlacementDetails.physicalView");
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();

  /**
   * Common pet colors for quick selection (localized)
   */
  const COMMON_COLORS = [
    { key: "black", label: t("colorBlack") },
    { key: "white", label: t("colorWhite") },
    { key: "brown", label: t("colorBrown") },
    { key: "gray", label: t("colorGray") },
    { key: "golden", label: t("colorGolden") },
    { key: "cream", label: t("colorCream") },
    { key: "orange", label: t("colorOrange") },
    { key: "red", label: t("colorRed") },
    { key: "yellow", label: t("colorYellow") },
    { key: "green", label: t("colorGreen") },
    { key: "blue", label: t("colorBlue") },
    { key: "pink", label: t("colorPink") },
    { key: "purple", label: t("colorPurple") },
    { key: "spotted", label: t("colorSpotted") },
    { key: "striped", label: t("colorStriped") },
    { key: "mixed", label: t("colorMixed") },
    { key: "other", label: t("colorOther") },
  ] as const;

  const [color, setColor] = useState<string>(formData.color || "");
  const [weight, setWeight] = useState<number | null>(formData.weight);
  const colorLabels = COMMON_COLORS.map((c) => c.label);
  const [customColorMode, setCustomColorMode] = useState<boolean>(
    formData.color !== "" && !colorLabels.includes(formData.color),
  );

  const handleColorSelect = (selectedColor: string) => {
    if (selectedColor === t("colorOther")) {
      setCustomColorMode(true);
      setColor("");
    } else {
      setCustomColorMode(false);
      setColor(selectedColor);
      updateFormData({ color: selectedColor });
    }
  };

  const handleCustomColorChange = (value: string) => {
    setColor(value);
    updateFormData({ color: value });
  };

  const handleWeightChange = (value: number | null) => {
    const validWeight =
      value !== null ? Math.max(0, Math.min(value, 500)) : null; // Max 500kg
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

            {!customColorMode ? (
              <>
                {/* Common Colors Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {COMMON_COLORS.map((colorOption) => {
                    const isSelected = color === colorOption.label;
                    const styles = COLOR_STYLES[colorOption.key];
                    return (
                      <button
                        key={colorOption.key}
                        type="button"
                        onClick={() => handleColorSelect(colorOption.label)}
                        className={cn(
                          "px-4 py-3 rounded-xl transition-all font-semibold text-sm",
                          styles.bg,
                          isSelected
                            ? "border-2 border-gray-900 text-gray-900"
                            : `border ${styles.border} ${styles.text} hover:border-gray-400`,
                        )}
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
                          {colorOption.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Custom Color Input */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder={t("customColorPlaceholder")}
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none transition-colors text-lg"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomColorMode(false);
                      setColor("");
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    {t("backToCommonColors")}
                  </button>
                </div>
              </>
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
              max={500}
              step={0.1}
              suffix="kg"
              placeholder={t("weightPlaceholder")}
              helperText={t("weightHelper")}
            />

            {weight !== null && weight > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{t("weightLabel")}</span>{" "}
                  {weight} kg
                  {weight < 1 && ` (${t("weightLessThan1")})`}
                  {weight >= 1 && weight < 10 && ` (${t("weightSmall")})`}
                  {weight >= 10 && weight < 25 && ` (${t("weightMedium")})`}
                  {weight >= 25 && weight < 50 && ` (${t("weightLarge")})`}
                  {weight >= 50 && ` (${t("weightVeryLarge")})`}
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
