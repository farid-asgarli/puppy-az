import MyAccountView from '@/lib/views/my-account/my-account.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount');
}

export default function Page() {
  return <MyAccountView />;
}
