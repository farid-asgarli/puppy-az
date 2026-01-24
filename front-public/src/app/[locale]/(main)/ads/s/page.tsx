import { petAdService } from "@/lib/api/services/pet-ad.service";
import { citiesService } from "@/lib/api/services/cities.service";
import { createLocalizedMetadata } from "@/lib/utils/metadata";
import { AdsSearchView } from "@/lib/views/ads-search";
import MobileBottomNav from "@/lib/components/footer/mobile-bottom-nav";
import { getLocale } from "next-intl/server";

export async function generateMetadata() {
  return createLocalizedMetadata("metadata.search");
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const locale = await getLocale();

  // Fetch categories and cities for SSR
  const [categories, cities] = await Promise.all([
    petAdService.getPetCategoriesDetailed(locale),
    citiesService.getCities(locale),
  ]);

  // Pre-fetch breeds if category is in URL (optimization for initial render - for future use)
  const categoryParam = searchParams.category;
  if (categoryParam && typeof categoryParam === "string") {
    const parsedCategoryId = parseInt(categoryParam, 10);
    if (!isNaN(parsedCategoryId)) {
      try {
        await petAdService.getPetBreeds(parsedCategoryId, locale);
        // Breeds are cached, will be available for navbar/filters
      } catch (error) {
        console.error("Failed to pre-fetch breeds:", error);
      }
    }
  }

  return (
    <>
      <AdsSearchView categories={categories} cities={cities} />
      <MobileBottomNav />
    </>
  );
}
