import PriceView from '@/lib/views/ad-placement/views/price-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.price');
}

export default function PricePage() {
  return <PriceView />;
}
