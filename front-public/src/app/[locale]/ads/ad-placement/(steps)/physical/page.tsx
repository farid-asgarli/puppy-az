import PhysicalView from '@/lib/views/ad-placement/views/physical-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.physical');
}

export default function PhysicalPage() {
  return <PhysicalView />;
}
