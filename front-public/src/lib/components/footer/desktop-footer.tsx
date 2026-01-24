"use client";

import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconWorld,
  IconChevronDown,
} from "@tabler/icons-react";
import TransitionLink from "@/lib/components/transition-link";
import NarrowContainer from "@/lib/components/narrow-container";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/lib/components/language-switcher";
import { useState, useRef } from "react";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { cn } from "@/lib/external/utils";
import { Text } from "@/lib/primitives/typography";

export function DesktopFooter() {
  const t = useTranslations("footer");
  const tAccessibility = useTranslations("accessibility");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(langMenuRef, () => setIsLangMenuOpen(false));

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <NarrowContainer className="py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <TransitionLink
              href="/"
              className="inline-flex items-center gap-3 mb-4"
            >
              <img
                src="/logo-black.png"
                alt="puppy.az"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">puppy.az</span>
            </TransitionLink>
            <Text variant="small" color="secondary" className="max-w-xs mb-6">
              {t("description")}
            </Text>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com/puppy.az"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-all duration-200"
                aria-label={tAccessibility("facebook")}
              >
                <IconBrandFacebook size={20} />
              </a>
              <a
                href="https://instagram.com/puppy.az"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 transition-all duration-200"
                aria-label={tAccessibility("instagram")}
              >
                <IconBrandInstagram size={20} />
              </a>
              <a
                href="https://twitter.com/puppy.az"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-600 transition-all duration-200"
                aria-label={tAccessibility("twitter")}
              >
                <IconBrandTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {t("company")}
            </h3>
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
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {t("support")}
            </h3>
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
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {t("community")}
            </h3>
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
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Copyright & Legal */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              <span>{t("copyright")}</span>
              <span className="hidden lg:inline text-gray-400">·</span>
              <TransitionLink
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                {t("terms")}
              </TransitionLink>
              <span className="hidden lg:inline text-gray-400">·</span>
              <TransitionLink
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                {t("privacy")}
              </TransitionLink>
            </div>

            {/* Right: Language Selector */}
            <LanguageSwitcher>
              {({ currentLanguage, languages, changeLanguage, isPending }) => {
                const currentLang = languages.find(
                  (l) => l.code === currentLanguage,
                );
                return (
                  <div className="relative" ref={langMenuRef}>
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
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 overflow-hidden z-50">
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
        </div>
      </NarrowContainer>
    </footer>
  );
}
