import ContactView from "@/lib/views/contact/contact.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.contact");
}

export default function Page() {
  return <ContactView />;
}
