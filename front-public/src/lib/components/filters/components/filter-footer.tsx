"use client";

import { useTranslations } from "next-intl";

interface FilterFooterProps {
  resetFilters(): void;
  submitFilters(): Promise<void>;
}

export const FilterFooter = ({
  resetFilters,
  submitFilters,
}: FilterFooterProps) => {
  const t = useTranslations("filters");

  return (
    <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
      <button
        type="button"
        onClick={resetFilters}
        className="text-sm font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors"
      >
        {t("reset")}
      </button>
      <button
        type="button"
        onClick={() => submitFilters()}
        className="px-8 py-3 bg-primary-600 text-white text-base font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
      >
        {t("showResults")}
      </button>
    </div>
  );
};
