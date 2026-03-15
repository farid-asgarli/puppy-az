"use client";

import { PetAdListItemDto } from "@/lib/api/types/pet-ad.types";
import { mapAdToCardItem } from "@/lib/components/cards/item-card/ad-card.utils";
import { useViewTransition } from "@/lib/hooks/use-view-transition";
import { AdListingCarousel } from "../components";
import { useTranslations } from "next-intl";

// Sparkles SVG icon matching Tabler Icons style
const sparklesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zM8 8a6 6 0 0 1 6 6a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6z" /></svg>`;

export interface LatestAdsSectionProps {
  latestAds: PetAdListItemDto[];
}

export const LatestAdsSection = ({ latestAds }: LatestAdsSectionProps) => {
  const t = useTranslations("home.latestAds");
  const tDateTime = useTranslations("dateTime");
  const { navigateWithTransition } = useViewTransition();

  if (!latestAds || latestAds.length === 0) {
    return null;
  }

  const mappedAds = latestAds.map((ad) => mapAdToCardItem(ad, tDateTime));

  const handleViewAll = () => {
    navigateWithTransition("/ads/s");
  };

  return (
    <section className="pt-8 sm:pt-10 lg:pt-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdListingCarousel
          title={t("title")}
          items={mappedAds}
          showTitle={true}
          svgIcon={sparklesSvg}
          iconColor="text-emerald-600"
          backgroundColor="bg-emerald-100"
          onViewAll={handleViewAll}
        />
      </div>
    </section>
  );
};

export default LatestAdsSection;
