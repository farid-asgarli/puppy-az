import AdCard from "@/lib/components/cards/item-card/ad-card";
import { PetAdCardType } from "@/lib/types/ad-card";
import {
  IconEye,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";

interface AdCardCarouselProps {
  items: PetAdCardType[];
  onViewAll?: () => void;
}

const AdCardCarousel: React.FC<AdCardCarouselProps> = ({
  items,
  onViewAll,
}) => {
  const t = useTranslations("petAdDetails.relatedAds");
  const tA11y = useTranslations("accessibility");
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Initialize Embla - NO responsive breakpoints, just free scrolling like Ad Listing
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    slidesToScroll: 1,
  });

  // Scroll handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Scroll to specific index
  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
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
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Calculate number of indicator dots
  const scrollSnaps = emblaApi?.scrollSnapList() || [];
  const indicatorCount = scrollSnaps.length;

  return (
    <div className="relative">
      {/* Desktop Navigation Buttons - Large buttons like CategoryCarousel */}
      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200"
          aria-label={tA11y("previousAds")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200"
          aria-label={tA11y("nextAds")}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      )}

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Embla container */}
        <div className="flex gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-72">
              <AdCard {...item} />
            </div>
          ))}

          {/* View all card - EXACTLY like Ad Listing Carousel */}
          {onViewAll && (
            <div
              onClick={onViewAll}
              className="flex-shrink-0 w-72 bg-gradient-to-br from-info-50 to-primary-50 rounded-2xl border-2 border-dashed border-primary-300 hover:border-primary-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-center p-6 group"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                <IconEye size={24} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("viewAll")}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{t("moreAds")}</p>
              <div className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium group-hover:bg-primary-700 transition-colors">
                {t("discover")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Buttons - Matching CategoryCarousel */}
      {(canScrollPrev || canScrollNext) && (
        <div className="md:hidden flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={tA11y("previousAds")}
          >
            <IconChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={tA11y("nextAds")}
          >
            <IconChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Indicators - Matching CategoryCarousel */}
      {indicatorCount > 1 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-primary-600 w-6 sm:w-8"
                  : "bg-gray-300 w-2 sm:w-2.5 hover:bg-gray-400"
              }`}
              aria-label={tA11y("goToSlide", { number: index + 1 })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default AdCardCarousel;
