import { PetAdType } from '@/lib/api';
import { getAdTypes } from '@/lib/utils/mappers';
import { cn } from '@/lib/external/utils';
import { ListDropdown, type ListDropdownOption } from '../components/dropdown-wrapper';
import { useTranslations } from 'next-intl';

interface AdTypeDropdownProps {
  onSelect: (type: PetAdType) => void;
  searchQuery?: string;
}

/**
 * Ad Type Dropdown Content
 */
export const AdTypeDropdown = ({ onSelect, searchQuery = '' }: AdTypeDropdownProps) => {
  const tSearch = useTranslations('search');
  const tCommon = useTranslations('common');
  const adTypes = getAdTypes(tCommon);
  const adTypeEntries = Object.entries(adTypes) as [string, ReturnType<typeof getAdTypes>[PetAdType]][];

  // Transform ad types to dropdown options
  const options: ListDropdownOption<PetAdType>[] = adTypeEntries.map(([key, adType]) => ({
    id: key,
    value: parseInt(key) as PetAdType,
    label: adType.title,
    description: adType.description,
    icon: <adType.icon className={cn('w-6 h-6', adType.color.text)} strokeWidth={1.5} />,
    iconClassName: cn('border', adType.color.bg, adType.color.border),
  }));

  return <ListDropdown<PetAdType> title={tSearch('adType')} titleId="ad-types" options={options} searchQuery={searchQuery} onSelect={onSelect} />;
};
