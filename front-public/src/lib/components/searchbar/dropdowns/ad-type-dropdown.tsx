import { PetAdType } from "@/lib/api";
import { useAdTypes } from "@/lib/hooks/use-ad-types";
import { cn } from "@/lib/external/utils";
import {
  ListDropdown,
  type ListDropdownOption,
} from "../components/dropdown-wrapper";
import { useTranslations } from "next-intl";

interface AdTypeDropdownProps {
  onSelect: (type: PetAdType) => void;
  searchQuery?: string;
}

/**
 * Ad Type Dropdown Content
 */
export const AdTypeDropdown = ({
  onSelect,
  searchQuery = "",
}: AdTypeDropdownProps) => {
  const tSearch = useTranslations("search");
  const { adTypesWithIcons } = useAdTypes();

  // Transform ad types to dropdown options
  const options: ListDropdownOption<PetAdType>[] = adTypesWithIcons.map(
    (adType) => ({
      id: String(adType.id),
      value: adType.id as PetAdType,
      label: adType.title,
      description: adType.description,
      icon: (
        <adType.icon
          className={cn("w-6 h-6", adType.color.text)}
          strokeWidth={1.5}
        />
      ),
      iconClassName: cn("border", adType.color.bg, adType.color.border),
    }),
  );

  return (
    <ListDropdown<PetAdType>
      title={tSearch("adType")}
      titleId="ad-types"
      options={options}
      searchQuery={searchQuery}
      onSelect={onSelect}
    />
  );
};
