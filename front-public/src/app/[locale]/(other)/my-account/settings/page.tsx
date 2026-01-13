import SettingsView from '@/lib/views/my-account/settings/settings.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

// This page requires authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.settings');
}

export default function Page() {
  return <SettingsView />;
}
