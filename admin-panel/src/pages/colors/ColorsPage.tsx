import { useState, useMemo, useCallback } from "react";
import { Typography, Button, Input, Space, Tag, Popconfirm } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/shared/components/DataTable";
import type { PetColor } from "@/shared/api/types";
import { usePagination } from "@/shared/hooks/useCrud";
import { useColors, useDeleteColor, ColorModal } from "@/features/colors";

const { Title } = Typography;

export default function ColorsPage() {
  const { t } = useTranslation();
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<PetColor | null>(null);

  // Fetch colors from API
  const { data: colors = [], isLoading, error } = useColors();
  const deleteMutation = useDeleteColor();

  // API returns localized title based on Accept-Language header
  const getColorName = useCallback(
    (color: PetColor) => color.title || color.key,
    [],
  );

  // Filter colors by search
  const filteredColors = useMemo(() => {
    if (!search) return colors;
    const searchLower = search.toLowerCase();
    return colors.filter(
      (color: PetColor) =>
        color.title?.toLowerCase().includes(searchLower) ||
        color.key?.toLowerCase().includes(searchLower),
    );
  }, [colors, search]);

  const columns: ColumnsType<PetColor> = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      {
        title: t("colors.table.preview"),
        key: "preview",
        width: 120,
        render: (_, color) => (
          <div
            className="px-3 py-1 rounded-full inline-block text-sm font-medium"
            style={{
              backgroundColor: color.backgroundColor,
              color: color.textColor,
              border: `2px solid ${color.borderColor}`,
            }}
          >
            {getColorName(color)}
          </div>
        ),
      },
      {
        title: t("colors.table.name"),
        key: "name",
        render: (_, color) => getColorName(color),
      },
      {
        title: t("colors.form.backgroundColor"),
        dataIndex: "backgroundColor",
        key: "backgroundColor",
        width: 150,
        render: (color: string) => (
          <Space>
            <div
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-sm">{color}</span>
          </Space>
        ),
      },
      {
        title: t("common.status"),
        dataIndex: "isActive",
        key: "isActive",
        width: 100,
        render: (isActive: boolean) => (
          <Tag color={isActive !== false ? "green" : "default"}>
            {isActive !== false ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: t("common.actions"),
        key: "actions",
        width: 120,
        render: (_, color) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-primary-500"
              onClick={() => {
                setSelectedColor(color);
                setModalOpen(true);
              }}
            />
            <Popconfirm
              title={t("colors.deleteConfirm", "Rəngi silmək istəyirsiniz?")}
              onConfirm={() => deleteMutation.mutate(color.id)}
              okText={t("common.yes", "Bəli")}
              cancelText={t("common.no", "Xeyr")}
              icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={deleteMutation.isPending}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [t, getColorName],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Title level={2} className="!mb-0">
          {t("colors.pageTitle")}
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedColor(null);
            setModalOpen(true);
          }}
        >
          {t("common.create")}
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder={t("common.search")}
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      <DataTable<PetColor>
        columns={columns}
        data={filteredColors}
        loading={isLoading}
        error={error}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: filteredColors.length,
          onChange: pagination.onChange,
        }}
        scroll={{ x: 700 }}
        searchable={false}
      />

      <ColorModal
        open={modalOpen}
        color={selectedColor}
        onClose={() => {
          setModalOpen(false);
          setSelectedColor(null);
        }}
      />
    </div>
  );
}
