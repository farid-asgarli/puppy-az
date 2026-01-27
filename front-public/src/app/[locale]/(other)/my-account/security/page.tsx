import { redirect } from '@/i18n';
import { getLocale } from 'next-intl/server';
import { checkAuthAction } from '@/lib/auth/actions';
import SecurityView from '@/lib/views/my-account/security/security.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.security');
}

export default async function SecurityPage() {
  const locale = await getLocale();

  // Check if user is authenticated
  const isAuthenticated = await checkAuthAction();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return redirect({ href: '/auth?redirect=/my-account/security', locale });
  }

  return <SecurityView />;
}
