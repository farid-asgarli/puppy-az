"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState, useCallback, useMemo } from "react";
import TransitionLink from "@/lib/components/transition-link";
import { IconPaw, IconHome, IconSearch } from "@tabler/icons-react";
import { SearchBarDesktopAnimated } from "@/lib/components/searchbar";
import { SearchBarSyncProvider } from "@/lib/components/searchbar/searchbar-sync-context";
import { FilterParams } from "@/lib/filtering/types";
import { FilterValidator } from "@/lib/filtering/filter-validator";
import { useRouter } from "@/i18n";
import { cn } from "@/lib/external/utils";
import { NavbarConstants } from "@/lib/components/navbar/constants";
import type { PetCategoryDetailedDto } from "@/lib/api/types/pet-ad.types";

const WomanHoldingDogAnimation = dynamic(
  () => import("@/lib/components/animations/woman-holding-dog"),
  { ssr: false },
);

interface NotFoundViewProps {
  categories?: PetCategoryDetailedDto[];
}

export default function NotFoundView({ categories = [] }: NotFoundViewProps) {
  const t = useTranslations("notFound");
  const tSearch = useTranslations("search");
  const router = useRouter();
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);

  // Navigate to search page with filters (slug-based URLs)
  const updateFilters = useCallback(
    (filters: Partial<FilterParams>) => {
      const url = FilterValidator.buildSlugFilterUrl(filters as FilterParams);
      router.push(url);
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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center px-4 overflow-hidden relative">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Floating paw prints - subtle gray tones */}
          <div className="absolute top-[8%] left-[8%] animate-[float_6s_ease-in-out_infinite]">
            <IconPaw className="w-8 h-8 text-slate-200/60 rotate-[-15deg]" />
          </div>
          <div className="absolute top-[20%] left-[20%] animate-[float_8s_ease-in-out_infinite_0.5s]">
            <IconPaw className="w-6 h-6 text-slate-200/50 rotate-[20deg]" />
          </div>
          <div className="absolute top-[12%] right-[12%] animate-[float_7s_ease-in-out_infinite_1s]">
            <IconPaw className="w-7 h-7 text-slate-200/50 rotate-[30deg]" />
          </div>
          <div className="absolute bottom-[25%] left-[12%] animate-[float_7.5s_ease-in-out_infinite_0.3s]">
            <IconPaw className="w-6 h-6 text-slate-200/40 rotate-[25deg]" />
          </div>
          <div className="absolute bottom-[18%] right-[18%] animate-[float_6.5s_ease-in-out_infinite_1.2s]">
            <IconPaw className="w-7 h-7 text-slate-200/50 rotate-[-20deg]" />
          </div>

          {/* Gradient blurs */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-100/20 to-transparent rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-slate-100/30 to-transparent rounded-full blur-[80px] translate-x-1/4 translate-y-1/4" />
        </div>
        {/* Main content - Split layout: Left canvas, Right content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center w-full max-w-5xl gap-8 lg:gap-16">
          {/* Left Side: Canvas Animation (larger on desktop) */}
          <div className="flex-shrink-0 flex items-center justify-center lg:w-[45%]">
            <div className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[380px] lg:h-[380px]">
              <WomanHoldingDogAnimation />
            </div>
          </div>
          {/* Right Side: 404 Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start">
            {/* 404 Typography - Clean and modern */}
            <div className="text-center lg:text-left space-y-3">
              <h1 className="text-8xl sm:text-9xl font-black tracking-tight">
                <span className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                  4
                </span>
                <span className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 bg-clip-text text-transparent">
                  0
                </span>
                <span className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                  4
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                {t("hero.title")}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-md leading-relaxed">
                {t("hero.description")}
              </p>
            </div>

            {/* Functional Search bar */}
            <div className="mt-8 w-full max-w-xl relative z-50">
              {/* Helper Text - Shows above searchbar when expanded */}
              <div
                className={cn(
                  "text-center lg:text-left text-sm text-slate-500 mb-3 transition-all duration-300",
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
                    className="!mx-0 !ml-0"
                  />
                </SearchBarSyncProvider>
              </div>
            </div>

            {/* Action buttons - Clean pill design */}
            <div className="flex items-center gap-3 mt-6 relative z-10">
              <TransitionLink
                href="/"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98]"
              >
                <IconHome
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                {t("navigationHelp.actions.home.label")}
              </TransitionLink>
              <TransitionLink
                href="/ads/s"
                className="group inline-flex items-center gap-2.5 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/30 active:scale-[0.98]"
              >
                <IconSearch
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                {t("navigationHelp.actions.browseAds.label")}
              </TransitionLink>
            </div>

            {/* Category shortcuts - Dynamic from API */}
            {categories.length > 0 && (
              <div className="mt-8 w-full">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {categories.map((category) => (
                    <TransitionLink
                      key={category.id}
                      href={`/${category.slug}`}
                      className="group inline-flex items-center gap-2 h-9 pl-1.5 pr-3.5 rounded-full bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm transition-all duration-200 active:scale-[0.97]"
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                          category.backgroundColor || "bg-slate-100",
                        )}
                      >
                        {category.svgIcon && (
                          <div
                            className={cn(
                              "w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full",
                              category.iconColor || "text-slate-500",
                            )}
                            dangerouslySetInnerHTML={{
                              __html: category.svgIcon,
                            }}
                          />
                        )}
                      </div>
                      <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors whitespace-nowrap">
                        {category.title}
                      </span>
                    </TransitionLink>
                  ))}
                </div>
              </div>
            )}
          </div>{" "}
          {/* End right side content */}
        </div>{" "}
        {/* End main flex container */}
        {/* Float animation keyframes */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(var(--rotate, 0deg));
            }
            50% {
              transform: translateY(-10px) rotate(var(--rotate, 0deg));
            }
          }
        `}</style>
      </div>
    </>
  );
}
