'use client';

import { PetBreedDto, PetCategoryDetailedDto } from '@/lib/api';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import ContentContainer from '@/lib/components/content-container';
import { SearchBarMobileAnimated } from '../searchbar';
import { useFilterUrl } from '@/lib/filtering/use-filter-url';
import { DisplayCache } from '@/lib/caching/display-cache';
import { SearchBarSyncProvider } from '../searchbar/searchbar-sync-context';
import { useMemo, useEffect } from 'react';
import { usePathname } from '@/i18n/routing';
import { FilterButton } from '@/lib/components/filters/filter-button';
import { IconButton } from '@/lib/primitives';
import { IconArrowLeft } from '@tabler/icons-react';
import { useViewTransition } from '@/lib/hooks/use-view-transition';
import { cn } from '@/lib/external/utils';
import { useLocale } from '@/lib/hooks/use-client-locale';

interface MobileNavbarProps {
  categories: PetCategoryDetailedDto[];
  initialBreeds: PetBreedDto[] | null;
  isSticky?: boolean;
}

export function MobileNavbar({ categories, initialBreeds, isSticky = true }: MobileNavbarProps) {
  const locale = useLocale();
  const { filters, updateFilters } = useFilterUrl();
  const pathname = usePathname();
  const { navigateWithTransition } = useViewTransition();

  // Check if we're on the search route where filtering happens
  const isSearchRoute = pathname === '/ads/s';

  // Prefetch breeds for current category if not in cache (with locale from URL)
  useEffect(() => {
    const categoryId = filters.category ? Number(filters.category) : null;
    if (categoryId && !DisplayCache.getBreeds(categoryId)) {
      petAdService
        .getPetBreeds(categoryId, locale)
        .then((breeds) => DisplayCache.setBreeds(categoryId, breeds))
        .catch(console.error);
    }
  }, [filters.category, locale]);

  // Build initial values from URL filters
  const initialValues = useMemo(() => {
    // Find category from filters.category (ID)
    const category = filters.category ? categories.find((c) => c.id === Number(filters.category)) ?? null : null;

    // Find breed from initial breeds or cache
    let breed = null;
    if (category && filters.breed) {
      const breedId = Number(filters.breed);

      // Try from server-provided breeds first
      if (initialBreeds) {
        breed = initialBreeds.find((b) => b.id === breedId) ?? null;
      }

      // Fallback to cache
      if (!breed) {
        const cachedBreeds = DisplayCache.getBreeds(category.id);
        breed = cachedBreeds?.find((b) => b.id === breedId) ?? null;
      }
    }

    return {
      adType: filters['ad-type'] ?? null,
      category,
      breed,
    };
  }, [filters, categories, initialBreeds]);

  return (
    <nav className={cn('left-0 right-0 z-50', !isSearchRoute ? 'bg-transparent top-2.5 ' : 'bg-white top-0', isSticky ? 'fixed' : 'relative')}>
      <ContentContainer className="h-full relative">
        {/* Main navigation items row */}
        <div className="flex items-center h-16 py-3 gap-2">
          {/* Back Button - Fixed width, no shrink */}
          {isSearchRoute && (
            <div className="flex-shrink-0">
              <IconButton onClick={() => navigateWithTransition('/')} icon={<IconArrowLeft size={20} />} variant="transparent" />
            </div>
          )}

          {/* SearchBar - Flexible, can shrink */}
          <div className="flex-1 min-w-0">
            <SearchBarSyncProvider
              initialValues={initialValues}
              updateUrlFilters={updateFilters}
              currentUrlFilters={filters}
              isSearchRoute={isSearchRoute}
            >
              <SearchBarMobileAnimated />
            </SearchBarSyncProvider>
          </div>

          {/* Filter Button - Fixed width, no shrink */}
          {isSearchRoute && (
            <div className="flex-shrink-0">
              <FilterButton className="lg:hidden border-0 p-2" />
            </div>
          )}
        </div>
      </ContentContainer>
    </nav>
  );
}
