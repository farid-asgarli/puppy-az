import CommunityView from "@/lib/views/community/community.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.community");
}

export default function Page() {
  return <CommunityView />;
}
