import { z } from "zod";

export const listingTypeLocalizationSchema = z.object({
  appLocaleId: z.number(),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
});

export const listingTypeSchema = z.object({
  key: z.string().min(1, "Key is required").max(50, "Key too long"),
  emoji: z.string().max(10, "Emoji too long").optional(),
  iconName: z.string().max(100, "Icon name too long").optional(),
  backgroundColor: z.string().max(20, "Color too long").optional(),
  textColor: z.string().max(20, "Color too long").optional(),
  borderColor: z.string().max(20, "Color too long").optional(),
  sortOrder: z.number().min(0, "Sort order must be positive"),
  isActive: z.boolean(),
  localizations: z
    .array(listingTypeLocalizationSchema)
    .min(1, "At least one localization is required"),
});

export type ListingTypeFormData = z.infer<typeof listingTypeSchema>;
export type ListingTypeLocalizationFormData = z.infer<
  typeof listingTypeLocalizationSchema
>;
