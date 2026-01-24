"use client";

import { IconPaw } from "@tabler/icons-react";
import { getAdTypes } from "@/lib/utils/mappers";
import { cn } from "@/lib/external/utils";
import {
  IconCrown,
  IconShare,
  IconMessageCircle,
  IconMapPin,
} from "@tabler/icons-react";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { IconButton } from "@/lib/primitives/icon-button";
import { AnimatedLikeButton } from "./animated-like-button";
import TransitionLink from "@/lib/components/transition-link";
import { PetAdCardType } from "@/lib/types/ad-card";
import { useTranslations } from "next-intl";

interface ResponsiveAdCardProps extends PetAdCardType {
  /** Force a specific view mode instead of responsive behavior */
  viewMode?: "grid" | "list";
}

export default function ResponsiveAdCard({
  viewMode,
  ...props
}: ResponsiveAdCardProps) {
  const t = useTranslations("common");
  const tSearch = useTranslations("search");
  const adTypes = getAdTypes(t);
  const { isFavorite, createToggleHandler } = useFavorites();
  const adId = props.id;
  const isLiked = isFavorite(adId);
  const toggleLike = createToggleHandler(adId);

  const adTypeInfo = adTypes[props.adType];

  // Determine layout classes based on viewMode
  // List mode: always horizontal (flex-row), larger image on mobile for differentiation
  // Grid mode: horizontal on small screens, vertical on larger screens (responsive)
  const layoutClasses =
    viewMode === "list" ? "flex-row" : "flex-row min-[480px]:flex-col";

  const imageClasses =
    viewMode === "list"
      ? "w-40 min-[480px]:w-32 aspect-square"
      : "w-32 min-[480px]:w-full aspect-square min-[480px]:aspect-[4/3]";

  return (
    <TransitionLink
      href={`/ads/item-details/${props.id}`}
      className={cn(
        "w-full bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group overflow-hidden flex",
        layoutClasses,
      )}
    >
      {/* Image - Horizontal on mobile, vertical on larger screens */}
      <div
        className={cn(
          "relative bg-gray-100 overflow-hidden flex-shrink-0",
          imageClasses,
        )}
      >
        <img
          src={props.imgUrl}
          alt={props.title}
          className="w-full h-full object-cover transition-transform duration-300"
        />

        {/* Badges */}
        <div
          className={cn(
            "absolute",
            viewMode === "list"
              ? "top-1.5 left-1.5"
              : "top-1.5 left-1.5 min-[480px]:top-2 min-[480px]:left-2",
          )}
        >
          {/* Ad type badge */}
          <div
            className={cn(
              "flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-white/20 text-xs font-medium rounded-full w-fit",
              viewMode === "list"
                ? "px-1.5 py-0.5"
                : "px-1.5 py-0.5 min-[480px]:px-2 min-[480px]:py-1",
              adTypeInfo.color.text,
            )}
          >
            <adTypeInfo.icon
              size={10}
              className={
                viewMode === "list" ? "" : "min-[480px]:w-3 min-[480px]:h-3"
              }
            />
            <span
              className={
                viewMode === "list" ? "hidden" : "hidden min-[480px]:inline"
              }
            >
              {adTypeInfo.title}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "absolute",
            viewMode === "list"
              ? "left-1.5 bottom-1.5"
              : "left-1.5 bottom-1.5 min-[480px]:left-2 min-[480px]:bottom-2",
          )}
        >
          {/* Premium badge */}
          {props.isPremium && (
            <div
              className={cn(
                "flex items-center gap-1 text-premium-500 bg-white text-xs font-medium rounded-full",
                viewMode === "list"
                  ? "px-1.5 py-0.5"
                  : "px-1.5 py-0.5 min-[480px]:px-2 min-[480px]:py-1",
              )}
            >
              <IconCrown
                size={10}
                className={
                  viewMode === "list" ? "" : "min-[480px]:w-3 min-[480px]:h-3"
                }
              />
              <span
                className={
                  viewMode === "list" ? "hidden" : "hidden min-[480px]:inline"
                }
              >
                Premium
              </span>
            </div>
          )}
        </div>

        {/* Heart button */}
        <div
          className={cn(
            "absolute",
            viewMode === "list"
              ? "top-1.5 right-1.5"
              : "top-1.5 right-1.5 min-[480px]:top-2 min-[480px]:right-2",
          )}
        >
          <AnimatedLikeButton
            isLiked={isLiked}
            toggleLike={toggleLike}
            size="sm"
            iconSize={16}
          />
        </div>

        {/* Quick actions on hover - hidden on mobile */}
        {/* <div className="hidden min-[480px]:flex absolute bottom-2 right-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            icon={<IconShare size={12} className="text-gray-600" />}
            variant="overlay"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Share', props.id);
            }}
            ariaLabel="Share"
          />
          <IconButton
            icon={<IconMessageCircle size={12} className="text-gray-600" />}
            variant="overlay"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Message', props.id);
            }}
            ariaLabel="Send message"
          />
        </div> */}
      </div>

      {/* Content - Compact horizontal layout on mobile */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          viewMode === "list" ? "p-3" : "p-3 min-[480px]:p-4",
        )}
      >
        <h3
          className={cn(
            "font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors",
            viewMode === "list"
              ? "mb-1.5 text-sm"
              : "mb-1.5 min-[480px]:mb-2 text-sm min-[480px]:text-base",
          )}
        >
          {props.title}
        </h3>

        <div
          className={cn(
            "flex items-center gap-1",
            viewMode === "list" ? "mb-1.5" : "mb-1.5 min-[480px]:mb-2",
          )}
        >
          <IconPaw
            size={12}
            className={cn(
              "text-amber-500 fill-current flex-shrink-0",
              viewMode === "list" ? "" : "min-[480px]:w-3.5 min-[480px]:h-3.5",
            )}
          />
          <span
            className={cn(
              "font-medium text-gray-900 truncate",
              viewMode === "list" ? "text-xs" : "text-xs min-[480px]:text-sm",
            )}
          >
            {props.animalCategory}
          </span>
        </div>

        <div
          className={cn(
            "flex items-center justify-between gap-2",
            viewMode === "list" ? "mb-2" : "mb-2 min-[480px]:mb-3",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1 text-gray-600 min-w-0",
              viewMode === "list" ? "text-xs" : "text-xs min-[480px]:text-sm",
            )}
          >
            <IconMapPin
              size={12}
              className={cn(
                "flex-shrink-0",
                viewMode === "list"
                  ? ""
                  : "min-[480px]:w-3.5 min-[480px]:h-3.5",
              )}
            />
            <span className="truncate">{props.location}</span>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {props.age} {tSearch("yearsOld")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div
            className={cn(
              "font-bold text-gray-900",
              viewMode === "list" ? "text-sm" : "text-sm min-[480px]:text-lg",
            )}
          >
            {props.price} AZN
          </div>
          <div className="text-xs text-gray-600 whitespace-nowrap">
            {props.postedDate}
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}
