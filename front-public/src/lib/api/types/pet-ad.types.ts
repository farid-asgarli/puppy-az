// Generated from Swagger API definition - Pet Ad related types

import { QuerySpecification } from "@/lib/api/types/common.types";

/**
 * Pet Color from API
 */
export interface PetColorDto {
  id: number;
  key: string;
  title: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

/**
 * Pet Ad Types (enums as numbers from API)
 * Must match PetAdTypes table in database:
 * 1=sale, 2=match, 3=found, 4=lost, 5=owning
 */
export enum PetAdType {
  Sale = 1,
  Match = 2,
  Found = 3,
  Lost = 4,
  Owning = 5,
}

/**
 * Pet Gender
 */
export enum PetGender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

/**
 * Pet Size
 */
export enum PetSize {
  ExtraSmall = 1,
  Small = 2,
  Medium = 3,
  Large = 4,
  ExtraLarge = 5,
}

export enum PetAdStatus {
  /// <summary>
  /// Ad is pending review by an administrator.
  /// </summary>
  Pending = 0,

  /// <summary>
  /// Ad has been approved and is visible to users.
  /// </summary>
  Published = 1,

  /// <summary>
  /// Ad was rejected by an administrator and is not visible.
  /// </summary>
  Rejected = 2,

  /// <summary>
  /// Ad has expired and is no longer visible.
  /// </summary>
  Expired = 3,

  /// <summary>
  /// Ad was closed by the owner (e.g., pet was sold/adopted).
  /// </summary>
  Closed = 4,

  /// <summary>
  /// Ad is saved as draft and not yet submitted.
  /// </summary>
  Draft = 5,
}

/**
 * Pet Category from API
 */
export interface PetCategoryDto {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
}

export interface PetCategoryWithAdsDto extends PetCategoryDetailedDto {
  petAds: PetAdListItemDto[];
}

/**
 * Pet Category from API
 */
export interface PetCategoryDetailedDto extends PetCategoryDto {
  svgIcon: string; // Raw SVG markup
  iconColor: string; // Tailwind text-* class
  backgroundColor: string; // Tailwind bg-* class
  petAdsCount: number;
}

/**
 * Pet Ad list item (for cards/grids)
 */
export interface PetAdListItemDto {
  id: number;
  title: string;
  ageInMonths: number | null;
  gender: PetGender | null;
  adType: PetAdType;
  size: PetSize;
  price: number;
  cityName: string;
  categoryTitle: string;
  categoryId: number;
  breedId: number;
  categorySlug: string;
  breedSlug: string;
  cityId: number;
  districtId: number | null;
  districtName: string | null;
  customDistrictName: string | null;
  primaryImageUrl: string;
  publishedAt: string; // ISO date-time
  isPremium: boolean;
  rejectionReason?: string | null; // Only present for rejected ads
}

/**
 * Pet Ad details (full view)
 */
export interface PetAdDetailsDto {
  id: number;
  status: PetAdStatus;
  rejectionReason: string | null;
  title: string;
  description: string;
  ageInMonths: number | null;
  gender: PetGender | null;
  adType: PetAdType;
  color: string;
  weight: number | null;
  size: PetSize;
  price: number;
  viewCount: number;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  publishedAt: string;
  expiresAt: string | null;
  updatedAt: string | null;
  breed: PetBreedDto | null;
  cityName: string;
  cityId: number;
  districtId: number | null;
  districtName: string | null;
  customDistrictName: string | null;
  categoryTitle: string;
  images: PetAdImageDto[];
  questions: PetAdQuestionDto[];
  owner: PetOwnerDto;
}

/** Pet Owner */
export interface PetOwnerDto {
  id: string;
  fullName: string;
  profilePictureUrl: string;
  memberSince: string;
  contactEmail: string;
  contactPhoneNumber: string;
}

/**
 * Pet breed reference
 */
export interface PetBreedDto {
  id: number;
  title: string;
  categoryId: number;
  slug: string;
}

/**
 * Pet category with metadata
 */
export interface PetCategoryDetailedDto {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  svgIcon: string;
  iconColor: string;
  backgroundColor: string;
  petAdsCount: number;
}

/**
 * Pet ad image
 */
export interface PetAdImageDto {
  id: number;
  url: string;
  isPrimary: boolean;
}

/**
 * Pet ad question/answer
 */
export interface PetAdQuestionDto {
  id: number;
  userId: string;
  question: string;
  answer: string | null;
  questionerName: string;
  askedAt: string; // ISO date-time
  answeredAt: string | null;
  isAnswered: boolean;
  replies: PetAdQuestionReplyDto[];
}

/**
 * Pet ad question reply (Facebook-style comment)
 */
export interface PetAdQuestionReplyDto {
  id: number;
  userId: string;
  text: string;
  userName: string;
  isOwnerReply: boolean;
  createdAt: string; // ISO date-time
}

/**
 * Reply to a question command
 */
export interface ReplyToQuestionCommand {
  questionId: number;
  text: string;
}

/**
 * Ask a question about a pet ad
 */
export interface AskQuestionCommand {
  petAdId: number;
  question: string;
}

/**
 * Answer a question (owner only)
 */
export interface AnswerQuestionCommand {
  questionId: number;
  answer: string;
}

export type MyAdQuestionDto = {
  questionId: number;
  userId: string;
  petAdId: number;
  petAdTitle: string;
  question: string;
  answer?: string;
  questionerName: string;
  askedAt: string;
  answeredAt?: string;
  isAnswered: boolean;
  primaryImageUrl?: string;
  replies: PetAdQuestionReplyDto[];
};

export type MyAdQuestionsSummaryDto = {
  totalQuestions: number;
  unansweredQuestions: number;
  adsWithUnansweredQuestions: number;
  latestUnansweredQuestionAt?: string;
};

export interface MyAdListItemDto extends PetAdListItemDto {
  status: PetAdStatus;
  viewCount: number;
  createdAt: string;
}

export type MyPetAdDto = {
  id: number;
  title: string;
  description: string;
  ageInMonths: number;
  gender: PetGender;
  adType: PetAdType;
  color: string;
  weight: number | null;
  size: PetSize | null;
  price: number;
  viewCount: number;
  isPremium: boolean;
  premiumExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  publishedAt: Date | null;
  expiresAt: Date | null;

  // Owner-specific fields
  status: PetAdStatus;
  rejectionReason?: string | null;
  isAvailable: boolean;

  // Related data
  breed: PetBreedDto;
  cityName: string;
  cityId: number;
  districtId: number | null;
  districtName: string | null;
  customDistrictName: string | null;
  categoryTitle: string;
  images: PetAdImageDto[];
  questions: PetAdQuestionDto[];

  // Statistics
  totalQuestions: number;
  unansweredQuestions: number;
  favoriteCount: number;
};

export interface RelatedPetAdsQuery {
  petAdId: number;
  specification: QuerySpecification;
}

/**
 * Response when deleting a pet ad image
 */
export interface DeletePetAdImageResponse {
  message: string;
}

export interface SubmitPetAdCommand {
  title: string;
  description: string;
  ageInMonths: number | null; // Optional for Found/Owning ad types
  gender: PetGender | null; // Optional for Found/Owning ad types
  adType: PetAdType;
  color: string;
  weight: number | null;
  size: PetSize | null;
  price: number;
  cityId: number;
  districtId: number | null;
  petBreedId: number | null; // Optional for Found/Owning ad types or when suggestedBreedName is provided
  petCategoryId: number | null; // Category can be set even without breed
  imageIds?: number[] | null;
  suggestedBreedName?: string | null; // User-suggested breed name when no existing breed matches
  customDistrictName?: string | null; // User-suggested district name when no existing district matches
}

/**
 * Update existing pet ad
 */
export interface UpdatePetAdCommand extends SubmitPetAdCommand {
  id: number;
}

/**
 * Pet ad image metadata
 */
export interface PetAdImageDto {
  id: number;
  filePath: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  isPrimary: boolean;
  uploadedAt: string; // ISO 8601 date string
  url: string; // URL to view/download the image (e.g., "/api/pet-ad-images/123")
}
