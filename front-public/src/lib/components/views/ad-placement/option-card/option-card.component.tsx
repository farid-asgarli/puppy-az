"use client";

import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import type { OptionCardProps } from "./option-card.types";

/**
 * OptionCard - Reusable selection card component
 *
 * Used throughout ad-placement flow for selecting options like:
 * - Ad types
 * - Categories
 * - Gender/Size
 * - Colors
 * - Breeds/Cities
 *
 * Features:
 * - Radio-style selection indicator
 * - Icon support (emoji or SVG)
 * - Hover states and transitions
 * - Responsive sizing
 * - Flexible layout (horizontal/vertical)
 * - Accessibility: keyboard navigation, ARIA labels
 *
 * @example
 * <OptionCard
 *   selected={selectedType === PetAdType.Sale}
 *   onClick={() => handleSelect(PetAdType.Sale)}
 *   icon="💰"
 *   title="For Sale"
 *   description="I want to sell my pet"
 * />
 */
export function OptionCard({
  selected,
  onClick,
  title,
  description,
  icon,
  showCheckmark = true,
  size = "md",
  layout = "horizontal",
  className,
  disabled = false,
  metadata,
  inlineDescription = false,
  children,
  checkmarkBgColor,
  checkmarkBorderColor,
}: OptionCardProps) {
  // Size-based padding classes
  const sizeClasses = {
    sm: "p-3 sm:p-3.5",
    md: "p-3.5 sm:p-4",
    lg: "p-4 sm:p-5",
  };

  // Layout classes
  const layoutClasses = {
    horizontal: "flex-row items-center gap-3",
    vertical: "flex-col items-start gap-2",
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: "text-2xl w-8 h-8",
    md: "text-2xl sm:text-3xl w-9 h-9 sm:w-10 sm:h-10",
    lg: "text-3xl sm:text-4xl w-10 h-10 sm:w-12 sm:h-12",
  };

  // Title size classes
  const titleSizeClasses = {
    sm: "text-sm font-semibold",
    md: "text-base sm:text-lg font-semibold",
    lg: "text-lg sm:text-xl",
  };

  // Description size classes
  const descriptionSizeClasses = {
    sm: "text-xs text-gray-500",
    md: "text-sm text-gray-500",
    lg: "text-sm sm:text-base",
  };

  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a string (emoji), render it directly
    if (typeof icon === "string") {
      return (
        <div className={cn("flex-shrink-0", iconSizeClasses[size])}>{icon}</div>
      );
    }

    // Otherwise, it's a ReactNode (SVG or component)
    return <div className="flex-shrink-0">{icon}</div>;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full border-2 rounded-xl transition-all duration-200",
        "flex text-left",
        sizeClasses[size],
        layoutClasses[layout],
        "hover:border-gray-400 hover:shadow-md",
        selected
          ? "border-black bg-gray-50 shadow-lg"
          : "border-gray-200 bg-white",
        disabled &&
          "opacity-50 cursor-not-allowed hover:border-gray-200 hover:shadow-none",
        className,
      )}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {/* Icon */}
      {renderIcon()}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {children ? (
          children
        ) : inlineDescription ? (
          <div className="flex items-baseline gap-4 flex-wrap">
            <Heading variant="card" as="h3" className={titleSizeClasses[size]}>
              {title}
            </Heading>
            {description && (
              <Text
                variant="body"
                className={descriptionSizeClasses[size]}
                as="span"
              >
                {description}
              </Text>
            )}
          </div>
        ) : (
          <>
            <Heading variant="card" as="h3" className={titleSizeClasses[size]}>
              {title}
            </Heading>
            {description && (
              <Text
                variant="body"
                className={cn("mt-0.5 sm:mt-1", descriptionSizeClasses[size])}
                as="p"
              >
                {description}
              </Text>
            )}
            {metadata && (
              <Text
                variant="small"
                color="tertiary"
                className={cn("mt-1 sm:mt-1.5", "text-xs sm:text-sm")}
                as="p"
              >
                {metadata}
              </Text>
            )}
          </>
        )}
      </div>

      {/* Selection Indicator */}
      {showCheckmark && (
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 transition-colors flex-shrink-0",
            selected
              ? checkmarkBgColor || checkmarkBorderColor
                ? [
                    checkmarkBgColor || "bg-black",
                    checkmarkBorderColor || "border-black",
                  ]
                : "border-black bg-black"
              : "border-gray-300 bg-white",
          )}
          aria-hidden="true"
        >
          {selected && (
            <svg
              className="w-full h-full text-white p-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      )}
    </button>
  );
}
