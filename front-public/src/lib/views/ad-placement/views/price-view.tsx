"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { PetAdType } from "@/lib/api/types/pet-ad.types";
import { NumberField } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout, LoadingState, InfoBox } from "../components";
import { Heading, Text } from "@/lib/primitives/typography";

/**
 * Pricing View
 * Step 8: Set price for Sale ads only
 */
export default function PriceView() {
  const t = useTranslations("adPlacementDetails.priceView");
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();

  const [price, setPrice] = useState<number | null>(formData.price);

  // Redirect if not a Sale ad
  useEffect(() => {
    if (formData.adType !== PetAdType.Sale) {
      navigateWithTransition("/ads/ad-placement/review");
    }
  }, [formData.adType, navigateWithTransition]);

  // Update form data when price changes
  useEffect(() => {
    updateFormData({ price });
  }, [price, updateFormData]);

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition("/ads/ad-placement/review");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/details");
  };

  const canProceed = price !== null && price >= 0;

  // Show loading if redirecting
  if (formData.adType !== PetAdType.Sale) {
    return <LoadingState message={t("redirecting")} />;
  }

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

          {/* Price Input Section */}
          <div className="space-y-6">
            <NumberField
              label={t("priceLabel")}
              value={price}
              onChange={(value) => setPrice(value)}
              min={0}
              step={0.01}
              prefix="₼"
              placeholder="0"
              helperText={t("helperText")}
            />

            {price !== null && price > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-center text-gray-700">
                  <span className="font-semibold">{t("listingPrice")}</span> ₼
                  {price.toFixed(2)}
                </p>
              </div>
            )}

            {/* Pricing Tips */}
            <InfoBox title={t("tipsTitle")}>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{t("tip1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{t("tip2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{t("tip3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{t("tip4")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{t("tip5")}</span>
                </li>
              </ul>
            </InfoBox>

            {/* Free Option Info */}
            <InfoBox title={t("freeTitle")} variant="blue">
              <p className="text-sm">{t("freeText")}</p>
            </InfoBox>
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
