import IntroView from '@/lib/views/ad-placement/views/intro-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.adPlacement.intro');
}

export default function IntroPage() {
  return <IntroView />;
}
