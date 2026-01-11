import BasicsView from '@/lib/views/ad-placement/views/basics-view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('adPlacement.metadata.basics');
}

export default function BasicsPage() {
  return <BasicsView />;
}
