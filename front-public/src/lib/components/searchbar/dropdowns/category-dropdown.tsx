import { useEffect, useState } from 'react';
import { ListDropdown, type ListDropdownOption } from '../components/dropdown-wrapper';
import { petAdService } from '@/lib/api/services/pet-ad.service';
import type { PetCategoryDetailedDto } from '@/lib/api/types/pet-ad.types';
import { useTranslations } from 'next-intl';

interface CategoryDropdownProps {
  onSelect: (category: PetCategoryDetailedDto) => void;
  searchQuery?: string;
}

/**
 * Category Dropdown Content (fetches from API)
 */
export const CategoryDropdown = ({ onSelect, searchQuery = '' }: CategoryDropdownProps) => {
  const [categories, setCategories] = useState<PetCategoryDetailedDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tSearch = useTranslations('search');
  const tCommon = useTranslations('common');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    petAdService
      .getPetCategoriesDetailed()
      .then((result) => {
        if (mounted) {
          setCategories(result ?? []);
          setError(null);
        }
      })
      .catch(() => {
        setError(tCommon('loadError'));
        setCategories([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [tCommon]);

  const options: ListDropdownOption<number>[] = categories.map((category) => ({
    id: category.id,
    value: category.id,
    label: category.title,
    description: category.subtitle || '',
    icon: <div className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: category.svgIcon }} />,
    iconClassName: `border ${category.backgroundColor} border-gray-200`,
  }));

  if (loading) {
    return <div className="px-4 py-3 text-gray-500">{tCommon('loading')}</div>;
  }
  if (error) {
    return <div className="px-4 py-3 text-red-500">{error}</div>;
  }

  const handleSelect = (categoryId: number) => {
    const selected = categories.find((c) => c.id === categoryId);
    console.log(selected);
    if (selected) onSelect(selected);
  };
  return (
    <ListDropdown<number> title={tSearch('category')} titleId="categories" options={options} searchQuery={searchQuery} onSelect={handleSelect} />
  );
};
