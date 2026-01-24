import React, { forwardRef, InputHTMLAttributes, useId, useState } from "react";
import { cn } from "@/lib/external/utils";
import { ComponentSizing } from "@/lib/types/component-sizing";
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: ComponentSizing;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  showPasswordToggle?: boolean; // Show/hide password toggle button
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      helperText,
      error,
      size = "md",
      fullWidth = true,
      containerClassName,
      labelClassName,
      inputClassName,
      helperTextClassName,
      errorClassName,
      className,
      id,
      disabled,
      showPasswordToggle = true,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const t = useTranslations("auth");

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn("mb-4", fullWidth && "w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block mb-2 font-semibold",
              size === "xs" && "text-xs",
              size === "sm" && "text-sm",
              size === "md" && "text-sm",
              size === "lg" && "text-base",
              size === "xl" && "text-lg",
              disabled ? "text-gray-400" : "text-gray-700",
              error && "text-red-600",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center rounded-2xl overflow-hidden transition-all duration-200 border-2",
            disabled && "bg-gray-50 cursor-not-allowed",
            error
              ? "border-red-500 bg-red-50/30"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white focus-within:border-primary-500 focus-within:bg-primary-50/30",
          )}
        >
          {/* Lock Icon */}
          <div className="flex items-center px-4 shrink-0">
            <IconLock
              size={18}
              className={cn("text-gray-400", error && "text-red-500")}
            />
          </div>

          <input
            id={inputId}
            ref={ref}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 bg-transparent focus:outline-none",
              // Use monospace font when password is visible for better character distinction (l vs i, 0 vs O)
              showPassword && "font-mono tracking-wide",
              size === "xs" && "py-1 text-xs",
              size === "sm" && "py-1.5 text-sm",
              size === "md" && "py-3 text-base",
              size === "lg" && "py-3.5 text-lg",
              size === "xl" && "py-4 text-xl",
              showPasswordToggle ? "pr-0" : "pr-4",
              disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900",
              error ? "placeholder-red-300" : "placeholder-gray-400",
              inputClassName,
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Show/Hide Password Toggle */}
          {showPasswordToggle && !disabled && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="flex items-center px-4 shrink-0 hover:opacity-70 transition-opacity"
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            >
              {showPassword ? (
                <IconEyeOff
                  size={18}
                  className={cn("text-gray-400", error && "text-red-500")}
                />
              ) : (
                <IconEye
                  size={18}
                  className={cn("text-gray-400", error && "text-red-500")}
                />
              )}
            </button>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className={cn("mt-1.5 text-sm text-red-600", errorClassName)}
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className={cn("mt-1.5 text-sm text-gray-500", helperTextClassName)}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
