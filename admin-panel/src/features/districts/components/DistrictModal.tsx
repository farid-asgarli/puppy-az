import { useEffect } from "react";
import { Modal, Form, Input, Select, Spin, InputNumber } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { districtSchema, DistrictFormData } from "../schemas/districtSchema";
import { useCreateDistrict, useUpdateDistrict } from "../api/districtsApi";
import { useAllCities } from "@/features/cities";
import type { District } from "@/shared/api/types";
import type { Locale } from "@/app/i18n";
import { SUPPORTED_LOCALES } from "@/app/i18n";

interface DistrictModalProps {
  open: boolean;
  district: District | null;
  onClose: () => void;
  defaultCityId?: number;
  initialAzName?: string;
  onSuccess?: (districtId: number) => void;
}

export function DistrictModal({
  open,
  district,
  onClose,
  defaultCityId,
  initialAzName,
  onSuccess,
}: DistrictModalProps) {
  const { t } = useTranslation();
  const isEdit = !!district;

  const createMutation = useCreateDistrict();
  const updateMutation = useUpdateDistrict();
  const { data: cities = [], isLoading: citiesLoading } = useAllCities();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistrictFormData>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      nameAz: "",
      nameEn: "",
      nameRu: "",
      cityId: 0,
      displayOrder: 0,
      isActive: true,
    },
  });

  // Reset form when modal opens/closes or district changes
  useEffect(() => {
    if (open && district) {
      reset({
        nameAz: district.nameAz,
        nameEn: district.nameEn,
        nameRu: district.nameRu,
        cityId: district.cityId,
        displayOrder: district.displayOrder ?? 0,
        isActive: district.isActive ?? true,
      });
    } else if (open && !district) {
      reset({
        nameAz: initialAzName || "",
        nameEn: "",
        nameRu: "",
        cityId: defaultCityId || 0,
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [open, district, reset, defaultCityId, initialAzName]);

  const onSubmit = async (data: DistrictFormData) => {
    try {
      if (isEdit && district) {
        await updateMutation.mutateAsync({
          id: district.id,
          data: { ...data, id: district.id },
        });
      } else {
        const result = await createMutation.mutateAsync(data);
        if (onSuccess && result?.id) {
          onSuccess(result.id);
        }
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
          `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof DistrictFormData;
        return (
          <Form.Item
            key={locale}
            label={`${t("districts.form.name")} (${localeLabels[locale]})`}
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
                  value={field.value as string}
                  placeholder={`${t("districts.form.name")} (${localeLabels[locale]})`}
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
      title={isEdit ? t("districts.editTitle") : t("districts.createTitle")}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isLoading}
      destroyOnHidden
      width={500}
    >
      <Spin spinning={isLoading || citiesLoading}>
        <Form layout="vertical" className="mt-4">
          {/* City selection */}
          <Form.Item
            label={t("districts.form.city")}
            validateStatus={errors.cityId ? "error" : ""}
            help={errors.cityId?.message}
            required
          >
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value)}
                  placeholder={t("districts.form.selectCity")}
                  showSearch
                  optionFilterProp="label"
                  options={cities.map((city) => ({
                    value: city.id,
                    label: `${city.nameAz} / ${city.nameEn}`,
                  }))}
                />
              )}
            />
          </Form.Item>

          {/* Name inputs for each language */}
          {renderLanguageInputs()}

          {/* Display Order */}
          <Form.Item label={t("districts.form.displayOrder")}>
            <Controller
              name="displayOrder"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  value={field.value ?? 0}
                  min={0}
                  placeholder="0"
                  className="w-full"
                />
              )}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
