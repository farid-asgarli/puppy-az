import { useState, useMemo } from "react";
import {
  Typography,
  Button,
  Input,
  Space,
  Tag,
  Spin,
  Alert,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/useCrud";
import {
  useCategories,
  useDeleteCategory,
  CategoryModal,
} from "@/features/categories";
import type { Category } from "@/shared/api/types";

const { Title } = Typography;

export default function CategoriesPage() {
  const { t, i18n } = useTranslation();
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // Fetch categories from API
  const { data: categories = [], isLoading, error } = useCategories();
  const deleteMutation = useDeleteCategory();

  // Handlers
  const handleCreate = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  // Get localized name for a category (use title from API response or fallback to localizations)
  const getLocalizedName = (
    category: Category,
    field: "title" | "subtitle" = "title",
  ) => {
    // First try to use the pre-localized title/subtitle from API
    if (field === "title" && category.title) {
      return category.title;
    }
    if (field === "subtitle" && category.subtitle) {
      return category.subtitle;
    }

    // Fallback to localizations array
    const localization = category.localizations?.find(
      (l) => l.localeCode === i18n.language,
    );
    if (localization) {
      return field === "title" ? localization.title : localization.subtitle;
    }
    // Fallback to first available localization
    const fallback = category.localizations?.[0];
    return fallback
      ? field === "title"
        ? fallback.title
        : fallback.subtitle
      : "";
  };

  // Get localization by locale code
  const getLocalization = (category: Category, locale: "az" | "en" | "ru") => {
    return (
      category.localizations?.find((l) => l.localeCode === locale)?.title || "-"
    );
  };

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const searchLower = search.toLowerCase();
    return categories.filter((cat) => {
      const name = getLocalizedName(cat);
      return name?.toLowerCase().includes(searchLower);
    });
  }, [categories, search, i18n.language]);

  const columns: ColumnsType<Category> = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      {
        title: t("categories.table.icon"),
        dataIndex: "icon",
        key: "icon",
        width: 80,
        render: (icon: string, item: Category) => (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.backgroundColor || "bg-gray-100 dark:bg-gray-800"}`}
            style={{ color: item.iconColor?.replace("text-", "") }}
          >
            {icon ? (
              <span
                className={`w-6 h-6 ${item.iconColor || ""}`}
                dangerouslySetInnerHTML={{ __html: icon }}
              />
            ) : (
              <span className="text-2xl">📁</span>
            )}
          </div>
        ),
      },
      {
        title: t("categories.table.name"),
        key: "name",
        render: (_, item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {getLocalizedName(item)}
          </span>
        ),
      },
      {
        title: "AZ",
        key: "nameAz",
        responsive: ["lg"],
        render: (_, item) => getLocalization(item, "az"),
      },
      {
        title: "EN",
        key: "nameEn",
        responsive: ["lg"],
        render: (_, item) => getLocalization(item, "en"),
      },
      {
        title: "RU",
        key: "nameRu",
        responsive: ["lg"],
        render: (_, item) => getLocalization(item, "ru"),
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
        title: t("common.actions"),
        key: "actions",
        width: 120,
        render: (_, item: Category) => (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-primary-500"
              onClick={() => handleEdit(item)}
            />
            <Popconfirm
              title={t(
                "categories.deleteConfirm",
                "Bu kateqoriyanı silmək istədiyinizə əminsiniz?",
              )}
              onConfirm={() => handleDelete(item.id)}
              okText={t("common.yes", "Bəli")}
              cancelText={t("common.no", "Xeyr")}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [t, i18n.language],
  );

  if (error) {
    return (
      <Alert
        type="error"
        message={t("error.loadingFailed")}
        description={String(error)}
        showIcon
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Title level={2} className="!mb-0">
          {t("categories.pageTitle")}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
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

      <Spin spinning={isLoading}>
        <DataTable<Category>
          columns={columns}
          data={filteredCategories}
          loading={isLoading}
          error={null}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: filteredCategories.length,
            onChange: pagination.onChange,
          }}
          scroll={{ x: 800 }}
          searchable={false}
        />
      </Spin>

      <CategoryModal
        open={modalOpen}
        category={selectedCategory}
        onClose={handleModalClose}
      />
    </div>
  );
}
