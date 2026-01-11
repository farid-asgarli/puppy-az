import LocationView from '@/lib/views/ad-placement/views/location-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.adPlacement.location');
}

export default function LocationPage() {
  return <LocationView />;
}
