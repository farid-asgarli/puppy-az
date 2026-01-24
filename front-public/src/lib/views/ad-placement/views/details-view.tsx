"use client";

import { useState } from "react";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { TextareaField } from "@/lib/components/views/ad-placement";
import { ViewFooter, ViewLayout, InfoBox } from "../components";
import { Heading, Text } from "@/lib/primitives/typography";
import { useTranslations } from "next-intl";

const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 30;
const DESCRIPTION_MAX_LENGTH = 2000;

export default function DetailsView() {
  const { formData, updateFormData } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const t = useTranslations("adPlacementDetails.titleView");

  const [title, setTitle] = useState(formData.title || "");
  const [description, setDescription] = useState(formData.description || "");

  const handleTitleChange = (value: string) => {
    if (value.length <= TITLE_MAX_LENGTH) {
      setTitle(value);
      updateFormData({ title: value });
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(value);
      updateFormData({ description: value });
    }
  };

  const handleNext = () => {
    if (canProceed) {
      navigateWithTransition("/ads/ad-placement/location");
    }
  };

  const handleBack = () => {
    navigateWithTransition("/ads/ad-placement/physical");
  };

  const canProceed =
    title.trim().length >= TITLE_MIN_LENGTH &&
    description.trim().length >= DESCRIPTION_MIN_LENGTH;

  return (
    <>
      <ViewLayout>
        <div className="space-y-12">
          <div className="space-y-2">
            <Heading variant="subsection">{t("heading")}</Heading>
            <Text variant="body-lg" color="secondary">
              {t("subheading")}
            </Text>
          </div>

          <div className="space-y-4">
            <TextareaField
              label={t("titleLabel")}
              value={title}
              onChange={handleTitleChange}
              placeholder={t("titlePlaceholder")}
              rows={2}
              maxLength={TITLE_MAX_LENGTH}
              minLength={TITLE_MIN_LENGTH}
              showCharCount
            />

            <InfoBox title={t("titleTips")}>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("tips.includeBreed")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("tips.keepClear")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("tips.avoidSpecial")}</span>
                </li>
              </ul>
            </InfoBox>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Heading variant="subsection">{t("descriptionHeading")}</Heading>
              <Text>{t("descriptionSubheading")}</Text>
            </div>

            <TextareaField
              label={t("descriptionLabel")}
              value={description}
              onChange={handleDescriptionChange}
              placeholder={t("descriptionPlaceholder")}
              rows={12}
              maxLength={DESCRIPTION_MAX_LENGTH}
              minLength={DESCRIPTION_MIN_LENGTH}
              showCharCount
            />

            <InfoBox title={t("whatToInclude")}>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("includeItems.personality")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("includeItems.health")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("includeItems.training")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("includeItems.specialNeeds")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("includeItems.reason")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{t("includeItems.unique")}</span>
                </li>
              </ul>
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
