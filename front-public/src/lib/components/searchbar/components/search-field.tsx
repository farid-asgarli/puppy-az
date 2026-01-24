import type { ActiveField } from "../constants";
import { cn } from "@/lib/external/utils";
import { useTranslations } from "next-intl";

interface SearchFieldProps {
  fieldId: NonNullable<ActiveField>;
  label: string;
  placeholder: string;
  displayValue: string;
  inputValue: string;
  isExpanded: boolean;
  isActive: boolean;
  onFieldClick: () => void;
  onInputChange: (value: string) => void;
  onInputBlur: () => void;
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  fieldRef: (el: HTMLDivElement | null) => void;
}

/**
 * Expanded search field with label and input
 */
const ExpandedField = ({
  label,
  placeholder,
  inputValue,
  isActive,
  onFieldClick,
  onInputChange,
  onInputBlur,
  onClear,
  onKeyDown,
  fieldRef,
}: Omit<SearchFieldProps, "displayValue" | "isExpanded" | "fieldId">) => {
  const showClearButton = isActive && inputValue.length > 0;
  const tAccessibility = useTranslations("accessibility");

  return (
    <div
      ref={fieldRef}
      className={cn(
        "relative flex items-center justify-between h-16 rounded-xl cursor-pointer transition-colors text-ellipsis line-clamp-1",
        isActive ? "bg-white shadow-lg" : "hover:bg-gray-100/50",
      )}
      onClick={(e) => {
        e.stopPropagation();
        onFieldClick();
      }}
    >
      <div className="relative px-8 py-[15px] overflow-hidden z-[2] cursor-pointer w-full flex items-center gap-2">
        <div className="flex-1">
          <div className="text-xs font-medium leading-4 text-ellipsis whitespace-nowrap overflow-hidden pb-0.5">
            {label}
          </div>
          <input
            className="w-full border-0 bg-transparent outline-none text-sm font-normal placeholder:text-gray-600 text-gray-900"
            type="text"
            placeholder={placeholder}
            aria-label={label}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={onFieldClick}
            onBlur={onInputBlur}
            onKeyDown={onKeyDown}
          />
        </div>
        {showClearButton && onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            onMouseDown={(e) => {
              // Prevent blur event from firing before clear
              e.preventDefault();
            }}
            className="flex-shrink-0 w-6 h-6 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            aria-label={tAccessibility("clear")}
          >
            <svg
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Collapsed search field button
 */
const CollapsedField = ({
  label,
  displayValue,
  onFieldClick,
  fieldId,
}: Pick<
  SearchFieldProps,
  "label" | "displayValue" | "onFieldClick" | "fieldId"
>) => {
  const getRoundedClass = () => {
    if (fieldId === "ad-type") return "rounded-[16px_4px_4px_16px]";
    return "rounded";
  };

  return (
    <button
      className={cn(
        "relative flex items-center h-12 -m-px border border-transparent cursor-pointer z-[1] hover:border-gray-300 transition-all  text-ellipsis line-clamp-1",
        getRoundedClass(),
        // 'rounded-xl'
      )}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onFieldClick();
      }}
    >
      <span className="absolute w-px h-px overflow-hidden whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 px-4 text-sm font-medium leading-[22px] text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
        {displayValue}
      </div>
    </button>
  );
};

/**
 * Reusable search field component
 */
export const SearchField = ({
  fieldId,
  label,
  placeholder,
  displayValue,
  inputValue,
  isExpanded,
  isActive,
  onFieldClick,
  onInputChange,
  onInputBlur,
  onClear,
  onKeyDown,
  fieldRef,
}: SearchFieldProps) => {
  if (isExpanded) {
    return (
      <ExpandedField
        label={label}
        placeholder={placeholder}
        inputValue={inputValue}
        isActive={isActive}
        onFieldClick={onFieldClick}
        onInputChange={onInputChange}
        onInputBlur={onInputBlur}
        onClear={onClear}
        onKeyDown={onKeyDown}
        fieldRef={fieldRef}
      />
    );
  }

  return (
    <CollapsedField
      fieldId={fieldId}
      label={label}
      displayValue={displayValue}
      onFieldClick={onFieldClick}
    />
  );
};
