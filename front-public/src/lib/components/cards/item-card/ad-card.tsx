"use client";

import { useAdTypes } from "@/lib/hooks/use-ad-types";
import { cn } from "@/lib/external/utils";
import { IconMapPin, IconPaw } from "@tabler/icons-react";
import TransitionLink from "@/lib/components/transition-link";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { AnimatedLikeButton } from "./animated-like-button";
import { PetAdCardType } from "@/lib/types/ad-card";
import { useTranslations } from "next-intl";

export default function AdCard(props: PetAdCardType) {
  const tSearch = useTranslations("search");
  const { getAdTypeById } = useAdTypes();
  const { isFavorite, createToggleHandler } = useFavorites();
  const adId = props.id;
  const isLiked = isFavorite(adId);
  const toggleLike = createToggleHandler(adId);

  const adTypeInfo = getAdTypeById(props.adType);

  return (
    <TransitionLink
      href={`/ads/item-details/${props.id}`}
      className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group overflow-hidden block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {props.imgUrl ? (
          <img
            src={props.imgUrl}
            alt={props.title}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2">
          {/* Ad type badge */}
          {adTypeInfo && (
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm border border-white/20 text-xs font-medium rounded-full w-fit",
                adTypeInfo.color.text,
              )}
            >
              <adTypeInfo.icon size={12} />
              {adTypeInfo.title}
            </div>
          )}
        </div>

        {/* Heart button */}
        <div className="absolute top-2 right-2">
          <AnimatedLikeButton isLiked={isLiked} toggleLike={toggleLike} />
        </div>
        {/* Quick actions on hover */}
        {/* <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
          {props.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <IconPaw size={14} className="text-amber-500 fill-current" />
          <span className="text-sm font-medium text-gray-900">
            {props.animalCategory}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <IconMapPin size={14} />
            {props.location}
          </div>
          {props.age !== null && props.age !== undefined && (
            <span className="text-xs text-gray-500">
              {props.age} {tSearch("yearsOld")}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {props.price} AZN
          </div>
          <div className="text-xs text-gray-600">{props.postedDate}</div>
        </div>
      </div>
    </TransitionLink>
  );
}
