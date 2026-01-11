import { FilterEntry, FilterEquation, LogicalOperator, SearchFilter } from '@/lib/api';
import { FilterParams } from '@/lib/filtering/types';

/**
 * Converts FilterParams to SearchFilter format for the API
 */
export function buildSearchFilter(filters: FilterParams): SearchFilter | undefined {
  const entries: FilterEntry[] = [];

  // Ad type
  if (filters['ad-type'] !== undefined) {
    entries.push({
      key: 'adType',
      value: filters['ad-type'],
      equation: FilterEquation.EQUALS,
    });
  }

  // Category
  if (filters.category !== undefined) {
    entries.push({
      key: 'categoryId',
      value: filters.category,
      equation: FilterEquation.EQUALS,
    });
  }

  // Breed
  if (filters.breed !== undefined) {
    entries.push({
      key: 'breedId',
      value: filters.breed,
      equation: FilterEquation.EQUALS,
    });
  }

  // City
  if (filters.city !== undefined) {
    entries.push({
      key: 'cityId',
      value: +filters.city,
      equation: FilterEquation.EQUALS,
    });
  }

  // Gender
  if (filters.gender !== undefined) {
    entries.push({
      key: 'gender',
      value: +filters.gender,
      equation: FilterEquation.EQUALS,
    });
  }

  // Size
  if (filters.size !== undefined) {
    entries.push({
      key: 'size',
      value: +filters.size,
      equation: FilterEquation.EQUALS,
    });
  }

  // Price min
  if (filters['price-min'] !== undefined) {
    entries.push({
      key: 'price',
      value: filters['price-min'],
      equation: FilterEquation.BIGGER_EQUALS,
    });
  }

  // Price max
  if (filters['price-max'] !== undefined) {
    entries.push({
      key: 'price',
      value: filters['price-max'],
      equation: FilterEquation.SMALLER_EQUALS,
    });
  }

  // Age min (in months)
  if (filters['age-min'] !== undefined) {
    entries.push({
      key: 'ageInMonths',
      value: filters['age-min'],
      equation: FilterEquation.BIGGER_EQUALS,
    });
  }

  // Age max (in months)
  if (filters['age-max'] !== undefined) {
    entries.push({
      key: 'ageInMonths',
      value: filters['age-max'],
      equation: FilterEquation.SMALLER_EQUALS,
    });
  }

  // Weight min
  if (filters['weight-min'] !== undefined) {
    entries.push({
      key: 'weight',
      value: filters['weight-min'],
      equation: FilterEquation.BIGGER_EQUALS,
    });
  }

  // Weight max
  if (filters['weight-max'] !== undefined) {
    entries.push({
      key: 'weight',
      value: filters['weight-max'],
      equation: FilterEquation.SMALLER_EQUALS,
    });
  }

  // Color (using CONTAINS for partial match)
  if (filters.color !== undefined && filters.color.trim() !== '') {
    entries.push({
      key: 'color',
      value: filters.color,
      equation: FilterEquation.CONTAINS,
    });
  }

  // If no filters, return undefined
  if (entries.length === 0) {
    return undefined;
  }

  return {
    entries,
    logicalOperator: LogicalOperator.AND_ALSO, // All filters must match
  };
}
