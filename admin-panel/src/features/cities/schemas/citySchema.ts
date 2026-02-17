import { z } from "zod";

export const citySchema = z.object({
  nameAz: z.string().min(1, "Name (AZ) is required").max(100, "Name too long"),
  nameEn: z.string().min(1, "Name (EN) is required").max(100, "Name too long"),
  nameRu: z.string().min(1, "Name (RU) is required").max(100, "Name too long"),
});

export type CityFormData = z.infer<typeof citySchema>;
