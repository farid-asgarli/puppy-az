"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import {
  PetAdType,
  PetGender,
  PetSize,
  type SubmitPetAdCommand,
} from "@/lib/api/types/pet-ad.types";
import {
  submitPetAdAction,
  getPetBreedsAction,
  getCitiesAction,
} from "@/lib/auth/actions";
import { ReviewCard } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout, InfoBox } from "../components";
import { Heading, Text } from "@/lib/primitives/typography";
import { getPetSizes } from "@/lib/utils/mappers";
import { AdSubmissionSuccessDialog } from "@/lib/components/confirmation-dialog";

/**
 * Helper to get ad type display name
 */
const getAdTypeLabel = (adType: PetAdType | null, t: any): string => {
  if (!adType) return t("notSelected");
  const labels = {
    [PetAdType.Sale]: t("adTypeForSale"),
    [PetAdType.Found]: t("adTypeFound"),
    [PetAdType.Lost]: t("adTypeLost"),
    [PetAdType.Match]: t("adTypeMatch"),
    [PetAdType.Owning]: t("adTypeOwning"),
  };
  return labels[adType] || t("unknown");
};

/**
 * Helper to get gender label
 */
const getGenderLabel = (gender: PetGender | null, t: any): string => {
  if (!gender) return t("notSelected");
  return gender === PetGender.Male
    ? t("petGender.male")
    : t("petGender.female");
};

/**
 * Review & Submit View
 * Step 9: Final review of all data before submission
 */
export default function ReviewView() {
  const t = useTranslations("adPlacementDetails.reviewView");
  const tCommon = useTranslations("adPlacement");
  const tPetSizes = useTranslations("common");
  const tGender = useTranslations("common");
  const tA11y = useTranslations("accessibility");
  const { formData, resetFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [breedName, setBreedName] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const petSizes = getPetSizes(tPetSizes);

  /**
   * Helper to get size label
   */
  const getSizeLabel = (size: PetSize | null): string => {
    if (!size) return t("notSelected");
    return petSizes[size]?.label || t("unknown");
  };
  const [cityName, setCityName] = useState<string | null>(null);
  const [loadingNames, setLoadingNames] = useState(true);

  // Fetch breed and city names using Server Actions
  useEffect(() => {
    const fetchNames = async () => {
      setLoadingNames(true);
      try {
        // Fetch breed name if we have categoryId and petBreedId
        if (formData.categoryId && formData.petBreedId) {
          const breedsResult = await getPetBreedsAction(formData.categoryId);
          if (breedsResult.success) {
            const breed = breedsResult.data.find(
              (b) => b.id === formData.petBreedId,
            );
            setBreedName(breed?.title || null);
          }
        }

        // Fetch city name if we have cityId
        if (formData.cityId) {
          const citiesResult = await getCitiesAction();
          if (citiesResult.success) {
            const city = citiesResult.data.find(
              (c) => c.id === formData.cityId,
            );
            setCityName(city?.name || null);
          }
        }
      } catch (error) {
        console.error("Error fetching names:", error);
      } finally {
        setLoadingNames(false);
      }
    };

    fetchNames();
  }, [formData.categoryId, formData.petBreedId, formData.cityId]);

  const handleEdit = (step: string) => {
    navigateWithTransition(`/ads/ad-placement/${step}`);
  };

  const handleBack = () => {
    if (formData.adType === PetAdType.Sale) {
      navigateWithTransition("/ads/ad-placement/price");
    } else {
      navigateWithTransition("/ads/ad-placement/photos");
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    resetFormData();
    // Use hard navigation to ensure fresh data (bypass router cache)
    window.location.href = "/my-account/ads?tab=pending";
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Validate required fields
      if (
        !formData.adType ||
        !formData.categoryId ||
        !formData.petBreedId ||
        !formData.gender ||
        !formData.size ||
        !formData.ageInMonths ||
        !formData.cityId ||
        !formData.title ||
        !formData.description ||
        formData.uploadedImages.length === 0
      ) {
        setSubmitError(t("fillAllFields"));
        setSubmitting(false);
        return;
      }

      // Validate price for Sale type
      if (
        formData.adType === PetAdType.Sale &&
        (formData.price === null || formData.price < 0)
      ) {
        setSubmitError(t("priceRequired"));
        setSubmitting(false);
        return;
      }

      // Prepare submission data
      const submissionData: SubmitPetAdCommand = {
        title: formData.title,
        description: formData.description,
        ageInMonths: formData.ageInMonths,
        gender: formData.gender,
        adType: formData.adType,
        color: formData.color || "",
        weight: formData.weight,
        size: formData.size,
        price: formData.adType === PetAdType.Sale ? formData.price || 0 : 0,
        cityId: formData.cityId,
        petBreedId: formData.petBreedId,
        imageIds: formData.uploadedImages.map((img) => img.id),
      };

      // Submit to backend
      const result = await submitPetAdAction(submissionData);

      if (result.success) {
        // Success - show success dialog
        setSubmitting(false);
        setShowSuccessDialog(true);
      } else {
        setSubmitError(result.error || t("submitError"));
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(t("unknownError"));
      setSubmitting(false);
    }
  };

  const years = formData.ageInMonths
    ? Math.floor(formData.ageInMonths / 12)
    : 0;
  const months = formData.ageInMonths ? formData.ageInMonths % 12 : 0;

  /**
   * Format age with proper localization
   */
  const formatAge = () => {
    if (!formData.ageInMonths) return t("notSet");

    const parts: string[] = [];
    if (years > 0) {
      parts.push(t("ageYears", { count: years }));
    }
    if (months > 0) {
      parts.push(t("ageMonths", { count: months }));
    }
    if (parts.length === 0) {
      parts.push(t("ageMonths", { count: 0 }));
    }
    return parts.join(" ");
  };

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

          {/* Error Message */}
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          {/* Review Sections */}
          <div className="space-y-6">
            {/* Photos */}
            <ReviewCard
              title={t("photosTitle")}
              onEdit={() => handleEdit("photos")}
            >
              {formData.uploadedImages.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    {t("photosCount", {
                      count: formData.uploadedImages.length,
                      plural: formData.uploadedImages.length !== 1 ? "s" : "",
                    })}
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {formData.uploadedImages.slice(0, 4).map((image, index) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={image.url}
                          alt={t("photoAlt", { number: index + 1 })}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 px-2 py-0.5 bg-black text-white text-xs font-semibold rounded">
                            {t("primary")}
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.uploadedImages.length > 4 && (
                      <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          +{formData.uploadedImages.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">{t("noPhotos")}</p>
              )}
            </ReviewCard>

            {/* Title & Description */}
            <ReviewCard
              title={t("titleDescriptionTitle")}
              onEdit={() => handleEdit("details")}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t("titleLabel")}
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formData.title || t("notSet")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {t("descriptionLabel")}
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {formData.description || t("notSet")}
                  </p>
                </div>
              </div>
            </ReviewCard>

            {/* Pet Details */}
            <ReviewCard
              title={t("petDetailsTitle")}
              onEdit={() => handleEdit("basics")}
              editLabel={t("editDetails")}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t("adTypeLabel")}</p>
                  <p className="text-gray-900 font-medium">
                    {getAdTypeLabel(formData.adType, tCommon)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("breedLabel")}</p>
                  <p className="text-gray-900 font-medium">
                    {loadingNames ? (
                      <span className="text-gray-400">{t("loading")}</span>
                    ) : breedName ? (
                      breedName
                    ) : formData.petBreedId ? (
                      `Breed ID: ${formData.petBreedId}`
                    ) : (
                      t("notSelected")
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("genderLabel")}</p>
                  <p className="text-gray-900 font-medium">
                    {getGenderLabel(formData.gender, tGender)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("sizeLabel")}</p>
                  <p className="text-gray-900 font-medium">
                    {getSizeLabel(formData.size)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("ageLabel")}</p>
                  <p className="text-gray-900 font-medium">{formatAge()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("colorLabel")}</p>
                  <p className="text-gray-900 font-medium">
                    {formData.color || t("notSet")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("weightLabel")}</p>
                  <p className="text-gray-900 font-medium">
                    {formData.weight
                      ? t("weightValue", { weight: formData.weight })
                      : t("notSpecified")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("locationLabel")}</p>
                  <p className="text-gray-900 font-medium">
                    {loadingNames ? (
                      <span className="text-gray-400">{t("loading")}</span>
                    ) : cityName ? (
                      cityName
                    ) : formData.cityId ? (
                      `City ID: ${formData.cityId}`
                    ) : (
                      t("notSet")
                    )}
                  </p>
                </div>
              </div>
            </ReviewCard>

            {/* Price (if Sale) */}
            {formData.adType === PetAdType.Sale && (
              <ReviewCard
                title={t("priceTitle")}
                onEdit={() => handleEdit("price")}
              >
                <p className="text-3xl font-semibold text-gray-900">
                  ₼{formData.price?.toFixed(2) || "0.00"}
                </p>
              </ReviewCard>
            )}
          </div>

          {/* Submit Info */}
          <InfoBox title={t("whatHappensTitle")} variant="blue">
            <p className="text-sm">{t("whatHappensText")}</p>
          </InfoBox>
        </div>
      </ViewLayout>

      <ViewFooter
        onBack={handleBack}
        onNext={handleSubmit}
        canProceed={!submitting}
        nextLabel={submitting ? t("submittingLabel") : t("submitLabel")}
        isSubmitting={submitting}
      />

      {/* Success Dialog with Dancing Dog Animation */}
      <AdSubmissionSuccessDialog
        isOpen={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        title={t("successDialog.title")}
        message={t("successDialog.message")}
        infoText={t("successDialog.infoText")}
        buttonText={t("successDialog.buttonText")}
        closeAriaLabel={tA11y("close")}
      />
    </>
  );
}
