"use client";

import { useTranslations } from "next-intl";
import {
  IconEye,
  IconClock,
  IconAlertCircle,
  IconCalendarOff,
  IconLayoutGrid,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { Text } from "@/lib/primitives/typography";

interface AdsSummaryStats {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  rejectedAds: number;
  expiredAds: number;
}

type StatType = "total" | "active" | "pending" | "rejected" | "expired";

interface AdsSummaryProps {
  stats: AdsSummaryStats;
  loading?: boolean;
  onStatClick?: (statType: StatType) => void;
  activeStatType?: StatType;
}

/**
 * AdsSummary - Dashboard stats card for My Ads management
 *
 * Features:
 * - Shows total ads, active, pending, rejected counts
 * - Responsive grid layout (2 cols mobile, 4 cols desktop)
 * - Color-coded stats with visual hierarchy
 * - Loading skeleton state
 * - Highlights pending/rejected when count > 0
 */
export function AdsSummary({
  stats,
  loading = false,
  onStatClick,
  activeStatType,
}: AdsSummaryProps) {
  const t = useTranslations("myAccount.myAds.summary");

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200 bg-white"
          >
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-1.5"></div>
            <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      id: "total",
      icon: IconLayoutGrid,
      value: stats.totalAds,
      label: t("totalAds"),
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      id: "active",
      icon: IconEye,
      value: stats.activeAds,
      label: t("activeAds"),
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      id: "pending",
      icon: IconClock,
      value: stats.pendingAds,
      label: t("pendingAds"),
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      highlight: stats.pendingAds > 0,
    },
    {
      id: "rejected",
      icon: IconAlertCircle,
      value: stats.rejectedAds,
      label: t("rejectedAds"),
      color: "red",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      highlight: stats.rejectedAds > 0,
    },
    {
      id: "expired",
      icon: IconCalendarOff,
      value: stats.expiredAds,
      label: t("expiredAds"),
      color: "gray",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      borderColor: "border-gray-200",
      highlight: stats.expiredAds > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {statCards.map((stat) => {
        const StatIcon = stat.icon;
        const isActive = activeStatType === stat.id;
        const isClickable = !!onStatClick;

        return (
          <button
            type="button"
            key={stat.id}
            onClick={() => onStatClick?.(stat.id as StatType)}
            disabled={!isClickable}
            className={cn(
              "p-3 sm:p-4 rounded-xl border bg-white transition-all duration-200 text-left w-full",
              isClickable &&
                "cursor-pointer hover:shadow-sm hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
              !isClickable && "cursor-default",
              isActive
                ? `${stat.borderColor.replace("200", "400")} shadow-md shadow-${stat.color}-100 scale-[1.01] ring-1 ring-${stat.color}-400`
                : stat.highlight
                  ? `${stat.borderColor.replace("200", "300")} shadow-sm shadow-${stat.color}-100`
                  : stat.borderColor,
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center mb-2",
                stat.bgColor,
              )}
            >
              <StatIcon size={16} strokeWidth={2} className={stat.iconColor} />
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
              {stat.value}
            </div>

            {/* Label */}
            <Text variant="small" color="secondary" className="text-xs">
              {stat.label}
            </Text>
          </button>
        );
      })}
    </div>
  );
}
