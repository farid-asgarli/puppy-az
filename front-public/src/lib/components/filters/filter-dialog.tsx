'use client';

import React, { useState, useEffect } from 'react';
import { FilterDrawer } from '@/lib/components/filters/views/filter-drawer';
import { FilterDialogModal } from '@/lib/components/filters/views/filter-modal';
import { FilterContent } from '@/lib/components/filters/components/filter-content';
import { DisplayCacheProvider } from '@/lib/caching/display-cache-provider';
import { DisplayCache } from '@/lib/caching/display-cache';
import { CityDto } from '@/lib/api';

interface FilterDialogProps {
  onClose: () => void;
  isOpen: boolean;
  cities?: CityDto[];
}

export default function FilterDialog({ isOpen, onClose, cities }: FilterDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Use provided cities or fallback to cache (for UI display)
  const citiesData = cities || DisplayCache.getCities() || undefined;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const filterContent = (
    <DisplayCacheProvider cities={citiesData}>
      <FilterContent onClose={onClose} cities={citiesData} />
    </DisplayCacheProvider>
  );

  if (isMobile) return <FilterDrawer isOpen={isOpen} onClose={onClose} filterContent={filterContent} />;

  return <FilterDialogModal isOpen={isOpen} onClose={onClose} filterContent={filterContent} />;
}
