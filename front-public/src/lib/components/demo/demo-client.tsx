'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n';

export function DemoClient() {
  const t = useTranslations('Demo');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-info-50 to-primary-50 rounded-lg shadow-md border border-info-200">
      <h2 className="text-2xl font-bold text-primary-900 mb-4">{t('clientComponent')}</h2>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-gray-700 font-medium mb-2">{t('title')}</p>
          <p className="text-gray-600 text-sm">{t('description')}</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-gray-700 font-medium mb-2">{t('greeting', { name: 'Developer' })}</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <p className="text-gray-700 font-medium mb-3">
            {t('currentLanguage')}: <span className="text-indigo-600">{locale.toUpperCase()}</span>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange('az')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                locale === 'az' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              AZ
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                locale === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                locale === 'ru' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
