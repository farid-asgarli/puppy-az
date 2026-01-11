import DetailsView from '@/lib/views/ad-placement/views/details-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.details');
}

export default function DetailsPage() {
  return <DetailsView />;
}
