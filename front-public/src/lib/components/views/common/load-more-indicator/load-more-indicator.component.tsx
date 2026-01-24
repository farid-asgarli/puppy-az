"use client";

import { cn } from "@/lib/external/utils";
import { Spinner } from "@/lib/primitives/spinner";
import { Text } from "@/lib/primitives/typography";
import { useTranslations } from "next-intl";
import type { LoadMoreIndicatorProps } from "./load-more-indicator.types";

/**
 * Load More Indicator Component
 * Displays loading state or completion message for infinite scroll
 * Shows at the bottom of paginated content lists
 */
export const LoadMoreIndicator: React.FC<LoadMoreIndicatorProps> = ({
  isLoading,
  hasMore,
  loadedCount,
  loadingText,
  completedText,
  className,
}) => {
  const t = useTranslations("common");
  const loading = loadingText ?? t("loading");
  const completed = completedText ?? t("allDataLoaded");

  // Don't render anything if we're done and not loading
  if (!isLoading && !hasMore) {
    return (
      <div
        className={cn("flex justify-center", className)}
        role="status"
        aria-live="polite"
      >
        <Text variant="small" color="tertiary" weight="medium" as="p">
          {completed}
        </Text>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn("flex justify-center", className)}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex items-center gap-3 text-gray-600">
          <Spinner size="sm" color="gray" />
          <Text variant="small" weight="medium" as="span">
            {loading}
          </Text>
        </div>
      </div>
    );
  }

  // Don't render if there's more but not loading (waiting for scroll)
  return null;
};

export default LoadMoreIndicator;
