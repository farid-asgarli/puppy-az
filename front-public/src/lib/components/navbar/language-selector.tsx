'use client';

import { useState, useRef } from 'react';
import { IconWorld } from '@tabler/icons-react';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { cn } from '@/lib/external/utils';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/lib/components/language-switcher';

export default function LanguageSelector() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const tAccessibility = useTranslations('accessibility');

  useClickOutside(languageMenuRef, () => setIsMenuOpen(false));

  return (
    <LanguageSwitcher>
      {({ currentLanguage, languages, changeLanguage, isPending }) => (
        <div className="relative" ref={languageMenuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex w-10 h-10 bg-gray-100 rounded-full items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label={tAccessibility('selectLanguage')}
            disabled={isPending}
          >
            <IconWorld className="w-5 h-5 text-gray-700" />
          </button>

          {/* Language Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-14 z-50 w-40 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  disabled={isPending}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-200 hover:bg-gray-100',
                    currentLanguage === lang.code ? 'text-gray-900 bg-gray-50' : 'text-gray-700',
                    isPending && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span>{lang.name}</span>
                  <span className="text-gray-500">{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </LanguageSwitcher>
  );
}
