import { Empty, Button } from "antd";
import { InboxOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="py-16 px-4">
      <Empty
        image={icon || <InboxOutlined className="text-6xl text-gray-300" />}
        description={
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {title || t("common.noData")}
            </p>
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
          </div>
        }
      >
        {action && (
          <Button type="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </Empty>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="py-16 px-4 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error-100 dark:bg-error-900/30 flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title || t("error.generic")}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}
      {onRetry && (
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
