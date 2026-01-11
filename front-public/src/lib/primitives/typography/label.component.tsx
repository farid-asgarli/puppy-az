import { cn } from '@/lib/external/utils';
import { LabelProps } from './typography.types';
import { labelStyles } from './typography.styles';

/**
 * Label Component
 *
 * Specialized component for form labels, metadata, display values, and badges.
 * Based on typography patterns from About, Premium, Settings, and Ad-Placement views.
 *
 * @example
 * ```tsx
 * <Label variant="field" htmlFor="email">Email ünvanı</Label>
 * <Label variant="value">₼ 299.99</Label>
 * <Label variant="meta">Qeydiyyat tarixi</Label>
 * <Label variant="badge">Premium</Label>
 * ```
 */
export function Label({ variant = 'field', as: Element = 'label', htmlFor, children, className }: LabelProps) {
  return (
    <Element htmlFor={htmlFor} className={cn(labelStyles[variant], className)}>
      {children}
    </Element>
  );
}

export default Label;
