'use client';

import { PetAdDetailsDto, PetGender, PetSize } from '@/lib/api/types/pet-ad.types';
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
} from '@tabler/icons-react';
import { InfoCard, SectionHeader } from '@/lib/components/views/common';
import { useTranslations } from 'next-intl';
import { getPetSizes } from '@/lib/utils/mappers';

export interface AdDetailsQuickInfoSectionProps {
  adDetails: PetAdDetailsDto;
}

export function AdDetailsQuickInfoSection({ adDetails }: AdDetailsQuickInfoSectionProps) {
  const t = useTranslations('petAdDetails.quickInfo');
  const tCommon = useTranslations('common');
  const petSizes = getPetSizes(tCommon);

  // Helper functions for display text
  const getGenderText = (gender: PetGender): string => {
    return gender === PetGender.Male ? t('gender.male') : t('gender.female');
  };

  const getGenderIcon = (gender: PetGender) => {
    return gender === PetGender.Male ? IconGenderMale : IconGenderFemale;
  };

  const getSizeText = (size: PetSize): string => {
    return petSizes[size]?.label || t('size.unknown');
  };

  const getAgeText = (ageInMonths: number): string => {
    if (ageInMonths < 12) {
      return t('age.months', { count: ageInMonths });
    }
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    if (months === 0) {
      return t('age.years', { count: years });
    }
    return t('age.yearsMonths', { years, months });
  };

  const GenderIcon = getGenderIcon(adDetails.gender);

  // Build info items array (conditional weight and color)
  const infoItems = [
    {
      icon: IconCategory,
      label: t('category'),
      value: adDetails.categoryTitle,
    },
    {
      icon: IconDna2,
      label: t('breed'),
      value: adDetails.breed.title,
    },
    {
      icon: GenderIcon,
      label: t('gender.label'),
      value: getGenderText(adDetails.gender),
    },
    {
      icon: IconCake,
      label: t('age.label'),
      value: getAgeText(adDetails.ageInMonths),
    },
    ...(adDetails.weight !== null
      ? [
          {
            icon: IconScale,
            label: t('weight.label'),
            value: t('weight.kg', { weight: adDetails.weight }),
          },
        ]
      : []),
    ...(adDetails.color
      ? [
          {
            icon: IconPalette,
            label: t('color.label'),
            value: adDetails.color,
          },
        ]
      : []),
    {
      icon: IconRuler2,
      label: t('size.label'),
      value: getSizeText(adDetails.size),
    },
    {
      icon: IconMapPin,
      label: t('city'),
      value: adDetails.cityName,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <SectionHeader title={t('title')} size="md" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {infoItems.map((item, index) => (
          <InfoCard key={index} icon={item.icon} label={item.label} value={item.value} variant="default" />
        ))}
      </div>
    </div>
  );
}
