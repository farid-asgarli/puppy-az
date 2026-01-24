import ForgotPasswordView from "@/lib/views/auth/forgot-password";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.forgotPassword");
}

export default function Page() {
  return <ForgotPasswordView />;
}
