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
  params: Promise<{ categorySlug: string; breedSlug: string }>;
}) {
  const { categorySlug, breedSlug } = await params;
  const locale = await getLocale();

  try {
    const breed = await petAdService.getBreedBySlug(
      categorySlug,
      breedSlug,
      locale,
    );
    return {
      title: `${breed.title} - ${breed.categoryTitle} | Puppy.az`,
      description: `${breed.title} - ${breed.categoryTitle}`,
    };
  } catch {
    return createLocalizedMetadata("metadata.search");
  }
}

interface PageProps {
  params: Promise<{ categorySlug: string; breedSlug: string }>;
}

export default async function BreedPage(props: PageProps) {
  const { categorySlug, breedSlug } = await props.params;
  const locale = await getLocale();

  // Resolve breed from slugs
  let breed;
  try {
    breed = await petAdService.getBreedBySlug(categorySlug, breedSlug, locale);
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
    breeds = await petAdService.getPetBreeds(breed.categoryId, locale);
  } catch (error) {
    console.error("Failed to pre-fetch breeds:", error);
  }

  return (
    <>
      <AdsSearchView
        categories={categories}
        cities={cities}
        breeds={breeds}
        initialCategory={breed.categoryId}
        initialCategorySlug={categorySlug}
        initialBreed={breed.id}
        initialBreedSlug={breedSlug}
      />
      <MobileBottomNav />
    </>
  );
}
