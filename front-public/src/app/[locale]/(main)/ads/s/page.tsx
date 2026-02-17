import { getCachedCategories, getCachedCities } from "@/lib/data/cached-data";
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
  await props.searchParams;
  const locale = await getLocale();

  // Fetch categories and cities for SSR using cached versions
  const [categories, cities] = await Promise.all([
    getCachedCategories(locale),
    getCachedCities(locale),
  ]);

  return (
    <>
      <AdsSearchView categories={categories} cities={cities} />
      <MobileBottomNav />
    </>
  );
}
