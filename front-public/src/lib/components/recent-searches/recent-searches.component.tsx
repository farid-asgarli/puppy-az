"use client";

import { useCallback } from "react";
import { IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { RecentSearch } from "@/lib/utils/recent-searches";
import { getAdTypes } from "@/lib/utils/mappers";
import { useFilterUrl } from "@/lib/filtering/use-filter-url";
import { useTranslations } from "next-intl";

/** Remap amber/orange icon colors to modern alternatives */
function remapIconColor(color: string): string {
  if (color.includes("amber")) return color.replace("amber", "indigo");
  if (color.includes("orange")) return color.replace("orange", "teal");
  return color;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  onClearAll: () => void;
  className?: string;
  collapsed?: boolean;
}

/**
 * Recent searches component
 * Displays up to 3 recent searches as clean, minimal cards
 * Inspired by Airbnb's search history UI
 */
export function RecentSearches({
  searches,
  onClearAll,
  className,
  collapsed = false,
}: RecentSearchesProps) {
  const t = useTranslations("adsSearch.recentSearches");
  const { updateFilters } = useFilterUrl();

  const handleSearchClick = useCallback(
    (search: RecentSearch) => {
      // Apply the search filters
      updateFilters(search.filters, false);
    },
    [updateFilters],
  );

  if (searches.length === 0) {
    return null;
  }

  // In collapsed mode, show horizontal scrollable chips
  if (collapsed) {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Compact Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <IconClock size={16} className="text-gray-500" strokeWidth={2} />
            <span className="text-sm font-medium text-gray-600">
              {t("title")}
            </span>
          </div>
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("clearHistory")}
          </button>
        </div>

        {/* Horizontal scrollable chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {searches.slice(0, 5).map((search) => (
            <button
              key={search.id}
              onClick={() => handleSearchClick(search)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-3 py-1.5",
                "bg-gray-50 hover:bg-gray-100 rounded-full",
                "text-sm font-normal text-gray-600",
                "transition-colors duration-150",
              )}
            >
              {search.category && (
                <div
                  className={cn(
                    "w-4 h-4 flex justify-center items-center",
                    remapIconColor(search.category.iconColor),
                  )}
                  dangerouslySetInnerHTML={{ __html: search.category.svgIcon }}
                />
              )}
              <span className="truncate max-w-[150px]">
                {search.displayText.primary}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <IconClock size={18} className="text-gray-400" strokeWidth={1.75} />
          <h3 className="text-[15px] font-medium text-gray-500">
            {t("title")}
          </h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-normal text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t("clearHistory")}
        </button>
      </div>

      {/* Search Cards */}
      <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
        {searches.map((search) => (
          <RecentSearchCard
            key={search.id}
            search={search}
            onClick={() => handleSearchClick(search)}
          />
        ))}
      </div>
    </div>
  );
}

interface RecentSearchCardProps {
  search: RecentSearch;
  onClick: () => void;
}

function RecentSearchCard({ search, onClick }: RecentSearchCardProps) {
  const t = useTranslations("common");
  const adTypes = getAdTypes(t);
  const adTypeData = search.adType ? adTypes[search.adType] : null;

  // Build the search description from displayText
  const details: string[] = [];

  if (adTypeData) {
    details.push(adTypeData.title);
  }

  if (search.displayText.secondary) {
    details.push(search.displayText.secondary);
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-4 py-3 rounded-none",
        "hover:bg-gray-50 active:bg-gray-100",
        "transition-colors duration-150",
        "text-left group",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Category Icon */}
        {search.category && (
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
            <div
              className={cn(
                "w-5 h-5 flex justify-center items-center",
                remapIconColor(search.category.iconColor),
              )}
              dangerouslySetInnerHTML={{ __html: search.category.svgIcon }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 mb-0.5 truncate">
            {search.displayText.primary}
          </p>
          {details.length > 0 && (
            <p className="text-xs text-gray-400 truncate">
              {details.join(" • ")}
            </p>
          )}
        </div>

        {/* Chevron Icon - shows on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gray-400"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
