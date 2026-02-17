import { useEffect } from "react";
import { Modal, Form, Input, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { citySchema, CityFormData } from "../schemas/citySchema";
import { useCreateCity, useUpdateCity } from "../api/citiesApi";
import type { City } from "@/shared/api/types";
import type { Locale } from "@/app/i18n";
import { SUPPORTED_LOCALES } from "@/app/i18n";

interface CityModalProps {
  open: boolean;
  city: City | null;
  onClose: () => void;
}

export function CityModal({ open, city, onClose }: CityModalProps) {
  const { t } = useTranslation();
  const isEdit = !!city;

  const createMutation = useCreateCity();
  const updateMutation = useUpdateCity();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      nameAz: "",
      nameEn: "",
      nameRu: "",
    },
  });

  // Reset form when modal opens/closes or city changes
  useEffect(() => {
    if (open && city) {
      reset({
        nameAz: city.nameAz,
        nameEn: city.nameEn,
        nameRu: city.nameRu,
      });
    } else if (open && !city) {
      reset({
        nameAz: "",
        nameEn: "",
        nameRu: "",
      });
    }
  }, [open, city, reset]);

  const onSubmit = async (data: CityFormData) => {
    try {
      if (isEdit && city) {
        await updateMutation.mutateAsync({
          id: city.id,
          data: { ...data, id: city.id },
        });
      } else {
        await createMutation.mutateAsync(data);
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

  // Render inputs vertically for each language
  const renderLanguageInputs = () => (
    <div className="space-y-4">
      {SUPPORTED_LOCALES.map((locale) => {
        const fieldName =
          `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof CityFormData;
        return (
          <Form.Item
            key={locale}
            label={`${t("cities.form.name")} (${localeLabels[locale]})`}
            validateStatus={errors[fieldName] ? "error" : ""}
            help={errors[fieldName]?.message}
            required
          >
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={`${t("cities.form.name")} (${localeLabels[locale]})`}
                  maxLength={100}
                />
              )}
            />
          </Form.Item>
        );
      })}
    </div>
  );

  return (
    <Modal
      open={open}
      title={isEdit ? t("cities.editTitle") : t("cities.createTitle")}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isLoading}
      destroyOnHidden
      width={500}
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" className="mt-4">
          {renderLanguageInputs()}
        </Form>
      </Spin>
    </Modal>
  );
}
