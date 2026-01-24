import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ new?: string }>;
}

/**
 * Root ad-placement page redirects to intro
 * Preserves ?new=true query param for starting fresh
 */
export default async function AdPlacementPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isNew = params.new === "true";
  redirect(
    isNew ? "/ads/ad-placement/intro?new=true" : "/ads/ad-placement/intro",
  );
}
