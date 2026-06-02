const PUPPY_API_URL = process.env.PUPPY_API_URL || 'https://puppy-api.cloud';
const PUPPY_ADMIN_TOKEN = process.env.PUPPY_ADMIN_TOKEN || '';

export interface PuppyCategory {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
}

export interface PuppyBreed {
  id: number;
  title: string;
  categoryId: number;
  slug: string;
}

export interface PuppyCity {
  id: number;
  name: string;
}

export interface PuppyColor {
  id: number;
  name: string;
  hexCode: string;
}

export interface PuppyAdType {
  value: number;
  name: string;
}

export interface LookupData {
  categories: PuppyCategory[];
  breeds: PuppyBreed[];
  cities: PuppyCity[];
  colors: PuppyColor[];
  adTypes: PuppyAdType[];
}

const headers = () => ({
  Authorization: `Bearer ${PUPPY_ADMIN_TOKEN}`,
  'Content-Type': 'application/json',
});

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${PUPPY_API_URL}${path}`, {
    headers: headers(),
    next: { revalidate: 300 }, // cache for 5 mins
  } as RequestInit);
  if (!res.ok) throw new Error(`Puppy API ${path} failed: ${res.status}`);
  return res.json();
}

let lookupCache: LookupData | null = null;
let lookupCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getLookupData(): Promise<LookupData> {
  if (lookupCache && Date.now() - lookupCacheTime < CACHE_TTL) {
    return lookupCache;
  }

  const [categories, breeds, cities, colors, adTypes] = await Promise.all([
    fetchJson<PuppyCategory[]>('/api/pet-ads/categories'),
    fetchJson<PuppyBreed[]>('/api/pet-ads/breeds'),
    fetchJson<PuppyCity[]>('/api/cities'),
    fetchJson<PuppyColor[]>('/api/pet-ads/colors'),
    fetchJson<PuppyAdType[]>('/api/pet-ads/types'),
  ]);

  lookupCache = { categories, breeds, cities, colors, adTypes };
  lookupCacheTime = Date.now();
  return lookupCache;
}

export interface CreatePetAdPayload {
  userId: string;
  title: string;
  description: string;
  ageInMonths: number | null;
  gender: number | null;
  adType: number;
  color: string;
  weight: number | null;
  size: number | null;
  price: number;
  cityId: number;
  districtId: number | null;
  petBreedId: number | null;
  petCategoryId: number | null;
  imageIds: number[] | null;
}

export async function createPetAd(payload: CreatePetAdPayload): Promise<{ id: number }> {
  const res = await fetch(`${PUPPY_API_URL}/api/admin/pet-ads`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create ad failed (${res.status}): ${text}`);
  }

  return res.json();
}
