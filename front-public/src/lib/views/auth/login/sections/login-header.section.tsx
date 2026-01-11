'use client';

import AppLogo from '@/lib/components/logo/logo';
import { useTranslations } from 'next-intl';

export function LoginHeaderSection() {
  const t = useTranslations('login');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Logo */}
      <AppLogo />

      {/* Welcome Message */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('header.title')}</h1>
        <p className="text-base sm:text-lg text-gray-600">{t('header.subtitle')}</p>
      </div>
    </div>
  );
}
