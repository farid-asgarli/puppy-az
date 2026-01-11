'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { IconEye } from '@tabler/icons-react';
import AdCard from '@/lib/components/cards/item-card/ad-card';
import { PetAdCardType } from '@/lib/types/ad-card';
import { cn } from '@/lib/external/utils';
import { CarouselNavButton } from '@/lib/components/views/ads';
import { SectionHeader } from '@/lib/components/views/common';
import { useTranslations } from 'next-intl';

export interface AdListingCarouselProps {
  title: string;
  items: PetAdCardType[];
  onViewAll?: () => void;
  showTitle?: boolean;
  svgIcon?: string;
  iconColor?: string;
  backgroundColor?: string;
}

export const AdListingCarousel: React.FC<AdListingCarouselProps> = ({
  title,
  items,
  onViewAll,
  showTitle = true,
  svgIcon,
  iconColor = 'text-gray-700',
  backgroundColor = 'bg-gray-100',
}) => {
  const t = useTranslations('adListing');
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showTitle && (
        <div className="flex items-center gap-3">
          {svgIcon && (
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', backgroundColor)}>
              <div className={cn('w-6 h-6', iconColor)} dangerouslySetInnerHTML={{ __html: svgIcon }} />
            </div>
          )}
          <SectionHeader
            title={title}
            layout="horizontal"
            size="md"
            className="w-full"
            action={
              onViewAll
                ? {
                    label: t('moreAds.viewAll'),
                    onClick: onViewAll,
                  }
                : undefined
            }
          />
        </div>
      )}

      {/* Carousel Container */}
      <div className="relative">
        {/* Left scroll button */}
        {canScrollPrev && <CarouselNavButton direction="prev" onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />}

        {/* Right scroll button */}
        {canScrollNext && <CarouselNavButton direction="next" onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />}

        {/* Embla viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          {/* Embla container */}
          <div className="flex gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-72">
                <AdCard {...item} />
              </div>
            ))}

            {/* View all card - Airbnb style */}
            {onViewAll && (
              <div
                onClick={onViewAll}
                className={cn(
                  'flex-shrink-0 w-72 min-h-[320px]',
                  'bg-gray-50 rounded-xl border-2 border-gray-200',
                  'hover:border-gray-400 hover:shadow-md',
                  'transition-all duration-200 cursor-pointer',
                  'flex flex-col items-center justify-center text-center p-8 group'
                )}
              >
                <div
                  className={cn(
                    'w-16 h-16 rounded-full',
                    'flex items-center justify-center mb-4',
                    'group-hover:scale-110 transition-transform',
                    backgroundColor
                  )}
                >
                  {svgIcon ? (
                    <div className={cn('w-8 h-8 flex justify-center items-center', iconColor)} dangerouslySetInnerHTML={{ __html: svgIcon }} />
                  ) : (
                    <IconEye size={28} className="text-gray-700" strokeWidth={2} />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('moreAds.viewAll')}</h3>
                <p className="text-sm text-gray-600">{t('moreAds.description', { category: title.toLowerCase() })}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdListingCarousel;
