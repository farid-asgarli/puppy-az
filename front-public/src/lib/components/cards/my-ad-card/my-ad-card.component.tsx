"use client";

import {
  IconEye,
  IconClock,
  IconTrendingUp,
  IconAlertCircle,
  IconCircleCheck,
  IconDotsVertical,
} from "@tabler/icons-react";
import { cn } from "@/lib/external/utils";
import { PetAdType } from "@/lib/api";
import { PetAdStatus } from "@/lib/api/types/pet-ad.types";
import { useTranslations } from "next-intl";
import { ImageWithFallback } from "@/lib/primitives";

interface MyAdCardProps {
  id: number;
  title: string;
  imageUrl: string | null;
  price: number | null;
  adType: PetAdType;
  status: PetAdStatus;
  categoryTitle: string;
  cityName: string;
  viewCount: number;
  isPremium: boolean;
  createdAt: string;
  onClick?: (id: number) => void;
}

/**
 * MyAdCard - Modern Airbnb-inspired card for user's ads
 * Displays essential ad information with clean, minimal design
 * Click to view full details in a drawer
 */
export function MyAdCard({
  id,
  title,
  imageUrl,
  price,
  adType,
  status,
  categoryTitle,
  cityName,
  viewCount,
  isPremium,
  createdAt: _createdAt,
  onClick,
}: MyAdCardProps) {
  console.log("status", status);
  const t = useTranslations("myAds.card");
  const tCommon = useTranslations("common");
  const tA11y = useTranslations("accessibility");

  const handleClick = () => {
    onClick?.(id);
  };

  // Status configuration
  const statusConfig: Record<
    PetAdStatus,
    {
      icon: typeof IconClock;
      label: string;
      color: string;
      bgColor: string;
      borderColor: string;
    }
  > = {
    [PetAdStatus.Pending]: {
      icon: IconClock,
      label: t("status.pending"),
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    [PetAdStatus.Published]: {
      icon: IconCircleCheck,
      label: t("status.published"),
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    [PetAdStatus.Rejected]: {
      icon: IconAlertCircle,
      label: t("status.rejected"),
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    [PetAdStatus.Expired]: {
      icon: IconClock,
      label: t("status.expired"),
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    [PetAdStatus.Closed]: {
      icon: IconAlertCircle,
      label: t("status.closed"),
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    [PetAdStatus.Draft]: {
      icon: IconClock,
      label: t("status.draft"),
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  // Ad type labels
  const adTypeLabels = {
    [PetAdType.Sale]: tCommon("adTypes.sale.title"),
    [PetAdType.Found]: tCommon("adTypes.found.title"),
    [PetAdType.Lost]: tCommon("adTypes.lost.title"),
    [PetAdType.Match]: tCommon("adTypes.match.title"),
    [PetAdType.Owning]: tCommon("adTypes.owning.title"),
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border border-gray-200 hover:border-gray-300"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <IconEye
                size={56}
                className="text-gray-300 mx-auto mb-2"
                strokeWidth={1.5}
              />
              <p className="text-xs text-gray-400 font-medium">
                {tA11y("noImage")}
              </p>
            </div>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Premium badge - Enhanced */}
          {isPremium && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl shadow-lg animate-pulse-slow">
              <IconTrendingUp
                size={16}
                strokeWidth={2.5}
                className="text-yellow-900"
              />
              <span className="text-xs font-bold text-yellow-900 uppercase tracking-wide">
                {t("premium")}
              </span>
            </div>
          )}

          {/* Top-right: Status and Ad Number badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            {/* Status badge */}
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-lg backdrop-blur-md border",
                currentStatus.bgColor,
                currentStatus.borderColor,
              )}
            >
              <StatusIcon
                size={15}
                strokeWidth={2.5}
                className={currentStatus.color}
              />
              <span
                className={cn("text-xs font-semibold", currentStatus.color)}
              >
                {currentStatus.label}
              </span>
            </div>

            {/* Ad Number badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200">
              <span className="text-xs text-gray-700 font-semibold">#{id}</span>
            </div>
          </div>

          {/* Bottom gradient overlay - Enhanced */}
          <div className="absolute bottom-0 left-0 right-0 h-32 " />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Meta Information */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="font-medium text-gray-700">{categoryTitle}</span>
          <span className="text-gray-300">•</span>
          <span>{cityName}</span>
        </div>

        {/* Bottom Row: Price, Stats, Actions */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div>
            {price !== null ? (
              <p className="text-lg font-bold text-gray-900">
                {price}{" "}
                <span className="text-sm font-normal text-gray-500">AZN</span>
              </p>
            ) : (
              <p className="text-sm text-gray-400">{t("noPrice")}</p>
            )}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-3">
            {/* View count */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <IconEye size={16} strokeWidth={2} />
              <span className="text-sm font-medium">{viewCount}</span>
            </div>

            {/* More options */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t("viewDetails")}
            >
              <IconDotsVertical size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Ad Type Label (subtle) */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {adTypeLabels[adType]}
          </span>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
