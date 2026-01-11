/**
 * Typography Primitives
 *
 * Centralized typography components following the puppy.az design system.
 * Based on best practices from About, Premium, Settings, and Ad-Placement views.
 *
 * @module primitives/typography
 */

export { Heading } from './heading.component';
export { Text } from './text.component';
export { Label } from './label.component';

export type { HeadingProps, HeadingVariant, HeadingLevel, TextProps, TextVariant, TextWeight, LabelProps, LabelVariant } from './typography.types';

export {
  headingStyles,
  headingColorStyles,
  headingElementMap,
  textStyles,
  textColorStyles,
  textWeightStyles,
  textLeadingStyles,
  labelStyles,
} from './typography.styles';
