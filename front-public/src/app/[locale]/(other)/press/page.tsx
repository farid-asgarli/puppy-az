import PressView from "@/lib/views/press/press.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.press");
}

export default function Page() {
  return <PressView />;
}
