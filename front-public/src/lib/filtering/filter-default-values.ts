import { FilterParamsPrimary, FilterParamsSecondary } from '@/lib/filtering/types';

export const DEFAULT_FILTER_VALUES = {
  MIN_AD_PRICE: 0,
  MAX_AD_PRICE: 50000,
};

export const DEFAULT_PRIMARY_FILTER_VALUES: FilterParamsPrimary = {
  'ad-type': undefined,
  breed: undefined,
  category: undefined,
};

export const DEFAULT_SECONDARY_FILTER_VALUES: FilterParamsSecondary = {
  city: undefined,
  gender: undefined,
  'price-min': DEFAULT_FILTER_VALUES.MIN_AD_PRICE,
  'price-max': DEFAULT_FILTER_VALUES.MAX_AD_PRICE,
  size: undefined,
  'age-min': undefined,
  'age-max': undefined,
  'weight-min': undefined,
  'weight-max': undefined,
  color: undefined,
};
