'use client';

import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';

export type Locale = 'az' | 'en' | 'ru';

export const LANGUAGES = [
  { code: 'az' as Locale, label: 'AZ', name: 'Azərbaycan' },
  { code: 'en' as Locale, label: 'EN', name: 'English' },
  { code: 'ru' as Locale, label: 'RU', name: 'Русский' },
];

interface LanguageSwitcherProps {
  children: (params: {
    currentLanguage: Locale;
    languages: typeof LANGUAGES;
    changeLanguage: (locale: Locale) => void;
    isPending: boolean;
  }) => React.ReactNode;
}

/**
 * Language Switcher Component
 *
 * Headless component that provides language switching functionality
 * Uses next-intl routing to change locale while preserving the current route
 *
 * @example
 * <LanguageSwitcher>
 *   {({ currentLanguage, languages, changeLanguage, isPending }) => (
 *     <button onClick={() => changeLanguage('en')} disabled={isPending}>
 *       {languages.find(l => l.code === currentLanguage)?.name}
 *     </button>
 *   )}
 * </LanguageSwitcher>
 */
export function LanguageSwitcher({ children }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = (params.locale as Locale) || 'az';

  const changeLanguage = (locale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  return <>{children({ currentLanguage, languages: LANGUAGES, changeLanguage, isPending })}</>;
}

export default LanguageSwitcher;
