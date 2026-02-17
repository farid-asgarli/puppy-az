import { useState, useMemo, useCallback } from "react";
import { Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { DataTable } from "@/shared/components/DataTable";
import { MembershipBadge } from "@/shared/components/StatusBadge";
import {
  useListings,
  useListingStats,
  ListingDetailsModal,
  ListingsFilters,
  ListingsStats,
} from "@/features/listings";
import type { Listing, ListingSearchRequest } from "@/shared/api/types";
import { ListingType, ListingStatus } from "@/shared/api/types";
import { usePagination } from "@/shared/hooks/useCrud";

const { Title } = Typography;

const DEFAULT_FILTERS: ListingSearchRequest = {
  page: 1,
  pageSize: 10,
};

export default function ListingsPage() {
  const { t } = useTranslation();
  const pagination = usePagination(10);
  const [filters, setFilters] = useState<ListingSearchRequest>(DEFAULT_FILTERS);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries
  const listingsQuery = useListings({
    ...filters,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const statsQuery = useListingStats();

  // Handlers
  const handleFiltersChange = useCallback(
    (newFilters: ListingSearchRequest) => {
      setFilters(newFilters);
      pagination.reset();
    },
    [pagination],
  );

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    pagination.reset();
  }, [pagination]);

  const handleStatusClick = useCallback(
    (status: ListingStatus | undefined) => {
      setFilters((prev) => ({
        ...prev,
        status,
        page: 1,
      }));
      pagination.reset();
    },
    [pagination],
  );

  const handleRowClick = useCallback((listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedListing(null);
  }, []);

  // Table columns
  const columns: ColumnsType<Listing> = useMemo(
    () => [
      {
        title: t("listings.table.title"),
        dataIndex: "title",
        key: "title",
        width: 200,
        ellipsis: true,
        render: (title: string, record: Listing) => (
          <div className="flex items-center gap-2">
            {record.primaryImageUrl && (
              <img
                src={record.primaryImageUrl}
                alt={title}
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <span className="font-medium text-gray-900 dark:text-white">
              {title}
            </span>
          </div>
        ),
      },
      {
        title: t("listings.table.listingType"),
        dataIndex: "adType",
        key: "adType",
        width: 100,
        render: (type: ListingType) => {
          const labels: Record<ListingType, string> = {
            [ListingType.Sale]: "Sale",
            [ListingType.Match]: "Match",
            [ListingType.Found]: "Found",
            [ListingType.Lost]: "Lost",
            [ListingType.Owning]: "Owning",
          };
          return labels[type] || "-";
        },
      },
      {
        title: t("listings.table.category"),
        dataIndex: "categoryTitle",
        key: "category",
        width: 120,
        render: (title: string) => title || "-",
      },
      {
        title: t("listings.table.breed"),
        dataIndex: "breedTitle",
        key: "breed",
        width: 120,
        render: (title: string) => title || "-",
      },
      {
        title: t("listings.table.city"),
        dataIndex: "cityName",
        key: "city",
        width: 120,
        render: (_: string, record: Listing) => {
          const city = record.cityName || "-";
          const district = record.districtName || record.customDistrictName;
          return district ? `${city} / ${district}` : city;
        },
      },
      {
        title: t("listings.table.price"),
        dataIndex: "price",
        key: "price",
        width: 100,
        render: (price: number | null | undefined) =>
          `${(price ?? 0).toLocaleString()} AZN`,
      },
      {
        title: t("listings.table.membership"),
        dataIndex: "isPremium",
        key: "membership",
        width: 100,
        render: (isPremium: boolean) => (
          <MembershipBadge
            type={isPremium ? "premium" : "standard"}
            size="small"
          />
        ),
      },
      {
        title: t("common.createdAt"),
        dataIndex: "publishedAt",
        key: "publishedAt",
        width: 140,
        render: (date: string) =>
          date ? dayjs(date).format("DD MMM YYYY") : "-",
      },
      {
        title: t("listings.table.expiresAt"),
        dataIndex: "expiresAt",
        key: "expiresAt",
        width: 160,
        render: (date: string) => {
          if (!date) return "-";
          const expiresAt = dayjs(date);
          const now = dayjs();
          const daysLeft = expiresAt.diff(now, "day");

          if (daysLeft < 0) {
            return (
              <span className="text-red-600 font-medium">
                {t("listings.expired")}
              </span>
            );
          }

          if (daysLeft <= 7) {
            return (
              <span className="text-orange-600 font-medium">
                {daysLeft} {t("listings.daysLeft")}
              </span>
            );
          }

          return (
            <span className="text-gray-600">
              {daysLeft} {t("listings.daysLeft")}
            </span>
          );
        },
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">
            {t("listings.pageTitle")}
          </Title>
          <ListingsStats
            stats={statsQuery.data}
            loading={statsQuery.isLoading}
            selectedStatus={filters.status}
            onStatusClick={handleStatusClick}
          />
        </div>
      </div>

      {/* Filters */}
      <ListingsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      {/* Table */}
      <DataTable<Listing>
        columns={columns}
        data={listingsQuery.data?.items || []}
        loading={listingsQuery.isLoading}
        error={listingsQuery.error as Error | null}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: listingsQuery.data?.totalCount || 0,
          onChange: pagination.onChange,
        }}
        searchable={false}
        onRefresh={() => listingsQuery.refetch()}
        onRowClick={handleRowClick}
        scroll={{ x: 1200 }}
      />

      {/* Details Modal */}
      <ListingDetailsModal
        open={isModalOpen}
        listing={selectedListing}
        onClose={handleModalClose}
      />
    </div>
  );
}
