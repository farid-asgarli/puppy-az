import RegisterView from '@/lib/views/auth/register/register.view';
import { createSimpleLocalizedMetadata } from '@/lib/utils/metadata';

export async function generateMetadata() {
  return createSimpleLocalizedMetadata('metadata.register');
}

export default function RegisterPage() {
  return <RegisterView />;
}
