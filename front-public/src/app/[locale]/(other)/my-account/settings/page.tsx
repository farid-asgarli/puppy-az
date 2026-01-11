import SettingsView from '@/lib/views/my-account/settings/settings.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.myAccount.settings');
}

export default function Page() {
  return <SettingsView />;
}
