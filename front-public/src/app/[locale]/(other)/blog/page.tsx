import BlogView from "@/lib/views/blog/blog.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.blog");
}

export default function Page() {
  return <BlogView />;
}
