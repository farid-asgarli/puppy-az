/**
 * Typography Style Configurations
 * Centralized typography styles based on DESIGN-SYSTEM-PROMPT.md
 */

import { HeadingVariant, TextVariant, LabelVariant, TextWeight } from './typography.types';

// ============================================================================
// Heading Styles
// ============================================================================

export const headingStyles: Record<HeadingVariant, string> = {
  // Hero: text-5xl lg:text-6xl font-semibold font-heading leading-tight
  hero: 'text-5xl lg:text-6xl font-semibold font-heading leading-tight',

  // Page Title: text-3xl lg:text-4xl font-semibold font-heading
  'page-title': 'text-3xl lg:text-4xl font-semibold font-heading',

  // Display: text-4xl lg:text-5xl font-semibold font-heading leading-tight
  display: 'text-4xl lg:text-5xl font-semibold font-heading leading-tight',

  // Section: text-3xl lg:text-4xl font-semibold font-heading
  section: 'text-3xl lg:text-4xl font-semibold font-heading',

  // Subsection: text-xl lg:text-2xl font-semibold
  subsection: 'text-xl lg:text-2xl font-semibold',

  // Card: text-xl font-semibold
  card: 'text-xl font-semibold',

  // Label: text-lg font-semibold
  label: 'text-lg font-semibold',
};

export const headingColorStyles = {
  primary: 'text-gray-900',
  secondary: 'text-gray-700',
  tertiary: 'text-gray-600',
};

// Default semantic mapping: variant -> HTML element
export const headingElementMap: Record<HeadingVariant, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  hero: 'h1',
  'page-title': 'h1',
  display: 'h2',
  section: 'h2',
  subsection: 'h3',
  card: 'h3',
  label: 'h4',
};

// ============================================================================
// Text Styles
// ============================================================================

export const textStyles: Record<TextVariant, string> = {
  // Body XL: text-xl
  'body-xl': 'text-xl',

  // Body Large: text-lg
  'body-lg': 'text-lg',

  // Body: text-base
  body: 'text-base',

  // Small: text-sm
  small: 'text-sm',

  // Tiny: text-xs
  tiny: 'text-xs',
};

export const textColorStyles = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  tertiary: 'text-gray-500',
  muted: 'text-gray-400',
};

export const textWeightStyles: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const textLeadingStyles = {
  tight: 'leading-tight',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
};

// ============================================================================
// Label Styles
// ============================================================================

export const labelStyles: Record<LabelVariant, string> = {
  // Field: text-sm text-gray-600 (for form labels)
  field: 'text-sm text-gray-600',

  // Value: font-semibold text-gray-900 (for display values)
  value: 'font-semibold text-gray-900',

  // Meta: text-sm text-gray-600 (for metadata)
  meta: 'text-sm text-gray-600',

  // Badge: text-xs font-semibold (for badges/tags)
  badge: 'text-xs font-semibold',
};
