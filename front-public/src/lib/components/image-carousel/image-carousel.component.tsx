'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/external/utils';
import { IconZoomIn, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Fancybox from '@/sections/fancy-box/fancy-box';
import { useTranslations } from 'next-intl';
import { ImageWithFallback } from '@/lib/primitives';

export interface ImageCarouselImage {
  id: number | string;
  url: string;
  isPrimary?: boolean;
}

export interface ImageCarouselProps {
  images: ImageCarouselImage[];
  title: string;
  galleryId?: string;
  aspectRatio?: 'square' | '4/3' | '16/9';
  showPrimaryBadge?: boolean;
  showCounter?: boolean;
  className?: string;
}

/**
 * ImageCarousel - Reusable image carousel with Embla and Fancybox integration
 * Mobile-optimized with swipe gestures, navigation buttons, and lightbox
 */
export function ImageCarousel({
  images,
  title,
  galleryId = 'gallery',
  aspectRatio = '4/3',
  showPrimaryBadge = false,
  showCounter = true,
  className,
}: ImageCarouselProps) {
  const t = useTranslations('imageGallery');

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (images.length === 0) {
    return null;
  }

  const aspectClasses = {
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-[16/9]',
  };

  return (
    <Fancybox
      options={{
        Carousel: {
          infinite: true,
        },
        Thumbs: true,
        Toolbar: {
          display: {
            left: ['infobar'],
            middle: [],
            right: ['close'],
          },
        },
        trapFocus: false,
        autoFocus: false,
        on: {
          close: (fancybox, event) => {
            if (event) {
              event.stopPropagation();
            }
          },
        },
      }}
    >
      <div className={className}>
        {images.length === 1 ? (
          // Single image - no carousel needed
          <div>
            <a
              data-fancybox={galleryId}
              href={images[0].url}
              className={cn('relative block overflow-hidden rounded-2xl bg-gray-100 group', aspectClasses[aspectRatio])}
            >
              <ImageWithFallback src={images[0].url} alt={title} fill className="object-cover" />
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                <IconZoomIn size={20} className="text-gray-900" />
              </div>
              {showPrimaryBadge && images[0].isPrimary && (
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                  <span className="text-xs font-semibold text-gray-900">{t('primaryBadge')}</span>
                </div>
              )}
            </a>
            {showCounter && (
              <div className="text-center mt-3">
                <p className="text-sm text-gray-600">{t('singleImage')}</p>
              </div>
            )}
          </div>
        ) : (
          // Multiple images - use carousel
          <div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                <div className="flex touch-pan-y">
                  {images.map((image, index) => (
                    <div key={image.id} className="flex-[0_0_100%] min-w-0 relative">
                      <a
                        data-fancybox={galleryId}
                        href={image.url}
                        className={cn('relative block overflow-hidden bg-gray-100 group', aspectClasses[aspectRatio])}
                      >
                        <ImageWithFallback src={image.url} alt={`${title} - ${index + 1}`} fill className="object-cover" />
                        <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                          <IconZoomIn size={20} className="text-gray-900" />
                        </div>
                        {showPrimaryBadge && image.isPrimary && (
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                            <span className="text-xs font-semibold text-gray-900">{t('primaryBadge')}</span>
                          </div>
                        )}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:bg-white z-10',
                  !canScrollPrev && 'opacity-0 pointer-events-none'
                )}
                aria-label={t('previousImage')}
              >
                <IconChevronLeft size={20} className="text-gray-900" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:bg-white z-10',
                  !canScrollNext && 'opacity-0 pointer-events-none'
                )}
                aria-label={t('nextImage')}
              >
                <IconChevronRight size={20} className="text-gray-900" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={cn('h-1.5 rounded-full transition-all', index === selectedIndex ? 'bg-white w-6' : 'bg-white/60 w-1.5')}
                    aria-label={t('goToSlide', { number: index + 1 })}
                  />
                ))}
              </div>
            </div>

            {/* Image Counter */}
            {showCounter && (
              <div className="text-center mt-3">
                <p className="text-sm text-gray-600">{t('imageCounter', { current: selectedIndex + 1, total: images.length })}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Fancybox>
  );
}
