"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PetAdType } from "@/lib/api/types/pet-ad.types";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { Heading, Text } from "@/lib/primitives/typography";
import { OptionCard } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout } from "../components";
import { getAdTypes } from "@/lib/utils/mappers";

/**
 * Ad Type Selection View
 * Step 1a: Choose what type of ad to create
 */
export default function AdTypeView() {
  const t = useTranslations("adPlacementDetails.adTypeView");
  const tCommon = useTranslations("common");
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [selectedType, setSelectedType] = useState<PetAdType | null>(
    formData.adType,
  );

  /**
   * Ad Type options - memoized to prevent recalculation on every render
   */
  const AD_TYPE_OPTIONS = useMemo(() => {
    const adTypes = getAdTypes(tCommon);
    return Object.entries(adTypes).map(([key, value]) => ({
      type: Number(key) as PetAdType,
      icon: value.emoji,
      title: value.title,
      description: value.description,
    }));
  }, [tCommon]);

  const handleSelect = (type: PetAdType) => {
    setSelectedType(type);
    updateFormData({ adType: type });
  };

  const handleNext = () => {
    if (selectedType !== null) {
      navigateWithTransition("/ads/ad-placement/category");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/intro");
  };

  const canProceed = selectedType !== null;

  return (
    <>
      <ViewLayout>
        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <Heading variant="subsection">{t("heading")}</Heading>
            <Text variant="body">{t("subheading")}</Text>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {AD_TYPE_OPTIONS.map((option) => (
              <OptionCard
                key={option.type}
                selected={selectedType === option.type}
                onClick={() => handleSelect(option.type)}
                icon={option.icon}
                title={option.title}
                description={option.description}
                size="md"
                inlineDescription
              />
            ))}
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
