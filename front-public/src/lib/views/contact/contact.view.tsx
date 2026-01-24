"use client";

import { useState } from "react";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconClock,
  IconSend,
  IconCheck,
  IconQuestionMark,
  IconBulb,
  IconAlertCircle,
  IconMessage,
  IconArrowRight,
  IconSparkles,
  IconMessageCircle,
  IconPaw,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import TransitionLink from "@/lib/components/transition-link";

type MessageType = "question" | "suggestion" | "problem" | "other";

interface FormData {
  name: string;
  email: string;
  type: MessageType;
  subject: string;
  message: string;
}

const ContactView = () => {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    type: "question",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const messageTypes: {
    value: MessageType;
    icon: typeof IconQuestionMark;
    label: string;
    color: string;
    bg: string;
  }[] = [
    {
      value: "question",
      icon: IconQuestionMark,
      label: t("form.types.question"),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      value: "suggestion",
      icon: IconBulb,
      label: t("form.types.suggestion"),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      value: "problem",
      icon: IconAlertCircle,
      label: t("form.types.problem"),
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      value: "other",
      icon: IconMessage,
      label: t("form.types.other"),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        type: "question",
        subject: "",
        message: "",
      });
    }, 4000);
  };

  const contactInfo = [
    {
      icon: IconMail,
      title: t("info.email.title"),
      value: "info@puppy.az",
      href: "mailto:info@puppy.az",
      iconColor: "text-primary-500",
      bgColor: "bg-primary-50",
    },
    {
      icon: IconPhone,
      title: t("info.phone.title"),
      value: "+994 50 123 45 67",
      href: "tel:+994501234567",
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      icon: IconMapPin,
      title: t("info.address.title"),
      value: t("info.address.value"),
      href: null,
      iconColor: "text-accent-500",
      bgColor: "bg-accent-50",
    },
    {
      icon: IconClock,
      title: t("info.workingHours.title"),
      value: t("info.workingHours.value"),
      href: null,
      iconColor: "text-info-500",
      bgColor: "bg-info-50",
    },
  ];

  const socialLinks = [
    {
      icon: IconBrandInstagram,
      name: "Instagram",
      href: "https://instagram.com/puppy.az",
      color: "text-pink-500 hover:text-pink-600",
      bg: "bg-pink-50 hover:bg-pink-100",
    },
    {
      icon: IconBrandFacebook,
      name: "Facebook",
      href: "https://facebook.com/puppy.az",
      color: "text-blue-500 hover:text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      icon: IconBrandTiktok,
      name: "TikTok",
      href: "https://tiktok.com/@puppy.az",
      color: "text-gray-700 hover:text-gray-900",
      bg: "bg-gray-100 hover:bg-gray-200",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50/80 via-white to-accent-50/50">
        {/* Decorative paw prints */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <IconPaw
            size={80}
            className="absolute top-8 left-[8%] text-primary-200/40 rotate-[-20deg]"
          />
          <IconPaw
            size={50}
            className="absolute top-20 right-[15%] text-accent-200/50 rotate-[15deg]"
          />
          <IconPaw
            size={60}
            className="absolute bottom-12 left-[20%] text-primary-200/30 rotate-[25deg]"
          />
          <IconPaw
            size={45}
            className="absolute bottom-20 right-[10%] text-accent-200/40 rotate-[-10deg]"
          />
          <IconPaw
            size={35}
            className="absolute top-1/2 left-[5%] text-info-200/30 rotate-[30deg]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-emerald-700">
                  {t("hero.badge")}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  {t("hero.title")}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg">
                  {t("hero.subtitle")}
                </p>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <IconClock size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      &lt;1 {t("hero.stats.hour")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("hero.stats.responseTime")}
                    </div>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <IconMessageCircle size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      24/7
                    </div>
                    <div className="text-xs text-gray-500">
                      {t("hero.stats.support")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Abstract Visual */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-80 h-72">
                {/* Gradient blobs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full blur-2xl opacity-60" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-2xl opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-xl opacity-70" />

                {/* Floating paws */}
                <IconPaw
                  size={40}
                  className="absolute top-6 left-8 text-emerald-400/70 rotate-[-15deg]"
                />
                <IconPaw
                  size={28}
                  className="absolute top-16 right-12 text-blue-400/60 rotate-[20deg]"
                />
                <IconPaw
                  size={32}
                  className="absolute bottom-16 left-16 text-indigo-400/50 rotate-[10deg]"
                />
                <IconPaw
                  size={24}
                  className="absolute bottom-8 right-20 text-emerald-400/60 rotate-[-20deg]"
                />

                {/* Center icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-gray-100">
                    <IconSend size={36} className="text-gray-800" />
                  </div>
                </div>

                {/* Mini floating cards */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-gray-700">
                      {t("hero.badge")}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/50">
                  <div className="flex items-center gap-2">
                    <IconClock size={12} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-700">
                      &lt;1 {t("hero.stats.hour")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Details */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Heading variant="section" as="h2" className="text-gray-900">
                  {t("sections.contactInfo.title")}
                </Heading>
                <Text variant="body" className="text-gray-500">
                  {t("sections.contactInfo.subtitle")}
                </Text>
              </div>

              <div className="space-y-3">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                      <div
                        className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                          item.bgColor,
                        )}
                      >
                        <Icon size={20} className={item.iconColor} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Text
                          variant="small"
                          className="text-gray-400 font-medium"
                        >
                          {item.title}
                        </Text>
                        <Text
                          variant="body"
                          weight="medium"
                          className="text-gray-900"
                        >
                          {item.value}
                        </Text>
                      </div>
                      {item.href && (
                        <IconArrowRight
                          size={18}
                          className="text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                        />
                      )}
                    </div>
                  );

                  return item.href ? (
                    <a key={index} href={item.href} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Heading variant="card" as="h3" className="text-gray-900">
                  {t("sections.social.title")}
                </Heading>
                <Text variant="small" className="text-gray-500">
                  {t("sections.social.subtitle")}
                </Text>
              </div>

              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                        social.bg,
                        social.color,
                      )}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Help Center Link */}
            <TransitionLink
              href="/help"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-50/80 to-accent-50/60 border border-primary-100/60 hover:border-primary-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-white/80 border border-primary-200/50 flex items-center justify-center">
                <IconSparkles size={18} className="text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <Text variant="body" weight="medium" className="text-gray-800">
                  {t("quickLinks.help.title")}
                </Text>
                <Text variant="small" className="text-gray-500">
                  {t("quickLinks.help.description")}
                </Text>
              </div>
              <IconArrowRight
                size={18}
                className="text-primary-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
              />
            </TransitionLink>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 lg:p-10">
              {isSubmitted ? (
                /* Success State */
                <div className="py-14 text-center space-y-5">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <IconCheck size={32} className="text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <Heading
                      variant="section"
                      as="h3"
                      className="text-gray-900"
                    >
                      {t("form.success.title")}
                    </Heading>
                    <Text variant="body" className="text-gray-500">
                      {t("form.success.message")}
                    </Text>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Header */}
                  <div className="space-y-1.5">
                    <Heading
                      variant="section"
                      as="h2"
                      className="text-gray-900"
                    >
                      {t("form.title")}
                    </Heading>
                    <Text variant="body" className="text-gray-500">
                      {t("form.subtitle")}
                    </Text>
                  </div>

                  {/* Message Type Selection */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("form.typeLabel")}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {messageTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = formData.type === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, type: type.value })
                            }
                            className={cn(
                              "flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200",
                              isSelected
                                ? "border-gray-900 bg-white shadow-sm"
                                : "border-gray-100 bg-white hover:border-gray-200",
                            )}
                          >
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                                isSelected ? type.bg : "bg-gray-50",
                              )}
                            >
                              <Icon
                                size={20}
                                className={
                                  isSelected ? type.color : "text-gray-400"
                                }
                              />
                            </div>
                            <span
                              className={cn(
                                "text-xs font-medium transition-colors",
                                isSelected ? "text-gray-800" : "text-gray-500",
                              )}
                            >
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t("form.name")}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={t("form.namePlaceholder")}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-50 outline-none transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t("form.email")}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder={t("form.emailPlaceholder")}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-50 outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("form.subject")}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder={t("form.subjectPlaceholder")}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-50 outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t("form.message")}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={t("form.messagePlaceholder")}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 placeholder:font-normal placeholder:text-sm focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-50 outline-none transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-white transition-all duration-200",
                      "bg-gray-900 hover:bg-gray-800 active:scale-[0.99]",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t("form.sending")}</span>
                      </>
                    ) : (
                      <>
                        <IconSend size={18} />
                        <span>{t("form.submit")}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-14">
          <div className="max-w-xl mx-auto text-center space-y-5">
            <div className="space-y-2">
              <Heading variant="section" as="h2" className="text-gray-900">
                {t("faq.title")}
              </Heading>
              <Text variant="body" className="text-gray-500">
                {t("faq.subtitle")}
              </Text>
            </div>
            <TransitionLink
              href="/help"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200"
            >
              <IconQuestionMark size={18} />
              <span>{t("faq.button")}</span>
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
