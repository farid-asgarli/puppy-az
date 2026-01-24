"use client";

import {
  IconSearch,
  IconMessageCircle,
  IconHeart,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { SectionHeader } from "@/lib/components/views/common";
import { useTranslations } from "next-intl";

export const HowItWorksSection = () => {
  const t = useTranslations("home.howItWorks");

  const steps = [
    {
      number: 1,
      icon: IconSearch,
      title: t("steps.search.title"),
      description: t("steps.search.description"),
      numberGradient: "from-primary-500 via-primary-600 to-primary-600",
      accentGradient: "from-info-500 via-info-600 to-info-600",
      bgGradient: "from-info-50 to-info-50",
      iconColor: "text-info-600",
    },
    {
      number: 2,
      icon: IconMessageCircle,
      title: t("steps.contact.title"),
      description: t("steps.contact.description"),
      numberGradient: "from-primary-500 via-primary-600 to-primary-600",
      accentGradient: "from-primary-500 via-primary-600 to-accent-600",
      bgGradient: "from-primary-50 to-accent-50",
      iconColor: "text-primary-600",
    },
    {
      number: 3,
      icon: IconShieldCheck,
      title: t("steps.meet.title"),
      description: t("steps.meet.description"),
      numberGradient: "from-primary-500 via-primary-600 to-primary-600",
      accentGradient: "from-green-500 via-green-600 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      iconColor: "text-green-600",
    },
    {
      number: 4,
      icon: IconHeart,
      title: t("steps.adopt.title"),
      description: t("steps.adopt.description"),
      numberGradient: "from-primary-500 via-primary-600 to-primary-600",
      accentGradient: "from-accent-500 via-accent-600 to-error-600",
      bgGradient: "from-accent-50 to-error-50",
      iconColor: "text-accent-600",
    },
  ];
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-info-100/40 to-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-accent-100/40 to-highlight-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-info-50 to-primary-50 border-2 border-info-100 rounded-full">
              <IconSparkles size={18} className="text-info-600" />
              <span className="text-sm font-semibold text-info-700">
                {t("badge")}
              </span>
            </div>
            <SectionHeader
              title={t("title")}
              subtitle={t("subtitle")}
              layout="stacked"
              align="center"
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLastStep = index === steps.length - 1;

              return (
                <div key={step.number} className="relative group">
                  {/* Connecting Arrow Line - Desktop only, not for last item */}
                  {!isLastStep && (
                    <div className="hidden lg:block absolute top-20 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] z-0">
                      <div className="relative h-0.5 bg-gradient-to-r from-gray-300 via-gray-200 to-transparent">
                        {/* Arrow head */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-gray-300 rotate-45" />
                      </div>
                    </div>
                  )}

                  {/* Step Card */}
                  <div
                    className={cn(
                      "relative bg-white rounded-3xl p-6 sm:p-7",
                      "border-2 border-gray-100",
                      "shadow-sm hover:shadow-xl",
                      "transition-all duration-300",
                      "hover:-translate-y-1",
                      "space-y-5",
                      "h-full flex flex-col",
                    )}
                  >
                    {/* Number Badge with Gradient */}
                    <div
                      className={cn(
                        "absolute -top-3 -right-3 w-11 h-11 sm:w-12 sm:h-12",
                        "rounded-full flex items-center justify-center",
                        "font-bold text-lg sm:text-xl text-white",
                        "shadow-lg",
                        "bg-gradient-to-br",
                        step.numberGradient,
                      )}
                    >
                      {step.number}
                    </div>

                    {/* Icon with Gradient Background */}
                    <div
                      className={cn(
                        "w-16 h-16 sm:w-18 sm:h-18 rounded-2xl",
                        "flex items-center justify-center",
                        "bg-gradient-to-br",
                        step.bgGradient,
                        "group-hover:scale-110 transition-transform duration-300",
                      )}
                    >
                      <Icon
                        size={32}
                        className={cn(step.iconColor, "drop-shadow-sm")}
                        strokeWidth={2}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-3 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-gray-900 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className={cn(
                        "h-1 w-12 rounded-full bg-gradient-to-r",
                        step.accentGradient,
                        "opacity-60",
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA with enhanced design */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 sm:p-8 text-center space-y-6">
              <p className="text-base sm:text-lg font-medium text-gray-700">
                {t("readyMessage")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                  <IconShieldCheck
                    size={18}
                    className="text-green-600"
                    strokeWidth={2.5}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t("secure")}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                  <IconHeart
                    size={18}
                    className="text-accent-600 fill-accent-600"
                    strokeWidth={2.5}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t("verifiedSellers")}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                  <IconMessageCircle
                    size={18}
                    className="text-info-600"
                    strokeWidth={2.5}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t("support")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
