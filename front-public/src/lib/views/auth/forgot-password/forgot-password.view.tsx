"use client";

import { useState } from "react";
import { IconMail, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Button from "@/lib/primitives/button/button.component";
import TransitionLink from "@/lib/components/transition-link";
import { AuthFormField } from "@/lib/components/views/auth";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { AppLogo } from "@/lib/components/logo/logo";

export default function ForgotPasswordView() {
  const t = useTranslations("forgotPassword");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (): boolean => {
    if (!email) {
      setError(t("validation.emailRequired"));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("validation.emailInvalid"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const result = await forgotPasswordAction({ email });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || t("errors.requestFailed"));
      }
    } catch {
      setError(t("errors.unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <AppLogo showTagline={false} />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <IconCheck size={40} className="text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("success.title")}
            </h1>
            <p className="text-gray-600">{t("success.description")}</p>
            <p className="text-sm text-gray-500">
              {t("success.emailSentTo")}{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <p className="text-sm text-gray-600">{t("success.checkSpam")}</p>
          </div>

          {/* Back to Login */}
          <TransitionLink
            href="/auth"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            <IconArrowLeft size={18} />
            {t("backToLogin")}
          </TransitionLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <AppLogo showTagline={false} />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthFormField
            type="email"
            label={t("fields.email")}
            icon={IconMail}
            placeholder="email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            error={error || undefined}
            disabled={isLoading}
          />

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

        {/* Back to Login */}
        <div className="text-center">
          <TransitionLink
            href="/auth"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <IconArrowLeft size={18} />
            {t("backToLogin")}
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
