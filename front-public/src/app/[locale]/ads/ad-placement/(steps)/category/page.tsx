import { petAdService } from '@/lib/api/services/pet-ad.service';
import CategoryView from '@/lib/views/ad-placement/views/category-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';
import { getLocale } from 'next-intl/server';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.category');
}

export default async function CategoryPage() {
  const locale = await getLocale();
  const categories = await petAdService.getPetCategoriesDetailed(locale);

  return <CategoryView categories={categories} />;
}
