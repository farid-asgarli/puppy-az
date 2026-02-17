import type { Locale } from "@/app/i18n";

// Base pagination types
export interface PaginatedRequest {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page?: number;
  pageNumber?: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Translation types
export type TranslatedField = Record<Locale, string>;

export interface LocalizationPayload {
  appLocaleId: number;
  title?: string;
  subtitle?: string;
  content?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  userId: string;
}

export interface AdminUserResponse {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

// Listing types
export enum ListingStatus {
  Pending = 0,
  Published = 1,
  Rejected = 2,
  Expired = 3,
  Closed = 4,
  Draft = 5,
}

export enum ListingType {
  Sale = 1,
  Match = 2,
  Found = 3,
  Lost = 4,
  Owning = 5,
}

export enum Gender {
  Male = 1,
  Female = 2,
}

export enum AnimalSize {
  ExtraSmall = 1,
  Small = 2,
  Medium = 3,
  Large = 4,
  ExtraLarge = 5,
}

export interface Listing {
  id: number;
  title: string;
  description?: string;
  slug?: string;
  adType: ListingType;
  petCategoryId?: number;
  categoryId?: number;
  petCategory?: Category;
  categoryTitle?: string;
  petBreedId?: number;
  breedId?: number;
  petBreed?: Breed;
  breedTitle?: string;
  suggestedBreedName?: string | null;
  gender?: Gender;
  size?: AnimalSize;
  age?: string;
  ageInMonths?: number;
  price?: number | null;
  cityId?: number;
  city?: City;
  cityName?: string;
  districtId?: number;
  districtName?: string;
  customDistrictName?: string | null;
  status?: ListingStatus;
  isPremium: boolean;
  premiumUntil?: string;
  premiumExpiresAt?: string;
  isVip: boolean;
  vipExpiresAt?: string;
  language?: Locale;
  userId?: string;
  user?: User;
  images?: ListingImage[];
  primaryImageUrl?: string;
  viewCount?: number;
  favoriteCount?: number;
  questionCount?: number;
  createdAt?: string;
  publishedAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  rejectionReason?: string | null;
}

export interface ListingImage {
  id: number;
  url: string;
  imageUrl?: string; // alias for url
  isPrimary: boolean;
  isMain?: boolean; // alias for isPrimary
}

export interface ListingSearchRequest extends PaginatedRequest {
  title?: string;
  adType?: ListingType;
  petCategoryId?: number;
  petBreedId?: number;
  cityId?: number;
  status?: ListingStatus;
  isPremium?: boolean;
  isVip?: boolean;
  language?: Locale;
  minPrice?: number;
  maxPrice?: number;
}

export interface ListingReviewRequest {
  approve: boolean;
  rejectionReason?: string;
}

export interface SetPremiumRequest {
  isPremium: boolean;
  durationInDays?: number;
}

export interface SetVipRequest {
  isVip: boolean;
  durationInDays?: number;
}

export interface ListingStats {
  total: number;
  active: number;
  pending: number;
  rejected: number;
  expired: number;
}

// User types
export interface User {
  id: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
  roles?: string[];
  createdAt?: string;
}

export interface UserSearchRequest extends PaginatedRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
}

// Regular User types (consumers)
export interface RegularUser {
  id: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  isActive: boolean;
  isCreatedByAdmin: boolean;
  createdAt: string;
  lastLoginAt?: string;
  totalAds: number;
  activeAds: number;
}

export interface RegularUserSearchRequest {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Pet Color types
export interface PetColor {
  id: number;
  key: string;
  title: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

// Pet Ad Type (Listing Type) types
export interface PetAdType {
  id: number;
  key: string;
  emoji?: string;
  iconName?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  sortOrder: number;
  isActive: boolean;
  localizations: PetAdTypeLocalization[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PetAdTypeLocalization {
  id: number;
  appLocaleId: number;
  title: string;
  description?: string;
}

export interface PetAdTypeListItem {
  id: number;
  key: string;
  emoji?: string;
  iconName?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  descriptionAz?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  petAdsCount?: number;
  createdAt?: string;
}

export interface PetAdTypeCreateRequest {
  key: string;
  emoji?: string;
  iconName?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  sortOrder: number;
  isActive: boolean;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  descriptionAz?: string;
  descriptionEn?: string;
  descriptionRu?: string;
}

export interface PetAdTypeUpdateRequest extends PetAdTypeCreateRequest {
  id: number;
}

// City types
export interface City {
  id: number;
  nameAz: string;
  nameEn: string;
  nameRu: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CityCreateRequest {
  nameAz: string;
  nameEn: string;
  nameRu: string;
}

export interface CityUpdateRequest extends CityCreateRequest {
  id: number;
}

// District types
export interface District {
  id: number;
  nameAz: string;
  nameEn: string;
  nameRu: string;
  cityId: number;
  cityNameAz: string;
  displayOrder: number;
  isActive: boolean;
  petAdsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DistrictCreateRequest {
  nameAz: string;
  nameEn: string;
  nameRu: string;
  cityId: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface DistrictUpdateRequest extends DistrictCreateRequest {
  id: number;
}

// Category types
export interface Category {
  id: number;
  title?: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  backgroundColor?: string;
  isActive: boolean;
  isDeleted?: boolean;
  breedsCount?: number;
  localizations: CategoryLocalization[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryLocalization {
  id: number;
  appLocaleId?: number;
  localeCode?: string;
  title: string;
  subtitle?: string;
}

export interface CategoryLocalizationPayload {
  id?: number;
  localeCode: string;
  title: string;
  subtitle?: string;
}

export interface CategoryCreateRequest {
  svgIcon?: string;
  iconColor?: string;
  backgroundColor?: string;
  isActive?: boolean;
  localizations: CategoryLocalizationPayload[];
}

export interface CategoryUpdateRequest {
  id: number;
  svgIcon?: string;
  iconColor?: string;
  backgroundColor?: string;
  isActive?: boolean;
  localizations: CategoryLocalizationPayload[];
}

// Breed types
export interface Breed {
  id: number;
  title: string;
  petCategoryId: number;
  categoryTitle?: string;
  petCategory?: Category;
  isActive: boolean;
  isDeleted: boolean;
  petAdsCount?: number;
  localizations: BreedLocalization[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface BreedLocalization {
  id: number;
  petBreedId?: number;
  localeCode: string;
  title: string;
}

export interface BreedLocalizationPayload {
  id?: number;
  localeCode: string;
  title: string;
}

export interface BreedCreateRequest {
  petCategoryId: number;
  isActive?: boolean;
  localizations: BreedLocalizationPayload[];
}

export interface BreedUpdateRequest {
  id: number;
  petCategoryId: number;
  isActive: boolean;
  localizations: BreedLocalizationPayload[];
}

// Breed Suggestion types
export enum BreedSuggestionStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export interface BreedSuggestion {
  id: number;
  name: string;
  petCategoryId: number;
  categoryTitle: string;
  userId: string | null;
  userName: string | null;
  status: BreedSuggestionStatus;
  approvedBreedId: number | null;
  adminNote: string | null;
  createdAt: string;
}

export interface ApproveBreedSuggestionRequest {
  suggestionId: number;
  petCategoryId: number;
  localizations: BreedLocalizationPayload[];
  isActive?: boolean;
}

export interface RejectBreedSuggestionRequest {
  suggestionId: number;
  adminNote?: string;
}

// Color types
export interface Color {
  id: number;
  nameAz: string;
  nameEn: string;
  nameRu: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  isActive: boolean;
}

export interface ColorCreateRequest {
  nameAz: string;
  nameEn: string;
  nameRu: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export interface ColorUpdateRequest extends ColorCreateRequest {
  id: number;
}

// Contact Message types
export interface UserBriefInfo {
  id: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  isVerified: boolean;
  totalAdsCount: number;
}

export interface ContactMessage {
  id: number;
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  userId?: string;
  user?: UserBriefInfo;
  matchedUserByPhone?: UserBriefInfo;
  subject?: string;
  message: string;
  messagePreview?: string;
  messageType: number;
  languageCode: Locale;
  status: MessageStatus;
  isSpam: boolean;
  isStarred: boolean;
  isArchived: boolean;
  hasReply: boolean;
  reply?: string;
  repliedAt?: string;
  readAt?: string;
  readByAdminName?: string;
  repliedByAdminName?: string;
  createdAt: string;
}

export enum MessageStatus {
  New = 0,
  Read = 1,
  Replied = 2,
}

export interface MessageSearchRequest extends PaginatedRequest {
  status?: MessageStatus;
  language?: Locale;
  fromName?: string;
  phoneNumber?: string;
}

export interface MessageReplyRequest {
  reply: string;
}

// Dashboard types
export interface DashboardStats {
  totalListings: number;
  totalUsers: number;
  pendingApprovals: number;
  newMessages: number;
  premiumListings: number;
  totalViews: number;
  todayListings: number;
  todayUsers: number;
  activeListings: number;
  rejectedListings: number;
  expiredListings: number;
  totalQuestions: number;
  totalFavorites: number;
}

// Chart Statistics types
export interface TimeSeriesDataPoint {
  label: string;
  value: number;
  period?: string;
}

export interface RankingItem {
  id: number;
  name: string;
  count: number;
  percentage?: number;
  averageValue?: number;
  color?: string;
}

export interface DistributionItem {
  name: string;
  key: string;
  count: number;
  percentage: number;
  color: string;
}

export interface UserRankingItem {
  userId: string;
  fullName: string;
  phone: string;
  listingsCount: number;
  totalViews: number;
  joinedAt?: string;
}

export interface ChartStats {
  listingsTrend: TimeSeriesDataPoint[];
  usersTrend: TimeSeriesDataPoint[];
  topCategories: RankingItem[];
  bottomCategories: RankingItem[];
  topBreeds: RankingItem[];
  bottomBreeds: RankingItem[];
  topCities: RankingItem[];
  bottomCities: RankingItem[];
  listingTypeDistribution: DistributionItem[];
  genderDistribution: DistributionItem[];
  sizeDistribution: DistributionItem[];
  statusDistribution: DistributionItem[];
  membershipDistribution: DistributionItem[];
  topUsers: UserRankingItem[];
  viewsTrend: TimeSeriesDataPoint[];
  averagePriceByCategory: RankingItem[];
  listingsByDayOfWeek: DistributionItem[];
}

export interface ChartStatsRequest {
  period?: "monthly" | "yearly";
  year?: number;
}

// Static Section types
export interface StaticSectionLocalization {
  id: number;
  localeCode: Locale;
  title: string;
  subtitle: string;
  content: string;
  metadata?: string | null;
}

export interface StaticSection {
  id: number;
  key: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  localizations: StaticSectionLocalization[];
}

export interface StaticSectionListItem {
  id: number;
  key: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  titleAz: string;
  titleEn: string;
  titleRu: string;
}

export interface CreateStaticSectionLocalizationDto {
  localeCode: string;
  title: string;
  subtitle: string;
  content: string;
  metadata?: string | null;
}

export interface CreateStaticSectionRequest {
  key: string;
  localizations: CreateStaticSectionLocalizationDto[];
  isActive?: boolean;
}

export interface UpdateStaticSectionRequest {
  id: number;
  key: string;
  localizations: CreateStaticSectionLocalizationDto[];
  isActive?: boolean;
}

// App Locale mapping (from backend)
export const APP_LOCALE_IDS: Record<Locale, number> = {
  az: 1,
  en: 2,
  ru: 3,
};

export const getLocaleId = (locale: Locale): number => APP_LOCALE_IDS[locale];
