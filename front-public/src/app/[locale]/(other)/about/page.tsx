import AboutView from '@/lib/views/about/about.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.about');
}

export default function Page() {
  return <AboutView />;
}
