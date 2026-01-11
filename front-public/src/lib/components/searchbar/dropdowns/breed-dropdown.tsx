import { useEffect, useState } from 'react';
import { ListDropdown, type ListDropdownOption } from '../components/dropdown-wrapper';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import type { PetBreedDto } from '@/lib/api/types/pet-ad.types';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/lib/hooks/use-client-locale';

interface BreedDropdownProps {
  categoryId: number | null;
  onSelect: (breed: PetBreedDto) => void;
  searchQuery?: string;
}

/**
 * Breed Dropdown Content (fetches from API)
 */
export const BreedDropdown = ({ categoryId, onSelect, searchQuery = '' }: BreedDropdownProps) => {
  const locale = useLocale();
  const [breeds, setBreeds] = useState<PetBreedDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tSearch = useTranslations('search');
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');

  useEffect(() => {
    if (!categoryId) {
      setBreeds([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    petAdService
      .getPetBreeds(categoryId, locale)
      .then((result) => {
        if (mounted) {
          setBreeds(result ?? []);
          setError(null);
        }
      })
      .catch(() => {
        setError(tErrors('fetchBreedsFailed'));
        setBreeds([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [categoryId, tErrors, locale]);

  const options: ListDropdownOption<number>[] = breeds.map((breed) => ({
    id: breed.id,
    value: breed.id,
    label: breed.title,
    description: '',
  }));

  const handleSelect = (breedId: number) => {
    const selected = breeds.find((b) => b.id === breedId);
    if (selected) onSelect(selected);
  };

  if (!categoryId) {
    return <div className="px-4 py-3 text-gray-500">{tSearch('selectCategoryFirst')}</div>;
  }
  if (loading) {
    return <div className="px-4 py-3 text-gray-500">{tCommon('loading')}</div>;
  }
  if (error) {
    return <div className="px-4 py-3 text-red-500">{error}</div>;
  }

  return <ListDropdown<number> title={tSearch('breed')} titleId="breeds" options={options} searchQuery={searchQuery} onSelect={handleSelect} />;
};
