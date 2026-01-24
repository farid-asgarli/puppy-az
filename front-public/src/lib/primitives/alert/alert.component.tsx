import { cn } from "@/lib/external/utils";

import { cva, type VariantProps } from "class-variance-authority";
import {
  IconX,
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
} from "@tabler/icons-react";

/**
 * Alert/Banner variants for info boxes, notifications, and messages
 */
const alertVariants = cva(
  "rounded-2xl border-2 flex items-start gap-3 transition-all",
  {
    variants: {
      variant: {
        info: "bg-info-50 border-info-200",
        success: "bg-success-50 border-success-200",
        warning: "bg-warning-50 border-warning-200",
        error: "bg-error-50 border-error-200",
        neutral: "bg-gray-100 border-gray-200",
        purple: "bg-primary-50 border-primary-200",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-4 sm:p-6",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  },
);

const iconContainerVariants = cva(
  "flex-shrink-0 rounded-xl flex items-center justify-center",
  {
    variants: {
      variant: {
        info: "bg-info-100 text-info-600",
        success: "bg-success-100 text-success-600",
        warning: "bg-warning-100 text-warning-600",
        error: "bg-error-100 text-error-600",
        neutral: "bg-gray-200 text-gray-600",
        purple: "bg-primary-100 text-primary-600",
      },
      size: {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  },
);

const textVariants = cva("", {
  variants: {
    variant: {
      info: "text-info-900",
      success: "text-success-900",
      warning: "text-warning-900",
      error: "text-error-900",
      neutral: "text-gray-900",
      purple: "text-primary-900",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

/**
 * Default icons for each variant
 */
const defaultIcons = {
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  error: IconAlertCircle,
  neutral: IconInfoCircle,
  purple: IconInfoCircle,
};

type AlertVariant =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "purple";

interface AlertProps
  extends
    Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof alertVariants> {
  /**
   * Alert title/heading
   */
  title?: React.ReactNode;
  /**
   * Alert description/message
   */
  description?: React.ReactNode;
  /**
   * Custom icon (overrides default)
   */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /**
   * Icon size in pixels
   */
  iconSize?: number;
  /**
   * Show close button
   */
  closable?: boolean;
  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;
  /**
   * Hide the icon completely
   */
  hideIcon?: boolean;
  /**
   * Accessibility label for close button
   */
  closeAriaLabel?: string;
}

/**
 * Alert component for info boxes, banners, and notifications
 *
 * @example
 * // Info alert with default icon
 * <Alert
 *   variant="info"
 *   title="Important Information"
 *   description="Your account has been verified successfully."
 * />
 *
 * @example
 * // Success alert
 * <Alert
 *   variant="success"
 *   title="Success!"
 *   description="Your changes have been saved."
 * />
 *
 * @example
 * // Warning with custom icon
 * <Alert
 *   variant="warning"
 *   icon={IconShield}
 *   title="Security Warning"
 *   description="Please enable two-factor authentication."
 * />
 *
 * @example
 * // Closable error alert
 * <Alert
 *   variant="error"
 *   title="Error"
 *  oseAriaLabel,
  cl description="Failed to submit form. Please try again."
 *   closable
 *   onClose={() => console.log('closed')}
 * />
 *
 * @example
 * // Custom content without icon
 * <Alert variant="neutral" hideIcon>
 *   <div>Custom content goes here</div>
 * </Alert>
 */
export default function Alert({
  variant = "info",
  size = "md",
  title,
  description,
  icon,
  iconSize,
  closable = false,
  onClose,
  hideIcon = false,
  closeAriaLabel,
  className,
  children,
  ...props
}: AlertProps) {
  const IconComponent = icon || defaultIcons[variant as AlertVariant];
  const defaultIconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  return (
    <div
      className={cn(alertVariants({ variant, size }), className)}
      role="alert"
      {...props}
    >
      {!hideIcon && (
        <div className={iconContainerVariants({ variant, size })}>
          <IconComponent size={iconSize || defaultIconSize} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <h3
            className={cn(
              "text-sm font-semibold mb-1",
              textVariants({ variant }),
              !description && "mb-0",
            )}
          >
            {title}
          </h3>
        )}
        {description && (
          <div
            className={cn("text-xs", textVariants({ variant }), "opacity-90")}
          >
            {description}
          </div>
        )}
        {children}
      </div>

      {closable && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors",
            textVariants({ variant }),
          )}
          aria-label={closeAriaLabel}
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}

// Export variants for external use if needed
export { alertVariants, iconContainerVariants, textVariants };
