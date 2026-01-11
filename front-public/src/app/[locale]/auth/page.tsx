import LoginView from '@/lib/views/auth/login/login.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.auth');
}

export default function Page() {
  return <LoginView />;
}
