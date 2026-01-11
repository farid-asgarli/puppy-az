'use client';

import { IconPaw, IconPlus, IconSearch, IconHeart } from '@tabler/icons-react';
import { cn } from '@/lib/external/utils';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { useTranslations } from 'next-intl';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';

const CAROUSEL_IMAGES = [
  { src: '/images/hero-card-1.png', alt: 'Happy pet 1' },
  { src: '/images/hero-card-2.png', alt: 'Happy pet 2' },
  { src: '/images/hero-card-3.png', alt: 'Happy pet 3' },
];

export const HeroSection = () => {
  const { navigateWithTransition } = useViewTransition();
  const t = useTranslations('home.hero');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Initialize Embla with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30, // Smooth transition duration
      align: 'center',
    },
    [
      Autoplay({
        delay: 3000, // 3 seconds between slides
        stopOnInteraction: false, // Continue autoplay after user interaction
      }),
    ]
  );

  // Update selected index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleBrowseAds = () => {
    navigateWithTransition('/ads/s');
  };

  const handlePostAd = () => {
    navigateWithTransition('/ads/ad-placement');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-accent-50 via-primary-50 to-info-50 min-h-screen flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating paw prints */}
        <div className="absolute top-20 left-[10%] opacity-10 ">
          <IconPaw size={80} className="text-accent-500" />
        </div>
        <div className="absolute top-40 right-[15%] opacity-10">
          <IconPaw size={60} className="text-primary-500" />
        </div>
        <div className="absolute bottom-32 left-[20%] opacity-10">
          <IconHeart size={70} className="text-info-500" />
        </div>
        <div className="absolute bottom-20 right-[25%] opacity-10">
          <IconPaw size={90} className="text-accent-400" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-info-200 to-primary-200 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left space-y-6 sm:space-y-8">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-primary-200 rounded-full shadow-sm">
              <IconSparkles size={18} className="text-primary-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-primary-700">{t('badge')}</span>
            </div> */}

            {/* Main Headline */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold font-heading text-gray-900 leading-tight">
                {t('titlePart1')}{' '}
                <span className="bg-gradient-to-r from-accent-500 via-primary-500 to-info-500 bg-clip-text text-transparent">
                  {t('titleHighlight1')}
                </span>
                ,{' '}
                <span className="bg-gradient-to-r from-info-500 via-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {t('titleHighlight2')}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">{t('subtitle')}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-3 sm:gap-4 pt-4">
              {/* Primary CTA - Browse Ads */}
              <button
                onClick={handleBrowseAds}
                className={cn(
                  'w-full sm:w-auto group',
                  'px-8 py-4 rounded-xl',
                  'bg-gray-900 text-white font-semibold text-base sm:text-lg',
                  'hover:bg-gray-800 hover:shadow-xl',
                  'transition-all duration-200',
                  'flex items-center justify-center gap-3',
                  'focus:outline-none focus:ring-4 focus:ring-gray-900/20'
                )}
              >
                <IconSearch size={24} />
                <span>{t('browseAdsButton')}</span>
              </button>

              {/* Secondary CTA - Post Ad */}
              <button
                onClick={handlePostAd}
                className={cn(
                  'w-full sm:w-auto group',
                  'px-8 py-4 rounded-xl',
                  'bg-white text-gray-900 font-semibold text-base sm:text-lg',
                  'border-2 border-gray-200',
                  'hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg',
                  'transition-all duration-200',
                  'flex items-center justify-center gap-3',
                  'focus:outline-none focus:ring-4 focus:ring-gray-900/10'
                )}
              >
                <IconPlus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>{t('postAdButton')}</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm sm:text-base text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-medium">{t('trustIndicators.activeAds')}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <IconHeart size={18} className="text-accent-500 fill-accent-500" />
                  <span className="font-medium">{t('trustIndicators.safeShopping')}</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <IconPaw size={18} className="text-primary-500 fill-primary-500" />
                  <span className="font-medium">{t('trustIndicators.verifiedSellers')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Autoplay Carousel */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Embla Carousel Container */}
              <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
                <div className="flex">
                  {CAROUSEL_IMAGES.map((image, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0">
                      <div className="relative aspect-square">
                        {/* Card with stacked effect */}
                        <div
                          className={cn(
                            'absolute inset-0',
                            'bg-white rounded-2xl shadow-2xl',
                            'border border-gray-100',
                            'transform transition-all duration-700 ease-out',
                            selectedIndex === index ? 'scale-100 opacity-100 rotate-0' : 'scale-95 opacity-70 rotate-3'
                          )}
                        >
                          <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {CAROUSEL_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      selectedIndex === index ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Decorative floating elements around carousel */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent-300 rounded-full opacity-60 blur-xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-info-300 rounded-full opacity-60 blur-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
