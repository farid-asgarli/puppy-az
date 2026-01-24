"use client";

import {
  PetCategoryWithAdsDto,
  PetAdListItemDto,
} from "@/lib/api/types/pet-ad.types";
import { HeroSection } from "./sections/hero.section";
import { HowItWorksSection } from "./sections/how-it-works.section";
import { PremiumAdsCarouselSection } from "./sections/premium-ads-carousel.section";
import { CategoryCarouselsSection } from "./sections/category-carousels.section";
import { WhyChooseUsSection } from "./sections/why-choose-us.section";
import { FinalCtaSection } from "./sections/final-cta.section";
import { RecentlyViewedSection } from "@/lib/views/home/sections/recently-viewed.section";

export interface HomeViewProps {
  categoriesWithAds: PetCategoryWithAdsDto[];
  premiumAds: PetAdListItemDto[];
}

export const HomeView = ({ categoriesWithAds, premiumAds }: HomeViewProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Premium Ads Carousel */}
      <PremiumAdsCarouselSection premiumAds={premiumAds} />

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
