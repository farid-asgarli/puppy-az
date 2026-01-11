import PrivacyPolicyView from '@/lib/views/privacy-policy/privacy-policy.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.privacy');
}

export default function Page() {
  return <PrivacyPolicyView />;
}
