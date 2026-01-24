"use client";

import TransitionLink from "@/lib/components/transition-link";
import { cn } from "@/lib/external/utils";
import {
  IconChevronDown,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconWorld,
} from "@tabler/icons-react";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/lib/components/language-switcher";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { Text } from "@/lib/primitives/typography";

// Collapsible section for mobile
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <IconChevronDown
          size={18}
          className={cn(
            "text-gray-600 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 pb-4" : "max-h-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function MobileFooter() {
  const t = useTranslations("footer");
  const tAccessibility = useTranslations("accessibility");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(langMenuRef, () => setIsLangMenuOpen(false));

  return (
    <footer className="bg-gray-50 border-t border-gray-200 pb-20">
      <div className="px-6 py-8">
        {/* Logo & Description */}
        <div className="mb-6">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-3 mb-3"
          >
            <img src="/logo-black.png" alt="puppy.az" className="h-7 w-auto" />
            <span className="text-lg font-bold text-gray-900">puppy.az</span>
          </TransitionLink>
          <Text variant="small" color="secondary" className="mb-4">
            {t("description")}
          </Text>
          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://facebook.com/puppy.az"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-all"
              aria-label={tAccessibility("facebook")}
            >
              <IconBrandFacebook size={18} />
            </a>
            <a
              href="https://instagram.com/puppy.az"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 transition-all"
              aria-label={tAccessibility("instagram")}
            >
              <IconBrandInstagram size={18} />
            </a>
            <a
              href="https://twitter.com/puppy.az"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-600 transition-all"
              aria-label={tAccessibility("twitter")}
            >
              <IconBrandTwitter size={18} />
            </a>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-0">
          <CollapsibleSection title={t("company")}>
            <ul className="space-y-3">
              <li>
                <TransitionLink
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("about")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/careers"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("careers")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/press"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("press")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/blog"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("blog")}
                </TransitionLink>
              </li>
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title={t("support")}>
            <ul className="space-y-3">
              <li>
                <TransitionLink
                  href="/help"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("helpCenter")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/safety"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("safety")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("contact")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/report"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("report")}
                </TransitionLink>
              </li>
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title={t("community")}>
            <ul className="space-y-3">
              <li>
                <TransitionLink
                  href="/community"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("communityForum")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/events"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("events")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/guides"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("guides")}
                </TransitionLink>
              </li>
              <li>
                <TransitionLink
                  href="/partnership"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  {t("partnership")}
                </TransitionLink>
              </li>
            </ul>
          </CollapsibleSection>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
          {/* Language Selector */}
          <div>
            <LanguageSwitcher>
              {({ currentLanguage, languages, changeLanguage, isPending }) => {
                const currentLang = languages.find(
                  (l) => l.code === currentLanguage,
                );
                return (
                  <div className="relative inline-block" ref={langMenuRef}>
                    <button
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      disabled={isPending}
                      className={cn(
                        "flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group",
                        isPending && "opacity-50 cursor-not-allowed",
                      )}
                      aria-label={tAccessibility("selectLanguage")}
                    >
                      <IconWorld
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="font-medium">
                        {currentLang?.name} ({currentLang?.label})
                      </span>
                      <IconChevronDown
                        size={16}
                        className={cn(
                          "transition-transform",
                          isLangMenuOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isLangMenuOpen && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 overflow-hidden z-50">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              changeLanguage(lang.code);
                              setIsLangMenuOpen(false);
                            }}
                            disabled={isPending}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                              currentLanguage === lang.code
                                ? "text-gray-900 bg-gray-50 font-semibold"
                                : "text-gray-700 hover:bg-gray-50",
                              isPending && "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <span>{lang.name}</span>
                            <span className="text-gray-500 text-xs">
                              {lang.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            </LanguageSwitcher>
          </div>

          {/* Legal Links & Copyright */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-gray-600">
              <TransitionLink
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                {t("terms")}
              </TransitionLink>
              <span className="text-gray-400">·</span>
              <TransitionLink
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                {t("privacy")}
              </TransitionLink>
            </div>
            <p className="text-sm text-gray-600">
              {t("copyright")}. {t("allRightsReserved")}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
