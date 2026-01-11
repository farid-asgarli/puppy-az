'use client';

import { useTranslations } from 'next-intl';
import { AuthFooter } from '@/lib/components/views/auth';

export function RegisterFooterSection() {
  const t = useTranslations('register.footer');

  return <AuthFooter message={t('haveAccount')} linkText={t('login')} linkHref="/auth" />;
}
