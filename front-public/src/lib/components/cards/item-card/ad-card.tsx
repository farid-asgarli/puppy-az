'use client';

import { getAdTypes } from '@/lib/utils/mappers';
import { cn } from '@/lib/external/utils';
import { IconCrown, IconShare, IconMessageCircle, IconMapPin, IconPaw } from '@tabler/icons-react';
import TransitionLink from '@/lib/components/transition-link';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { IconButton } from '@/lib/primitives/icon-button';
import { AnimatedLikeButton } from './animated-like-button';
import { PetAdCardType } from '@/lib/types/ad-card';
import { useTranslations } from 'next-intl';

export default function AdCard(props: PetAdCardType) {
  const t = useTranslations('common');
  const tSearch = useTranslations('search');
  const adTypes = getAdTypes(t);
  const { isFavorite, createToggleHandler } = useFavorites();
  const adId = props.id;
  const isLiked = isFavorite(adId);
  const toggleLike = createToggleHandler(adId);

  const adTypeInfo = adTypes[props.adType];

  return (
    <TransitionLink
      href={`/ads/item-details/${props.id}`}
      className="flex-shrink-0 w-72 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group overflow-hidden block"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img src={props.imgUrl} alt={props.title} className="w-full h-full object-cover transition-transform duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2">
          {/* Ad type badge */}
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur-sm border border-white/20 text-xs font-medium rounded-full w-fit',
              adTypeInfo.color.text
            )}
          >
            <adTypeInfo.icon size={12} />
            {adTypeInfo.title}
          </div>
        </div>
        <div className="absolute left-2 bottom-2">
          {/* Premium badge */}
          {props.isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 text-premium-500 bg-white text-xs font-medium rounded-full">
              <IconCrown size={12} />
              Premium
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
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">{props.title}</h3>
        <div className="flex items-center gap-1 mb-2">
          <IconPaw size={14} className="text-amber-500 fill-current" />
          <span className="text-sm font-medium text-gray-900">{props.animalCategory}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <IconMapPin size={14} />
            {props.location}
          </div>
          <span className="text-xs text-gray-500">
            {props.age} {tSearch('yearsOld')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">{props.price} AZN</div>
          <div className="text-xs text-gray-600">{props.postedDate}</div>
        </div>
      </div>
    </TransitionLink>
  );
}
