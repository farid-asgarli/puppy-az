import { redirect } from '@/i18n';
import { getLocale } from 'next-intl/server';
import { getProfileAction } from '@/lib/auth/actions';
import ProfileInfoView from '@/lib/views/my-account/profile-info/profile-info.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.profileInfo');
}

export default async function ProfileInfoPage() {
  const locale = await getLocale();

  // Fetch user profile data server-side
  const result = await getProfileAction();

  // Redirect to login if not authenticated
  if (!result.success) {
    return redirect({ href: '/auth?redirect=/my-account/profile-info', locale });
  }

  return <ProfileInfoView profile={result.data} />;
}
