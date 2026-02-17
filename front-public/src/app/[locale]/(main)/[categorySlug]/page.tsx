import { petAdService } from "@/lib/api/services/pet-ad.service";
import { citiesService } from "@/lib/api/services/cities.service";
import { createLocalizedMetadata } from "@/lib/utils/metadata";
import { AdsSearchView } from "@/lib/views/ads-search";
import MobileBottomNav from "@/lib/components/footer/mobile-bottom-nav";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const locale = await getLocale();

  try {
    const category = await petAdService.getCategoryBySlug(categorySlug, locale);
    return {
      title: `${category.title} | Puppy.az`,
      description: category.subtitle || category.title,
    };
  } catch {
    return createLocalizedMetadata("metadata.search");
  }
}

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage(props: PageProps) {
  const { categorySlug } = await props.params;
  const locale = await getLocale();

  // Resolve category from slug
  let category;
  try {
    category = await petAdService.getCategoryBySlug(categorySlug, locale);
  } catch {
    notFound();
  }

  // Fetch categories and cities for SSR
  const [categories, cities] = await Promise.all([
    petAdService.getPetCategoriesDetailed(locale),
    citiesService.getCities(locale),
  ]);

  // Pre-fetch breeds for this category
  let breeds = null;
  try {
    breeds = await petAdService.getPetBreeds(category.id, locale);
  } catch (error) {
    console.error("Failed to pre-fetch breeds:", error);
  }

  return (
    <>
      <AdsSearchView
        categories={categories}
        cities={cities}
        breeds={breeds}
        initialCategory={category.id}
        initialCategorySlug={categorySlug}
      />
      <MobileBottomNav />
    </>
  );
}
