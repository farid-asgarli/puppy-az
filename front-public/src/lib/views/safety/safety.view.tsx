"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/external/utils";
import { Heading, Text } from "@/lib/primitives/typography";
import {
  IconShieldCheck,
  IconAlertTriangle,
  IconUserCheck,
  IconCreditCard,
  IconMapPin,
  IconPhone,
  IconPhoto,
  IconMessageCircle,
  IconPaw,
  IconChevronDown,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconHeartHandshake,
  IconEye,
  IconLock,
  IconBuildingBank,
} from "@tabler/icons-react";

interface SafetyTip {
  id: string;
  icon: typeof IconShieldCheck;
  title: string;
  description: string;
  tips: string[];
  color: string;
  bgColor: string;
}

interface WarningSign {
  id: string;
  text: string;
  severity: "high" | "medium";
}

const SafetyView = () => {
  const t = useTranslations("safety");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "buyers",
  );

  const safetyTips: SafetyTip[] = [
    {
      id: "buyers",
      icon: IconUserCheck,
      title: t("tips.buyers.title"),
      description: t("tips.buyers.description"),
      tips: [
        t("tips.buyers.tip1"),
        t("tips.buyers.tip2"),
        t("tips.buyers.tip3"),
        t("tips.buyers.tip4"),
        t("tips.buyers.tip5"),
        t("tips.buyers.tip6"),
      ],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "sellers",
      icon: IconHeartHandshake,
      title: t("tips.sellers.title"),
      description: t("tips.sellers.description"),
      tips: [
        t("tips.sellers.tip1"),
        t("tips.sellers.tip2"),
        t("tips.sellers.tip3"),
        t("tips.sellers.tip4"),
        t("tips.sellers.tip5"),
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "meetings",
      icon: IconMapPin,
      title: t("tips.meetings.title"),
      description: t("tips.meetings.description"),
      tips: [
        t("tips.meetings.tip1"),
        t("tips.meetings.tip2"),
        t("tips.meetings.tip3"),
        t("tips.meetings.tip4"),
        t("tips.meetings.tip5"),
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "payments",
      icon: IconCreditCard,
      title: t("tips.payments.title"),
      description: t("tips.payments.description"),
      tips: [
        t("tips.payments.tip1"),
        t("tips.payments.tip2"),
        t("tips.payments.tip3"),
        t("tips.payments.tip4"),
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const warningSignsHigh: WarningSign[] = [
    { id: "1", text: t("warnings.high.price"), severity: "high" },
    { id: "2", text: t("warnings.high.deposit"), severity: "high" },
    { id: "3", text: t("warnings.high.noMeet"), severity: "high" },
    { id: "4", text: t("warnings.high.pressure"), severity: "high" },
    { id: "5", text: t("warnings.high.shipping"), severity: "high" },
  ];

  const warningSignsMedium: WarningSign[] = [
    { id: "1", text: t("warnings.medium.photos"), severity: "medium" },
    { id: "2", text: t("warnings.medium.vague"), severity: "medium" },
    { id: "3", text: t("warnings.medium.contact"), severity: "medium" },
    { id: "4", text: t("warnings.medium.location"), severity: "medium" },
  ];

  const bestPractices = [
    {
      icon: IconEye,
      title: t("practices.verify.title"),
      description: t("practices.verify.description"),
    },
    {
      icon: IconPhoto,
      title: t("practices.photos.title"),
      description: t("practices.photos.description"),
    },
    {
      icon: IconMessageCircle,
      title: t("practices.communicate.title"),
      description: t("practices.communicate.description"),
    },
    {
      icon: IconLock,
      title: t("practices.privacy.title"),
      description: t("practices.privacy.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Decorative paws */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <IconPaw
            size={70}
            className="absolute top-10 left-[10%] text-emerald-200/50 rotate-[-15deg]"
          />
          <IconPaw
            size={50}
            className="absolute top-20 right-[15%] text-blue-200/50 rotate-[20deg]"
          />
          <IconPaw
            size={55}
            className="absolute bottom-16 left-[18%] text-emerald-200/40 rotate-[10deg]"
          />
          <IconPaw
            size={40}
            className="absolute bottom-24 right-[12%] text-blue-200/50 rotate-[-20deg]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200">
              <IconShieldCheck size={18} className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconCheck size={18} className="text-emerald-500" />
                <span>{t("hero.stat1")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconCheck size={18} className="text-emerald-500" />
                <span>{t("hero.stat2")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconCheck size={18} className="text-emerald-500" />
                <span>{t("hero.stat3")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-16">
        {/* Safety Tips Accordion */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Heading variant="section" as="h2" className="text-gray-900 mb-3">
              {t("sections.tips.title")}
            </Heading>
            <Text variant="body" className="text-gray-600 max-w-2xl mx-auto">
              {t("sections.tips.subtitle")}
            </Text>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {safetyTips.map((tip) => {
              const Icon = tip.icon;
              const isExpanded = expandedSection === tip.id;

              return (
                <div
                  key={tip.id}
                  className={cn(
                    "rounded-2xl border transition-all duration-300",
                    isExpanded
                      ? "border-gray-200 shadow-md"
                      : "border-gray-100 hover:border-gray-200",
                  )}
                >
                  <button
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : tip.id)
                    }
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          tip.bgColor,
                        )}
                      >
                        <Icon size={24} className={tip.color} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {tip.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tip.description}
                        </div>
                      </div>
                    </div>
                    <IconChevronDown
                      size={20}
                      className={cn(
                        "text-gray-400 transition-transform duration-300",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5">
                      <div className="pt-4 border-t border-gray-100">
                        <ul className="space-y-3">
                          {tip.tips.map((tipText, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <IconCheck
                                size={18}
                                className={cn("shrink-0 mt-0.5", tip.color)}
                              />
                              <span className="text-gray-700">{tipText}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning Signs */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Heading variant="section" as="h2" className="text-gray-900 mb-3">
              {t("sections.warnings.title")}
            </Heading>
            <Text variant="body" className="text-gray-600 max-w-2xl mx-auto">
              {t("sections.warnings.subtitle")}
            </Text>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* High Severity */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <IconAlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <div className="font-semibold text-red-900">
                    {t("warnings.highTitle")}
                  </div>
                  <div className="text-xs text-red-600">
                    {t("warnings.highSubtitle")}
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {warningSignsHigh.map((warning) => (
                  <li key={warning.id} className="flex items-start gap-3">
                    <IconX size={16} className="shrink-0 mt-1 text-red-500" />
                    <span className="text-sm text-red-800">{warning.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Medium Severity */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <IconInfoCircle size={20} className="text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-amber-900">
                    {t("warnings.mediumTitle")}
                  </div>
                  <div className="text-xs text-amber-600">
                    {t("warnings.mediumSubtitle")}
                  </div>
                </div>
              </div>
              <ul className="space-y-3">
                {warningSignsMedium.map((warning) => (
                  <li key={warning.id} className="flex items-start gap-3">
                    <IconAlertTriangle
                      size={16}
                      className="shrink-0 mt-1 text-amber-500"
                    />
                    <span className="text-sm text-amber-800">
                      {warning.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Heading variant="section" as="h2" className="text-gray-900 mb-3">
              {t("sections.practices.title")}
            </Heading>
            <Text variant="body" className="text-gray-600 max-w-2xl mx-auto">
              {t("sections.practices.subtitle")}
            </Text>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-gray-700" />
                  </div>
                  <div className="font-semibold text-gray-900 mb-2">
                    {practice.title}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {practice.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
              <IconShieldCheck size={32} className="text-white" />
            </div>
            <Heading variant="section" as="h2" className="text-white">
              {t("report.title")}
            </Heading>
            <Text variant="body" className="text-gray-300">
              {t("report.description")}
            </Text>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="mailto:safety@puppy.az"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                <IconPhone size={18} />
                {t("report.contact")}
              </a>
            </div>
            <p className="text-sm text-gray-400">{t("report.note")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyView;
