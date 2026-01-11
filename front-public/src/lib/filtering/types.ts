import { PetAdType, PetGender, PetSize } from '@/lib/api';

/**
 * Primary filters - main search criteria
 * Updated to use dynamic IDs from API instead of static string enums
 */
export interface FilterParamsPrimary {
  'ad-type'?: PetAdType;
  category?: number; // Category ID from API
  breed?: number; // Breed ID from API
}

export interface FilterParamsSecondary {
  city?: number; // City ID from API
  gender?: PetGender;
  size?: PetSize;
  'price-min'?: number;
  'price-max'?: number;
  'age-min'?: number;
  'age-max'?: number;
  'weight-min'?: number;
  'weight-max'?: number;
  color?: string;
}

export type FilterParams = FilterParamsPrimary &
  FilterParamsSecondary & {
    page?: number;
    sort?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'distance';
  };

export interface SearchField {
  id: keyof FilterParams;
  label: string;
  'expanded-placeholder': string;
  'collapsed-placeholder': string;
  element: React.ReactNode;
  required?: boolean;
  dependsOn?: keyof FilterParams;
}
