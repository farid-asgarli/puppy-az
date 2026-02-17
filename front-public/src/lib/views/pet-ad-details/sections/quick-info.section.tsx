"use client";

import {
  PetAdDetailsDto,
  PetGender,
  PetSize,
} from "@/lib/api/types/pet-ad.types";
import {
  IconDna2,
  IconGenderMale,
  IconGenderFemale,
  IconCake,
  IconScale,
  IconPalette,
  IconRuler2,
  IconMapPin,
  IconCategory,
} from "@tabler/icons-react";
import { InfoCard, SectionHeader } from "@/lib/components/views/common";
import { useTranslations, useLocale } from "next-intl";
import { getPetSizes } from "@/lib/utils/mappers";
import { petAdService } from "@/lib/api/services/pet-ad.service";
import { useState, useEffect } from "react";

export interface AdDetailsQuickInfoSectionProps {
  adDetails: PetAdDetailsDto;
}

export function AdDetailsQuickInfoSection({
  adDetails,
}: AdDetailsQuickInfoSectionProps) {
  const t = useTranslations("petAdDetails.quickInfo");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const petSizes = getPetSizes(tCommon);
  const [colorName, setColorName] = useState<string | null>(null);

  useEffect(() => {
    if (adDetails.color) {
      petAdService
        .getPetColors(locale)
        .then((colors) => {
          const found = colors.find((c) => c.key === adDetails.color);
          setColorName(found?.title || adDetails.color);
        })
        .catch(() => {
          setColorName(adDetails.color);
        });
    }
  }, [adDetails.color, locale]);

  // Helper functions for display text
  const getGenderText = (gender: PetGender | null | undefined): string => {
    if (gender === null || gender === undefined) {
      return t("gender.notSpecified");
    }
    if (gender === PetGender.Unknown) {
      return tCommon("petGender.other");
    }
    return gender === PetGender.Male ? t("gender.male") : t("gender.female");
  };

  const getGenderIcon = (gender: PetGender | null | undefined) => {
    // Default to male icon if gender not specified or unknown
    if (
      gender === null ||
      gender === undefined ||
      gender === PetGender.Unknown
    ) {
      return IconGenderMale;
    }
    return gender === PetGender.Male ? IconGenderMale : IconGenderFemale;
  };

  const getSizeText = (size: PetSize): string => {
    return petSizes[size]?.label || t("size.unknown");
  };

  const getAgeText = (ageInMonths: number | null | undefined): string => {
    // If age is null, undefined, or 0, show "Not specified"
    if (
      ageInMonths === null ||
      ageInMonths === undefined ||
      ageInMonths === 0
    ) {
      return t("age.notSpecified");
    }
    if (ageInMonths < 12) {
      return t("age.months", { count: ageInMonths });
    }
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    if (months === 0) {
      return t("age.years", { count: years });
    }
    return t("age.yearsMonths", { years, months });
  };

  const GenderIcon = getGenderIcon(adDetails.gender);

  // Build info items array (conditional weight, color, breed)
  const infoItems = [
    {
      icon: IconCategory,
      label: t("category"),
      value: adDetails.categoryTitle,
    },
    {
      icon: IconDna2,
      label: t("breed"),
      value: adDetails.breed
        ? adDetails.breed.title
        : tCommon("petBreed.other"),
    },
    {
      icon: GenderIcon,
      label: t("gender.label"),
      value: getGenderText(adDetails.gender),
    },
    {
      icon: IconCake,
      label: t("age.label"),
      value: getAgeText(adDetails.ageInMonths),
    },
    {
      icon: IconScale,
      label: t("weight.label"),
      value:
        adDetails.weight !== null && adDetails.weight !== 0
          ? t("weight.kg", { weight: adDetails.weight })
          : t("weight.notSpecified"),
    },
    ...(adDetails.color
      ? [
          {
            icon: IconPalette,
            label: t("color.label"),
            value: colorName || adDetails.color,
          },
        ]
      : []),
    {
      icon: IconRuler2,
      label: t("size.label"),
      value: getSizeText(adDetails.size),
    },
    {
      icon: IconMapPin,
      label: t("city"),
      value: adDetails.districtName
        ? `${adDetails.cityName} — ${adDetails.districtName}`
        : adDetails.cityName,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader title={t("title")} size="md" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {infoItems.map((item, index) => (
          <InfoCard
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.value}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
}
