import BreedView from '@/lib/views/ad-placement/views/breed-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.breed');
}

export default async function BreedPage() {
  // We need to get the selected categoryId from the context/localStorage
  // Since this is a server component, we'll pass all breeds and filter client-side
  // Or we can use searchParams to pass categoryId

  // For now, we'll handle this in the client component with dynamic fetching
  return <BreedView />;
}
