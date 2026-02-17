import { useState, useMemo, useCallback } from "react";
import { Typography, Button, Space, Input, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { DataTable } from "@/shared/components/DataTable";
import { ConfirmDialog, useConfirm } from "@/shared/components/ConfirmDialog";
import { useCities, useDeleteCity, CityModal } from "@/features/cities";
import type { City } from "@/shared/api/types";
import { usePagination } from "@/shared/hooks/useCrud";

const { Title } = Typography;

export default function CitiesPage() {
  const { t, i18n } = useTranslation();
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);

  // Queries
  const citiesQuery = useCities({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
  });

  const deleteMutation = useDeleteCity();

  // Delete confirmation
  const deleteConfirm = useConfirm({
    onConfirm: async () => {
      if (cityToDelete) {
        await deleteMutation.mutateAsync(cityToDelete.id);
        setCityToDelete(null);
      }
    },
    onCancel: () => setCityToDelete(null),
  });

  // Handlers
  const handleCreate = useCallback(() => {
    setSelectedCity(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((city: City) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (city: City) => {
      setCityToDelete(city);
      deleteConfirm.open();
    },
    [deleteConfirm],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCity(null);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      pagination.reset();
    },
    [pagination],
  );

  // Get city name based on current language
  const getCityName = useCallback(
    (city: City) => {
      const key =
        `name${i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)}` as keyof City;
      return (city[key] as string) || city.nameEn;
    },
    [i18n.language],
  );

  // Table columns
  const columns: ColumnsType<City> = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 60,
        render: (_, __, index) =>
          (pagination.page - 1) * pagination.pageSize + index + 1,
      },
      {
        title: t("cities.table.name"),
        key: "name",
        render: (_, city) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {getCityName(city)}
          </span>
        ),
      },
      {
        title: `${t("cities.table.name")} (AZ)`,
        dataIndex: "nameAz",
        key: "nameAz",
        responsive: ["lg"],
      },
      {
        title: `${t("cities.table.name")} (EN)`,
        dataIndex: "nameEn",
        key: "nameEn",
        responsive: ["lg"],
      },
      {
        title: `${t("cities.table.name")} (RU)`,
        dataIndex: "nameRu",
        key: "nameRu",
        responsive: ["lg"],
      },
      {
        title: t("common.status"),
        dataIndex: "isActive",
        key: "isActive",
        width: 100,
        render: (isActive: boolean) => (
          <Tag color={isActive ? "green" : "default"}>
            {isActive ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: t("common.createdAt"),
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
        responsive: ["md"],
        render: (date: string) =>
          date ? dayjs(date).format("DD MMM YYYY") : "-",
      },
      {
        title: t("common.actions"),
        key: "actions",
        width: 120,
        fixed: "right",
        render: (_, city) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(city);
              }}
              className="text-primary-500 hover:text-primary-600"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(city);
              }}
            />
          </Space>
        ),
      },
    ],
    [
      t,
      pagination.page,
      pagination.pageSize,
      getCityName,
      handleEdit,
      handleDelete,
    ],
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Title level={2} className="!mb-0">
          {t("cities.pageTitle")}
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
      <DataTable<City>
        columns={columns}
        data={citiesQuery.data?.items || []}
        loading={citiesQuery.isLoading}
        error={citiesQuery.error as Error | null}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: citiesQuery.data?.totalCount || 0,
          onChange: pagination.onChange,
        }}
        searchable={false}
        onRefresh={() => citiesQuery.refetch()}
        scroll={{ x: 800 }}
      />

      {/* City Modal */}
      <CityModal
        open={isModalOpen}
        city={selectedCity}
        onClose={handleModalClose}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!cityToDelete}
        title={t("confirm.delete.title")}
        message={t("cities.deleteConfirm")}
        loading={deleteMutation.isPending}
        onConfirm={deleteConfirm.confirm}
        onCancel={() => setCityToDelete(null)}
      />
    </div>
  );
}
