/**
 * Pet Ad Type related types
 * Types for listing types fetched from the database
 */

/**
 * Pet Ad Type DTO from API
 */
export interface PetAdTypeDto {
  id: number;
  key: string;
  title: string;
  description?: string;
  emoji?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

/**
 * Mapped Pet Ad Type for UI usage
 */
export interface MappedPetAdType {
  id: number;
  key: string;
  title: string;
  description: string;
  emoji: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
}
