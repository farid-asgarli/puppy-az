import HelpCenterView from '@/lib/views/help-center/help-center.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.help');
}

export default function Page() {
  return <HelpCenterView />;
}
