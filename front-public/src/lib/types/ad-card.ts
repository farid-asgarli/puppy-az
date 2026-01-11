import { PetAdType } from '@/lib/api';

export type PetAdCardType = {
  id: number;
  title: string;
  adType: PetAdType;
  imgUrl: string;
  price: string | number | null;
  age: number;
  location: string;
  animalCategory: string;
  postedDate: string;
  isPremium: boolean;
};
