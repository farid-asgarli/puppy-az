'use client';

import { useTranslations } from 'next-intl';
import { AuthFooter } from '@/lib/components/views/auth';

export function LoginFooterSection() {
  const t = useTranslations('login');

  return <AuthFooter message={t('footer.noAccount')} linkText={t('footer.register')} linkHref="/register" />;
}
