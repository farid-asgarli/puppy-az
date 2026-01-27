'use client';

import { useState } from 'react';
import { usePathname } from '@/i18n';
import { PetCategoryDetailedDto } from '@/lib/api';
import Navbar from '@/lib/components/navbar/navbar';
import FilterDialog from '@/lib/components/filters/filter-dialog';
import { FilterDialogContext } from '@/lib/contexts/filter-dialog-context';

interface MainLayoutClientProps {
  children: React.ReactNode;
  categories: PetCategoryDetailedDto[];
}

/**
 * Client component for main layout
 * Provides FilterDialog state management via context
 * Controls navbar sticky behavior based on route
 */
export function MainLayoutClient({ children, categories }: MainLayoutClientProps) {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const pathname = usePathname();
  // Navbar should be sticky/fixed only on homepage (/) and search page (/ads/s)
  const isStickyNavbar = pathname === '/' || pathname === '/ads/s';

  return (
    <FilterDialogContext.Provider
      value={{
        isOpen: isFilterDialogOpen,
        openDialog: () => setIsFilterDialogOpen(true),
        closeDialog: () => setIsFilterDialogOpen(false),
      }}
    >
      <Navbar categories={categories} initialBreeds={null} isSticky={isStickyNavbar} />
      {children}
      <FilterDialog isOpen={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)} />
    </FilterDialogContext.Provider>
  );
}
