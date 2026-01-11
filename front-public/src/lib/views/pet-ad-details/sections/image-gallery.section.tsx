'use client';

import React from 'react';
import { PetAdImageDto } from '@/lib/api/types/pet-ad.types';
import { cn } from '@/lib/external/utils';
import { IconZoomIn } from '@tabler/icons-react';
import Fancybox from '@/sections/fancy-box/fancy-box';
import { useTranslations } from 'next-intl';
import { ImageCarousel } from '@/lib/components/image-carousel';

export interface AdDetailsImageGallerySectionProps {
  images: PetAdImageDto[];
  title: string;
}

export function AdDetailsImageGallerySection({ images, title }: AdDetailsImageGallerySectionProps) {
  const t = useTranslations('imageGallery');

  // Sort images to ensure primary image is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return 0;
  });

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400 font-medium">{t('noImage')}</p>
      </div>
    );
  }

  // Layout: Primary image takes 2/3, rest in grid on the right for 4+ images
  const hasPrimaryLayout = sortedImages.length >= 4;
  const primaryImage = sortedImages[0];
  const secondaryImages = sortedImages.slice(1, hasPrimaryLayout ? 5 : sortedImages.length);

  return (
    <>
      {/* Mobile Carousel (< 768px) */}
      <div className="md:hidden">
        <ImageCarousel
          images={sortedImages.map((img) => ({
            id: img.id,
            url: img.url,
            isPrimary: img.isPrimary,
          }))}
          title={title}
          galleryId="gallery"
          aspectRatio="4/3"
          showPrimaryBadge={true}
          showCounter={true}
        />
      </div>

      {/* Desktop Grid (≥ 768px) */}
      <div className="hidden md:block">
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
          }}
        >
          <div className="space-y-4">
            <div className={cn('grid gap-4', hasPrimaryLayout ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
              {/* Primary Image */}
              <a
                data-fancybox="gallery"
                href={primaryImage.url}
                className={cn(
                  'relative overflow-hidden rounded-2xl bg-gray-100 cursor-pointer group block',
                  hasPrimaryLayout ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-[4/3]'
                )}
              >
                <img
                  src={primaryImage.url}
                  alt={t('imageAlt', { title, number: 1 })}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IconZoomIn size={18} className="sm:w-5 sm:h-5 text-gray-900" />
                </div>
                {primaryImage.isPrimary && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-900">{t('primaryBadge')}</span>
                  </div>
                )}
              </a>

              {/* Secondary Images */}
              {secondaryImages.map((image, index) => (
                <a
                  key={image.id}
                  data-fancybox="gallery"
                  href={image.url}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 cursor-pointer group block"
                >
                  <img
                    src={image.url}
                    alt={t('imageAlt', { title, number: index + 2 })}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <IconZoomIn size={18} className="sm:w-5 sm:h-5 text-gray-900" />
                  </div>
                </a>
              ))}

              {/* "More Images" Overlay (if more than 5 images) */}
              {sortedImages.length > 5 && (
                <a
                  data-fancybox="gallery"
                  href={sortedImages[5].url}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 cursor-pointer group block"
                >
                  <img src={sortedImages[5].url} alt={t('morePhotosAlt', { title })} className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-4xl font-semibold text-white mb-2">+{sortedImages.length - 5}</div>
                      <div className="text-sm font-medium text-white">{t('morePhotos')}</div>
                    </div>
                  </div>
                </a>
              )}

              {/* Hidden images for Fancybox (beyond first 6) */}
              {sortedImages.slice(6).map((image, index) => (
                <a key={image.id} data-fancybox="gallery" href={image.url} className="hidden">
                  <img src={image.url} alt={t('imageAlt', { title, number: index + 7 })} />
                </a>
              ))}
            </div>

            {/* Image Counter */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                {t(sortedImages.length === 1 ? 'imageCount_one' : 'imageCount_other', { count: sortedImages.length })}
              </p>
            </div>
          </div>
        </Fancybox>
      </div>
    </>
  );
}
