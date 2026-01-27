"use client";

import { useFormContext } from "react-hook-form";
import {
  IconUser,
  IconMail,
  IconLock,
  IconPhone,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/external/utils";
import Button from "@/lib/primitives/button/button.component";
import Checkbox from "@/lib/form/components/checkbox/checkbox.component";
import { AuthFormField, AuthAlert } from "@/lib/components/views/auth";
import { RegisterFormData } from "../register.view";
import { useState } from "react";
import { sendVerificationCodeAction } from "@/lib/auth/actions";

interface PersonalInfoFormSectionProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onNext: () => void;
}

export function PersonalInfoFormSection({
  isLoading,
  setIsLoading,
  onNext,
}: PersonalInfoFormSectionProps) {
  const t = useTranslations("register.personalInfoForm");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useFormContext<RegisterFormData>();

  const [generalError, setGeneralError] = useState("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const password = watch("password");

  // Password strength checker
  const getPasswordStrength = (
    pwd: string,
  ): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2)
      return {
        score,
        label: t("passwordStrength.weak"),
        color: "text-red-600 bg-red-100",
      };
    if (score <= 3)
      return {
        score,
        label: t("passwordStrength.medium"),
        color: "text-yellow-600 bg-yellow-100",
      };
    return {
      score,
      label: t("passwordStrength.strong"),
      color: "text-green-600 bg-green-100",
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.acceptTerms) {
      setError("acceptTerms", { message: t("validation.acceptTermsRequired") });
      return;
    }

    setIsLoading(true);
    setGeneralError("");
    setErrorDetails([]);

    try {
      // Send phone number as-is (backend accepts both 501234567 and 0501234567)
      const result = await sendVerificationCodeAction({
        phoneNumber: data.phoneNumber,
        purpose: "Registration",
      });

      if (result.success) {
        onNext();
      } else {
        setGeneralError(result.error || t("errors.sendFailed"));
        setErrorDetails(result.details || []);
      }
    } catch {
      setGeneralError(t("errors.unknown"));
      setErrorDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* General Error */}
      {generalError && (
        <AuthAlert
          variant="error"
          message={generalError}
          details={errorDetails}
        />
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <AuthFormField
          type="text"
          label={t("fields.firstName")}
          icon={IconUser}
          placeholder={t("fields.firstNamePlaceholder")}
          error={errors.firstName?.message}
          disabled={isLoading}
          registerProps={register("firstName", {
            required: t("validation.firstNameRequired"),
            minLength: {
              value: 3,
              message: t("validation.firstNameMinLength"),
            },
          })}
        />

        {/* Last Name */}
        <AuthFormField
          type="text"
          label={t("fields.lastName")}
          icon={IconUser}
          placeholder={t("fields.lastNamePlaceholder")}
          error={errors.lastName?.message}
          disabled={isLoading}
          registerProps={register("lastName", {
            required: t("validation.lastNameRequired"),
            minLength: { value: 3, message: t("validation.lastNameMinLength") },
          })}
        />
      </div>

      {/* Email */}
      <AuthFormField
        type="email"
        label={t("fields.email")}
        icon={IconMail}
        placeholder={t("fields.emailPlaceholder")}
        error={errors.email?.message}
        disabled={isLoading}
        registerProps={register("email", {
          required: t("validation.emailRequired"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("validation.emailInvalid"),
          },
        })}
      />

      {/* Phone Number */}
      <div className="space-y-2">
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-900"
        >
          {t("fields.phone")}
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 border-r border-gray-200 pr-3">
            <IconPhone size={20} />
            <span className="text-sm font-medium">
              {t("fields.phonePrefix")}
            </span>
          </div>
          <input
            id="phoneNumber"
            type="tel"
            disabled={isLoading}
            placeholder={t("fields.phonePlaceholder")}
            className={cn(
              "w-full pl-24 pr-4 py-3 rounded-xl border-2 transition-all duration-200",
              "text-gray-900 placeholder:text-gray-400",
              "focus:outline-none focus:ring-0",
              errors.phoneNumber
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : "border-gray-200 bg-white focus:border-gray-900",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
            {...register("phoneNumber", {
              required: t("validation.phoneRequired"),
              pattern: {
                value: /^[0-9]{9}$/,
                message: t("validation.phoneInvalid"),
              },
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
              },
            })}
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <IconAlertCircle size={16} />
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <AuthFormField
          type="password"
          label={t("fields.password")}
          icon={IconLock}
          placeholder={t("fields.passwordPlaceholder")}
          error={errors.password?.message}
          disabled={isLoading}
          showPasswordToggle
          registerProps={register("password", {
            required: t("validation.passwordRequired"),
            minLength: { value: 6, message: t("validation.passwordMinLength") },
          })}
        />
        {password && passwordStrength.label && (
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
              passwordStrength.color,
            )}
          >
            {passwordStrength.label}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <AuthFormField
        type="password"
        label={t("fields.confirmPassword")}
        icon={IconLock}
        placeholder={t("fields.confirmPasswordPlaceholder")}
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        showPasswordToggle
        registerProps={register("confirmPassword", {
          required: t("validation.confirmPasswordRequired"),
          validate: (value) =>
            value === password || t("validation.passwordMismatch"),
        })}
      />

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="acceptTerms"
          disabled={isLoading}
          {...register("acceptTerms", {
            required: t("validation.acceptTermsRequired"),
          })}
        />
        <div className="flex-1">
          <label
            htmlFor="acceptTerms"
            className="text-sm text-gray-600 cursor-pointer"
          >
            {t("fields.acceptTermsText")}{" "}
            <a
              href="/terms"
              target="_blank"
              className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
            >
              {t("fields.termsOfService")}
            </a>{" "}
            {t("fields.and")}{" "}
            <a
              href="/privacy"
              target="_blank"
              className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
            >
              {t("fields.privacyPolicy")}
            </a>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
              <IconAlertCircle size={16} />
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="w-full rounded-xl font-semibold"
        disabled={isLoading}
      >
        {isLoading ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
