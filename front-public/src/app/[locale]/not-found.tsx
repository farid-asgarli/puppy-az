import NotFoundView from "@/lib/views/not-found";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Global Not Found Page
 *
 * This page is automatically shown by Next.js when:
 * - A route doesn't exist
 * - notFound() is called from a page/layout
 * - A dynamic route returns no data
 *
 * Provides a friendly, helpful 404 experience with multiple recovery paths.
 */
export default function NotFound() {
  return <NotFoundView />;
}
