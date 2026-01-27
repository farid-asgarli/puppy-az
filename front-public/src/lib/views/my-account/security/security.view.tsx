"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IconShield, IconKey } from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { Text } from "@/lib/primitives/typography";
import { changePasswordAction } from "@/lib/auth/actions";
import type { ChangePasswordCommand } from "@/lib/api/types/auth.types";
import PasswordInput from "@/lib/form/components/password/password-input.component";
import Button from "@/lib/primitives/button/button.component";
import { StatusMessage } from "@/lib/components/views/my-account/status-message/status-message.component";
import { PageHeader, InfoBanner } from "@/lib/components/views/common";
import { useTranslations } from "next-intl";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecurityView() {
  const t = useTranslations("myAccountPages.security");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const changePasswordData: ChangePasswordCommand = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      const result = await changePasswordAction(changePasswordData);

      if (result.success) {
        setSubmitStatus("success");
        reset(); // Clear form

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 5000);
      } else {
        setSubmitStatus("error");
        // Show details if available, otherwise show error message
        const errorText =
          result.details && result.details.length > 0
            ? result.details.join(". ")
            : result.error || t("messages.error.updateFailed");
        setErrorMessage(errorText);
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(t("messages.error.generalError"));
      console.error("Password change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (
    password: string,
  ): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return {
        strength,
        label: t("changePassword.strength.weak"),
        color: "red",
      };
    if (strength <= 3)
      return {
        strength,
        label: t("changePassword.strength.medium"),
        color: "amber",
      };
    if (strength <= 4)
      return {
        strength,
        label: t("changePassword.strength.strong"),
        color: "green",
      };
    return {
      strength,
      label: t("changePassword.strength.veryStrong"),
      color: "green",
    };
  };

  const passwordStrength = getPasswordStrength(newPassword || "");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        maxWidth="lg"
      />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Status Messages */}
          {submitStatus === "success" && (
            <StatusMessage
              variant="success"
              title={t("messages.success.title")}
              message={t("messages.success.message")}
            />
          )}

          {submitStatus === "error" && (
            <StatusMessage
              variant="error"
              title={t("messages.error.title")}
              message={errorMessage}
            />
          )}

          {/* Change Password Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <IconKey size={20} className="sm:w-6 sm:h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {t("changePassword.title")}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {t("changePassword.subtitle")}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              {/* Current Password */}
              <PasswordInput
                label={t("changePassword.currentPassword.label")}
                placeholder={t("changePassword.currentPassword.placeholder")}
                error={errors.currentPassword?.message}
                {...register("currentPassword", {
                  required: t("changePassword.currentPassword.required"),
                })}
              />

              {/* New Password */}
              <div>
                <PasswordInput
                  label={t("changePassword.newPassword.label")}
                  placeholder={t("changePassword.newPassword.placeholder")}
                  error={errors.newPassword?.message}
                  {...register("newPassword", {
                    required: t("changePassword.newPassword.required"),
                    minLength: {
                      value: 8,
                      message: t("changePassword.newPassword.minLength"),
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: t("changePassword.newPassword.pattern"),
                    },
                  })}
                />

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2 sm:mt-3">
                    <div className="flex items-center justify-between">
                      <Text variant="small" color="secondary">
                        {t("changePassword.passwordStrength")}:
                      </Text>
                      <Text
                        variant="small"
                        weight="semibold"
                        as="span"
                        className={cn(
                          passwordStrength.color === "red" && "text-red-600",
                          passwordStrength.color === "amber" &&
                            "text-amber-600",
                          passwordStrength.color === "green" &&
                            "text-green-600",
                        )}
                      >
                        {passwordStrength.label}
                      </Text>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          passwordStrength.color === "red" && "bg-red-500",
                          passwordStrength.color === "amber" && "bg-amber-500",
                          passwordStrength.color === "green" && "bg-green-500",
                        )}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <PasswordInput
                label={t("changePassword.confirmPassword.label")}
                placeholder={t("changePassword.confirmPassword.placeholder")}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: t("changePassword.confirmPassword.required"),
                  validate: (value) =>
                    value === newPassword ||
                    t("changePassword.confirmPassword.mustMatch"),
                })}
              />

              {/* Submit Button */}
              <div className="pt-1 sm:pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="solid"
                  fullWidth
                  leftSection={
                    <IconShield size={18} className="sm:w-5 sm:h-5" />
                  }
                >
                  {isSubmitting ? t("actions.saving") : t("actions.save")}
                </Button>
              </div>
            </form>
          </div>

          {/* Security Tips */}
          <InfoBanner
            variant="default"
            title={t("infoBanner.title")}
            description={
              <ul className="space-y-1.5 sm:space-y-2">
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{t("requirements.minLength")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{t("requirements.upperLower")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{t("requirements.number")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{t("requirements.special")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{t("requirements.noPersonal")}</span>
                </li>
              </ul>
            }
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
