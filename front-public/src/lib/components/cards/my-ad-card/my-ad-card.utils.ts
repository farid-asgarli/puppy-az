import { MyAdListItemDto } from '@/lib/api/types/pet-ad.types';
import { MyAdCard } from './my-ad-card.component';

/**
 * Convert MyAdListItemDto to MyAdCard props
 */
export function mapAdToMyAdCard(ad: MyAdListItemDto) {
  return {
    id: ad.id,
    title: ad.title,
    imageUrl: ad.primaryImageUrl,
    price: ad.price,
    adType: ad.adType,
    status: ad.status,
    categoryTitle: ad.categoryTitle,
    cityName: ad.cityName,
    viewCount: ad.viewCount,
    isPremium: ad.isPremium,
    createdAt: ad.createdAt,
  };
}

export type MyAdCardProps = React.ComponentProps<typeof MyAdCard>;
