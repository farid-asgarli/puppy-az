import { Space, Tag } from "antd";
import { useTranslation } from "react-i18next";
import type { ListingStats } from "@/shared/api/types";
import { ListingStatus } from "@/shared/api/types";

interface ListingsStatsProps {
  stats: ListingStats | undefined;
  loading?: boolean;
  selectedStatus?: ListingStatus;
  onStatusClick?: (status: ListingStatus | undefined) => void;
}

export function ListingsStats({
  stats,
  loading,
  selectedStatus,
  onStatusClick,
}: ListingsStatsProps) {
  const { t } = useTranslation();

  if (loading || !stats) {
    return (
      <Space wrap className="mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          />
        ))}
      </Space>
    );
  }

  const statItems = [
    {
      status: ListingStatus.Published,
      color: "green",
      label: t("listings.stats.active"),
      count: stats.active,
    },
    {
      status: ListingStatus.Pending,
      color: "orange",
      label: t("listings.stats.pending"),
      count: stats.pending,
    },
    {
      status: ListingStatus.Rejected,
      color: "red",
      label: t("listings.stats.rejected"),
      count: stats.rejected,
    },
    {
      status: ListingStatus.Expired,
      color: "default",
      label: t("listings.stats.expired"),
      count: stats.expired,
    },
  ];

  return (
    <Space wrap className="mb-4">
      {statItems.map((item) => (
        <Tag
          key={item.status}
          color={item.color}
          className={`px-4 py-1 text-sm font-medium rounded-full cursor-pointer transition-all ${
            selectedStatus === item.status
              ? "ring-2 ring-offset-2 ring-blue-500"
              : "hover:opacity-80"
          }`}
          onClick={() =>
            onStatusClick?.(
              selectedStatus === item.status ? undefined : item.status,
            )
          }
        >
          {item.label}: {item.count}
        </Tag>
      ))}
    </Space>
  );
}
