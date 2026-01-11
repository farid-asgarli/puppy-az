import PhotosView from '@/lib/views/ad-placement/views/photos-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.photos');
}

export default function PhotosPage() {
  return <PhotosView />;
}
