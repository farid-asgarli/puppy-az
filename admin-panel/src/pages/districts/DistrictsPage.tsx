import { useState, useMemo, useCallback } from "react";
import { Typography, Button, Space, Input, Tag, Select } from "antd";
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
import {
  useDistricts,
  useDeleteDistrict,
  DistrictModal,
} from "@/features/districts";
import { useAllCities } from "@/features/cities";
import type { District } from "@/shared/api/types";
import { usePagination } from "@/shared/hooks/useCrud";

const { Title } = Typography;

export default function DistrictsPage() {
  const { t, i18n } = useTranslation();
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<number | undefined>(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState<District | null>(
    null,
  );

  // Queries
  const districtsQuery = useDistricts({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    cityId: cityFilter,
  });

  const { data: cities = [] } = useAllCities();
  const deleteMutation = useDeleteDistrict();

  // Delete confirmation
  const deleteConfirm = useConfirm({
    onConfirm: async () => {
      if (districtToDelete) {
        await deleteMutation.mutateAsync(districtToDelete.id);
        setDistrictToDelete(null);
      }
    },
    onCancel: () => setDistrictToDelete(null),
  });

  // Handlers
  const handleCreate = useCallback(() => {
    setSelectedDistrict(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((district: District) => {
    setSelectedDistrict(district);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (district: District) => {
      setDistrictToDelete(district);
      deleteConfirm.open();
    },
    [deleteConfirm],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDistrict(null);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      pagination.reset();
    },
    [pagination],
  );

  const handleCityFilter = useCallback(
    (value: number | undefined) => {
      setCityFilter(value);
      pagination.reset();
    },
    [pagination],
  );

  // Get district name based on current language
  const getDistrictName = useCallback(
    (district: District) => {
      const key =
        `name${i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)}` as keyof District;
      return (district[key] as string) || district.nameEn;
    },
    [i18n.language],
  );

  // Get city name for a district
  const getCityName = useCallback(
    (district: District) => {
      const city = cities.find((c) => c.id === district.cityId);
      if (!city) return district.cityNameAz || "-";
      const key =
        `name${i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1)}` as keyof typeof city;
      return (city[key] as string) || city.nameEn;
    },
    [i18n.language, cities],
  );

  // Table columns
  const columns: ColumnsType<District> = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 60,
        render: (_, __, index) =>
          (pagination.page - 1) * pagination.pageSize + index + 1,
      },
      {
        title: t("districts.table.name"),
        key: "name",
        render: (_, district) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {getDistrictName(district)}
          </span>
        ),
      },
      {
        title: `${t("districts.table.name")} (AZ)`,
        dataIndex: "nameAz",
        key: "nameAz",
        responsive: ["lg"],
      },
      {
        title: `${t("districts.table.name")} (EN)`,
        dataIndex: "nameEn",
        key: "nameEn",
        responsive: ["lg"],
      },
      {
        title: `${t("districts.table.name")} (RU)`,
        dataIndex: "nameRu",
        key: "nameRu",
        responsive: ["lg"],
      },
      {
        title: t("districts.table.city"),
        key: "city",
        width: 160,
        render: (_, district) => (
          <Tag color="blue">{getCityName(district)}</Tag>
        ),
      },
      {
        title: t("districts.table.displayOrder"),
        dataIndex: "displayOrder",
        key: "displayOrder",
        width: 100,
        responsive: ["md"],
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
        render: (_, district) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(district);
              }}
              className="text-primary-500 hover:text-primary-600"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(district);
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
      getDistrictName,
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
          {t("districts.pageTitle")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t("common.create")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="max-w-md flex-1">
          <Input
            placeholder={t("common.search")}
            prefix={<SearchOutlined className="text-gray-400" />}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>
        <Select
          placeholder={t("districts.filter.allCities")}
          value={cityFilter}
          onChange={handleCityFilter}
          allowClear
          showSearch
          optionFilterProp="label"
          className="min-w-[200px]"
          options={cities.map((city) => ({
            value: city.id,
            label: `${city.nameAz} / ${city.nameEn}`,
          }))}
        />
      </div>

      {/* Table */}
      <DataTable<District>
        columns={columns}
        data={districtsQuery.data?.items || []}
        loading={districtsQuery.isLoading}
        error={districtsQuery.error as Error | null}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: districtsQuery.data?.totalCount || 0,
          onChange: pagination.onChange,
        }}
        searchable={false}
        onRefresh={() => districtsQuery.refetch()}
        scroll={{ x: 1000 }}
      />

      {/* District Modal */}
      <DistrictModal
        open={isModalOpen}
        district={selectedDistrict}
        onClose={handleModalClose}
        defaultCityId={cityFilter}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!districtToDelete}
        title={t("confirm.delete.title")}
        message={t("districts.deleteConfirm")}
        loading={deleteMutation.isPending}
        onConfirm={deleteConfirm.confirm}
        onCancel={() => setDistrictToDelete(null)}
      />
    </div>
  );
}
