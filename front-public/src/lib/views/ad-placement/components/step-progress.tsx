"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/external/utils";
import { useTranslations } from "next-intl";
import { useAdPlacement } from "@/lib/contexts/ad-placement-context";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { PetAdType } from "@/lib/api/types/pet-ad.types";
import {
  IconListDetails,
  IconCategory,
  IconDog,
  IconRuler,
  IconInfoCircle,
  IconMapPin,
  IconPhoto,
  IconCurrencyManat,
  IconClipboardCheck,
  IconCheck,
} from "@tabler/icons-react";

// Define all possible steps
const ALL_STEPS = [
  { path: "ad-type", icon: IconListDetails, key: "adType", alwaysShow: true },
  { path: "category", icon: IconCategory, key: "category", alwaysShow: true },
  { path: "breed", icon: IconDog, key: "breed", alwaysShow: true },
  { path: "basics", icon: IconInfoCircle, key: "basics", alwaysShow: true },
  { path: "physical", icon: IconRuler, key: "physical", alwaysShow: true },
  { path: "details", icon: IconInfoCircle, key: "details", alwaysShow: true },
  { path: "location", icon: IconMapPin, key: "location", alwaysShow: true },
  { path: "photos", icon: IconPhoto, key: "photos", alwaysShow: true },
  {
    path: "price",
    icon: IconCurrencyManat,
    key: "price",
    alwaysShow: false,
    showFor: [PetAdType.Sale],
  },
  { path: "review", icon: IconClipboardCheck, key: "review", alwaysShow: true },
] as const;

/**
 * Step Progress Bar for Ad Placement Flow
 * Shows current progress with animated transitions
 * Steps are dynamic based on ad type (e.g., price only for Sale)
 * Users can navigate to any step they've already reached
 */
export function StepProgress() {
  const pathname = usePathname();
  const t = useTranslations("adPlacement.steps");
  const { formData, maxReachedStep } = useAdPlacement();
  const { navigateWithTransition } = useViewTransition();
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  // Filter steps based on ad type
  const steps = ALL_STEPS.filter((step) => {
    if (step.alwaysShow) return true;
    if (step.showFor && formData.adType) {
      return (step.showFor as readonly PetAdType[]).includes(formData.adType);
    }
    return false;
  });

  // Extract current step from pathname
  const pathWithoutLocale = pathname.replace(/^\/(az|en|ru)/, "");
  const currentStepPath = pathWithoutLocale.split("/").pop() || "";
  const currentStepIndex = steps.findIndex((s) => s.path === currentStepPath);

  // Extract max reached step index - handle "price" step for non-Sale ads
  const maxReachedStepPath = maxReachedStep.split("/").pop() || "";
  let maxReachedStepIndex = steps.findIndex(
    (s) => s.path === maxReachedStepPath,
  );

  // If maxReachedStep is "price" but we're not showing price step, map to "photos"
  if (maxReachedStepIndex === -1 && maxReachedStepPath === "price") {
    maxReachedStepIndex = steps.findIndex((s) => s.path === "photos");
  }
  // If maxReachedStep is "review" and we don't have price, it should still work
  if (maxReachedStepIndex === -1 && maxReachedStepPath === "review") {
    maxReachedStepIndex = steps.length - 1;
  }

  // Ensure maxReachedStepIndex is at least currentStepIndex
  if (maxReachedStepIndex < currentStepIndex) {
    maxReachedStepIndex = currentStepIndex;
  }

  // Calculate progress percentage based on current step (shows where user IS, not where they've been)
  const progress =
    currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  // Handle step click - allow clicking on any step up to maxReachedStep
  const handleStepClick = (stepPath: string, stepIndex: number) => {
    if (stepIndex <= maxReachedStepIndex && stepIndex !== currentStepIndex) {
      navigateWithTransition(`/ads/ad-placement/${stepPath}`);
    }
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Progress Info */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-medium text-gray-900 shrink-0">
              {t("step")} {currentStepIndex + 1}/{steps.length}
            </span>
            {currentStepIndex >= 0 && (
              <span className="text-xs sm:text-sm text-gray-500 truncate">
                • {t(steps[currentStepIndex].key)}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-medium text-primary-600 shrink-0 ml-2">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Main Progress Bar */}
        <div className="relative h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Animated shine effect */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full transition-all duration-500 ease-out animate-shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Dots - Desktop */}
        <div className="hidden sm:flex items-center justify-between mt-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isReached = index <= maxReachedStepIndex;
            const isMaxReached = index === maxReachedStepIndex;
            const isUpcoming = index > maxReachedStepIndex;
            const isClickable = isReached && !isCurrent;
            const isHovered = hoveredStep === step.path;

            return (
              <div key={step.path} className="relative">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.path, index)}
                  onMouseEnter={() => setHoveredStep(step.path)}
                  onMouseLeave={() => setHoveredStep(null)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col items-center gap-1.5 transition-all duration-300",
                    isReached && "text-primary-600",
                    isClickable && "cursor-pointer hover:scale-105",
                    isCurrent && "scale-110",
                    isUpcoming && "text-gray-300 cursor-default",
                  )}
                >
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-primary-100",
                      isClickable && "hover:bg-primary-200",
                      isCurrent &&
                        "bg-primary-100 ring-2 ring-primary-500 ring-offset-2",
                      isMaxReached &&
                        !isCurrent &&
                        "bg-primary-50 ring-1 ring-primary-300 animate-pulse-subtle",
                      isReached &&
                        !isCurrent &&
                        !isMaxReached &&
                        "bg-primary-100 opacity-70",
                      isUpcoming && "bg-gray-100",
                    )}
                  >
                    {isCompleted ? (
                      <IconCheck size={16} strokeWidth={2.5} />
                    ) : (
                      <Icon
                        size={16}
                        strokeWidth={2}
                        className={cn(
                          isReached && !isCurrent && "opacity-70",
                          isMaxReached && !isCurrent && "animate-pulse-subtle",
                        )}
                      />
                    )}
                  </div>
                  {/* Step Label - Show for current and hovered */}
                  <span
                    className={cn(
                      "text-[10px] font-medium whitespace-nowrap transition-all duration-200",
                      isCurrent && "text-primary-600",
                      isHovered && !isCurrent && "text-primary-500",
                      !isCurrent && !isHovered && "opacity-0 h-0",
                    )}
                  >
                    {t(step.key)}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Step Pills - Mobile */}
        <div className="flex sm:hidden items-center gap-1 mt-2 overflow-x-auto pb-1 -mx-1 px-1">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isReached = index <= maxReachedStepIndex;
            const isMaxReached = index === maxReachedStepIndex;
            const isClickable = isReached && !isCurrent;

            return (
              <button
                key={step.path}
                type="button"
                onClick={() => handleStepClick(step.path, index)}
                disabled={!isClickable}
                className={cn(
                  "h-1 min-w-[20px] rounded-full transition-all duration-300 shrink-0",
                  isCompleted && "bg-primary-500 flex-1",
                  isClickable && "cursor-pointer hover:bg-primary-600",
                  isCurrent && "bg-primary-500 flex-[1.5] min-w-[28px]",
                  isReached &&
                    !isCurrent &&
                    !isCompleted &&
                    "bg-primary-300 flex-1",
                  isMaxReached && !isCurrent && "animate-pulse-subtle",
                  !isReached && "bg-gray-200 flex-1 cursor-default",
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
