import { petAdService } from '@/lib/api/services/pet-ad.service';
import { MainLayoutClient } from './layout-client';
import type { PetCategoryDetailedDto } from '@/lib/api/types/pet-ad.types';
import { getLocale } from 'next-intl/server';

/**
 * Shared layout for main routes (/, /ads/s, /ads/item-details)
 * Fetches navbar data at layout level and provides FilterDialog context
 * Prevents prop drilling through navbar components
 */
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  // Fetch categories for navbar (shared across all main routes)
  // Handle errors gracefully to prevent infinite retry loops
  let categories: PetCategoryDetailedDto[] = [];
  try {
    categories = await petAdService.getPetCategoriesDetailed(locale);
  } catch (error) {
    console.error('Failed to fetch categories in MainLayout:', error);
  }

  return <MainLayoutClient categories={categories}>{children}</MainLayoutClient>;
}
