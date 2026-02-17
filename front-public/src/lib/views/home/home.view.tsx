"use client";

import {
  PetCategoryWithAdsDto,
  PetAdListItemDto,
} from "@/lib/api/types/pet-ad.types";
import { HeroSection } from "./sections/hero.section";
import { LatestAdsSection } from "./sections/latest-ads.section";
import { HowItWorksSection } from "./sections/how-it-works.section";
import { CategoryCarouselsSection } from "./sections/category-carousels.section";
import { WhyChooseUsSection } from "./sections/why-choose-us.section";
import { FinalCtaSection } from "./sections/final-cta.section";
import { RecentlyViewedSection } from "@/lib/views/home/sections/recently-viewed.section";

export interface HomeViewProps {
  categoriesWithAds: PetCategoryWithAdsDto[];
  latestAds: PetAdListItemDto[];
}

export const HomeView = ({ categoriesWithAds, latestAds }: HomeViewProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest Ads - Newest additions */}
      <LatestAdsSection latestAds={latestAds} />

      {/* Recently Viewed Ads - Personalized for authenticated users */}
      <RecentlyViewedSection />

      {/* Category Carousels */}
      <CategoryCarouselsSection categoriesWithAds={categoriesWithAds} />

      {/* How It Works Section - At the bottom for better flow */}
      <HowItWorksSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Final CTA */}
      <FinalCtaSection />
    </div>
  );
};

export default HomeView;
