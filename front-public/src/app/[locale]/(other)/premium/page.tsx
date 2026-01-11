import PremiumAdView from '@/lib/views/premium-ad/premium-ad.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.premium');
}

export default function Page() {
  return <PremiumAdView />;
}
