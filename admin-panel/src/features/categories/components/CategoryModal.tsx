import { useEffect } from "react";
import { Modal, Form, Input, Switch, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreateCategory, useUpdateCategory } from "../api/categoriesApi";
import type { Category } from "@/shared/api/types";

interface CategoryFormData {
  svgIcon: string;
  iconColor: string;
  backgroundColor: string;
  isActive: boolean;
  localizations: {
    localeCode: string;
    title: string;
    subtitle: string;
  }[];
}

interface CategoryModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

const LOCALES = [
  { code: "az", label: "Azərbaycan" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export function CategoryModal({ open, category, onClose }: CategoryModalProps) {
  const { t } = useTranslation();
  const isEdit = !!category;

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      svgIcon: "",
      iconColor: "text-gray-600",
      backgroundColor: "bg-gray-50",
      isActive: true,
      localizations: LOCALES.map((l) => ({
        localeCode: l.code,
        title: "",
        subtitle: "",
      })),
    },
  });

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (open && category) {
      reset({
        svgIcon: category.icon || "",
        iconColor: category.iconColor || "text-gray-600",
        backgroundColor: category.backgroundColor || "bg-gray-50",
        isActive: category.isActive,
        localizations: LOCALES.map((l) => {
          const loc = category.localizations?.find(
            (cl) => cl.localeCode === l.code,
          );
          return {
            localeCode: l.code,
            title: loc?.title || "",
            subtitle: loc?.subtitle || "",
          };
        }),
      });
    } else if (open && !category) {
      reset({
        svgIcon: "",
        iconColor: "text-gray-600",
        backgroundColor: "bg-gray-50",
        isActive: true,
        localizations: LOCALES.map((l) => ({
          localeCode: l.code,
          title: "",
          subtitle: "",
        })),
      });
    }
  }, [open, category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const payload = {
        svgIcon: data.svgIcon,
        iconColor: data.iconColor,
        backgroundColor: data.backgroundColor,
        isActive: data.isActive,
        localizations: data.localizations.map((l, index) => ({
          id: isEdit ? category?.localizations?.[index]?.id : undefined,
          localeCode: l.localeCode,
          title: l.title,
          subtitle: l.subtitle || "",
        })),
      };

      if (isEdit && category) {
        await updateMutation.mutateAsync({
          id: category.id,
          data: { ...payload, id: category.id },
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <Modal
      open={open}
      title={
        isEdit
          ? t("categories.editTitle", "Kateqoriyanı redaktə et")
          : t("categories.createTitle", "Yeni kateqoriya")
      }
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isLoading}
      destroyOnHidden
      width={window.innerWidth < 768 ? "95vw" : 600}
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" className="mt-4">
          {/* SVG Icon */}
          <Form.Item
            label={t("categories.form.svgIcon", "SVG İkon")}
            validateStatus={errors.svgIcon ? "error" : ""}
            help={errors.svgIcon?.message}
          >
            <Controller
              name="svgIcon"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>'
                  rows={3}
                />
              )}
            />
          </Form.Item>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label={t("categories.form.iconColor", "İkon rəngi")}>
              <Controller
                name="iconColor"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="text-amber-600" />
                )}
              />
            </Form.Item>

            <Form.Item label={t("categories.form.backgroundColor", "Arxa fon")}>
              <Controller
                name="backgroundColor"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="bg-amber-50" />
                )}
              />
            </Form.Item>
          </div>

          {/* Active Status */}
          <Form.Item label={t("categories.form.isActive", "Aktiv")}>
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
              {t("categories.form.translations", "Tərcümələr")}
            </h4>
            {LOCALES.map((locale, index) => (
              <div
                key={locale.code}
                className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <h5 className="font-medium mb-2">{locale.label}</h5>
                <Form.Item
                  label={t("categories.form.title", "Başlıq")}
                  validateStatus={
                    errors.localizations?.[index]?.title ? "error" : ""
                  }
                  help={errors.localizations?.[index]?.title?.message}
                  required
                >
                  <Controller
                    name={`localizations.${index}.title`}
                    control={control}
                    rules={{ required: "Bu sahə tələb olunur" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t(
                          "categories.form.titlePlaceholder",
                          "Kateqoriya adı",
                        )}
                        maxLength={100}
                      />
                    )}
                  />
                </Form.Item>
                <Form.Item label={t("categories.form.subtitle", "Alt başlıq")}>
                  <Controller
                    name={`localizations.${index}.subtitle`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t(
                          "categories.form.subtitlePlaceholder",
                          "Qısa təsvir",
                        )}
                        maxLength={200}
                      />
                    )}
                  />
                </Form.Item>
              </div>
            ))}
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}
