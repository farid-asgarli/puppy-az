import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ new?: string; edit?: string }>;
}

/**
 * Root ad-placement page redirects appropriately:
 * - ?edit=ID -> directly to ad-type step (skip intro)
 * - ?new=true -> intro with new param
 * - default -> intro page
 */
export default async function AdPlacementPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isNew = params.new === "true";
  const editId = params.edit;

  if (editId) {
    // Edit mode - skip intro, go directly to first step
    redirect(`/ads/ad-placement/ad-type?edit=${editId}`);
  }

  redirect(
    isNew ? "/ads/ad-placement/intro?new=true" : "/ads/ad-placement/intro",
  );
}
