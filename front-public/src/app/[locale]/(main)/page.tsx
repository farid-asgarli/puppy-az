import { petAdService } from "@/lib/api/services/pet-ad.service";
import MobileBottomNav from "@/lib/components/footer/mobile-bottom-nav";
import { createLocalizedMetadata } from "@/lib/utils/metadata";
import { HomeView } from "@/lib/views/home";
import type {
  PetCategoryWithAdsDto,
  PetAdListItemDto,
} from "@/lib/api/types/pet-ad.types";
import { SortDirection } from "@/lib/api/types/common.types";
import { getLocale } from "next-intl/server";

export async function generateMetadata() {
  return createLocalizedMetadata("metadata.home");
}

export default async function Page() {
  // Get locale for backend API calls
  const locale = await getLocale();

  // Fetch data for SSR in parallel
  let categoriesWithAds: PetCategoryWithAdsDto[] = [];
  let latestAds: PetAdListItemDto[] = [];

  try {
    const [categoriesResult, latestAdsResult] = await Promise.all([
      petAdService.getPetCategoriesWithAds(locale),
      petAdService.searchPetAds(
        {
          pagination: { number: 1, size: 12 },
          sorting: [{ key: "CreatedAt", direction: SortDirection.DESCENDING }],
        },
        locale,
      ),
    ]);
    categoriesWithAds = categoriesResult;
    latestAds = latestAdsResult.items;
  } catch (error) {
    // If API call fails, use empty data
    console.error("Failed to fetch homepage data:", error);
  }

  return (
    <>
      <HomeView categoriesWithAds={categoriesWithAds} latestAds={latestAds} />
      <MobileBottomNav />
    </>
  );
}
