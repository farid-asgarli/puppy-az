/**
 * Ad Placement Wizard Types
 */

import { PetAdType, PetGender, PetSize } from '@/lib/api/types/pet-ad.types';

/**
 * Uploaded file tracking for photos
 */
export interface UploadedImageInfo {
  id: number; // Backend image ID
  url: string; // Backend URL from getPetAdImageUrl()
  file?: File; // Original file object (optional, for reference)
}

/**
 * Complete wizard form data
 */
export interface AdPlacementFormData {
  // Step 1: Ad Type & Category
  adType: PetAdType | null;
  categoryId: number | null;

  // Step 2: Breed
  petBreedId: number | null;

  // Step 3: Basic Details
  gender: PetGender | null;
  size: PetSize | null;
  ageInMonths: number | null;

  // Step 4: Physical Details
  color: string;
  weight: number | null;

  // Step 5: Location
  cityId: number | null;

  // Step 6: Photos
  // Uploaded images with backend IDs
  uploadedImages: UploadedImageInfo[];

  // Step 7: Title & Description
  title: string;
  description: string;

  // Step 8: Pricing (conditional)
  price: number | null;
}

/**
 * Initial empty form state
 */
export const INITIAL_AD_PLACEMENT_DATA: AdPlacementFormData = {
  adType: null,
  categoryId: null,
  petBreedId: null,
  gender: null,
  size: null,
  ageInMonths: null,
  color: '',
  weight: null,
  cityId: null,
  uploadedImages: [],
  title: '',
  description: '',
  price: null,
};

/**
 * Get minimum photo requirement based on ad type
 */
export function getMinPhotoCount(adType: PetAdType | null): number {
  if (!adType) return 1;
  // Sale, Match, Owning = 3 photos minimum
  if ([PetAdType.Sale, PetAdType.Match, PetAdType.Owning].includes(adType)) {
    return 3;
  }
  // Found, Lost = 1 photo minimum
  return 1;
}

/**
 * Wizard step configuration
 */
export interface WizardStep {
  id: number;
  path: string;
  title: string;
  description: string;
  /** Function to check if this step should be shown */
  shouldShow?: (data: AdPlacementFormData) => boolean;
  /** Function to validate if we can proceed from this step */
  isValid: (data: AdPlacementFormData) => boolean;
}

/**
 * Wizard steps definition
 */
export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    path: 'category',
    title: 'Tell us about your pet',
    description: 'Choose what type of ad and which category',
    isValid: (data) => data.adType !== null && data.categoryId !== null,
  },
  {
    id: 2,
    path: 'breed',
    title: 'Select the breed',
    description: 'What breed is your pet?',
    isValid: (data) => data.petBreedId !== null,
  },
  {
    id: 3,
    path: 'basics',
    title: 'Basic details',
    description: 'Tell us about gender, size, and age',
    isValid: (data) => data.gender !== null && data.size !== null && data.ageInMonths !== null && data.ageInMonths > 0,
  },
  {
    id: 4,
    path: 'physical',
    title: 'Physical characteristics',
    description: 'Color and weight information',
    isValid: (data) => data.color.trim().length > 0,
  },
  {
    id: 5,
    path: 'location',
    title: 'Where is your pet located?',
    description: 'Select the city',
    isValid: (data) => data.cityId !== null,
  },
  {
    id: 6,
    path: 'photos',
    title: 'Add some photos',
    description: "You'll need at least 1 photo to get started",
    isValid: (data) => data.uploadedImages.length >= getMinPhotoCount(data.adType),
  },
  {
    id: 7,
    path: 'details',
    title: 'Create your title and description',
    description: 'Make it stand out',
    isValid: (data) => data.title.trim().length >= 10 && data.description.trim().length >= 30,
  },
  {
    id: 8,
    path: 'price',
    title: 'Set your price',
    description: 'How much do you want to charge?',
    shouldShow: (data) => data.adType === PetAdType.Sale,
    isValid: (data) => data.adType !== PetAdType.Sale || (data.price !== null && data.price >= 0),
  },
  {
    id: 9,
    path: 'review',
    title: 'Review your listing',
    description: "Here's what we'll show to guests. Make sure everything looks good.",
    isValid: () => true, // Always valid, this is the final step
  },
];
