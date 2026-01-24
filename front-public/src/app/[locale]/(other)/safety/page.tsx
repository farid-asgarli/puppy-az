import SafetyView from "@/lib/views/safety/safety.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.safety");
}

export default function Page() {
  return <SafetyView />;
}
