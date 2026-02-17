import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import { ListingStatus } from "@/shared/api/types";

interface StatusBadgeProps {
  status: ListingStatus;
  size?: "small" | "default";
}

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const { t } = useTranslation();

  const statusConfig: Record<
    ListingStatus,
    { color: string; bgColor: string; textColor: string; label: string }
  > = {
    [ListingStatus.Pending]: {
      color: "orange",
      bgColor: "bg-warning-100 dark:bg-warning-900/30",
      textColor: "text-warning-700 dark:text-warning-400",
      label: t("listings.status.pending"),
    },
    [ListingStatus.Published]: {
      color: "green",
      bgColor: "bg-success-100 dark:bg-success-900/30",
      textColor: "text-success-700 dark:text-success-400",
      label: t("listings.status.active"),
    },
    [ListingStatus.Rejected]: {
      color: "red",
      bgColor: "bg-error-100 dark:bg-error-900/30",
      textColor: "text-error-700 dark:text-error-400",
      label: t("listings.status.rejected"),
    },
    [ListingStatus.Expired]: {
      color: "default",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-700 dark:text-gray-400",
      label: t("listings.status.expired"),
    },
    [ListingStatus.Closed]: {
      color: "default",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-600 dark:text-gray-500",
      label: t("listings.status.closed"),
    },
    [ListingStatus.Draft]: {
      color: "default",
      bgColor: "bg-gray-100 dark:bg-gray-800",
      textColor: "text-gray-500 dark:text-gray-500",
      label: t("listings.status.draft"),
    },
  };

  const config = statusConfig[status];

  return (
    <Tag
      color={config.color}
      className={`${size === "small" ? "text-xs px-2 py-0" : "text-sm px-3 py-1"} rounded-full font-medium border-0`}
    >
      {config.label}
    </Tag>
  );
}

// Membership badge
type MembershipType = "standard" | "premium" | "vip";

interface MembershipBadgeProps {
  type: MembershipType;
  size?: "small" | "default";
}

export function MembershipBadge({
  type,
  size = "default",
}: MembershipBadgeProps) {
  const { t } = useTranslation();

  const membershipConfig: Record<
    MembershipType,
    { color: string; label: string }
  > = {
    standard: {
      color: "default",
      label: t("listings.membership.standard"),
    },
    premium: {
      color: "gold",
      label: t("listings.membership.premium"),
    },
    vip: {
      color: "purple",
      label: t("listings.membership.vip"),
    },
  };

  const config = membershipConfig[type];

  return (
    <Tag
      color={config.color}
      className={`${size === "small" ? "text-xs" : "text-sm"} rounded-full font-medium`}
    >
      {config.label}
    </Tag>
  );
}

// Language badge
import type { Locale } from "@/app/i18n";

interface LanguageBadgeProps {
  language: Locale;
}

export function LanguageBadge({ language }: LanguageBadgeProps) {
  const colorMap: Record<Locale, string> = {
    az: "blue",
    en: "green",
    ru: "red",
  };

  return (
    <Tag color={colorMap[language]} className="uppercase font-medium">
      {language}
    </Tag>
  );
}
