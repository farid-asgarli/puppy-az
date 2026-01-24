"use client";

import { cn } from "@/lib/external/utils";
import { Text } from "@/lib/primitives/typography";
import { useTranslations } from "next-intl";
import type { SettingActionItemProps } from "./setting-action-item.types";

const buttonStyles = {
  primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
  secondary:
    "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 focus:ring-gray-900",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
};

/**
 * Setting item with action button
 * Used for settings that trigger an action (download, delete, etc.)
 */
export const SettingActionItem: React.FC<SettingActionItemProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionVariant = "primary",
  onAction,
  disabled = false,
  loading = false,
  className,
}) => {
  const t = useTranslations("common");
  const isDanger = actionVariant === "danger";

  return (
    <div
      className={cn(
        "flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border-2 border-gray-200",
        "hover:border-gray-300 transition-colors",
        disabled && "opacity-50",
        className,
      )}
    >
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <Icon
          size={20}
          className={cn(
            "sm:w-[22px] sm:h-[22px]",
            isDanger ? "text-red-600" : "text-gray-700",
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <Text
          variant="body"
          weight="semibold"
          color={isDanger ? "primary" : "primary"}
          className={cn(
            "mb-1 text-sm sm:text-base",
            isDanger && "text-red-600",
          )}
          as="div"
        >
          {title}
        </Text>
        <Text variant="small" className="text-xs sm:text-sm" as="div">
          {description}
        </Text>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={onAction}
          disabled={disabled || loading}
          className={cn(
            "px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg font-semibold transition-colors text-sm sm:text-base",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            buttonStyles[actionVariant],
            (disabled || loading) && "opacity-50 cursor-not-allowed",
          )}
          aria-label={`${actionLabel} - ${title}`}
          aria-busy={loading}
        >
          {loading ? t("loading") : actionLabel}
        </button>
      </div>
    </div>
  );
};

export default SettingActionItem;
