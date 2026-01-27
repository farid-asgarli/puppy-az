"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState, useCallback, useMemo } from "react";
import TransitionLink from "@/lib/components/transition-link";
import {
  IconPaw,
  IconDog,
  IconCat,
  IconFeather,
  IconFish,
} from "@tabler/icons-react";
import { SearchBarDesktopAnimated } from "@/lib/components/searchbar";
import { SearchBarSyncProvider } from "@/lib/components/searchbar/searchbar-sync-context";
import { FilterParams } from "@/lib/filtering/types";
import { useRouter } from "@/i18n";
import { cn } from "@/lib/external/utils";
import { NavbarConstants } from "@/lib/components/navbar/constants";

const WomanHoldingDogAnimation = dynamic(
  () => import("@/lib/components/animations/woman-holding-dog"),
  { ssr: false },
);

export default function NotFoundView() {
  const t = useTranslations("notFound");
  const tSearch = useTranslations("search");
  const router = useRouter();
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);

  // Navigate to search page with filters
  const updateFilters = useCallback(
    (filters: Partial<FilterParams>) => {
      const params = new URLSearchParams();
      if (filters["ad-type"]) params.set("ad-type", String(filters["ad-type"]));
      if (filters.category) params.set("category", String(filters.category));
      if (filters.breed) params.set("breed", String(filters.breed));
      router.push(`/ads/s?${params.toString()}`);
    },
    [router],
  );

  const handleSearchBarExpandedChange = useCallback((expanded: boolean) => {
    setIsSearchBarExpanded(expanded);
  }, []);

  const initialValues = useMemo(
    () => ({
      adType: null,
      category: null,
      breed: null,
    }),
    [],
  );

  const currentFilters = useMemo(() => ({}) as FilterParams, []);

  return (
    <>
      {/* Backdrop overlay - shown when searchbar is expanded */}
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300"
        style={{
          zIndex: 40,
          opacity: isSearchBarExpanded ? 0.4 : 0,
          pointerEvents: isSearchBarExpanded ? "auto" : "none",
        }}
        onClick={() => {
          if (isSearchBarExpanded) {
            setIsSearchBarExpanded(false);
          }
        }}
      />

      <div className="h-screen bg-[#FFF8F3] flex flex-col items-center justify-center px-4 overflow-hidden relative">
        {/* Animated background paws */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[5%] left-[5%] animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <IconPaw className="w-10 h-10 text-orange-200/60 rotate-[-20deg]" />
          </div>
          <div
            className="absolute top-[15%] left-[25%] animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "0.5s" }}
          >
            <IconPaw className="w-7 h-7 text-amber-200/50 rotate-[15deg]" />
          </div>
          <div
            className="absolute top-[10%] right-[10%] animate-bounce"
            style={{ animationDuration: "3.5s", animationDelay: "1s" }}
          >
            <IconPaw className="w-9 h-9 text-orange-200/50 rotate-[25deg]" />
          </div>
          <div
            className="absolute top-[25%] right-[25%] animate-bounce"
            style={{ animationDuration: "4.5s" }}
          >
            <IconPaw className="w-6 h-6 text-amber-200/60 rotate-[-10deg]" />
          </div>
          <div
            className="absolute bottom-[20%] left-[8%] animate-bounce"
            style={{ animationDuration: "3.8s", animationDelay: "0.3s" }}
          >
            <IconPaw className="w-8 h-8 text-orange-200/40 rotate-[30deg]" />
          </div>
          <div
            className="absolute bottom-[30%] left-[30%] animate-bounce"
            style={{ animationDuration: "4.2s", animationDelay: "0.7s" }}
          >
            <IconPaw className="w-5 h-5 text-amber-200/50 rotate-[-25deg]" />
          </div>
          <div
            className="absolute bottom-[15%] right-[15%] animate-bounce"
            style={{ animationDuration: "3.3s", animationDelay: "1.2s" }}
          >
            <IconPaw className="w-9 h-9 text-orange-200/50 rotate-[-15deg]" />
          </div>
          <div
            className="absolute bottom-[25%] right-[5%] animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "0.2s" }}
          >
            <IconPaw className="w-6 h-6 text-amber-200/60 rotate-[20deg]" />
          </div>

          {/* Gradient orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-200/20 to-transparent rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
          {/* Animation */}
          <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]">
            <WomanHoldingDogAnimation />
          </div>

          {/* 404 with fun styling */}
          <div className="-mt-2 text-center">
            <h1 className="text-7xl sm:text-8xl font-black text-neutral-800 tracking-tight">
              4<span className="text-orange-500">0</span>4
            </h1>
            <p className="text-lg text-neutral-700 font-medium mt-1">
              {t("hero.title")}
            </p>
            <p className="text-neutral-500 mt-1 text-sm max-w-md mx-auto">
              {t("hero.description")}
            </p>
          </div>

          {/* Functional Search bar - EXACT copy from desktop-navbar-with-search */}
          <div className="mt-4 w-full max-w-xl relative z-50">
            {/* Helper Text - Shows above searchbar when expanded */}
            <div
              className={cn(
                "text-center text-sm text-gray-500 mb-3 transition-all duration-300",
                isSearchBarExpanded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none",
              )}
              style={{
                transitionDelay: isSearchBarExpanded ? "150ms" : "0ms",
              }}
            >
              {tSearch("helperText.default")}
            </div>
            <div
              className="w-full"
              style={{
                transition: `transform ${NavbarConstants.TRANSITION_DURATION}ms ${NavbarConstants.TRANSITION_TIMING}`,
              }}
            >
              <SearchBarSyncProvider
                initialValues={initialValues}
                updateUrlFilters={updateFilters}
                currentUrlFilters={currentFilters}
                isSearchRoute={false}
              >
                <SearchBarDesktopAnimated
                  onExpandedChange={handleSearchBarExpandedChange}
                />
              </SearchBarSyncProvider>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4 relative z-10">
            <TransitionLink
              href="/"
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-2xl transition-all hover:scale-105"
            >
              {t("navigationHelp.actions.home.label")}
            </TransitionLink>
            <TransitionLink
              href="/ads/s"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-all hover:scale-105"
            >
              {t("navigationHelp.actions.browseAds.label")}
            </TransitionLink>
          </div>

          {/* Category shortcuts - 4 items */}
          <div className="mt-6 w-full">
            <p className="text-center text-xs text-neutral-500 mb-3">
              Kateqoriyalara baxın
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <TransitionLink
                href="/ads/s?category=1"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 group-hover:scale-110 transition-all shadow-sm">
                  <IconDog className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-neutral-600 group-hover:text-orange-600">
                  İtlər
                </span>
              </TransitionLink>
              <TransitionLink
                href="/ads/s?category=2"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all shadow-sm">
                  <IconCat className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-neutral-600 group-hover:text-blue-600">
                  Pişiklər
                </span>
              </TransitionLink>
              <TransitionLink
                href="/ads/s?category=3"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 group-hover:scale-110 transition-all shadow-sm">
                  <IconFeather className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-neutral-600 group-hover:text-amber-600">
                  Quşlar
                </span>
              </TransitionLink>
              <TransitionLink
                href="/ads/s?category=4"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 group-hover:scale-110 transition-all shadow-sm">
                  <IconFish className="w-6 h-6 text-cyan-600" />
                </div>
                <span className="text-xs font-medium text-neutral-600 group-hover:text-cyan-600">
                  Balıqlar
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
