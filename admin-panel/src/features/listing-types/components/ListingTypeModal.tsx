import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  listingTypeSchema,
  ListingTypeFormData,
} from "../schemas/listingTypeSchema";
import {
  useCreateListingType,
  useUpdateListingType,
} from "../api/listingTypesApi";
import type { PetAdTypeListItem } from "@/shared/api/types";
import { APP_LOCALE_IDS } from "@/shared/api/types";
import type { Locale } from "@/app/i18n";
import { SUPPORTED_LOCALES } from "@/app/i18n";

interface ListingTypeModalProps {
  open: boolean;
  listingType: PetAdTypeListItem | null;
  onClose: () => void;
}

export function ListingTypeModal({
  open,
  listingType,
  onClose,
}: ListingTypeModalProps) {
  const { t } = useTranslation();
  const isEdit = !!listingType;

  const createMutation = useCreateListingType();
  const updateMutation = useUpdateListingType();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const getDefaultLocalizations = () =>
    SUPPORTED_LOCALES.map((locale) => ({
      appLocaleId: APP_LOCALE_IDS[locale],
      title: "",
      description: "",
    }));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListingTypeFormData>({
    resolver: zodResolver(listingTypeSchema),
    defaultValues: {
      key: "",
      emoji: "",
      iconName: "",
      backgroundColor: "",
      textColor: "",
      borderColor: "",
      sortOrder: 0,
      isActive: true,
      localizations: getDefaultLocalizations(),
    },
  });

  // Reset form when modal opens/closes or listingType changes
  useEffect(() => {
    if (open && listingType) {
      // Use titleAz/En/Ru from the list item
      reset({
        key: listingType.key,
        emoji: listingType.emoji || "",
        iconName: listingType.iconName || "",
        backgroundColor: listingType.backgroundColor || "",
        textColor: listingType.textColor || "",
        borderColor: listingType.borderColor || "",
        sortOrder: listingType.sortOrder,
        isActive: listingType.isActive,
        // Initialize localizations with proper titles
        localizations: [
          {
            appLocaleId: APP_LOCALE_IDS.az,
            title: listingType.titleAz || "",
            description: listingType.descriptionAz || "",
          },
          {
            appLocaleId: APP_LOCALE_IDS.en,
            title: listingType.titleEn || "",
            description: listingType.descriptionEn || "",
          },
          {
            appLocaleId: APP_LOCALE_IDS.ru,
            title: listingType.titleRu || "",
            description: listingType.descriptionRu || "",
          },
        ],
      });
    } else if (open && !listingType) {
      reset({
        key: "",
        emoji: "",
        iconName: "",
        backgroundColor: "",
        textColor: "",
        borderColor: "",
        sortOrder: 0,
        isActive: true,
        localizations: getDefaultLocalizations(),
      });
    }
  }, [open, listingType, reset]);

  const onSubmit = async (data: ListingTypeFormData) => {
    try {
      // Transform localizations array to flat fields for backend
      const azLocale = data.localizations.find(
        (l) => l.appLocaleId === APP_LOCALE_IDS.az,
      );
      const enLocale = data.localizations.find(
        (l) => l.appLocaleId === APP_LOCALE_IDS.en,
      );
      const ruLocale = data.localizations.find(
        (l) => l.appLocaleId === APP_LOCALE_IDS.ru,
      );

      const payload = {
        key: data.key,
        emoji: data.emoji || "",
        iconName: data.iconName,
        backgroundColor: data.backgroundColor || "",
        textColor: data.textColor || "",
        borderColor: data.borderColor || "",
        sortOrder: data.sortOrder,
        isActive: data.isActive,
        titleAz: azLocale?.title || "",
        titleEn: enLocale?.title || "",
        titleRu: ruLocale?.title || "",
        descriptionAz: azLocale?.description,
        descriptionEn: enLocale?.description,
        descriptionRu: ruLocale?.description,
      };

      if (isEdit && listingType) {
        await updateMutation.mutateAsync({
          id: listingType.id,
          data: { ...payload, id: listingType.id },
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Error handled in mutation
    }
  };

  const localeLabels: Record<Locale, string> = {
    az: t("translationTabs.az"),
    en: t("translationTabs.en"),
    ru: t("translationTabs.ru"),
  };

  return (
    <Modal
      open={open}
      title={
        isEdit
          ? t("listingTypes.editTitle", "Elan növünü redaktə et")
          : t("listingTypes.createTitle", "Yeni elan növü")
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
          {/* Key and Emoji */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={t("listingTypes.form.key", "Açar")}
              validateStatus={errors.key ? "error" : ""}
              help={errors.key?.message}
              required
            >
              <Controller
                name="key"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Sale, Match, Found..."
                    maxLength={50}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("listingTypes.form.emoji", "Emoji")}
              validateStatus={errors.emoji ? "error" : ""}
              help={errors.emoji?.message}
            >
              <Controller
                name="emoji"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="💰" maxLength={10} />
                )}
              />
            </Form.Item>
          </div>

          {/* Sort Order and Active */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={t("listingTypes.form.sortOrder", "Sıralama")}
              validateStatus={errors.sortOrder ? "error" : ""}
              help={errors.sortOrder?.message}
              required
            >
              <Controller
                name="sortOrder"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={0} className="w-full" />
                )}
              />
            </Form.Item>

            <Form.Item label={t("listingTypes.form.isActive", "Aktiv")}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onChange={field.onChange} />
                )}
              />
            </Form.Item>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Form.Item
              label={t("listingTypes.form.backgroundColor", "Arxa fon rəngi")}
            >
              <Controller
                name="backgroundColor"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="#ffffff" maxLength={20} />
                )}
              />
            </Form.Item>

            <Form.Item label={t("listingTypes.form.textColor", "Mətn rəngi")}>
              <Controller
                name="textColor"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="#000000" maxLength={20} />
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("listingTypes.form.borderColor", "Sərhəd rəngi")}
            >
              <Controller
                name="borderColor"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="#cccccc" maxLength={20} />
                )}
              />
            </Form.Item>
          </div>

          {/* Localizations */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-4">
              {t("listingTypes.form.translations", "Tərcümələr")}
            </h4>
            {SUPPORTED_LOCALES.map((locale, index) => (
              <div
                key={locale}
                className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <h5 className="font-medium mb-2">{localeLabels[locale]}</h5>
                <Form.Item
                  label={t("listingTypes.form.title", "Başlıq")}
                  validateStatus={
                    errors.localizations?.[index]?.title ? "error" : ""
                  }
                  help={errors.localizations?.[index]?.title?.message}
                  required
                >
                  <Controller
                    name={`localizations.${index}.title`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t(
                          "listingTypes.form.titlePlaceholder",
                          "Elan növünün adı",
                        )}
                        maxLength={100}
                      />
                    )}
                  />
                </Form.Item>
                <Form.Item
                  label={t("listingTypes.form.description", "Təsvir")}
                  validateStatus={
                    errors.localizations?.[index]?.description ? "error" : ""
                  }
                  help={errors.localizations?.[index]?.description?.message}
                >
                  <Controller
                    name={`localizations.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        placeholder={t(
                          "listingTypes.form.descriptionPlaceholder",
                          "Elan növünün qısa təsviri",
                        )}
                        rows={2}
                        maxLength={500}
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
