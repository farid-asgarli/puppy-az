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
    ageInMonths: ad.ageInMonths ?? null,
    location: ad.districtName
      ? `${ad.cityName} — ${ad.districtName}`
      : ad.cityName,
    animalCategory: ad.categoryTitle,
    postedDate: formatDate(ad.publishedAt, t),
    isPremium: ad.isPremium,
  };
}

export function formatCardAge(
  ageInMonths: number | null | undefined,
  tSearch: (key: string) => string,
): string | null {
  if (!ageInMonths || ageInMonths <= 0) return null;
  if (ageInMonths < 12) {
    return `${ageInMonths} ${tSearch("monthsOld")}`;
  }
  const years = Math.floor(ageInMonths / 12);
  return `${years} ${tSearch("yearsOld")}`;
}
