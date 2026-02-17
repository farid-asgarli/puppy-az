import { z } from "zod";

export const districtSchema = z.object({
  nameAz: z
    .string()
    .min(1, "Name (AZ) is required")
    .max(100, "Name too long"),
  nameEn: z
    .string()
    .min(1, "Name (EN) is required")
    .max(100, "Name too long"),
  nameRu: z
    .string()
    .min(1, "Name (RU) is required")
    .max(100, "Name too long"),
  cityId: z.number().min(1, "City is required"),
  displayOrder: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type DistrictFormData = z.infer<typeof districtSchema>;
