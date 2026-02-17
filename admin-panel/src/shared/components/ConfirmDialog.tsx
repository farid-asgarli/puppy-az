import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-3">
          <ExclamationCircleOutlined
            className={danger ? "text-error-500" : "text-warning-500"}
            style={{ fontSize: 24 }}
          />
          <span>{title || t("confirm.delete.title")}</span>
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {cancelText || t("common.cancel")}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger={danger}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmText || t("common.confirm")}
        </Button>,
      ]}
      centered
      destroyOnHidden
    >
      <p className="text-gray-600 dark:text-gray-300 mt-4">
        {message || t("confirm.delete.message")}
      </p>
    </Modal>
  );
}

// Hook for confirm dialog
import { useState, useCallback } from "react";

interface UseConfirmOptions {
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export function useConfirm(options: UseConfirmOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    options.onCancel?.();
  }, [options]);

  const confirm = useCallback(async () => {
    setIsLoading(true);
    try {
      await options.onConfirm();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    isOpen,
    isLoading,
    open,
    close,
    confirm,
  };
}
