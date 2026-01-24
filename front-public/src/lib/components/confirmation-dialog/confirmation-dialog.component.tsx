"use client";

import {
  IconAlertCircle,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { useTranslations } from "next-intl";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "warning" | "danger" | "success";
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "info",
  isLoading = false,
}: ConfirmationDialogProps) {
  const t = useTranslations("common");
  const confirm = confirmText ?? t("confirm");
  const cancel = cancelText ?? t("cancel");

  const variantConfig = {
    info: {
      icon: IconInfoCircle,
      iconColor: "text-info-600",
      iconBg: "bg-info-100",
    },
    warning: {
      icon: IconAlertTriangle,
      iconColor: "text-warning-600",
      iconBg: "bg-warning-100",
    },
    danger: {
      icon: IconAlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    success: {
      icon: IconCircleCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-in fade-in zoom-in duration-200">
          {/* Icon */}
          <div
            className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center",
              config.iconBg,
            )}
          >
            <IconComponent
              size={32}
              className={config.iconColor}
              strokeWidth={2}
            />
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold font-heading text-gray-900">
              {title}
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "w-full px-6 py-3 rounded-xl font-semibold",
                "bg-black text-white",
                "hover:bg-gray-800 transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {isLoading ? t("pleaseWait") : confirm}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className={cn(
                "w-full px-6 py-3 rounded-xl font-semibold",
                "bg-gray-100 text-gray-700",
                "hover:bg-gray-200 transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {cancel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
