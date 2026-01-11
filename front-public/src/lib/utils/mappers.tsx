import { PetAdType, PetGender, PetSize } from '@/lib/api';
import { IconHeart, IconHeartBroken, IconPaw, IconRadar, IconReplaceUser } from '@tabler/icons-react';

// Getter function for translated pet sizes
export const getPetSizes = (t: (key: string) => string) =>
  ({
    [PetSize.ExtraSmall]: {
      label: t('petSize.extraSmall.label'),
      description: t('petSize.extraSmall.description'),
    },
    [PetSize.Small]: {
      label: t('petSize.small.label'),
      description: t('petSize.small.description'),
    },
    [PetSize.Medium]: {
      label: t('petSize.medium.label'),
      description: t('petSize.medium.description'),
    },
    [PetSize.Large]: {
      label: t('petSize.large.label'),
      description: t('petSize.large.description'),
    },
    [PetSize.ExtraLarge]: {
      label: t('petSize.extraLarge.label'),
      description: t('petSize.extraLarge.description'),
    },
  } as const);

// Getter function for translated ad types
export const getAdTypes = (t: (key: string) => string) =>
  ({
    [PetAdType.Sale]: {
      title: t('adTypes.sale.title'),
      icon: IconReplaceUser,
      emoji: '💰',
      description: t('adTypes.sale.description'),
      color: { bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-200' },
    },
    [PetAdType.Found]: {
      title: t('adTypes.found.title'),
      icon: IconRadar,
      emoji: '🔍',
      description: t('adTypes.found.description'),
      color: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    },
    [PetAdType.Lost]: {
      title: t('adTypes.lost.title'),
      icon: IconHeartBroken,
      emoji: '😢',
      description: t('adTypes.lost.description'),
      color: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
    },
    [PetAdType.Match]: {
      title: t('adTypes.match.title'),
      icon: IconPaw,
      emoji: '❤️',
      description: t('adTypes.match.description'),
      color: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
    },
    [PetAdType.Owning]: {
      title: t('adTypes.owning.title'),
      icon: IconHeart,
      emoji: '🏠',
      description: t('adTypes.owning.description'),
      color: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
    },
  } as const);

// Getter function for translated pet genders
export const getPetGender = (t: (key: string) => string) =>
  ({
    [PetGender.Male]: {
      label: t('petGender.male'),
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="10" cy="14" r="6" strokeWidth="2" />
          <path d="M15 9l5-5m0 0v4m0-4h-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    [PetGender.Female]: {
      label: t('petGender.female'),
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="9" r="6" strokeWidth="2" />
          <path d="M12 15v6m0 0h-3m3 0h3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  } as const);
