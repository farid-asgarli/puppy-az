"use client";

import { useState } from "react";
import {
  IconAlertTriangle,
  IconShieldCheck,
  IconMail,
  IconPhoto,
  IconCurrencyManat,
  IconCopy,
  IconBan,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import TransitionLink from "@/lib/components/transition-link";
import toast from "react-hot-toast";

type ReportType = "fake" | "scam" | "inappropriate" | "spam" | "other";

interface FormData {
  type: ReportType;
  adLink: string;
  description: string;
  email: string;
}

const ReportView = () => {
  const t = useTranslations("report");
  const [formData, setFormData] = useState<FormData>({
    type: "fake",
    adLink: "",
    description: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return true; // optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const reportTypes: {
    value: ReportType;
    icon: typeof IconPhoto;
    label: string;
    description: string;
  }[] = [
    {
      value: "fake",
      icon: IconPhoto,
      label: t("types.fake.label"),
      description: t("types.fake.description"),
    },
    {
      value: "scam",
      icon: IconCurrencyManat,
      label: t("types.scam.label"),
      description: t("types.scam.description"),
    },
    {
      value: "inappropriate",
      icon: IconBan,
      label: t("types.inappropriate.label"),
      description: t("types.inappropriate.description"),
    },
    {
      value: "spam",
      icon: IconCopy,
      label: t("types.spam.label"),
      description: t("types.spam.description"),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    // Show success toast
    toast.success(t("success.title"));

    // Reset form
    setFormData({
      type: "fake",
      adLink: "",
      description: "",
      email: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-2">
            <Heading variant="page-title" as="h1">
              {t("hero.title")}
            </Heading>
            <Text variant="body-lg" color="secondary">
              {t("hero.subtitle")}
            </Text>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Report Type Selection */}
              <div className="space-y-4">
                <Heading variant="subsection" as="h2">
                  {t("form.typeLabel")}
                </Heading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reportTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: type.value })
                      }
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        formData.type === type.value
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            formData.type === type.value
                              ? "bg-primary-100"
                              : "bg-gray-100",
                          )}
                        >
                          <type.icon
                            size={20}
                            className={
                              formData.type === type.value
                                ? "text-primary-600"
                                : "text-gray-500"
                            }
                          />
                        </div>
                        <div>
                          <Text
                            variant="body"
                            className={cn(
                              "font-medium",
                              formData.type === type.value &&
                                "text-primary-700",
                            )}
                          >
                            {type.label}
                          </Text>
                          <Text variant="body-sm" color="secondary">
                            {type.description}
                          </Text>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad Link */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.adLink")}
                </label>
                <input
                  type="text"
                  name="adLink"
                  value={formData.adLink}
                  onChange={handleChange}
                  placeholder={t("form.adLinkPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors"
                />
                <Text variant="body-sm" color="secondary">
                  {t("form.adLinkHint")}
                </Text>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.description")}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("form.descriptionPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("form.email")}
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (emailError) setEmailError(false);
                  }}
                  placeholder={t("form.emailPlaceholder")}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-colors",
                    emailError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-primary-500",
                  )}
                />
                {emailError ? (
                  <Text variant="body-sm" className="text-red-500">
                    {t("form.emailError")}
                  </Text>
                ) : (
                  <Text variant="body-sm" color="secondary">
                    {t("form.emailHint")}
                  </Text>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.description}
                className={cn(
                  "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                  isSubmitting || !formData.description
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800",
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("form.submitting")}
                  </>
                ) : (
                  <>
                    <IconAlertTriangle size={20} />
                    {t("form.submit")}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="p-6 rounded-xl border-2 border-gray-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <IconShieldCheck size={24} className="text-primary-600" />
              </div>
              <div>
                <Heading variant="card" as="h3" className="mb-2">
                  {t("sidebar.security.title")}
                </Heading>
                <Text variant="body" color="secondary">
                  {t("sidebar.security.description")}
                </Text>
              </div>
            </div>

            {/* Process Info */}
            <div className="p-6 rounded-xl bg-gray-50 space-y-4">
              <Heading variant="label" as="h4">
                {t("sidebar.process.title")}
              </Heading>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">
                      1
                    </span>
                  </div>
                  <Text variant="body-sm" color="secondary">
                    {t("sidebar.process.step1")}
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">
                      2
                    </span>
                  </div>
                  <Text variant="body-sm" color="secondary">
                    {t("sidebar.process.step2")}
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">
                      3
                    </span>
                  </div>
                  <Text variant="body-sm" color="secondary">
                    {t("sidebar.process.step3")}
                  </Text>
                </div>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <IconMail size={20} className="text-gray-600" />
                </div>
                <div>
                  <Text variant="body" className="font-medium mb-1">
                    {t("sidebar.directContact.title")}
                  </Text>
                  <a
                    href="mailto:report@puppy.az"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    report@puppy.az
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
