/**
 * Layout and sizing constants for the search bar
 */
export const LAYOUT = {
  EXPANDED_WIDTH: 950,
  COLLAPSED_WIDTH: 374,
  EXPANDED_HEIGHT: 64,
  COLLAPSED_HEIGHT: 46,
  DROPDOWN_WIDTH: 480,
  DROPDOWN_OFFSET: 16,
} as const;

/**
 * Type representing which field is currently active
 */
export type ActiveField = "ad-type" | "category" | "breed" | null;
