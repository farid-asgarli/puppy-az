import { PetAdListItemDto } from "@/lib/api";
import { PetAdCardType } from "@/lib/types/ad-card";
import { formatDate } from "@/lib/utils/date-utils";

export function mapAdToCardItem(
  ad: PetAdListItemDto,
  t: (key: string) => string,
): PetAdCardType {
  return {
    id: ad.id,
    title: ad.title,
    adType: ad.adType,
    imgUrl: ad.primaryImageUrl,
    price: ad.price ?? 0,
    age: ad.ageInMonths ? Math.floor(ad.ageInMonths / 12) : null,
    location: ad.districtName
      ? `${ad.cityName} — ${ad.districtName}`
      : ad.cityName,
    animalCategory: ad.categoryTitle,
    postedDate: formatDate(ad.publishedAt, t),
    isPremium: ad.isPremium,
  };
}
