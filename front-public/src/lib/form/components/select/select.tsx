"use client";

import React, { forwardRef, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/external/utils";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import {
  IconChevronDown,
  IconSearch,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { Drawer } from "vaul";
import { Badge } from "@/lib/primitives/badge";
import { useTranslations } from "next-intl";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  onChange?: (value: string) => void;
  onSearchChange?: (search: string) => void;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  dropdownClassName?: string;
  error?: boolean;
  emptyMessage?: string;
  maxHeight?: number;
  autoFocus?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  usePortal?: boolean;
}

const SearchableSelect = forwardRef<HTMLDivElement, SearchableSelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      placeholder,
      searchPlaceholder,
      onChange,
      onSearchChange,
      disabled = false,
      clearable = false,
      searchable = true,
      size = "md",
      className,
      dropdownClassName,
      error = false,
      emptyMessage,
      maxHeight = 200,
      autoFocus = false,
      loading = false,
      leftIcon,
      rightIcon,
      usePortal,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations("form.select");
    const defaultPlaceholder = placeholder || t("placeholder");
    const defaultSearchPlaceholder =
      searchPlaceholder || t("searchPlaceholder");
    const defaultEmptyMessage = emptyMessage || t("noResults");
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const isMobile = useMediaQuery("(max-width: 992px)");

    const currentValue =
      controlledValue !== undefined ? controlledValue : internalValue;

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : options;

    // Get selected option
    const selectedOption = options.find(
      (option) => option.value === currentValue,
    );

    // Calculate dropdown position
    const updateDropdownPosition = () => {
      if (triggerRef.current && !isMobile) {
        const rect = triggerRef.current.getBoundingClientRect();

        // Use the trigger width, but with a reasonable minimum
        const minWidth = 150;
        const triggerWidth = rect.width;
        const finalWidth = Math.max(triggerWidth, minWidth);

        setDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: finalWidth,
        });
      }
    };

    // Handle value change
    const handleValueChange = (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleValueChange("");
    };

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!searchable) return;

      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
      setHighlightedIndex(-1);
      onSearchChange?.(newSearchTerm);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (isOpen) {
            if (
              highlightedIndex >= 0 &&
              highlightedIndex < filteredOptions.length
            ) {
              handleValueChange(filteredOptions[highlightedIndex].value);
            }
          } else {
            setIsOpen(true);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1,
            );
          }
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    };

    // Handle click outside
    useEffect(() => {
      if (!isOpen || isMobile) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        // Check if click is outside both the container and the portal dropdown
        const isOutsideContainer =
          containerRef.current && !containerRef.current.contains(target);
        const portalElement = document.querySelector("[data-dropdown-portal]");
        const isOutsidePortal = !portalElement?.contains(target);

        if (isOutsideContainer && isOutsidePortal) {
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
        }
      };

      // Small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, isMobile]);

    // Update dropdown position when opened or on scroll/resize
    useEffect(() => {
      if (isOpen && !isMobile) {
        updateDropdownPosition();

        // Throttle scroll events for better performance
        let ticking = false;
        const handleScroll = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              updateDropdownPosition();
              ticking = false;
            });
            ticking = true;
          }
        };

        const handleResize = () => updateDropdownPosition();

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("scroll", handleScroll);
        };
      }
    }, [isOpen, isMobile]);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current && searchable && !isMobile) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable, isMobile]);

    // Scroll highlighted option into view
    useEffect(() => {
      if (highlightedIndex >= 0 && optionsRef.current && !isMobile) {
        const optionElement = optionsRef.current.children[
          highlightedIndex
        ] as HTMLElement;
        if (optionElement) {
          optionElement.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex, isMobile]);

    // Handle drawer close and cleanup
    const handleDrawerOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setSearchTerm("");
        setHighlightedIndex(-1);
        // Ensure pointer-events are restored
        setTimeout(() => {
          document.body.style.pointerEvents = "";
        }, 100);
      }
    };

    const sizeClasses = {
      sm: "h-10 px-3 text-sm",
      md: "h-12 px-4 text-base",
      lg: "h-14 px-5 text-lg",
    };

    const renderOptions = () => (
      <div
        ref={optionsRef}
        className="max-h-60 overflow-y-auto py-1"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {loading ? (
          <div className="px-3 py-2 text-gray-500 text-center">
            {t("loading")}
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="px-3 py-2 text-gray-500 text-center">
            {defaultEmptyMessage}
          </div>
        ) : (
          filteredOptions.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                !option.disabled && handleValueChange(option.value)
              }
              disabled={option.disabled}
              className={cn(
                "w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-150",
                option.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-900 hover:bg-gray-50 cursor-pointer",
                index === highlightedIndex && !option.disabled && "bg-gray-100",
                option.value === currentValue && "bg-gray-100 font-semibold",
              )}
            >
              <span className="truncate text-base">{option.label}</span>
              {option.value === currentValue && (
                <IconCheck
                  size={18}
                  className="text-black flex-shrink-0 ml-2"
                />
              )}
            </button>
          ))
        )}
      </div>
    );

    const renderSearchInput = () => {
      if (!searchable) return null;

      return (
        <div className="p-3 border-b border-gray-200">
          <div className="relative flex items-center rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white focus-within:border-black focus-within:bg-white transition-all duration-200">
            <div className="flex items-center px-4 shrink-0">
              <IconSearch size={18} className="text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              placeholder={defaultSearchPlaceholder}
              className="flex-1 min-w-0 py-3 pr-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-base"
              autoFocus={autoFocus && !isMobile}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      );
    };

    // Render dropdown portal
    const renderDropdownPortal = () => {
      if (!isOpen || isMobile) return null;

      return createPortal(
        <div
          data-dropdown-portal
          className={cn(
            "fixed z-[9999] bg-white border border-gray-300 rounded-xl shadow-lg",
            dropdownClassName,
          )}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            minWidth: "150px", // Fallback minimum width
          }}
          onMouseDown={(e) => {
            // Prevent the click from bubbling up and triggering handleClickOutside
            e.stopPropagation();
          }}
        >
          {renderSearchInput()}
          {renderOptions()}
        </div>,
        document.body,
      );
    };

    return (
      <div ref={containerRef} className={cn("relative", className)} {...props}>
        {/* Trigger Button */}
        <div
          className={cn(
            "relative flex items-center rounded-xl overflow-hidden transition-all duration-200 border-2",
            disabled && "bg-gray-50 cursor-not-allowed",
            error
              ? "border-red-500 bg-red-50/30"
              : isOpen && !disabled
                ? "border-black bg-white"
                : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-white",
          )}
        >
          {leftIcon && (
            <div className="flex items-center px-4 shrink-0">
              <div className={cn("text-gray-400", error && "text-red-500")}>
                {leftIcon}
              </div>
            </div>
          )}

          <button
            ref={triggerRef}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0 flex items-center justify-between bg-transparent focus:outline-none",
              sizeClasses[size],
              leftIcon ? "pr-4" : "px-4",
              disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-900 cursor-pointer",
            )}
          >
            <span
              className={cn("truncate", !selectedOption && "text-gray-400")}
            >
              {selectedOption ? selectedOption.label : defaultPlaceholder}
            </span>

            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              {clearable && selectedOption && !disabled && (
                <span
                  role="button"
                  title={t("clearSelection")}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(
                      e as unknown as React.MouseEvent<HTMLButtonElement>,
                    );
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <IconX size={16} className="text-gray-400" />
                </span>
              )}
              <IconChevronDown
                size={20}
                className={cn(
                  "text-gray-400 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </button>

          {rightIcon && (
            <div className="flex items-center px-4 shrink-0">
              <div className={cn("text-gray-400", error && "text-red-500")}>
                {rightIcon}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Dropdown Portal */}
        {usePortal !== false
          ? renderDropdownPortal()
          : isOpen &&
            !isMobile && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50">
                {renderSearchInput()}
                {renderOptions()}
              </div>
            )}

        {/* Mobile Drawer */}
        <Drawer.Root
          open={isOpen && isMobile}
          onOpenChange={handleDrawerOpenChange}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[9998]" />
            <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[90vh] fixed bottom-0 left-0 right-0 z-[9999]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Drawer.Title className="font-semibold text-xl text-gray-900">
                  {defaultPlaceholder}
                </Drawer.Title>
                <button
                  title={t("closeDrawer")}
                  onClick={() => handleDrawerOpenChange(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IconX size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Search Section */}
              {searchable && (
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-600 mb-3">
                    {t("currentlySelected")}{" "}
                    <span className="font-medium">
                      {selectedOption ? selectedOption.label : t("notSelected")}
                    </span>
                  </div>
                  <div className="relative">
                    <IconSearch
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder={searchPlaceholder}
                      className="w-full pl-12 pr-4 py-3 bg-white border-0 rounded-full focus:outline-none focus:ring-0 text-base placeholder-gray-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 text-base">
                      {t("loading")}
                    </div>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 text-base">
                      {defaultEmptyMessage}
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    {filteredOptions.map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          !option.disabled && handleValueChange(option.value)
                        }
                        disabled={option.disabled}
                        className={cn(
                          "w-full flex items-center justify-between p-4 text-left rounded-xl transition-colors duration-200 mb-2",
                          option.disabled
                            ? "text-gray-400 cursor-not-allowed bg-gray-50"
                            : "text-gray-700 hover:bg-gray-50 cursor-pointer active:bg-gray-100",
                          option.value === currentValue &&
                            "bg-primary-50 text-primary-700 font-medium border border-primary-200",
                        )}
                      >
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center",
                              option.value === currentValue
                                ? "border-primary-500 bg-primary-500"
                                : "border-gray-300",
                            )}
                          >
                            {option.value === currentValue && (
                              <Badge color="white" />
                            )}
                          </div>
                          <span className="text-base">{option.label}</span>
                        </div>
                        {option.value === currentValue && (
                          <IconCheck
                            size={20}
                            className="text-primary-600 flex-shrink-0"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    );
  },
);

SearchableSelect.displayName = "SearchableSelect";

export { SearchableSelect };
