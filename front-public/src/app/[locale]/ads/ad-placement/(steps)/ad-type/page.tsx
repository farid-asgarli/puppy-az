import AdTypeView from '@/lib/views/ad-placement/views/ad-type-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.adType');
}

export default function AdTypePage() {
  return <AdTypeView />;
}
