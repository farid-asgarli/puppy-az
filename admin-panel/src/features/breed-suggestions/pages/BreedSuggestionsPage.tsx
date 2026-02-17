import { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Select,
  Modal,
  Form,
  Input,
  Spin,
  Switch,
  Typography,
  Card,
  Tooltip,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import {
  useBreedSuggestions,
  useApproveBreedSuggestion,
  useRejectBreedSuggestion,
} from "../api/breedSuggestionsApi";
import { useCategories } from "@/features/categories/api/categoriesApi";
import type {
  BreedSuggestion,
  BreedSuggestionStatus,
  Category,
  BreedLocalizationPayload,
} from "@/shared/api/types";
import { BreedSuggestionStatus as Status } from "@/shared/api/types";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

const LOCALES = [
  { code: "az", label: "Azərbaycan" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

interface ApproveFormData {
  petCategoryId: number | null;
  isActive: boolean;
  localizations: {
    localeCode: string;
    title: string;
  }[];
}

export default function BreedSuggestionsPage() {
  const { t, i18n } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    Status.Pending,
  );
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();

  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<BreedSuggestion | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  // API hooks
  const {
    data: suggestionsData,
    isLoading,
    refetch,
  } = useBreedSuggestions({
    status: statusFilter,
    petCategoryId: categoryFilter,
  });
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const approveMutation = useApproveBreedSuggestion();
  const rejectMutation = useRejectBreedSuggestion();

  const suggestions = suggestionsData?.items || [];

  // Form for approve modal
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ApproveFormData>({
    defaultValues: {
      petCategoryId: null,
      isActive: true,
      localizations: LOCALES.map((l) => ({
        localeCode: l.code,
        title: "",
      })),
    },
  });

  const getCategoryName = (category: Category) => {
    const loc = category.localizations?.find(
      (l) => l.localeCode === i18n.language,
    );
    return loc?.title || category.title || `Category ${category.id}`;
  };

  const getStatusTag = (status: BreedSuggestionStatus) => {
    switch (status) {
      case Status.Pending:
        return (
          <Tag color="orange">
            {t("breedSuggestions.statusPending", "Gözləyir")}
          </Tag>
        );
      case Status.Approved:
        return (
          <Tag color="green">
            {t("breedSuggestions.statusApproved", "Qəbul edildi")}
          </Tag>
        );
      case Status.Rejected:
        return (
          <Tag color="red">
            {t("breedSuggestions.statusRejected", "Rədd edildi")}
          </Tag>
        );
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const handleApproveClick = (suggestion: BreedSuggestion) => {
    setSelectedSuggestion(suggestion);
    reset({
      petCategoryId: suggestion.petCategoryId,
      isActive: true,
      localizations: LOCALES.map((l) => ({
        localeCode: l.code,
        // Pre-fill the suggested name in all locales as a starting point
        title: suggestion.name,
      })),
    });
    setApproveModalOpen(true);
  };

  const handleRejectClick = (suggestion: BreedSuggestion) => {
    setSelectedSuggestion(suggestion);
    setRejectNote("");
    setRejectModalOpen(true);
  };

  const onApproveSubmit = async (data: ApproveFormData) => {
    if (!selectedSuggestion || !data.petCategoryId) return;

    try {
      await approveMutation.mutateAsync({
        suggestionId: selectedSuggestion.id,
        petCategoryId: data.petCategoryId,
        localizations: data.localizations as BreedLocalizationPayload[],
        isActive: data.isActive,
      });
      setApproveModalOpen(false);
      setSelectedSuggestion(null);
    } catch {
      // Error handled in mutation
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedSuggestion) return;

    try {
      await rejectMutation.mutateAsync({
        suggestionId: selectedSuggestion.id,
        adminNote: rejectNote || undefined,
      });
      setRejectModalOpen(false);
      setSelectedSuggestion(null);
    } catch {
      // Error handled in mutation
    }
  };

  const selectedCategoryId = watch("petCategoryId");

  const columns: ColumnsType<BreedSuggestion> = [
    {
      title: t("breedSuggestions.columnName", "Təklif edilən ad"),
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Text strong className="text-base">
          {name}
        </Text>
      ),
    },
    {
      title: t("breedSuggestions.columnCategory", "Kateqoriya"),
      dataIndex: "categoryTitle",
      key: "categoryTitle",
      render: (title: string) => <Tag>{title}</Tag>,
    },
    {
      title: t("breedSuggestions.columnUser", "İstifadəçi"),
      dataIndex: "userName",
      key: "userName",
      render: (name: string | null) => name || <Text type="secondary">—</Text>,
    },
    {
      title: t("breedSuggestions.columnStatus", "Status"),
      dataIndex: "status",
      key: "status",
      render: (status: BreedSuggestionStatus) => getStatusTag(status),
    },
    {
      title: t("breedSuggestions.columnDate", "Tarix"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        new Date(date).toLocaleDateString(i18n.language, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: t("breedSuggestions.columnNote", "Qeyd"),
      dataIndex: "adminNote",
      key: "adminNote",
      render: (note: string | null) =>
        note ? (
          <Tooltip title={note}>
            <Text className="max-w-[200px] truncate block">{note}</Text>
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: t("breedSuggestions.columnActions", "Əməliyyatlar"),
      key: "actions",
      render: (_: unknown, record: BreedSuggestion) =>
        record.status === Status.Pending ? (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApproveClick(record)}
            >
              {t("breedSuggestions.approve", "Qəbul et")}
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleRejectClick(record)}
            >
              {t("breedSuggestions.reject", "Rədd et")}
            </Button>
          </Space>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {t("breedSuggestions.title", "Cins Təklifləri")}
          </h1>
          <p className="text-gray-500 mt-1">
            {t(
              "breedSuggestions.description",
              "İstifadəçilərin təklif etdiyi yeni cinsləri idarə edin",
            )}
          </p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          {t("common.refresh", "Yenilə")}
        </Button>
      </div>

      {/* Filters */}
      <Card size="small">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <FilterOutlined />
            <Text>{t("breedSuggestions.filters", "Filtrlər")}:</Text>
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            placeholder={t("breedSuggestions.filterStatus", "Status")}
            style={{ width: 180 }}
            options={[
              {
                value: Status.Pending,
                label: t("breedSuggestions.statusPending", "Gözləyir"),
              },
              {
                value: Status.Approved,
                label: t("breedSuggestions.statusApproved", "Qəbul edildi"),
              },
              {
                value: Status.Rejected,
                label: t("breedSuggestions.statusRejected", "Rədd edildi"),
              },
            ]}
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            allowClear
            placeholder={t("breedSuggestions.filterCategory", "Kateqoriya")}
            style={{ width: 200 }}
            loading={categoriesLoading}
            options={categories
              .filter((c) => c.isActive && !c.isDeleted)
              .map((c) => ({
                value: c.id,
                label: getCategoryName(c),
              }))}
            showSearch
            optionFilterProp="label"
          />
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={suggestions}
        loading={isLoading}
        rowKey="id"
        pagination={{
          total: suggestionsData?.totalCount,
          showSizeChanger: true,
          showTotal: (total) =>
            t("common.totalItems", {
              count: total,
              defaultValue: `${total} nəticə`,
            }),
        }}
        locale={{
          emptyText: t("breedSuggestions.noSuggestions", "Təklif yoxdur"),
        }}
      />

      {/* Approve Modal */}
      <Modal
        open={approveModalOpen}
        title={
          <div>
            <span>
              {t("breedSuggestions.approveTitle", "Təklifi qəbul et")}
            </span>
            {selectedSuggestion && (
              <Tag color="blue" className="ml-2">
                {selectedSuggestion.name}
              </Tag>
            )}
          </div>
        }
        onCancel={() => {
          setApproveModalOpen(false);
          setSelectedSuggestion(null);
        }}
        onOk={handleSubmit(onApproveSubmit)}
        okText={t(
          "breedSuggestions.approveAndCreate",
          "Qəbul et və cinsi yarat",
        )}
        cancelText={t("common.cancel", "Ləğv et")}
        confirmLoading={approveMutation.isPending}
        destroyOnHidden
        width={window.innerWidth < 768 ? "95vw" : 600}
      >
        <Spin spinning={approveMutation.isPending || categoriesLoading}>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <Text type="secondary">
              {t(
                "breedSuggestions.approveDescription",
                "Təklif olunan cinsi 3 dildə adlandırın. Admin paneldən cinslər siyahısına əlavə olunacaq.",
              )}
            </Text>
          </div>

          <Form layout="vertical" className="mt-4">
            {/* Category Select */}
            <Form.Item
              label={t("breeds.form.category", "Kateqoriya")}
              validateStatus={errors.petCategoryId ? "error" : ""}
              help={errors.petCategoryId?.message}
              required
            >
              <Controller
                name="petCategoryId"
                control={control}
                rules={{
                  required: t("validation.required", "Bu sahə tələb olunur"),
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={t(
                      "breeds.form.selectCategory",
                      "Kateqoriya seçin",
                    )}
                    loading={categoriesLoading}
                    options={categories
                      .filter((c) => c.isActive && !c.isDeleted)
                      .map((c) => ({
                        value: c.id,
                        label: getCategoryName(c),
                      }))}
                    showSearch
                    optionFilterProp="label"
                    allowClear
                  />
                )}
              />
            </Form.Item>

            {/* Active Status */}
            <Form.Item label={t("breeds.form.isActive", "Aktiv")}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} />
                )}
              />
            </Form.Item>

            {/* Localizations */}
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-4">
                {t("breeds.form.translations", "Tərcümələr")}
              </h4>
              {LOCALES.map((locale, index) => (
                <div
                  key={locale.code}
                  className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <h5 className="font-medium mb-2">{locale.label}</h5>
                  <Form.Item
                    label={t("breeds.form.name", "Ad")}
                    validateStatus={
                      errors.localizations?.[index]?.title ? "error" : ""
                    }
                    help={errors.localizations?.[index]?.title?.message}
                    required
                  >
                    <Controller
                      name={`localizations.${index}.title`}
                      control={control}
                      rules={{
                        required: t(
                          "validation.required",
                          "Bu sahə tələb olunur",
                        ),
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={t(
                            "breeds.form.namePlaceholder",
                            "Cins adı",
                          )}
                          maxLength={100}
                        />
                      )}
                    />
                  </Form.Item>
                </div>
              ))}
            </div>

            {/* Preview */}
            {selectedCategoryId && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">
                  {t("breeds.form.preview", "Önizləmə")}
                </h4>
                <p className="text-sm text-gray-500">
                  {t("breeds.form.selectedCategory", "Seçilmiş kateqoriya")}:{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getCategoryName(
                      categories.find((c) => c.id === selectedCategoryId) ||
                        ({} as Category),
                    )}
                  </span>
                </p>
              </div>
            )}
          </Form>
        </Spin>
      </Modal>

      {/* Reject Modal */}
      <Modal
        open={rejectModalOpen}
        title={t("breedSuggestions.rejectTitle", "Təklifi rədd et")}
        onCancel={() => {
          setRejectModalOpen(false);
          setSelectedSuggestion(null);
        }}
        onOk={handleRejectSubmit}
        okText={t("breedSuggestions.confirmReject", "Rədd et")}
        cancelText={t("common.cancel", "Ləğv et")}
        confirmLoading={rejectMutation.isPending}
        okButtonProps={{ danger: true }}
        destroyOnHidden
      >
        {selectedSuggestion && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <Text type="secondary">
                {t("breedSuggestions.rejectingBreed", "Rədd olunan cins")}:
              </Text>
              <Text strong className="ml-2">
                {selectedSuggestion.name}
              </Text>
            </div>
            <Form.Item
              label={t("breedSuggestions.adminNote", "Admin qeydi (ixtiyari)")}
            >
              <Input.TextArea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder={t(
                  "breedSuggestions.adminNotePlaceholder",
                  "Rədd etmə səbəbini yazın...",
                )}
                maxLength={500}
                rows={3}
              />
            </Form.Item>
          </div>
        )}
      </Modal>
    </div>
  );
}
