import { petAdService } from "@/lib/api/services/pet-ad.service";
import MobileBottomNav from "@/lib/components/footer/mobile-bottom-nav";
import { createLocalizedMetadata } from "@/lib/utils/metadata";
import { HomeView } from "@/lib/views/home";
import type {
  PetCategoryWithAdsDto,
  PetAdListItemDto,
} from "@/lib/api/types/pet-ad.types";
import { getLocale } from "next-intl/server";

export async function generateMetadata() {
  return createLocalizedMetadata("metadata.home");
}

export default async function Page() {
  // Get locale for backend API calls
  const locale = await getLocale();

  // Fetch data for SSR (for navbar and filtering)
  // Handle errors gracefully to prevent infinite retry loops
  let categoriesWithAds: PetCategoryWithAdsDto[] = [];
  let premiumAds: PetAdListItemDto[] = [];

  try {
    const [_categories, categoriesResult, premiumAdsResponse] =
      await Promise.all([
        petAdService.getPetCategoriesDetailed(locale).catch(() => []),
        petAdService.getPetCategoriesWithAds(locale).catch(() => []),
        petAdService
          .getPremiumAds({ pagination: { number: 1, size: 10 } }, locale)
          .catch(() => ({ items: [], totalCount: 0 })),
      ]);

    categoriesWithAds = categoriesResult;
    premiumAds = premiumAdsResponse.items;
  } catch (error) {
    // If all API calls fail, use empty data
    console.error("Failed to fetch homepage data:", error);
  }

  return (
    <>
      <HomeView categoriesWithAds={categoriesWithAds} premiumAds={premiumAds} />
      <MobileBottomNav />
    </>
  );
}
