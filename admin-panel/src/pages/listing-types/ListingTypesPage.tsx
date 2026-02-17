import { useState, useMemo, useCallback } from "react";
import { Typography, Button, Space, Input, Tag, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/shared/components/DataTable";
import { ConfirmDialog, useConfirm } from "@/shared/components/ConfirmDialog";
import {
  useListingTypes,
  useToggleListingTypeStatus,
  ListingTypeModal,
} from "@/features/listing-types";
import type { PetAdTypeListItem } from "@/shared/api/types";
import { usePagination } from "@/shared/hooks/useCrud";

const { Title } = Typography;

// Helper to get localized title based on current language
function getLocalizedTitle(item: PetAdTypeListItem, lang: string): string {
  if (lang === "az") return item.titleAz || item.titleEn || item.key;
  if (lang === "ru") return item.titleRu || item.titleEn || item.key;
  return item.titleEn || item.titleAz || item.key;
}

function getLocalizedDescription(
  item: PetAdTypeListItem,
  lang: string,
): string | undefined {
  if (lang === "az") return item.descriptionAz || item.descriptionEn;
  if (lang === "ru") return item.descriptionRu || item.descriptionEn;
  return item.descriptionEn || item.descriptionAz;
}

export default function ListingTypesPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<PetAdTypeListItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeToToggle, setTypeToToggle] = useState<PetAdTypeListItem | null>(
    null,
  );

  // Queries
  const listingTypesQuery = useListingTypes();
  const toggleMutation = useToggleListingTypeStatus();

  // Filter data based on search
  const filteredData = useMemo(() => {
    const rawData = listingTypesQuery.data;
    // Ensure data is always an array
    const data = Array.isArray(rawData) ? rawData : [];
    if (!search.trim()) return data;
    const searchLower = search.toLowerCase();
    return data.filter(
      (item) =>
        item.key.toLowerCase().includes(searchLower) ||
        item.titleAz.toLowerCase().includes(searchLower) ||
        item.titleEn.toLowerCase().includes(searchLower) ||
        item.titleRu.toLowerCase().includes(searchLower) ||
        (item.descriptionAz &&
          item.descriptionAz.toLowerCase().includes(searchLower)) ||
        (item.descriptionEn &&
          item.descriptionEn.toLowerCase().includes(searchLower)) ||
        (item.descriptionRu &&
          item.descriptionRu.toLowerCase().includes(searchLower)),
    );
  }, [listingTypesQuery.data, search]);

  // Toggle confirmation
  const toggleConfirm = useConfirm({
    onConfirm: async () => {
      if (typeToToggle) {
        // Toggle isActive status
        await toggleMutation.mutateAsync({
          id: typeToToggle.id,
          data: {
            id: typeToToggle.id,
            key: typeToToggle.key,
            emoji: typeToToggle.emoji || "",
            backgroundColor: typeToToggle.backgroundColor || "",
            textColor: typeToToggle.textColor || "",
            borderColor: typeToToggle.borderColor || "",
            sortOrder: typeToToggle.sortOrder,
            isActive: !typeToToggle.isActive,
            titleAz: typeToToggle.titleAz,
            titleEn: typeToToggle.titleEn,
            titleRu: typeToToggle.titleRu,
            descriptionAz: typeToToggle.descriptionAz,
            descriptionEn: typeToToggle.descriptionEn,
            descriptionRu: typeToToggle.descriptionRu,
          },
        });
        setTypeToToggle(null);
      }
    },
    onCancel: () => setTypeToToggle(null),
  });

  // Handlers
  const handleCreate = useCallback(() => {
    setSelectedType(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((type: PetAdTypeListItem) => {
    setSelectedType(type);
    setIsModalOpen(true);
  }, []);

  const handleToggleStatus = useCallback(
    (type: PetAdTypeListItem) => {
      setTypeToToggle(type);
      toggleConfirm.open();
    },
    [toggleConfirm],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedType(null);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      pagination.reset();
    },
    [pagination],
  );

  // Table columns
  const columns: ColumnsType<PetAdTypeListItem> = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 60,
        render: (_, __, index) =>
          (pagination.page - 1) * pagination.pageSize + index + 1,
      },
      {
        title: t("listingTypes.table.icon"),
        dataIndex: "emoji",
        key: "emoji",
        width: 80,
        render: (emoji: string) => (
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-2xl">{emoji || "📋"}</span>
          </div>
        ),
      },
      {
        title: t("listingTypes.table.name"),
        key: "name",
        render: (_, item) => {
          const title = getLocalizedTitle(item, currentLang);
          const description = getLocalizedDescription(item, currentLang);
          return (
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                {title}
              </span>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          );
        },
      },
      {
        title: t("listingTypes.table.key", "Açar"),
        dataIndex: "key",
        key: "key",
        width: 120,
        responsive: ["md"],
      },
      {
        title: t("listingTypes.table.sortOrder", "Sıra"),
        dataIndex: "sortOrder",
        key: "sortOrder",
        width: 80,
        responsive: ["lg"],
      },
      {
        title: t("common.status"),
        dataIndex: "isActive",
        key: "isActive",
        width: 100,
        render: (isActive: boolean) => (
          <Tag color={isActive ? "green" : "default"}>
            {isActive
              ? t("common.active", "Aktiv")
              : t("common.inactive", "Deaktiv")}
          </Tag>
        ),
      },
      {
        title: t("common.actions"),
        key: "actions",
        width: 120,
        fixed: "right",
        render: (_, item) => (
          <Space>
            <Tooltip title={t("common.edit", "Redaktə et")}>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(item);
                }}
                className="text-primary-500 hover:text-primary-600"
              />
            </Tooltip>
            <Tooltip
              title={
                item.isActive
                  ? t("common.deactivate", "Deaktiv et")
                  : t("common.activate", "Aktivləşdir")
              }
            >
              <Button
                type="text"
                danger={item.isActive}
                icon={
                  item.isActive ? <StopOutlined /> : <CheckCircleOutlined />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(item);
                }}
                className={
                  item.isActive ? "" : "text-green-500 hover:text-green-600"
                }
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [
      t,
      currentLang,
      pagination.page,
      pagination.pageSize,
      handleEdit,
      handleToggleStatus,
    ],
  );

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.page, pagination.pageSize]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Title level={2} className="!mb-0">
          {t("listingTypes.pageTitle")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t("common.create")}
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder={t("common.search")}
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
      </div>

      {/* Table */}
      <DataTable<PetAdTypeListItem>
        columns={columns}
        data={paginatedData}
        loading={listingTypesQuery.isLoading}
        error={listingTypesQuery.error as Error | null}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: filteredData.length,
          onChange: pagination.onChange,
        }}
        searchable={false}
        onRefresh={() => listingTypesQuery.refetch()}
        scroll={{ x: 800 }}
      />

      {/* Listing Type Modal */}
      <ListingTypeModal
        open={isModalOpen}
        listingType={selectedType}
        onClose={handleModalClose}
      />

      {/* Toggle Status Confirmation */}
      <ConfirmDialog
        open={!!typeToToggle}
        title={
          typeToToggle?.isActive
            ? t("listingTypes.deactivateTitle", "Deaktiv et")
            : t("listingTypes.activateTitle", "Aktivləşdir")
        }
        message={
          typeToToggle?.isActive
            ? t(
                "listingTypes.deactivateConfirm",
                "Bu elan növünü deaktiv etmək istədiyinizə əminsiniz?",
              )
            : t(
                "listingTypes.activateConfirm",
                "Bu elan növünü aktivləşdirmək istədiyinizə əminsiniz?",
              )
        }
        loading={toggleMutation.isPending}
        onConfirm={toggleConfirm.confirm}
        onCancel={() => setTypeToToggle(null)}
      />
    </div>
  );
}
