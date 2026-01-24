import ReportView from "@/lib/views/report/report.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.report");
}

export default function Page() {
  return <ReportView />;
}
