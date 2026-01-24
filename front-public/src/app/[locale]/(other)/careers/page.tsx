import CareersView from "@/lib/views/careers/careers.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.careers");
}

export default function Page() {
  return <CareersView />;
}
