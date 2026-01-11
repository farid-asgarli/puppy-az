'use client';
import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { PetCategoryDetailedDto } from '@/lib/api/types/pet-ad.types';
import CategoryCard from '@/lib/components/cards/category-card/category-card.component';
import { useTranslations } from 'next-intl';

// ============================================================================
// CATEGORY CAROUSEL WITH EMBLA
// ============================================================================

interface CategoryCarouselProps {
  categories: PetCategoryDetailedDto[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
  baseHref?: string;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories, autoPlay = false, autoPlayDelay = 5000, baseHref = '/categories' }) => {
  const t = useTranslations('petAdDetailsPage.categories');
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Configure autoplay plugin
  const autoplayPlugin = useCallback(
    () =>
      Autoplay({
        delay: autoPlayDelay,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    [autoPlayDelay]
  );

  // Initialize Embla with responsive breakpoints
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 640px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 },
        '(min-width: 1280px)': { slidesToScroll: 4 },
      },
    },
    autoPlay ? [autoplayPlugin()] : []
  );

  // Scroll handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Update button states and selected index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Setup event listeners
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

  // Calculate number of indicator dots based on slides and viewport
  const scrollSnaps = emblaApi?.scrollSnapList() || [];
  const indicatorCount = scrollSnaps.length;

  return (
    <div className="relative">
      {/* Desktop Navigation Buttons */}
      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200"
          aria-label={t('previousCategories')}
        >
          <IconChevronLeft size={20} />
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200"
          aria-label={t('nextCategories')}
        >
          <IconChevronRight size={20} />
        </button>
      )}

      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Embla Container */}
        <div className="flex gap-4">
          {categories.map((category) => (
            <div key={category.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
              <CategoryCard
                href={`${baseHref}/${category.id}`}
                itemProps={{
                  id: category.id,
                  title: category.title,
                  subtitle: category.subtitle,
                  icon: category.svgIcon,
                  iconColor: category.iconColor,
                  bgColor: category.backgroundColor,
                  count: category.petAdsCount,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Buttons */}
      {(canScrollPrev || canScrollNext) && (
        <div className="md:hidden flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={t('previousCategories')}
          >
            <IconChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={t('nextCategories')}
          >
            <IconChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Indicators */}
      {indicatorCount > 1 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex ? 'bg-primary-600 w-6 sm:w-8' : 'bg-gray-300 w-2 sm:w-2.5 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN SECTION COMPONENT
// ============================================================================

export function AdDetailsCategoriesSection({ categories }: { categories: PetCategoryDetailedDto[] }) {
  const t = useTranslations('petAdDetailsPage.categories');
  return (
    <section id="categories">
      <div className="py-12 px-8 rounded-xl bg-gray-50">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold font-heading text-gray-900 mb-3">{t('title')}</h2>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Carousel */}
        <CategoryCarousel categories={categories} autoPlay={true} autoPlayDelay={5000} baseHref="/categories" />

        {/* Call to action button */}
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-900 hover:border-gray-400 transition-all duration-200">
            {t('showAll')}
          </button>
        </div>
      </div>
    </section>
  );
}
