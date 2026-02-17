import { useEffect } from "react";
import { Modal, Form, Input, Switch, Spin, ColorPicker } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useCreateColor, useUpdateColor } from "../api/colorsApi";
import type { PetColor } from "@/shared/api/types";

interface ColorFormData {
  key: string;
  title: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  isActive: boolean;
}

interface ColorModalProps {
  open: boolean;
  color: PetColor | null;
  onClose: () => void;
}

export function ColorModal({ open, color, onClose }: ColorModalProps) {
  const { t } = useTranslation();
  const isEdit = !!color;

  const createMutation = useCreateColor();
  const updateMutation = useUpdateColor();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ColorFormData>({
    defaultValues: {
      key: "",
      title: "",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      borderColor: "#d9d9d9",
      isActive: true,
    },
  });

  const watchBg = watch("backgroundColor");
  const watchText = watch("textColor");
  const watchBorder = watch("borderColor");
  const watchTitle = watch("title");

  useEffect(() => {
    if (open && color) {
      reset({
        key: color.key || "",
        title: color.title || "",
        backgroundColor: color.backgroundColor || "#ffffff",
        textColor: color.textColor || "#000000",
        borderColor: color.borderColor || "#d9d9d9",
        isActive: true,
      });
    } else if (open && !color) {
      reset({
        key: "",
        title: "",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        borderColor: "#d9d9d9",
        isActive: true,
      });
    }
  }, [open, color, reset]);

  const onSubmit = async (data: ColorFormData) => {
    try {
      if (isEdit && color) {
        await updateMutation.mutateAsync({
          id: color.id,
          data: { id: color.id, ...data },
        });
      } else {
        await createMutation.mutateAsync(data as Omit<PetColor, "id">);
      }
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Modal
      open={open}
      title={
        isEdit
          ? t("colors.editTitle", "Rəngi redaktə et")
          : t("colors.createTitle", "Yeni rəng")
      }
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={isLoading}
      destroyOnHidden
      width={window.innerWidth < 768 ? "95vw" : 500}
    >
      <Spin spinning={isLoading}>
        <Form layout="vertical" className="mt-4">
          {/* Preview */}
          <div className="flex justify-center mb-6">
            <div
              className="px-6 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: watchBg,
                color: watchText,
                border: `2px solid ${watchBorder}`,
              }}
            >
              {watchTitle || t("colors.form.preview", "Önizləmə")}
            </div>
          </div>

          {/* Key */}
          <Form.Item
            label={t("colors.form.key", "Açar")}
            validateStatus={errors.key ? "error" : ""}
            help={errors.key?.message}
            required
          >
            <Controller
              name="key"
              control={control}
              rules={{ required: t("common.required", "Bu sahə tələb olunur") }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="white, black, brown..."
                  maxLength={50}
                />
              )}
            />
          </Form.Item>

          {/* Title */}
          <Form.Item
            label={t("colors.form.title", "Ad")}
            validateStatus={errors.title ? "error" : ""}
            help={errors.title?.message}
            required
          >
            <Controller
              name="title"
              control={control}
              rules={{ required: t("common.required", "Bu sahə tələb olunur") }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={t("colors.form.titlePlaceholder", "Rəng adı")}
                  maxLength={100}
                />
              )}
            />
          </Form.Item>

          {/* Colors */}
          <div className="grid grid-cols-3 gap-4">
            <Form.Item label={t("colors.form.backgroundColor", "Arxa fon")}>
              <Controller
                name="backgroundColor"
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    value={field.value}
                    onChange={(_, hex) => field.onChange(hex)}
                    showText
                    size="small"
                  />
                )}
              />
            </Form.Item>

            <Form.Item label={t("colors.form.textColor", "Mətn rəngi")}>
              <Controller
                name="textColor"
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    value={field.value}
                    onChange={(_, hex) => field.onChange(hex)}
                    showText
                    size="small"
                  />
                )}
              />
            </Form.Item>

            <Form.Item label={t("colors.form.borderColor", "Haşiyə rəngi")}>
              <Controller
                name="borderColor"
                control={control}
                render={({ field }) => (
                  <ColorPicker
                    value={field.value}
                    onChange={(_, hex) => field.onChange(hex)}
                    showText
                    size="small"
                  />
                )}
              />
            </Form.Item>
          </div>

          {/* Active */}
          <Form.Item label={t("common.active", "Aktiv")}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
