'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/external/utils';
import { RegisterStep } from '../register.view';
import AppLogo from '@/lib/components/logo/logo';

interface RegisterHeaderSectionProps {
  currentStep: RegisterStep;
}

export function RegisterHeaderSection({ currentStep }: RegisterHeaderSectionProps) {
  const t = useTranslations('register.header');

  return (
    <div className="space-y-6">
      {/* Logo */}
      <AppLogo />

      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-semibold font-heading text-gray-900">{t('title')}</h1>
        <p className="text-lg text-gray-600">{currentStep === 'info' ? t('subtitleInfo') : t('subtitleVerification')}</p>
      </div>
    </div>
  );
}
