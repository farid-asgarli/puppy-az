import ConversationDetailView from "@/lib/views/my-account/messages/conversation-detail.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.myAccount.messages");
}

export default function ConversationDetailPage() {
  return <ConversationDetailView />;
}
