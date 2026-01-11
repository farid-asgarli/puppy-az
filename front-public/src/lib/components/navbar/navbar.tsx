'use client';

import { PetBreedDto, PetCategoryDetailedDto } from '@/lib/api';
import { MobileNavbar } from './mobile-navbar';
import { DesktopNavbarWithSearchbar } from '@/lib/components/navbar/desktop-navbar-with-search';

interface NavbarProps {
  categories: PetCategoryDetailedDto[];
  initialBreeds: PetBreedDto[] | null;
  isSticky?: boolean;
}

/**
 * Responsive Navbar Component
 * Uses CSS media queries to show/hide appropriate navbar
 * Prevents hydration mismatches by rendering both and using CSS visibility
 * @param isSticky - If true, navbar is fixed/sticky. If false, navbar is static (default: true)
 */
export default function Navbar({ categories, initialBreeds, isSticky = true }: NavbarProps) {
  return (
    <>
      {/* Desktop Navbar - Hidden on mobile via CSS */}
      <div className="hidden md:block">
        {/* <DesktopNavbarWithSearchbar categories={categories} initialBreeds={initialBreeds} isSticky={isSticky} /> */}
        <DesktopNavbarWithSearchbar categories={categories} initialBreeds={initialBreeds} isSticky={isSticky} />
      </div>

      {/* Mobile Navbar - Hidden on desktop via CSS */}
      <div className="block md:hidden">
        <MobileNavbar categories={categories} initialBreeds={initialBreeds} isSticky={isSticky} />
      </div>
    </>
  );
}
