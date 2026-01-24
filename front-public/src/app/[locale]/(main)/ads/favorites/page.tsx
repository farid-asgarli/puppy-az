import FavoriteAdsPage from "@/lib/views/favorite-ads/favorites-ads.view";
import { createSimpleLocalizedMetadata } from "@/lib/utils/metadata";

export async function generateMetadata() {
  return createSimpleLocalizedMetadata("metadata.favorites");
}

export default function Page() {
  return <FavoriteAdsPage />;
}
