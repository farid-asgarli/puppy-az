import { cn } from "@/lib/external/utils";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface SearchButtonProps {
  isExpanded: boolean;
  activeField: boolean;
  onClick: (e: React.MouseEvent) => void;
}

/**
 * Search button component - changes size based on state
 */
export const SearchButton = ({
  isExpanded,
  activeField,
  onClick,
}: SearchButtonProps) => {
  const tAccessibility = useTranslations("accessibility");
  const tCommon = useTranslations("common");

  if (!isExpanded) {
    return (
      <button
        className="p-[7px_7px_7px_0] cursor-pointer"
        type="button"
        aria-label={tAccessibility("search")}
        onClick={onClick}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-3xl bg-primary text-white hover:bg-primary/90 transition-colors">
          <IconSearch size={18} />
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-end pr-2">
      <button
        className={cn(
          "flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          activeField ? "w-auto h-12 px-6 gap-3" : "w-12 h-12",
        )}
        type="button"
        aria-label={tAccessibility("search")}
        onClick={onClick}
      >
        <div className="flex items-center justify-center w-4 h-4">
          <IconSearch size={18} />
        </div>
        {activeField && (
          <span className="text-base font-medium whitespace-nowrap">
            {tCommon("search")}
          </span>
        )}
      </button>
    </div>
  );
};
