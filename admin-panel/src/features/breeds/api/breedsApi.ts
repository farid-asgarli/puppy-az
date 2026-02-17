import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, endpoints } from "@/shared/api";
import type {
  Breed,
  BreedCreateRequest,
  BreedUpdateRequest,
  PaginatedResponse,
} from "@/shared/api/types";
import { App } from "antd";
import { useTranslation } from "react-i18next";

// Query keys
export const breedsKeys = {
  all: ["breeds"] as const,
  lists: () => [...breedsKeys.all, "list"] as const,
  list: (params?: { petCategoryId?: number; includeDeleted?: boolean }) =>
    [...breedsKeys.lists(), params] as const,
  details: () => [...breedsKeys.all, "detail"] as const,
  detail: (id: number) => [...breedsKeys.details(), id] as const,
};

interface BreedsListParams {
  petCategoryId?: number;
  includeDeleted?: boolean;
  page?: number;
  pageSize?: number;
}

// Get all breeds with optional filtering
export function useBreeds(params?: BreedsListParams) {
  return useQuery({
    queryKey: breedsKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.petCategoryId) {
        queryParams.append("petCategoryId", params.petCategoryId.toString());
      }
      if (params?.includeDeleted) {
        queryParams.append("includeDeleted", "true");
      }
      if (params?.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params?.pageSize) {
        queryParams.append("pageSize", params.pageSize.toString());
      }

      const url = queryParams.toString()
        ? `${endpoints.breeds.list}?${queryParams.toString()}`
        : endpoints.breeds.list;

      const response = await api.get<PaginatedResponse<Breed> | Breed[]>(url);

      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        return response;
      }
      if (response && typeof response === "object" && "items" in response) {
        return response.items;
      }
      if (response && typeof response === "object" && "value" in response) {
        return (response as unknown as { value: Breed[] }).value;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get breed by ID
export function useBreed(id: number) {
  return useQuery({
    queryKey: breedsKeys.detail(id),
    queryFn: async () => {
      return api.get<Breed>(endpoints.breeds.byId(id));
    },
    enabled: !!id,
  });
}

// Create breed
export function useCreateBreed() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: BreedCreateRequest) =>
      api.post<number>(endpoints.breeds.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: breedsKeys.all });
      message.success(t("breeds.createSuccess", "Cins uğurla yaradıldı"));
    },
    onError: (error: Error) => {
      message.error(error.message || t("error.generic"));
    },
  });
}

// Update breed
export function useUpdateBreed() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BreedUpdateRequest }) =>
      api.put<void>(endpoints.breeds.update(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: breedsKeys.all });
      message.success(t("breeds.updateSuccess", "Cins uğurla yeniləndi"));
    },
    onError: (error: Error) => {
      message.error(error.message || t("error.generic"));
    },
  });
}

// Soft delete breed
export function useDeleteBreed() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(endpoints.breeds.softDelete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: breedsKeys.all });
      message.success(t("breeds.deleteSuccess", "Cins uğurla silindi"));
    },
    onError: (error: Error) => {
      message.error(error.message || t("error.generic"));
    },
  });
}

// Hard delete breed
export function useHardDeleteBreed() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(endpoints.breeds.hardDelete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: breedsKeys.all });
      message.success(t("breeds.hardDeleteSuccess", "Cins tamamilə silindi"));
    },
    onError: (error: Error) => {
      message.error(error.message || t("error.generic"));
    },
  });
}

// Restore breed
export function useRestoreBreed() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) =>
      api.post<void>(endpoints.breeds.restore(id), {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: breedsKeys.all });
      message.success(t("breeds.restoreSuccess", "Cins bərpa edildi"));
    },
    onError: (error: Error) => {
      message.error(error.message || t("error.generic"));
    },
  });
}
