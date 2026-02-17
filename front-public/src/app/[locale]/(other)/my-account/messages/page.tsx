import MessagesView from "@/lib/views/my-account/messages/messages.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

// This page requires authentication, so it must be dynamic
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.myAccount.messages");
}

export default function Page() {
  return <MessagesView />;
}
