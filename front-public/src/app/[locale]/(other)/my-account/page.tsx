import MyAccountView from '@/lib/views/my-account/my-account.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount');
}

export default function Page() {
  return <MyAccountView />;
}
