import TermsConditionsView from '@/lib/views/terms-conditions/terms-conditions.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.terms');
}

export default function Page() {
  return <TermsConditionsView />;
}
