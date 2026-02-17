import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type { PetColor } from "@/shared/api/types";

// Query keys
export const colorsKeys = {
  all: ["colors"] as const,
  lists: () => [...colorsKeys.all, "list"] as const,
  list: () => [...colorsKeys.lists()] as const,
  details: () => [...colorsKeys.all, "detail"] as const,
  detail: (id: number) => [...colorsKeys.details(), id] as const,
};

// Get all colors (public endpoint)
export function useColors() {
  return useQuery({
    queryKey: colorsKeys.list(),
    queryFn: () => api.get<PetColor[]>(endpoints.colors.list),
    staleTime: 1000 * 60 * 10, // 10 minutes - colors rarely change
  });
}

// Create color
export function useCreateColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<PetColor, "id">) =>
      api.post<PetColor>(endpoints.colors.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorsKeys.lists() });
    },
  });
}

// Update color
export function useUpdateColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PetColor> }) =>
      api.put<PetColor>(endpoints.colors.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorsKeys.lists() });
    },
  });
}

// Delete color
export function useDeleteColor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.delete(endpoints.colors.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorsKeys.lists() });
    },
  });
}
