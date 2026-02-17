import { useState, useMemo, useCallback } from "react";
import {
  Typography,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/shared/components/DataTable";
import { usePagination } from "@/shared/hooks/useCrud";
import {
  useBreeds,
  useDeleteBreed,
  useRestoreBreed,
  BreedModal,
} from "@/features/breeds";
import { useCategories } from "@/features/categories";
import type { Breed, Category } from "@/shared/api/types";

const { Title } = Typography;

export default function BreedsPage() {
  const { t, i18n } = useTranslation();
  const pagination = usePagination(10);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [showDeleted, setShowDeleted] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);

  // API hooks - get ALL breeds for counting (without category filter)
  const { data: allBreeds = [], isLoading: allBreedsLoading } = useBreeds({
    includeDeleted: showDeleted,
    pageSize: 1000,
  });

  // Filter breeds by selected category (client-side)
  const breeds = useMemo(() => {
    if (!selectedCategoryId) return allBreeds;
    return allBreeds.filter((b) => b.petCategoryId === selectedCategoryId);
  }, [allBreeds, selectedCategoryId]);

  const breedsLoading = allBreedsLoading;

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const deleteMutation = useDeleteBreed();
  const restoreMutation = useRestoreBreed();

  // Get localized breed name
  const getBreedName = useCallback(
    (breed: Breed) => {
      const loc = breed.localizations?.find(
        (l) => l.localeCode === i18n.language,
      );
      return loc?.title || breed.title || `Breed ${breed.id}`;
    },
    [i18n.language],
  );

  // Get localized category name
  const getCategoryName = useCallback(
    (category: Category) => {
      const loc = category.localizations?.find(
        (l) => l.localeCode === i18n.language,
      );
      return loc?.title || category.title || `Category ${category.id}`;
    },
    [i18n.language],
  );

  // Get breed localization by locale
  const getBreedLocalization = useCallback((breed: Breed, locale: string) => {
    return (
      breed.localizations?.find((l) => l.localeCode === locale)?.title || ""
    );
  }, []);

  // Filter breeds by search
  const filteredBreeds = useMemo(() => {
    if (!search) return breeds;
    const searchLower = search.toLowerCase();
    return breeds.filter((breed) => {
      const nameAz = getBreedLocalization(breed, "az").toLowerCase();
      const nameEn = getBreedLocalization(breed, "en").toLowerCase();
      const nameRu = getBreedLocalization(breed, "ru").toLowerCase();
      return (
        nameAz.includes(searchLower) ||
        nameEn.includes(searchLower) ||
        nameRu.includes(searchLower)
      );
    });
  }, [breeds, search, getBreedLocalization]);

  // Handlers
  const handleCreate = () => {
    setSelectedBreed(null);
    setModalOpen(true);
  };

  const handleEdit = (breed: Breed) => {
    setSelectedBreed(breed);
    setModalOpen(true);
  };

  const handleDelete = (breed: Breed) => {
    deleteMutation.mutate(breed.id);
  };

  const handleRestore = (breed: Breed) => {
    restoreMutation.mutate(breed.id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedBreed(null);
  };

  // Table columns
  const columns: ColumnsType<Breed> = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      {
        title: t("breeds.table.name"),
        key: "name",
        render: (_, breed) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {getBreedName(breed)}
          </span>
        ),
      },
      {
        title: t("breeds.table.category"),
        key: "category",
        width: 150,
        render: (_, breed) => {
          const category = categories.find((c) => c.id === breed.petCategoryId);
          return (
            <Tag color="blue">
              {category ? getCategoryName(category) : breed.categoryTitle}
            </Tag>
          );
        },
      },
      {
        title: "AZ",
        key: "nameAz",
        responsive: ["lg"],
        render: (_, breed) => getBreedLocalization(breed, "az"),
      },
      {
        title: "EN",
        key: "nameEn",
        responsive: ["lg"],
        render: (_, breed) => getBreedLocalization(breed, "en"),
      },
      {
        title: "RU",
        key: "nameRu",
        responsive: ["lg"],
        render: (_, breed) => getBreedLocalization(breed, "ru"),
      },
      {
        title: t("common.status"),
        key: "status",
        width: 100,
        render: (_, breed) => {
          if (breed.isDeleted) {
            return <Tag color="red">{t("common.deleted", "Silinmiş")}</Tag>;
          }
          return (
            <Tag color={breed.isActive ? "green" : "default"}>
              {breed.isActive
                ? t("common.active", "Aktiv")
                : t("common.inactive", "Deaktiv")}
            </Tag>
          );
        },
      },
      {
        title: t("breeds.table.adsCount", "Elan sayı"),
        key: "petAdsCount",
        width: 100,
        render: (_, breed) => (
          <Tag color="purple">{breed.petAdsCount || 0}</Tag>
        ),
      },
      {
        title: t("common.actions"),
        key: "actions",
        width: 150,
        render: (_, breed) => (
          <Space>
            {breed.isDeleted ? (
              <Tooltip title={t("common.restore", "Bərpa et")}>
                <Button
                  type="text"
                  icon={<UndoOutlined />}
                  className="text-green-500"
                  onClick={() => handleRestore(breed)}
                  loading={restoreMutation.isPending}
                />
              </Tooltip>
            ) : (
              <>
                <Tooltip title={t("common.edit", "Redaktə et")}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className="text-primary-500"
                    onClick={() => handleEdit(breed)}
                  />
                </Tooltip>
                <Popconfirm
                  title={t(
                    "breeds.deleteConfirm",
                    "Cinsi silmək istədiyinizə əminsiniz?",
                  )}
                  description={t(
                    "breeds.deleteDescription",
                    "Bu cins yumşaq silinəcək və bərpa edilə bilər.",
                  )}
                  onConfirm={() => handleDelete(breed)}
                  okText={t("common.yes", "Bəli")}
                  cancelText={t("common.no", "Xeyr")}
                  icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                >
                  <Tooltip title={t("common.delete", "Sil")}>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      loading={deleteMutation.isPending}
                    />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </Space>
        ),
      },
    ],
    [
      t,
      categories,
      getBreedName,
      getCategoryName,
      getBreedLocalization,
      deleteMutation.isPending,
      restoreMutation.isPending,
    ],
  );

  // Build category filter items with breed counts
  const categoryFilters = useMemo(() => {
    // Calculate breed count per category
    const countByCategory = allBreeds.reduce(
      (acc, breed) => {
        const catId = breed.petCategoryId;
        acc[catId] = (acc[catId] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const totalCount = allBreeds.length;

    return {
      totalCount,
      countByCategory,
      items: categories.filter((cat) => cat.isActive && !cat.isDeleted),
    };
  }, [categories, allBreeds]);

  const isLoading = breedsLoading || categoriesLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Title level={2} className="!mb-0">
          {t("breeds.pageTitle")}
        </Title>
        <div className="flex flex-wrap gap-2">
          <Button
            type={showDeleted ? "primary" : "default"}
            onClick={() => setShowDeleted(!showDeleted)}
            icon={<DeleteOutlined />}
            size={window.innerWidth < 640 ? "small" : "middle"}
          >
            {showDeleted
              ? t("common.hideDeleted", "Silinmişləri gizlət")
              : t("common.showDeleted", "Silinmişləri göstər")}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size={window.innerWidth < 640 ? "small" : "middle"}
          >
            {t("common.create")}
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 overflow-x-auto">
        <div className="flex flex-nowrap sm:flex-wrap gap-2 min-w-max sm:min-w-0">
          {/* All Categories Pill */}
          <button
            onClick={() => setSelectedCategoryId(undefined)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 border-2
              ${
                !selectedCategoryId
                  ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              }
            `}
          >
            <span>🏠</span>
            <span>{t("common.all")}</span>
            <span
              className={`
                inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold
                ${!selectedCategoryId ? "bg-white/20 text-white" : "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300"}
              `}
            >
              {categoryFilters.totalCount}
            </span>
          </button>

          {/* Category Pills */}
          {categoryFilters.items.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = categoryFilters.countByCategory[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 border-2
                  ${
                    isSelected
                      ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  }
                `}
              >
                {cat.icon && (
                  <span
                    className="w-5 h-5 inline-flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4"
                    dangerouslySetInnerHTML={{ __html: cat.icon }}
                  />
                )}
                <span>{getCategoryName(cat)}</span>
                <span
                  className={`
                    inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold
                    ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300"}
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
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

      <DataTable<Breed>
        columns={columns}
        data={filteredBreeds}
        loading={isLoading}
        error={null}
        rowKey="id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: filteredBreeds.length,
          onChange: pagination.onChange,
        }}
        scroll={{ x: 700 }}
        searchable={false}
      />

      {/* Create/Edit Modal */}
      <BreedModal
        open={modalOpen}
        breed={selectedBreed}
        onClose={handleModalClose}
        defaultCategoryId={selectedCategoryId}
      />
    </div>
  );
}
