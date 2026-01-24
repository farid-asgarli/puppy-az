import ResetPasswordView from "@/lib/views/auth/reset-password";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.resetPassword");
}

export default function Page() {
  return <ResetPasswordView />;
}
