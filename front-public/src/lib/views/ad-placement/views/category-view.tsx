"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PetCategoryDetailedDto } from "@/lib/api/types/pet-ad.types";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import { OptionCard } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout } from "../components";

interface CategoryViewProps {
  categories: PetCategoryDetailedDto[];
}

/**
 * Category Selection View
 * Step 1b: Choose pet category
 */
export default function CategoryView({ categories }: CategoryViewProps) {
  const t = useTranslations("adPlacementDetails.categoryView");
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    formData.categoryId,
  );

  const handleSelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    updateFormData({ categoryId });
  };

  const handleNext = () => {
    if (selectedCategoryId !== null) {
      navigateWithTransition("/ads/ad-placement/breed");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/ad-type");
  };

  const canProceed = selectedCategoryId !== null;

  return (
    <>
      <ViewLayout>
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <Heading variant="subsection">{t("heading")}</Heading>
            <Text variant="body-lg">{t("subheading")}</Text>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              // Map iconColor to checkmark colors
              // Safelist: bg-orange-500 bg-blue-500 bg-purple-500 bg-pink-500 bg-green-500 bg-cyan-500 bg-red-500 bg-yellow-500 bg-gray-500
              // Safelist: border-orange-500 border-blue-500 border-purple-500 border-pink-500 border-green-500 border-cyan-500 border-red-500 border-yellow-500 border-gray-500
              const colorMap: Record<string, { bg: string; border: string }> = {
                "text-orange-600": {
                  bg: "bg-orange-500",
                  border: "border-orange-500",
                },
                "text-blue-600": {
                  bg: "bg-blue-500",
                  border: "border-blue-500",
                },
                "text-purple-600": {
                  bg: "bg-purple-500",
                  border: "border-purple-500",
                },
                "text-pink-600": {
                  bg: "bg-pink-500",
                  border: "border-pink-500",
                },
                "text-green-600": {
                  bg: "bg-green-500",
                  border: "border-green-500",
                },
                "text-cyan-600": {
                  bg: "bg-cyan-500",
                  border: "border-cyan-500",
                },
                "text-red-600": { bg: "bg-red-500", border: "border-red-500" },
                "text-yellow-600": {
                  bg: "bg-yellow-500",
                  border: "border-yellow-500",
                },
                "text-gray-600": {
                  bg: "bg-gray-500",
                  border: "border-gray-500",
                },
                "text-indigo-600": {
                  bg: "bg-indigo-500",
                  border: "border-indigo-500",
                },
                "text-teal-600": {
                  bg: "bg-teal-500",
                  border: "border-teal-500",
                },
                "text-amber-600": {
                  bg: "bg-amber-500",
                  border: "border-amber-500",
                },
              };
              const colors = category.iconColor
                ? colorMap[category.iconColor]
                : null;

              return (
                <OptionCard
                  key={category.id}
                  selected={selectedCategoryId === category.id}
                  onClick={() => handleSelect(category.id)}
                  icon={
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        category.backgroundColor,
                        category.iconColor,
                      )}
                      dangerouslySetInnerHTML={{ __html: category.svgIcon }}
                    />
                  }
                  title={category.title}
                  metadata={
                    category.petAdsCount > 0
                      ? t("activeListings", {
                          count: category.petAdsCount.toLocaleString(),
                        })
                      : undefined
                  }
                  size="sm"
                  layout="horizontal"
                  checkmarkBgColor={colors?.bg}
                  checkmarkBorderColor={colors?.border}
                />
              );
            })}
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
