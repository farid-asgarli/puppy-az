import { cn } from "@/lib/external/utils";
import { TextProps } from "./typography.types";
import {
  textStyles,
  textColorStyles,
  textWeightStyles,
  textLeadingStyles,
} from "./typography.styles";

/**
 * Text Component
 *
 * Centralized text component for body copy, descriptions, and general text.
 * Based on typography patterns from About, Premium, Settings, and Ad-Placement views.
 *
 * @example
 * ```tsx
 * <Text variant="body-lg" color="secondary">
 *   Tətbiq və məxfilik tənzimləmələri
 * </Text>
 * <Text variant="body-xl" leading="relaxed">
 *   İdeal heyvanı tapmaq üçün filtirlərdən istifadə edin
 * </Text>
 * <Text variant="small" color="tertiary">
 *   Saxlanmış elanlar 5 gün saxlanılır
 * </Text>
 * ```
 */
export function Text({
  variant = "body",
  as: Element = "p",
  color = "secondary",
  weight = "normal",
  leading = "normal",
  children,
  className,
}: TextProps) {
  return (
    <Element
      className={cn(
        textStyles[variant],
        textColorStyles[color],
        textWeightStyles[weight],
        textLeadingStyles[leading],
        className,
      )}
    >
      {children}
    </Element>
  );
}

export default Text;
