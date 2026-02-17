import { useEffect } from "react";
import { Modal, Form, Input, Switch, Select, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreateBreed, useUpdateBreed } from "../api/breedsApi";
import { useCategories } from "@/features/categories/api/categoriesApi";
import type { Breed, Category } from "@/shared/api/types";

interface BreedFormData {
  petCategoryId: number | null;
  isActive: boolean;
  localizations: {
    id?: number;
    localeCode: string;
    title: string;
  }[];
}

interface BreedModalProps {
  open: boolean;
  breed: Breed | null;
  onClose: () => void;
  defaultCategoryId?: number;
  initialAzName?: string;
  onSuccess?: (breedId: number) => void;
}

const LOCALES = [
  { code: "az", label: "Azərbaycan" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export function BreedModal({
  open,
  breed,
  onClose,
  defaultCategoryId,
  initialAzName,
  onSuccess,
}: BreedModalProps) {
  const { t, i18n } = useTranslation();
  const isEdit = !!breed;

  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const createMutation = useCreateBreed();
  const updateMutation = useUpdateBreed();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BreedFormData>({
    defaultValues: {
      petCategoryId: null,
      isActive: true,
      localizations: LOCALES.map((l) => ({
        localeCode: l.code,
        title: "",
      })),
    },
  });

  // Helper to get localized category name
  const getCategoryName = (category: Category) => {
    const loc = category.localizations?.find(
      (l) => l.localeCode === i18n.language,
    );
    return loc?.title || category.title || `Category ${category.id}`;
  };

  // Reset form when modal opens/closes or breed changes
  useEffect(() => {
    if (open && breed) {
      reset({
        petCategoryId: breed.petCategoryId,
        isActive: breed.isActive,
        localizations: LOCALES.map((l) => {
          const loc = breed.localizations?.find(
            (bl) => bl.localeCode === l.code,
          );
          return {
            id: loc?.id,
            localeCode: l.code,
            title: loc?.title || "",
          };
        }),
      });
    } else if (open && !breed) {
      reset({
        petCategoryId: defaultCategoryId || null,
        isActive: true,
        localizations: LOCALES.map((l) => ({
          localeCode: l.code,
          title: l.code === "az" && initialAzName ? initialAzName : "",
        })),
      });
    }
  }, [open, breed, defaultCategoryId, initialAzName, reset]);

  const onSubmit = async (data: BreedFormData) => {
    if (!data.petCategoryId) {
      return;
    }

    try {
      const payload = {
        petCategoryId: data.petCategoryId,
        isActive: data.isActive,
        localizations: data.localizations.map((l) => ({
          id: l.id,
          localeCode: l.localeCode,
          title: l.title,
        })),
      };

      if (isEdit && breed) {
        await updateMutation.mutateAsync({
          id: breed.id,
          data: { ...payload, id: breed.id },
        });
      } else {
        const newBreedId = await createMutation.mutateAsync(payload);
        if (onSuccess) {
          onSuccess(newBreedId);
        }
      }
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  const selectedCategoryId = watch("petCategoryId");

  return (
    <Modal
      open={open}
      title={
        isEdit
          ? t("breeds.editTitle", "Cinsi redaktə et")
          : t("breeds.createTitle", "Yeni cins")
      }
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isLoading}
      destroyOnHidden
      width={window.innerWidth < 768 ? "95vw" : 600}
    >
      <Spin spinning={isLoading || categoriesLoading}>
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
  );
}
