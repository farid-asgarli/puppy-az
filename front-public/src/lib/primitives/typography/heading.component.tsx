import { cn } from '@/lib/external/utils';
import { HeadingProps } from './typography.types';
import { headingStyles, headingColorStyles, headingElementMap } from './typography.styles';

/**
 * Heading Component
 *
 * Centralized heading component following the design system.
 * Based on typography patterns from About, Premium, Settings, and Ad-Placement views.
 *
 * @example
 * ```tsx
 * <Heading variant="page-title">Haqqımızda</Heading>
 * <Heading variant="section">Tətbiq tənzimləmələri</Heading>
 * <Heading variant="subsection" as="h3">Görünüş</Heading>
 * ```
 */
export function Heading({ variant = 'page-title', as, color = 'primary', children, className }: HeadingProps) {
  // Determine semantic element (use explicit 'as' or default from variant)
  const Element = as || headingElementMap[variant];

  return <Element className={cn(headingStyles[variant], headingColorStyles[color], className)}>{children}</Element>;
}

export default Heading;
