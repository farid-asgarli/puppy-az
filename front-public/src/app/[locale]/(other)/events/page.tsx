import EventsView from "@/lib/views/events/events.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.events");
}

export default function Page() {
  return <EventsView />;
}
