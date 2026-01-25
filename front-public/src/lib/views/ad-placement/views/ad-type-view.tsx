"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PetAdType } from "@/lib/api/types/pet-ad.types";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { Heading, Text } from "@/lib/primitives/typography";
import { OptionCard } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout } from "../components";
import { getAdTypes } from "@/lib/utils/mappers";
import { IconLoader2 } from "@tabler/icons-react";

/**
 * Ad Type Selection View
 * Step 1a: Choose what type of ad to create
 * Also handles loading existing ad when edit param is present
 */
export default function AdTypeView() {
  const t = useTranslations("adPlacementDetails.adTypeView");
  const tCommon = useTranslations("common");
  const tAdPlacement = useTranslations("adPlacement");
  const searchParams = useSearchParams();
  const { formData, updateFormData, loadExistingAd, isEditMode } =
    useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [selectedType, setSelectedType] = useState<PetAdType | null>(
    formData.adType,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Handle edit mode - load existing ad
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && !isEditMode) {
      const adId = parseInt(editId, 10);
      if (!isNaN(adId) && adId > 0) {
        setIsLoading(true);
        loadExistingAd(adId).then((success) => {
          setIsLoading(false);
          if (!success) {
            setLoadError(tAdPlacement("editLoadError"));
          }
          // Remove edit param from URL after loading
          window.history.replaceState({}, "", window.location.pathname);
        });
      }
    }
  }, [searchParams, isEditMode, loadExistingAd, tAdPlacement]);

  // Update selected type when formData changes (after loading)
  useEffect(() => {
    if (formData.adType !== null) {
      setSelectedType(formData.adType);
    }
  }, [formData.adType]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <IconLoader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <Text variant="body-lg" color="secondary">
            {tAdPlacement("loadingAd")}
          </Text>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <Heading variant="subsection">{loadError}</Heading>
          <Text variant="body" color="secondary">
            {tAdPlacement("editLoadErrorDescription")}
          </Text>
          <button
            onClick={() => navigateWithTransition("/my-account/my-ads")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-200"
          >
            {tAdPlacement("backToMyAds")}
          </button>
        </div>
      </div>
    );
  }

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
