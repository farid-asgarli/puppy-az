import { ReactNode } from 'react';

/**
 * Typography Component Types
 * Based on design patterns from About, Premium, Settings, and Ad-Placement views
 */

// ============================================================================
// Heading Variants
// ============================================================================

export type HeadingVariant =
  | 'hero' // Extra large hero headings: text-5xl lg:text-6xl
  | 'page-title' // Page titles: text-3xl lg:text-4xl
  | 'display' // Display headings: text-4xl lg:text-5xl
  | 'section' // Section headings: text-3xl lg:text-4xl
  | 'subsection' // Subsection headings: text-xl lg:text-2xl
  | 'card' // Card/component headings: text-xl
  | 'label'; // Small headings/labels: text-lg

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps {
  /**
   * Visual variant - controls size and weight
   * @default 'page-title'
   */
  variant?: HeadingVariant;

  /**
   * Semantic HTML element
   * @default auto-mapped based on variant
   */
  as?: HeadingLevel;

  /**
   * Text color variant
   * @default 'primary' (text-gray-900)
   */
  color?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Content
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// Text Variants
// ============================================================================

export type TextVariant =
  | 'body-xl' // Extra large body: text-xl
  | 'body-lg' // Large body: text-lg
  | 'body' // Default body: text-base
  | 'small' // Small text: text-sm
  | 'tiny'; // Extra small: text-xs

export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface TextProps {
  /**
   * Visual variant - controls size
   * @default 'body'
   */
  variant?: TextVariant;

  /**
   * Semantic HTML element
   * @default 'p'
   */
  as?: 'p' | 'span' | 'div' | 'label';

  /**
   * Text color variant
   * @default 'secondary' (text-gray-600)
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted';

  /**
   * Font weight
   * @default 'normal'
   */
  weight?: TextWeight;

  /**
   * Leading/line-height
   * @default 'normal'
   */
  leading?: 'tight' | 'normal' | 'relaxed';

  /**
   * Content
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============================================================================
// Label Variants (for form fields, metadata, etc.)
// ============================================================================

export type LabelVariant =
  | 'field' // Form field labels: text-sm text-gray-600
  | 'value' // Display values: font-semibold text-gray-900
  | 'meta' // Metadata: text-sm text-gray-600
  | 'badge'; // Badge text: text-xs font-semibold

export interface LabelProps {
  /**
   * Visual variant
   * @default 'field'
   */
  variant?: LabelVariant;

  /**
   * Semantic HTML element
   * @default 'label'
   */
  as?: 'label' | 'span' | 'div' | 'p';

  /**
   * For attribute (when used as label)
   */
  htmlFor?: string;

  /**
   * Content
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}
