import { redirect } from 'next/navigation';
import { checkAuthAction } from '@/lib/auth/actions';
import SecurityView from '@/lib/views/my-account/security/security.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.security');
}

export default async function SecurityPage() {
  // Check if user is authenticated
  const isAuthenticated = await checkAuthAction();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    redirect('/auth?redirect=/my-account/security');
  }

  return <SecurityView />;
}
