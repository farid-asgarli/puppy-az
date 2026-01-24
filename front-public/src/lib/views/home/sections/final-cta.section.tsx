"use client";

import {
  IconSearch,
  IconPlus,
  IconPaw,
  IconHeart,
  IconSparkles,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { useTranslations } from "next-intl";

export const FinalCtaSection = () => {
  const { navigateWithTransition } = useViewTransition();
  const t = useTranslations("home.finalCta");

  const handleBrowseAds = () => {
    navigateWithTransition("/ads/s");
  };

  const handlePostAd = () => {
    navigateWithTransition("/ads/ad-placement");
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 p-8 sm:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient orbs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-info-500/20 to-primary-500/20 rounded-full blur-3xl" />

            {/* Floating icons */}
            <div className="absolute top-12 right-12 opacity-10">
              <IconPaw size={60} className="text-white" />
            </div>
            <div className="absolute bottom-12 left-12 opacity-10">
              <IconHeart size={50} className="text-white" />
            </div>
            <div className="absolute top-1/2 left-1/4 opacity-5">
              <IconSparkles size={70} className="text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="relative max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Icon badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20">
              <IconPaw size={32} className="text-white" strokeWidth={2} />
            </div>

            {/* Heading */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-heading text-white leading-tight">
                {t("title")}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              {/* Primary CTA */}
              <button
                onClick={handleBrowseAds}
                className={cn(
                  "w-full sm:w-auto group",
                  "px-8 py-4 rounded-xl",
                  "bg-white text-gray-900 font-semibold text-base sm:text-lg",
                  "hover:bg-gray-100 hover:shadow-xl",
                  "transition-all duration-200",
                  "flex items-center justify-center gap-3",
                  "focus:outline-none focus:ring-4 focus:ring-white/30",
                )}
              >
                <IconSearch size={24} />
                <span>{t("browseAdsButton")}</span>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={handlePostAd}
                className={cn(
                  "w-full sm:w-auto group",
                  "px-8 py-4 rounded-xl",
                  "bg-white/10 text-white font-semibold text-base sm:text-lg",
                  "border-2 border-white/30",
                  "hover:bg-white/20 hover:border-white/50 hover:shadow-lg",
                  "backdrop-blur-sm",
                  "transition-all duration-200",
                  "flex items-center justify-center gap-3",
                  "focus:outline-none focus:ring-4 focus:ring-white/20",
                )}
              >
                <IconPlus size={24} />
                <span>{t("postAdButton")}</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 sm:pt-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>{t("trustIndicators.freeRegistration")}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full" />
                <div className="flex items-center gap-2">
                  <IconHeart
                    size={18}
                    className="text-accent-400 fill-accent-400"
                  />
                  <span>{t("trustIndicators.activeAds")}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full" />
                <div className="flex items-center gap-2">
                  <IconSparkles size={18} className="text-yellow-400" />
                  <span>{t("trustIndicators.safePlatform")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
