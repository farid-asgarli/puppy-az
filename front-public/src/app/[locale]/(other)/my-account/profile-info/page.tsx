import { redirect } from 'next/navigation';
import { getProfileAction } from '@/lib/auth/actions';
import ProfileInfoView from '@/lib/views/my-account/profile-info/profile-info.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.profileInfo');
}

export default async function ProfileInfoPage() {
  // Fetch user profile data server-side
  const result = await getProfileAction();

  // Redirect to login if not authenticated
  if (!result.success) {
    redirect('/auth?redirect=/my-account/profile-info');
  }

  return <ProfileInfoView profile={result.data} />;
}
